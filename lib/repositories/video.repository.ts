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
  thumbnail_url,
  hero_url,
  trailer_url,
  stream_provider,
  stream_uid,
  playback_url,
  stream_status,
  updated_at
`;

export async function getVideos(): Promise<VideoRecord[]> {
  const { data, error } = await supabase
    .from("videos")
    .select(videoFields)
    .order("display_order");

  if (error) {
    console.error("GET VIDEOS ERROR:", error);
    throw new Error(error.message);
  }

  return data as VideoRecord[];
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
    console.error("GET VIDEO ERROR:", error);
    throw new Error(error.message);
  }

  return data as VideoRecord;
}

export async function createVideo(
  values: SaveVideoInput
) {
  const { data, error } = await supabase
    .from("videos")
    .insert({
      title: values.title,
      subtitle: values.subtitle || null,
      slug: values.slug,
      description: values.description || null,
      long_description: "",
      category: values.category || null,
      series_id: values.series_id,

      year: new Date().getFullYear(),
      duration_seconds: 0,
      rating: "TV-G",
      display_order: 0,

      thumbnail_url: values.thumbnail_url,
      hero_url: values.hero_url,
      trailer_url: values.trailer_url,

      stream_provider: values.stream_provider,
      stream_uid: values.stream_uid,
      playback_url: values.playback_url,
      stream_status: values.stream_uid
        ? "processing"
        : "pending",

      featured: values.featured,
      published: values.published,
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE VIDEO ERROR:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateVideo(
  id: string,
  values: SaveVideoInput
) {
  const { data, error } = await supabase
    .from("videos")
    .update({
      title: values.title,
      subtitle: values.subtitle || null,
      slug: values.slug,
      description: values.description || null,
      category: values.category || null,
      series_id: values.series_id,

      thumbnail_url: values.thumbnail_url,
      hero_url: values.hero_url,
      trailer_url: values.trailer_url,

      stream_provider: values.stream_provider,
      stream_uid: values.stream_uid,
      playback_url: values.playback_url,
      stream_status: values.stream_uid
        ? "processing"
        : "pending",

      featured: values.featured,
      published: values.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE VIDEO ERROR:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteVideo(id: string) {
  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE VIDEO ERROR:", error);
    throw new Error(error.message);
  }
}