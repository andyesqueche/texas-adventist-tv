import { PageHeader } from "@/components/studio/page-header";

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-10">
      <PageHeader
        title="Dashboard"
        description="Manage Texas Adventist TV content and publishing."
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Videos"
          value="1"
        />

        <StatCard
          label="Published"
          value="1"
        />

        <StatCard
          label="Drafts"
          value="0"
        />

        <StatCard
          label="Featured"
          value="1"
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
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>
    </article>
  );
}