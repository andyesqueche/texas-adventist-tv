import {
  createLiveBroadcast,
  updateLiveBroadcast,
  type SaveLiveBroadcastInput,
} from "@/lib/repositories/live.repository";

export async function saveLiveBroadcast(
  values: SaveLiveBroadcastInput,
  id?: string
) {
  if (id) {
    return updateLiveBroadcast(
      id,
      values
    );
  }

  return createLiveBroadcast(values);
}