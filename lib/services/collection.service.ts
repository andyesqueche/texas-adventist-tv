import {
  createCollection,
  getVideosForCollection,
  SaveCollectionInput,
} from "@/lib/repositories/collection.repository";

export async function loadCollectionVideos() {
  return getVideosForCollection();
}

export async function saveCollection(
  values: SaveCollectionInput
) {
  return createCollection(values);
}