import { supabase } from "@/lib/supabase/client";
import type { VideoRecord } from "@/types/video";

export type SeriesOrientation =
  | "landscape"
  | "portrait";

export type SeriesRecord = {
  id: string;

  title: string;
  subtitle: string | null;

  slug: string;

  description: string | null;

  category_id: string | null;

  thumbnail_url: string | null;
  hero_url: string | null;
  logo_url: string | null;

  orientation: SeriesOrientation;

  featured: boolean;
  published: boolean;

  updated_at: string;
};

export type SaveSeriesInput = {
  title: string;

  subtitle: string;

  slug: string;

  description: string;

  category_id: string | null;

  thumbnail_url: string | null;
  hero_url: string | null;
  logo_url: string | null;

  orientation: SeriesOrientation;

  featured: boolean;
  published: boolean;
};

export type PublicSeriesWithVideos = {
  series: SeriesRecord;
  videos: VideoRecord[];
};

const seriesFields = `
  id,
  title,
  subtitle,
  slug,
  description,
  category_id,
  thumbnail_url,
  hero_url,
  logo_url,
  orientation,
  featured,
  published,
  updated_at
`;

const publicVideoFields = `
  id,
  title,
  subtitle,
  slug,
  description,
  category,
  series_id,
  featured,
  published,
  thumbnail_url,
  hero_url,
  trailer_url,
  stream_provider,
  stream_uid,
  playback_url,
  stream_status,
  updated_at
`;

export async function getSeries(): Promise<
  SeriesRecord[]
> {
  const { data, error } = await supabase
    .from("series")
    .select(seriesFields)
    .order("display_order");

  if (error) {
    console.error(
      "GET SERIES ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as SeriesRecord[];
}

export async function getSeriesById(
  id: string
): Promise<SeriesRecord> {
  const { data, error } = await supabase
    .from("series")
    .select(seriesFields)
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "GET SERIES ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as SeriesRecord;
}

export async function createSeries(
  values: SaveSeriesInput
) {
  const { data, error } = await supabase
    .from("series")
    .insert({
      title: values.title,

      subtitle:
        values.subtitle || null,

      slug: values.slug,

      description:
        values.description || null,

      category_id:
        values.category_id,

      thumbnail_url:
        values.thumbnail_url,

      hero_url:
        values.hero_url,

      logo_url:
        values.logo_url,

      orientation:
        values.orientation,

      featured:
        values.featured,

      published:
        values.published,

      display_order: 0,
    })
    .select(seriesFields)
    .single();

  if (error) {
    console.error(
      "CREATE SERIES ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as SeriesRecord;
}

export async function updateSeries(
  id: string,
  values: SaveSeriesInput
) {
  const { data, error } = await supabase
    .from("series")
    .update({
      title: values.title,

      subtitle:
        values.subtitle || null,

      slug: values.slug,

      description:
        values.description || null,

      category_id:
        values.category_id,

      thumbnail_url:
        values.thumbnail_url,

      hero_url:
        values.hero_url,

      logo_url:
        values.logo_url,

      orientation:
        values.orientation,

      featured:
        values.featured,

      published:
        values.published,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .select(seriesFields)
    .single();

  if (error) {
    console.error(
      "UPDATE SERIES ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as SeriesRecord;
}

export async function deleteSeries(
  id: string
) {
  const { error } = await supabase
    .from("series")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "DELETE SERIES ERROR:",
      error
    );

    throw new Error(error.message);
  }
}

export async function getSeriesOptions() {
  const { data, error } = await supabase
    .from("series")
    .select("id, title")
    .eq("published", true)
    .order("display_order")
    .order("title");

  if (error) {
    console.error(
      "GET SERIES OPTIONS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPublishedSeries(): Promise<
  SeriesRecord[]
> {
  const { data, error } = await supabase
    .from("series")
    .select(seriesFields)
    .eq("published", true)
    .order("display_order")
    .order("title");

  if (error) {
    console.error(
      "GET PUBLISHED SERIES ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as SeriesRecord[];
}

export async function getPublicSeriesWithVideos(
  id: string
): Promise<PublicSeriesWithVideos | null> {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return null;
  }

  const {
    data: series,
    error: seriesError,
  } = await supabase
    .from("series")
    .select(seriesFields)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (seriesError) {
    console.error(
      "GET PUBLIC SERIES ERROR:",
      seriesError
    );

    throw new Error(
      seriesError.message
    );
  }

  if (!series) {
    return null;
  }

  const {
    data: videos,
    error: videosError,
  } = await supabase
    .from("videos")
    .select(publicVideoFields)
    .eq("series_id", id)
    .eq("published", true)
    .order("display_order", {
      ascending: true,
    })
    .order("updated_at", {
      ascending: false,
    });

  if (videosError) {
    console.error(
      "GET SERIES VIDEOS ERROR:",
      videosError
    );

    throw new Error(
      videosError.message
    );
  }

  return {
    series:
      series as SeriesRecord,

    videos:
      (videos ?? []) as VideoRecord[],
  };
}