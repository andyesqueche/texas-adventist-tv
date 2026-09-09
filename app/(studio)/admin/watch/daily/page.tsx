"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getWatchDailyContent,
  type WatchDailyContentRecord,
} from "@/lib/repositories/watch.repository";

export default function WatchDailyContentPage() {
  const [items, setItems] = useState<WatchDailyContentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getWatchDailyContent();
        setItems(data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load daily content.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <div className="p-10">
      <div className="mb-8">
        <Link
          href="/admin/watch"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Apple Watch
        </Link>

        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Daily Content
            </h1>
            <p className="mt-2 text-zinc-400">
              Manage the daily Bible verse and prayer for Texas Adventist Watch.
            </p>
          </div>

          <Link
            href="/admin/watch/daily/new"
            className="inline-flex items-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            New Daily Content
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        {loading ? (
          <div className="p-8 text-sm text-zinc-400">
            Loading daily content...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-zinc-300">
              No daily content has been created yet.
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Create the first Bible verse and prayer for Texas Adventist Watch.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-6 p-5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-white">
                      {item.content_date}
                    </p>

                    <span
                      className={
                        item.is_published
                          ? "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400"
                          : "rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400"
                      }
                    >
                      {item.is_published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="mt-2 truncate text-sm text-zinc-400">
                    {item.verse_reference_en}
                  </p>

                  <p className="mt-1 truncate text-sm text-zinc-500">
                    {item.prayer_title_en}
                  </p>
                </div>

                <Link
                  href={`/admin/watch/daily/${item.id}`}
                  className="shrink-0 rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
