import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/studio/page-header";
import { LiveTable } from "@/components/live/live-table";
import { getLiveBroadcasts } from "@/lib/repositories/live.repository";

// ---------------------------------------------------------
// Always render this page with current Supabase data
// ---------------------------------------------------------

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ---------------------------------------------------------
// Broadcast Center
// ---------------------------------------------------------

export default async function LivePage() {
  const broadcasts = await getLiveBroadcasts();

  return (
    <div>
      <PageHeader
        title="Broadcast Center"
        description="Manage live and scheduled broadcasts for Texas Adventist TV."
        actions={
          <Link
            href="/admin/live/new"
            className="inline-flex items-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
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