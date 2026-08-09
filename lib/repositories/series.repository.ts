import { supabase } from "@/lib/supabase/client";

export type SeriesRecord = {
  id: string;

  title: string;
  subtitle: string | null;

  slug: string;

  description: string | null;

  category_id: string | null;

  thumbnail_url: string | null;
  hero_url: string | null;
  logo_url: string |null;

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

  featured: boolean;
  published: boolean;
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
  featured,
  published,
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
    console.error("GET SERIES ERROR:", error);
    throw new Error(error.message);
  }

  return data as SeriesRecord[];
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
    console.error("GET SERIES ERROR:", error);
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
      subtitle: values.subtitle || null,
      slug: values.slug,
      description: values.description || null,

      category_id: values.category_id,

      thumbnail_url: values.thumbnail_url,
      hero_url: values.hero_url,
      logo_url: values.logo_url,

      featured: values.featured,
      published: values.published,

      display_order: 0,
    })
    .select(seriesFields)
    .single();

  if (error) {
    console.error("CREATE SERIES ERROR:", error);
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
      subtitle: values.subtitle || null,
      slug: values.slug,
      description: values.description || null,

      category_id: values.category_id,

      thumbnail_url: values.thumbnail_url,
      hero_url: values.hero_url,
      logo_url: values.logo_url,

      featured: values.featured,
      published: values.published,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(seriesFields)
    .single();

  if (error) {
    console.error("UPDATE SERIES ERROR:", error);
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
    console.error("DELETE SERIES ERROR:", error);
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
    console.error("GET SERIES OPTIONS ERROR:", error);
    throw new Error(error.message);
  }

  return data;
}