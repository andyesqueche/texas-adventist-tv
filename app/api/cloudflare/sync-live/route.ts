import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/client";

type CloudflareLifecycle = {
  isInput?: boolean;
  videoUID?: string | null;
  live?: boolean;
  status?: string;
  chunked?: boolean;
};

type CloudflareRecording = {
  uid?: string;
  readyToStream?: boolean;
  status?: {
    state?: string;
    pctComplete?: string;
    errorReasonCode?: string;
    errorReasonText?: string;
  };
  playback?: {
    hls?: string;
    dash?: string;
  };
};

type CloudflareRecordingsResponse = {
  success?: boolean;
  result?: CloudflareRecording[];
  errors?: Array<{
    code?: number;
    message?: string;
  }>;
};

export async function GET(request: Request) {
  const syncSecret =
    process.env.LIVE_SYNC_SECRET;

  const authorization =
    request.headers.get("authorization");

  if (!syncSecret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "LIVE_SYNC_SECRET is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  if (
    authorization !==
    `Bearer ${syncSecret}`
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID;

  const apiToken =
    process.env.CLOUDFLARE_STREAM_TOKEN;

  const liveInputId =
    process.env.CLOUDFLARE_LIVE_INPUT_ID;

  const hlsUrl =
    process.env
      .NEXT_PUBLIC_CLOUDFLARE_LIVE_HLS_URL;

  if (
    !accountId ||
    !apiToken ||
    !liveInputId ||
    !hlsUrl
  ) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Cloudflare Live environment variables are incomplete.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const now =
      new Date().toISOString();

    // -------------------------------------------------
    // 1. First check broadcasts that already ended
    //    and are waiting for Cloudflare recording.
    // -------------------------------------------------

    const {
      data: endedBroadcasts,
      error: endedBroadcastsError,
    } = await supabase
      .from("live_broadcasts")
      .select(`
        id,
        title,
        status,
        scheduled_start,
        scheduled_end,
        playback_url,
        cloudflare_video_uid,
        went_live_at,
        ended_at
      `)
      .eq("published", true)
      .eq("status", "ended")
      .not(
        "cloudflare_video_uid",
        "is",
        null
      )
      .order("ended_at", {
        ascending: false,
      });

    if (endedBroadcastsError) {
      throw new Error(
        endedBroadcastsError.message
      );
    }

    const endedBroadcast =
      endedBroadcasts?.[0] ?? null;

    // -------------------------------------------------
    // 2. If an ended broadcast exists, ask Cloudflare
    //    whether its recording is ready.
    // -------------------------------------------------

    if (
      endedBroadcast &&
      endedBroadcast.cloudflare_video_uid
    ) {
      const recordingsUrl =
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs/${liveInputId}/videos`;

      const recordingsResponse =
        await fetch(recordingsUrl, {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${apiToken}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        });

      if (!recordingsResponse.ok) {
        const text =
          await recordingsResponse.text();

        throw new Error(
          `Cloudflare recordings request failed: ${recordingsResponse.status} ${text}`
        );
      }

      const recordings =
        (await recordingsResponse.json()) as CloudflareRecordingsResponse;

      if (
        recordings.success === false
      ) {
        throw new Error(
          recordings.errors
            ?.map(
              (error) =>
                error.message
            )
            .filter(Boolean)
            .join(", ") ||
            "Cloudflare recordings request failed."
        );
      }

      const recording =
        recordings.result?.find(
          (item) =>
            item.uid ===
            endedBroadcast.cloudflare_video_uid
        );

      if (
        recording &&
        recording.readyToStream === true
      ) {
        const replayHlsUrl =
          recording.playback?.hls ??
          `https://customer-${getCustomerCode(
            hlsUrl
          )}.cloudflarestream.com/${endedBroadcast.cloudflare_video_uid}/manifest/video.m3u8`;

        const {
          data: replayBroadcast,
          error: replayUpdateError,
        } = await supabase
          .from("live_broadcasts")
          .update({
            status: "replay",

            playback_url:
              replayHlsUrl,

            last_cloudflare_status:
              recording.status?.state ??
              "ready",

            last_synced_at:
              now,

            updated_at:
              now,
          })
          .eq(
            "id",
            endedBroadcast.id
          )
          .select()
          .single();

        if (replayUpdateError) {
          throw new Error(
            replayUpdateError.message
          );
        }

        return NextResponse.json({
          ok: true,

          action:
            "Recording is ready. Broadcast changed from ended to replay.",

          broadcast: {
            id:
              replayBroadcast.id,

            title:
              replayBroadcast.title,

            previousStatus:
              "ended",

            status:
              replayBroadcast.status,

            cloudflareVideoUID:
              replayBroadcast
                .cloudflare_video_uid,

            playbackUrl:
              replayBroadcast
                .playback_url,

            wentLiveAt:
              replayBroadcast
                .went_live_at,

            endedAt:
              replayBroadcast
                .ended_at,
          },
        });
      }
    }

    // -------------------------------------------------
    // 3. Read current Cloudflare Live lifecycle
    // -------------------------------------------------

    const customerCode =
      getCustomerCode(hlsUrl);

    const lifecycleUrl =
      `https://customer-${customerCode}.cloudflarestream.com/${liveInputId}/lifecycle`;

    const lifecycleResponse =
      await fetch(lifecycleUrl, {
        method: "GET",
        headers: {
          Authorization:
            `Bearer ${apiToken}`,
        },
        cache: "no-store",
      });

    if (!lifecycleResponse.ok) {
      const text =
        await lifecycleResponse.text();

      throw new Error(
        `Cloudflare lifecycle request failed: ${lifecycleResponse.status} ${text}`
      );
    }

    const cloudflare =
      (await lifecycleResponse.json()) as CloudflareLifecycle;

    // -------------------------------------------------
    // 4. Find currently active broadcast
    // -------------------------------------------------

    const {
      data: activeBroadcasts,
      error: activeError,
    } = await supabase
      .from("live_broadcasts")
      .select(`
        id,
        title,
        status,
        scheduled_start,
        scheduled_end,
        playback_url,
        cloudflare_video_uid,
        went_live_at,
        ended_at
      `)
      .eq("published", true)
      .in("status", [
        "starting_soon",
        "live",
      ])
      .order("scheduled_start", {
        ascending: true,
      });

    if (activeError) {
      throw new Error(
        activeError.message
      );
    }

    let broadcast =
      activeBroadcasts?.[0] ?? null;

    // -------------------------------------------------
    // 5. If there is no active broadcast,
    //    find nearest scheduled broadcast
    // -------------------------------------------------

    if (!broadcast) {
      const {
        data: scheduledBroadcasts,
        error: scheduledError,
      } = await supabase
        .from("live_broadcasts")
        .select(`
          id,
          title,
          status,
          scheduled_start,
          scheduled_end,
          playback_url,
          cloudflare_video_uid,
          went_live_at,
          ended_at
        `)
        .eq("published", true)
        .eq("status", "scheduled")
        .order("scheduled_start", {
          ascending: true,
        });

      if (scheduledError) {
        throw new Error(
          scheduledError.message
        );
      }

      const nowDate =
        Date.now();

      broadcast =
        scheduledBroadcasts
          ?.map((item) => {
            const start =
              item.scheduled_start
                ? new Date(
                    item.scheduled_start
                  ).getTime()
                : nowDate;

            return {
              ...item,

              distance:
                Math.abs(
                  start -
                    nowDate
                ),
            };
          })
          .sort(
            (a, b) =>
              a.distance -
              b.distance
          )[0] ?? null;
    }

    // -------------------------------------------------
    // 6. Nothing currently needs lifecycle sync
    // -------------------------------------------------

    if (!broadcast) {
      return NextResponse.json({
        ok: true,

        cloudflare,

        action:
          endedBroadcast
            ? "Ended broadcast recording is still processing."
            : "No published broadcast available to synchronize.",
      });
    }

    // -------------------------------------------------
    // 7. Determine desired broadcast status
    // -------------------------------------------------

    let nextStatus =
      broadcast.status;

    let wentLiveAt =
      broadcast.went_live_at;

    let endedAt =
      broadcast.ended_at;

    let videoUID =
      broadcast.cloudflare_video_uid;

    // Cloudflare is preparing incoming stream.

    if (
      cloudflare.status ===
        "initializing" &&
      cloudflare.live === false
    ) {
      nextStatus =
        "starting_soon";
    }

    // Cloudflare confirms actual live playback.

    if (
      cloudflare.live === true &&
      cloudflare.status ===
        "ready"
    ) {
      nextStatus =
        "live";

      wentLiveAt =
        wentLiveAt ?? now;

      if (
        cloudflare.videoUID
      ) {
        videoUID =
          cloudflare.videoUID;
      }

      endedAt = null;
    }

    // -------------------------------------------------
    // 8. Stream stopped
    // -------------------------------------------------

    if (
      cloudflare.live === false &&
      cloudflare.status ===
        "disconnected"
    ) {
      if (
        broadcast.status ===
          "live" ||
        wentLiveAt
      ) {
        nextStatus =
          "ended";

        endedAt =
          endedAt ?? now;
      } else if (
        broadcast.status ===
          "starting_soon"
      ) {
        nextStatus =
          "scheduled";
      }
    }

    // -------------------------------------------------
    // 9. Update Supabase
    // -------------------------------------------------

    const {
      data: updatedBroadcast,
      error: updateError,
    } = await supabase
      .from("live_broadcasts")
      .update({
        status:
          nextStatus,

        playback_url:
          hlsUrl,

        cloudflare_video_uid:
          videoUID,

        last_cloudflare_status:
          cloudflare.status ??
          null,

        last_synced_at:
          now,

        went_live_at:
          wentLiveAt,

        ended_at:
          endedAt,

        updated_at:
          now,
      })
      .eq(
        "id",
        broadcast.id
      )
      .select()
      .single();

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    // -------------------------------------------------
    // 10. Result
    // -------------------------------------------------

    return NextResponse.json({
      ok: true,

      cloudflare: {
        live:
          cloudflare.live,

        status:
          cloudflare.status,

        videoUID:
          cloudflare.videoUID,
      },

      broadcast: {
        id:
          updatedBroadcast.id,

        title:
          updatedBroadcast.title,

        previousStatus:
          broadcast.status,

        status:
          updatedBroadcast.status,

        cloudflareVideoUID:
          updatedBroadcast
            .cloudflare_video_uid,

        playbackUrl:
          updatedBroadcast
            .playback_url,

        wentLiveAt:
          updatedBroadcast
            .went_live_at,

        endedAt:
          updatedBroadcast
            .ended_at,
      },
    });
  } catch (error) {
    console.error(
      "SYNC LIVE ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to synchronize live broadcast.",
      },
      {
        status: 500,
      }
    );
  }
}

function getCustomerCode(
  hlsUrl: string
): string {
  const customerCode =
    hlsUrl.match(
      /customer-([^.]+)\.cloudflarestream\.com/
    )?.[1];

  if (!customerCode) {
    throw new Error(
      "Unable to determine Cloudflare customer code."
    );
  }

  return customerCode;
}