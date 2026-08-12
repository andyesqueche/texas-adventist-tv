import { supabase } from "@/lib/supabase/client";
import type { VideoRecord } from "@/types/video";
import type { SeriesRecord } from "@/lib/repositories/series.repository";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryOption = {
  id: string;
  name: string;
};

export type SaveCategoryInput = {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  display_order: number;
  published: boolean;
};

export type PublicCategoryContent = {
  category: CategoryRecord;
  videos: VideoRecord[];
  series: SeriesRecord[];
};

const categoryFields = `
  id,
  name,
  slug,
  description,
  color,
  icon,
  display_order,
  published,
  created_at,
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

const publicSeriesFields = `
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

export async function getCategories(): Promise<
  CategoryRecord[]
> {
  const { data, error } = await supabase
    .from("categories")
    .select(categoryFields)
    .order("display_order")
    .order("name");

  if (error) {
    console.error(
      "GET CATEGORIES ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as CategoryRecord[];
}

export async function getPublishedCategoryOptions(): Promise<
  CategoryOption[]
> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("published", true)
    .order("display_order")
    .order("name");

  if (error) {
    console.error(
      "GET CATEGORY OPTIONS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as CategoryOption[];
}

export async function getCategoryById(
  id: string
): Promise<CategoryRecord> {
  const { data, error } = await supabase
    .from("categories")
    .select(categoryFields)
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "GET CATEGORY ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as CategoryRecord;
}

export async function createCategory(
  values: SaveCategoryInput
): Promise<CategoryRecord> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: values.name.trim(),

      slug: values.slug.trim(),

      description:
        values.description.trim() || null,

      color:
        values.color.trim() || "#003B5C",

      icon:
        values.icon.trim() || null,

      display_order:
        values.display_order,

      published:
        values.published,
    })
    .select(categoryFields)
    .single();

  if (error) {
    console.error(
      "CREATE CATEGORY ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as CategoryRecord;
}

export async function updateCategory(
  id: string,
  values: SaveCategoryInput
): Promise<CategoryRecord> {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: values.name.trim(),

      slug: values.slug.trim(),

      description:
        values.description.trim() || null,

      color:
        values.color.trim() || "#003B5C",

      icon:
        values.icon.trim() || null,

      display_order:
        values.display_order,

      published:
        values.published,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .select(categoryFields)
    .single();

  if (error) {
    console.error(
      "UPDATE CATEGORY ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as CategoryRecord;
}

export async function deleteCategory(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "DELETE CATEGORY ERROR:",
      error
    );

    throw new Error(error.message);
  }
}

export async function getPublishedCategories(): Promise<
  CategoryRecord[]
> {
  const { data, error } = await supabase
    .from("categories")
    .select(categoryFields)
    .eq("published", true)
    .order("display_order")
    .order("name");

  if (error) {
    console.error(
      "GET PUBLISHED CATEGORIES ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as CategoryRecord[];
}

export async function getPublicCategoryContent(
  slug: string
): Promise<PublicCategoryContent | null> {
  const {
    data: category,
    error: categoryError,
  } = await supabase
    .from("categories")
    .select(categoryFields)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (categoryError) {
    console.error(
      "GET PUBLIC CATEGORY ERROR:",
      categoryError
    );

    throw new Error(
      categoryError.message
    );
  }

  if (!category) {
    return null;
  }

  const [
    videosResult,
    seriesResult,
  ] = await Promise.all([
    supabase
      .from("videos")
      .select(publicVideoFields)
      .eq("published", true)
      .eq("category", category.name)
      .order("updated_at", {
        ascending: false,
      }),

    supabase
      .from("series")
      .select(publicSeriesFields)
      .eq("published", true)
      .eq("category_id", category.id)
      .order("display_order", {
        ascending: true,
      })
      .order("title", {
        ascending: true,
      }),
  ]);

  if (videosResult.error) {
    console.error(
      "GET CATEGORY VIDEOS ERROR:",
      videosResult.error
    );

    throw new Error(
      videosResult.error.message
    );
  }

  if (seriesResult.error) {
    console.error(
      "GET CATEGORY SERIES ERROR:",
      seriesResult.error
    );

    throw new Error(
      seriesResult.error.message
    );
  }

  return {
    category:
      category as CategoryRecord,

    videos:
      (videosResult.data ??
        []) as VideoRecord[],

    series:
      (seriesResult.data ??
        []) as SeriesRecord[],
  };
}