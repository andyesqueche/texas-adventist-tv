"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { deleteVideo } from "@/lib/repositories/video.repository";
import type { VideoRecord } from "@/types/video";

type Props = {
  videos: VideoRecord[];
};

export function VideoTable({ videos }: Props) {
  const router = useRouter();

  async function removeVideo(id: string) {
    const confirmed = window.confirm(
      "Delete this video?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVideo(id);

      toast.success("Video deleted successfully.");

      router.refresh();
    } catch (error) {
      console.error("DELETE VIDEO ERROR:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete video.";

      toast.error(message);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead className="bg-zinc-900">
          <tr>
            <th className="p-4 text-left">Thumbnail</th>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Published</th>
            <th className="p-4 text-left">Featured</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {videos.map((video) => (
            <tr
              key={video.id}
              className="border-t border-zinc-800 transition hover:bg-zinc-900"
            >
              <td className="p-4">
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    width={140}
                    height={80}
                    className="h-20 w-36 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-20 w-36 rounded-lg bg-zinc-800" />
                )}
              </td>

              <td className="p-4 font-medium text-white">
                <div>
                  <p>{video.title}</p>

                  {video.subtitle ? (
                    <p className="mt-1 text-sm text-zinc-400">
                      {video.subtitle}
                    </p>
                  ) : null}
                </div>
              </td>

              <td className="p-4 text-zinc-300">
                {video.category ?? "—"}
              </td>

              <td className="p-4">
                {video.published ? (
                  <Badge>Published</Badge>
                ) : (
                  <Badge variant="secondary">
                    Draft
                  </Badge>
                )}
              </td>

              <td className="p-4">
                {video.featured ? "⭐" : "—"}
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/videos/${video.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeVideo(video.id)}
                    className="inline-flex items-center gap-2 rounded-md border border-red-800 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {videos.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-10 text-center text-zinc-400"
              >
                No videos found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}