import Link from "next/link";
import {
  Radio,
  Search,
  Tv,
} from "lucide-react";

export function TopNavigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003B5C]">
              <Tv className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="font-serif text-lg font-semibold text-white">
                Texas Adventist TV
              </p>

              <p className="text-xs text-zinc-500">
                Watch. Learn. Grow.
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-300 md:flex">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/live"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <Radio className="h-4 w-4" />

              Live TV
            </Link>

            <Link
              href="/series"
              className="transition hover:text-white"
            >
              Series
            </Link>

            <Link
              href="/browse"
              className="transition hover:text-white"
            >
              Browse
            </Link>
          </nav>
        </div>

        <Link
          href="/search"
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}