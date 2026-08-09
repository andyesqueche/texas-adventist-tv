import { supabase } from "@/lib/supabase/client";

export type CollectionVideo = {
  id: string;
  title: string;
  thumbnail_url: string | null;
};

export type SaveCollectionInput = {
  title: string;
  subtitle: string;
  videoIds: string[];
};

export async function getVideosForCollection() {
  const { data, error } = await supabase
    .from("videos")
    .select(`
      id,
      title,
      thumbnail_url
    `)
    .eq("published", true)
    .order("title");

  if (error) throw new Error(error.message);

  return data as CollectionVideo[];
}

export async function createCollection(
  values: SaveCollectionInput
) {
  const { data, error } = await supabase
    .from("collections")
    .insert({
      title: values.title,
      subtitle: values.subtitle,
      published: true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (values.videoIds.length) {

    const items = values.videoIds.map(
      (videoId, index) => ({
        collection_id: data.id,
        video_id: videoId,
        display_order: index,
      })
    );

    const { error: itemsError } =
      await supabase
        .from("collection_items")
        .insert(items);

    if (itemsError)
      throw new Error(itemsError.message);

  }

  return data;
}
export type CollectionRecord = {
  id: string;
  title: string;
  subtitle: string | null;
  published: boolean;
  display_order: number;
};

export async function getCollections() {

  const { data, error } = await supabase
    .from("collections")
    .select(`
      id,
      title,
      subtitle,
      published,
      display_order
    `)
    .order("display_order");

  if (error) {
    throw new Error(error.message);
  }

  return data as CollectionRecord[];

}