import {
  createVideo,
  updateVideo,
} from "@/lib/repositories/video.repository";
import type { SaveVideoInput } from "@/types/video";

export async function saveVideo(
  values: SaveVideoInput,
  id?: string
) {
  if (id) {
    return updateVideo(id, values);
  }

  return createVideo(values);
}