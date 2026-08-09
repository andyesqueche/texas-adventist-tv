import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/studio/page-header";
import { SeriesTable } from "@/components/series/series-table";

import { getSeries } from "@/lib/repositories/series.repository";

export default async function SeriesPage() {
  const series = await getSeries();

  return (
    <div className="space-y-8 p-10">
      <PageHeader
        title="Shows"
        description="Manage all TV shows and series."
        actions={
          <Link
            href="/admin/series/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#003B5C] px-4 py-2 text-white hover:bg-[#004d78]"
          >
            <Plus className="h-4 w-4" />
            New Show
          </Link>
        }
      />

      <SeriesTable series={series} />
    </div>
  );
}