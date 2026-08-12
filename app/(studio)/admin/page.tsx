import { PageHeader } from "@/components/studio/page-header";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    totalResult,
    publishedResult,
    draftsResult,
    featuredResult,
  ] = await Promise.all([
    // Total Videos
    supabase
      .from("videos")
      .select("id", {
        count: "exact",
        head: true,
      }),

    // Published
    supabase
      .from("videos")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("published", true),

    // Drafts
    supabase
      .from("videos")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("published", false),

    // Featured
    supabase
      .from("videos")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("featured", true),
  ]);

  // MARK: - Error Logging

  const errors = [
    totalResult.error,
    publishedResult.error,
    draftsResult.error,
    featuredResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error(
      "DASHBOARD STATS ERROR:",
      errors
    );
  }

  // MARK: - Stats

  const totalVideos =
    totalResult.count ?? 0;

  const publishedVideos =
    publishedResult.count ?? 0;

  const draftVideos =
    draftsResult.count ?? 0;

  const featuredVideos =
    featuredResult.count ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Manage Texas Adventist TV content and publishing."
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Videos"
          value={totalVideos}
        />

        <StatCard
          label="Published"
          value={publishedVideos}
        />

        <StatCard
          label="Drafts"
          value={draftVideos}
        />

        <StatCard
          label="Featured"
          value={featuredVideos}
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
      <p className="text-sm text-zinc-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>
    </article>
  );
}