import Link from "next/link";
import { Upload } from "lucide-react";
import { PageHeader } from "@/components/studio/page-header";

export default function MediaPage() {
  return (
    <div className="space-y-8 p-10">

      <PageHeader
        title="Media Library"
        description="Images, videos and assets used across the platform."
        actions={
          <Link
            href="/admin/media/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-[#003B5C] px-4 py-2 text-white hover:bg-[#004d78]"
          >
            <Upload className="h-4 w-4" />
            Upload Media
          </Link>
        }
      />

      <div className="rounded-xl border border-dashed border-zinc-800 p-24 text-center text-zinc-500">

        Media Library

      </div>

    </div>
  );
}