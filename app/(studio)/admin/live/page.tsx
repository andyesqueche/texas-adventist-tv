import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/studio/page-header";
import { LiveTable } from "@/components/live/live-table";
import { getLiveBroadcasts } from "@/lib/repositories/live.repository";

export default async function LivePage() {
  const broadcasts = await getLiveBroadcasts();

  return (
    <div className="space-y-8 p-10">
      <PageHeader
        title="Broadcast Center"
        description="Manage live and scheduled broadcasts for Texas Adventist TV."
        actions={
          <Link
            href="/admin/live/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#003B5C] px-4 py-2 text-white transition hover:bg-[#004d78]"
          >
            <Plus className="h-4 w-4" />
            New Broadcast
          </Link>
        }
      />

      <LiveTable broadcasts={broadcasts} />
    </div>
  );
}