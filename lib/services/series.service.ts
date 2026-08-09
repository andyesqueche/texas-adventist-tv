import {
  createSeries,
  updateSeries,
  type SaveSeriesInput,
} from "@/lib/repositories/series.repository";

export async function saveSeries(
  values: SaveSeriesInput,
  id?: string
) {
  if (id) {
    return updateSeries(id, values);
  }

  return createSeries(values);
}