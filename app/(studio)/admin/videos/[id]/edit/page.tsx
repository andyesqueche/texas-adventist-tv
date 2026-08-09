import { notFound } from "next/navigation";

import { VideoForm } from "@/components/videos/video-form";

import {
  getVideoById,
} from "@/lib/repositories/video.repository";

import {
  getSeriesOptions,
} from "@/lib/repositories/series.repository";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditVideoPage({
  params,
}: Props) {
  const { id } = await params;

  const [video, series] = await Promise.all([
    getVideoById(id),
    getSeriesOptions(),
  ]);

  if (!video) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl p-10">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Video
      </h1>

      <VideoForm
        initialData={video}
        series={series}
      />
    </div>
  );
}