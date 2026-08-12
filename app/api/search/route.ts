import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabase } from "@/lib/supabase/client";

export const dynamic =
  "force-dynamic";

export async function GET(
  request: NextRequest
) {
  const query =
    request.nextUrl.searchParams
      .get("q")
      ?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({
      videos: [],
      series: [],
    });
  }

  const safeQuery =
    query
      .replace(/[%_,()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  if (!safeQuery) {
    return NextResponse.json({
      videos: [],
      series: [],
    });
  }

  try {
    const [
      videosResult,
      seriesResult,
    ] = await Promise.all([
      supabase
        .from("videos")
        .select(`
          id,
          title,
          subtitle,
          description,
          thumbnail_url,
          category
        `)
        .eq("published", true)
        .or(
          `title.ilike.%${safeQuery}%,subtitle.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%,category.ilike.%${safeQuery}%`
        )
        .limit(24),

      supabase
        .from("series")
        .select(`
          id,
          title,
          subtitle,
          description,
          thumbnail_url
        `)
        .eq("published", true)
        .or(
          `title.ilike.%${safeQuery}%,subtitle.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%`
        )
        .limit(24),
    ]);

    if (videosResult.error) {
      throw new Error(
        videosResult.error.message
      );
    }

    if (seriesResult.error) {
      throw new Error(
        seriesResult.error.message
      );
    }

    return NextResponse.json({
      videos:
        videosResult.data ?? [],

      series:
        seriesResult.data ?? [],
    });
  } catch (error) {
    console.error(
      "PUBLIC SEARCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        videos: [],
        series: [],
        error:
          error instanceof Error
            ? error.message
            : "Search failed.",
      },
      {
        status: 500,
      }
    );
  }
}