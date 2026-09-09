import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WatchDailyForm } from "@/components/watch/watch-daily-form";

export default function NewWatchDailyContentPage() {
  return (
    <div className="p-10">
      <div className="mb-8">
        <Link
          href="/admin/watch/daily"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Daily Content
        </Link>

        <h1 className="text-3xl font-bold text-white">
          New Daily Content
        </h1>

        <p className="mt-2 text-zinc-400">
          Create the Bible verse and prayer for a specific day.
        </p>
      </div>

      <WatchDailyForm />
    </div>
  );
}
