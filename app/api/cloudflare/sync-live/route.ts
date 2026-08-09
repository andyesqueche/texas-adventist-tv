import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/client";

type CloudflareLifecycle = {
  isInput?: boolean;
  videoUID?: string | null;
  live?: boolean;
  status?: string;
  chunked?: boolean;
};

export async function GET(
  request: Request
) {
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
    // -----------------------------------------------------
    // 1. Read Cloudflare lifecycle
    // -----------------------------------------------------

    const customerCode =
      hlsUrl.match(
        /customer-([^.]+)\.cloudflarestream\.com/
      )?.[1];

    if (!customerCode) {
      throw new Error(
        "Unable to determine Cloudflare customer code."
      );
    }

    const lifecycleUrl =
      `https://customer-${customerCode}.cloudflarestream.com/${liveInputId}/lifecycle`;

    const lifecycleResponse =
      await fetch(
        lifecycleUrl,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${apiToken}`,
          },
          cache: "no-store",
        }
      );

    if (!lifecycleResponse.ok) {
      const text =
        await lifecycleResponse.text();

      throw new Error(
        `Cloudflare lifecycle request failed: ${lifecycleResponse.status} ${text}`
      );
    }

    const cloudflare =
      (await lifecycleResponse.json()) as CloudflareLifecycle;

    const now =
      new Date().toISOString();

    // -----------------------------------------------------
    // 2. Find currently active broadcast first
    // -----------------------------------------------------

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
        cloudflare_video_uid,
        went_live_at,
        ended_at
      `)
      .eq("published", true)
      .in(
        "status",
        [
          "starting_soon",
          "live"
        ]
      )
      .order(
        "scheduled_start",
        {
          ascending: true,
        }
      );

    if (activeError) {
      throw new Error(
        activeError.message
      );
    }

    let broadcast =
      activeBroadcasts?.[0] ?? null;

    // -----------------------------------------------------
    // 3. If there is no active broadcast,
    //    find the nearest scheduled broadcast
    // -----------------------------------------------------

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
          cloudflare_video_uid,
          went_live_at,
          ended_at
        `)
        .eq("published", true)
        .eq(
          "status",
          "scheduled"
        )
        .order(
          "scheduled_start",
          {
            ascending: true,
          }
        );

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

    // -----------------------------------------------------
    // No broadcast is scheduled
    // -----------------------------------------------------

    if (!broadcast) {
      return NextResponse.json({
        ok: true,

        cloudflare,

        action:
          "No published broadcast available to synchronize.",
      });
    }

    // -----------------------------------------------------
    // 4. Determine desired status
    // -----------------------------------------------------

    let nextStatus =
      broadcast.status;

    let wentLiveAt =
      broadcast.went_live_at;

    let endedAt =
      broadcast.ended_at;

    let videoUID =
      broadcast.cloudflare_video_uid;

    // Cloudflare is preparing the incoming stream.

    if (
      cloudflare.status ===
        "initializing" &&
      cloudflare.live === false
    ) {
      nextStatus =
        "starting_soon";
    }

    // Cloudflare confirms actual LIVE playback.

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

    // -----------------------------------------------------
    // 5. Stream stopped
    // -----------------------------------------------------

    if (
      cloudflare.live === false &&
      cloudflare.status ===
        "disconnected"
    ) {
      // It was actually live before.
      if (
        broadcast.status ===
          "live" ||
        wentLiveAt
      ) {
        nextStatus =
          "ended";

        endedAt =
          endedAt ?? now;
      }

      // Stream started initializing but never became live.
      else if (
        broadcast.status ===
          "starting_soon"
      ) {
        nextStatus =
          "scheduled";
      }
    }

    // -----------------------------------------------------
    // 6. Update Supabase
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // Result
    // -----------------------------------------------------

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