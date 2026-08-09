import Link from "next/link";
import { Plus } from "lucide-react";

import { getVideos } from "@/lib/repositories/video.repository";
import { VideoTable } from "@/components/videos/video-table";
import { PageHeader } from "@/components/studio/page-header";

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="space-y-8 p-10">
      <PageHeader
        title="Videos"
        description="Manage all videos available in Texas Adventist TV."
        actions={
          <Link
            href="/admin/videos/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#003B5C] px-4 py-2 text-white hover:bg-[#004d78]"
          >
            <Plus className="h-4 w-4" />
            New Video
          </Link>
        }
      />

      <VideoTable videos={videos} />
    </div>
  );
}