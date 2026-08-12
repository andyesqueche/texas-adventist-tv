import { notFound } from "next/navigation";

import { VideoForm } from "@/components/videos/video-form";

import {
  getVideoById,
} from "@/lib/repositories/video.repository";

import {
  getSeriesOptions,
} from "@/lib/repositories/series.repository";

import {
  getPublishedCategoryOptions,
} from "@/lib/repositories/category.repository";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditVideoPage({
  params,
}: Props) {
  const { id } = await params;

  const [video, series, categories] =
    await Promise.all([
      getVideoById(id),
      getSeriesOptions(),
      getPublishedCategoryOptions(),
    ]);

  if (!video) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Edit Video
      </h1>

      <VideoForm
        initialData={video}
        series={series}
        categories={categories}
      />
    </div>
  );
}