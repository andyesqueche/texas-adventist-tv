import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
  Tv,
} from "lucide-react";

import { TopNavigation } from "@/components/public/top-navigation";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white">
      <TopNavigation />

      <section className="flex min-h-screen items-center justify-center px-6 pb-20 pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900">
            <Tv className="h-7 w-7 text-zinc-400" />
          </div>

          <div className="mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-zinc-600">
            Error 404
          </div>

          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            Content not found
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-zinc-400">
            The video, series, or page you are looking for
            may have been removed or is no longer available.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              <Home className="h-5 w-5" />

              Go Home
            </Link>

            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:bg-zinc-800"
            >
              <ArrowLeft className="h-5 w-5" />

              Browse
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:bg-zinc-800"
            >
              <Search className="h-5 w-5" />

              Search
            </Link>
          </div>

          <div className="mt-16 border-t border-zinc-900 pt-8">
            <p className="text-sm text-zinc-600">
              Texas Adventist TV
            </p>

            <p className="mt-1 text-xs text-zinc-700">
              Watch. Learn. Grow.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}