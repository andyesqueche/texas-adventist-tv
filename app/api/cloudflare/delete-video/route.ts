import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: NextRequest
) {
  try {
    // -----------------------------------------
    // 1. AUTHENTICATION
    // -----------------------------------------

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // -----------------------------------------
    // 2. REQUEST DATA
    // -----------------------------------------

    const body = await request.json();

    const uid =
      typeof body.uid === "string"
        ? body.uid.trim()
        : "";

    const videoId =
      typeof body.videoId === "string"
        ? body.videoId.trim()
        : "";

    const type =
      typeof body.type === "string"
        ? body.type
        : "";

    if (!uid) {
      return NextResponse.json(
        {
          error:
            "Cloudflare Stream UID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!videoId) {
      return NextResponse.json(
        {
          error: "Video ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (type !== "trailer") {
      return NextResponse.json(
        {
          error:
            "Only trailer deletion is supported.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // 3. GET VIDEO FROM SUPABASE
    // -----------------------------------------

    const {
      data: video,
      error: videoError,
    } = await supabase
      .from("videos")
      .select(
        `
          id,
          trailer_stream_uid
        `
      )
      .eq("id", videoId)
      .single();

    if (videoError || !video) {
      console.error(
        "GET VIDEO FOR TRAILER DELETE ERROR:",
        videoError
      );

      return NextResponse.json(
        {
          error: "Video not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------
    // 4. VERIFY UID
    // -----------------------------------------

    if (video.trailer_stream_uid !== uid) {
      return NextResponse.json(
        {
          error:
            "Trailer UID does not match this video.",
        },
        {
          status: 409,
        }
      );
    }

    // -----------------------------------------
    // 5. CLOUDFLARE CONFIGURATION
    // -----------------------------------------

    const accountId =
      process.env.CLOUDFLARE_ACCOUNT_ID;

    const apiToken =
      process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        {
          error:
            "Cloudflare credentials are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------------
    // 6. DELETE FROM CLOUDFLARE
    // -----------------------------------------

    const cloudflareResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${uid}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },

        cache: "no-store",
      }
    );

    if (!cloudflareResponse.ok) {
      const errorBody =
        await cloudflareResponse.text();

      console.error(
        "CLOUDFLARE TRAILER DELETE ERROR:",
        errorBody
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete trailer from Cloudflare Stream.",
        },
        {
          status: cloudflareResponse.status,
        }
      );
    }

    // -----------------------------------------
    // 7. CLEAN SUPABASE
    // -----------------------------------------

    const {
      error: updateError,
    } = await supabase
      .from("videos")
      .update({
        trailer_url: null,
        trailer_stream_uid: null,
        trailer_playback_url: null,
        trailer_stream_status: null,
      })
      .eq("id", videoId)
      .eq("trailer_stream_uid", uid);

    if (updateError) {
      console.error(
        "CLEAR TRAILER FIELDS ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Trailer was deleted from Cloudflare, but Supabase could not be updated.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------------
    // 8. SUCCESS
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      videoId,
      uid,
      type: "trailer",
    });
  } catch (error) {
    console.error(
      "DELETE TRAILER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete trailer.",
      },
      {
        status: 500,
      }
    );
  }
}