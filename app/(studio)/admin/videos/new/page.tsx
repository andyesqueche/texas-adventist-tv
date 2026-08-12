import { VideoForm } from "@/components/videos/video-form";

import {
  getSeriesOptions,
} from "@/lib/repositories/series.repository";

import {
  getPublishedCategoryOptions,
} from "@/lib/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function NewVideoPage() {
  const [series, categories] =
    await Promise.all([
      getSeriesOptions(),
      getPublishedCategoryOptions(),
    ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        New Video
      </h1>

      <VideoForm
        series={series}
        categories={categories}
      />
    </div>
  );
}