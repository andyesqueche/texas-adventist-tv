import { VideoForm } from "@/components/videos/video-form";
import { getSeriesOptions } from "@/lib/repositories/series.repository";

export default async function NewVideoPage() {
  const series = await getSeriesOptions();

  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">
        New Video
      </h1>

      <VideoForm
        series={series}
      />
    </div>
  );
}