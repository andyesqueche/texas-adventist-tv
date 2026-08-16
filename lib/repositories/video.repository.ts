import { supabase } from "@/lib/supabase/client";

import type {
  SaveVideoInput,
  VideoRecord,
} from "@/types/video";

const videoFields = `
  id,
  title,
  subtitle,
  slug,
  description,
  category,
  series_id,
  featured,
  published,
  display_order,
  thumbnail_url,
  hero_url,
  trailer_url,
  trailer_stream_uid,
  trailer_playback_url,
  trailer_stream_status,
  stream_provider,
  stream_uid,
  playback_url,
  stream_status,
  created_at,
  updated_at
`;

export async function getVideos(): Promise<
  VideoRecord[]
> {
  const { data, error } = await supabase
    .from("videos")
    .select(videoFields)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "GET VIDEOS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as VideoRecord[];
}

export async function getVideoById(
  id: string
): Promise<VideoRecord> {
  const { data, error } = await supabase
    .from("videos")
    .select(videoFields)
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "GET VIDEO ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as VideoRecord;
}

export async function createVideo(
  values: SaveVideoInput
) {
  let displayOrder = 0;

  if (values.series_id) {
    const { data, error } = await supabase
      .from("videos")
      .select("display_order")
      .eq("series_id", values.series_id)
      .order("display_order", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "GET LAST VIDEO ORDER ERROR:",
        error
      );

      throw new Error(error.message);
    }

    displayOrder =
      typeof data?.display_order ===
        "number"
        ? data.display_order + 1
        : 0;
  }

  const { data, error } = await supabase
    .from("videos")
    .insert({
      title: values.title,

      subtitle:
        values.subtitle || null,

      slug: values.slug,

      description:
        values.description || null,

      long_description: "",

      category:
        values.category || null,

      series_id:
        values.series_id,

      year:
        new Date().getFullYear(),

      duration_seconds: 0,

      rating: "TV-G",

      display_order:
        displayOrder,

      thumbnail_url:
        values.thumbnail_url,

      hero_url:
        values.hero_url,

      trailer_url:
        values.trailer_url,

      trailer_stream_uid:
        values.trailer_stream_uid,

      trailer_playback_url:
        values.trailer_playback_url,

      trailer_stream_status:
        values.trailer_stream_status,

      stream_provider:
        values.stream_provider,

      stream_uid:
        values.stream_uid,

      playback_url:
        values.playback_url,

      stream_status:
        values.stream_uid
          ? "processing"
          : "pending",

      featured:
        values.featured,

      published:
        values.published,
    })
    .select(videoFields)
    .single();

  if (error) {
    console.error(
      "CREATE VIDEO ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as VideoRecord;
}

export async function updateVideo(
  id: string,
  values: SaveVideoInput
) {
  const { data, error } = await supabase
    .from("videos")
    .update({
      title:
        values.title,

      subtitle:
        values.subtitle || null,

      slug:
        values.slug,

      description:
        values.description || null,

      category:
        values.category || null,

      series_id:
        values.series_id,

      thumbnail_url:
        values.thumbnail_url,

      hero_url:
        values.hero_url,

      trailer_url:
        values.trailer_url,

      trailer_stream_uid:
        values.trailer_stream_uid,

      trailer_playback_url:
        values.trailer_playback_url,

      trailer_stream_status:
        values.trailer_stream_status,

      stream_provider:
        values.stream_provider,

      stream_uid:
        values.stream_uid,

      playback_url:
        values.playback_url,

      stream_status:
        values.stream_uid
          ? "processing"
          : "pending",

      featured:
        values.featured,

      published:
        values.published,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .select(videoFields)
    .single();

  if (error) {
    console.error(
      "UPDATE VIDEO ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as VideoRecord;
}

export async function deleteVideo(
  id: string
) {
  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "DELETE VIDEO ERROR:",
      error
    );

    throw new Error(error.message);
  }
}

export async function getPublishedVideos(): Promise<
  VideoRecord[]
> {
  const { data, error } = await supabase
    .from("videos")
    .select(videoFields)
    .eq("published", true)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "GET PUBLISHED VIDEOS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as VideoRecord[];
}

export async function getFeaturedVideo(): Promise<
  VideoRecord | null
> {
  const { data, error } = await supabase
    .from("videos")
    .select(videoFields)
    .eq("published", true)
    .eq("featured", true)
    .order("updated_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "GET FEATURED VIDEO ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as VideoRecord | null;
}

export async function getVideosFromSeries(
  seriesId: string,
  excludeVideoId?: string
): Promise<VideoRecord[]> {
  let query = supabase
    .from("videos")
    .select(videoFields)
    .eq("published", true)
    .eq("series_id", seriesId)
    .order("display_order", {
      ascending: true,
    })
    .order("updated_at", {
      ascending: false,
    });

  if (excludeVideoId) {
    query = query.neq(
      "id",
      excludeVideoId
    );
  }

  const { data, error } =
    await query;

  if (error) {
    console.error(
      "GET SERIES VIDEOS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as VideoRecord[];
}

export async function getRelatedVideos(
  video: VideoRecord,
  limit = 12
): Promise<VideoRecord[]> {
  if (!video.category) {
    return [];
  }

  let query = supabase
    .from("videos")
    .select(videoFields)
    .eq("published", true)
    .eq("category", video.category)
    .neq("id", video.id)
    .order("updated_at", {
      ascending: false,
    })
    .limit(limit);

  if (video.series_id) {
    query = query.or(
      `series_id.is.null,series_id.neq.${video.series_id}`
    );
  }

  const { data, error } =
    await query;

  if (error) {
    console.error(
      "GET RELATED VIDEOS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as VideoRecord[];
}

export async function getVideosForSeriesAdmin(
  seriesId: string
): Promise<VideoRecord[]> {
  const { data, error } = await supabase
    .from("videos")
    .select(videoFields)
    .eq("series_id", seriesId)
    .order("display_order", {
      ascending: true,
    })
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "GET ADMIN SERIES VIDEOS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as VideoRecord[];
}

export async function updateSeriesVideoOrder(
  videos: {
    id: string;
    display_order: number;
  }[]
) {
  const results = await Promise.all(
    videos.map((video) =>
      supabase
        .from("videos")
        .update({
          display_order:
            video.display_order,
        })
        .eq("id", video.id)
    )
  );

  const failed = results.find(
    (result) => result.error
  );

  if (failed?.error) {
    console.error(
      "UPDATE SERIES VIDEO ORDER ERROR:",
      failed.error
    );

    throw new Error(
      failed.error.message
    );
  }
}
