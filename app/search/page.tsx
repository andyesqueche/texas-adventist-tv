"use client";

import Link from "next/link";
import {
  Play,
  Search,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { TopNavigation } from "@/components/public/top-navigation";

type VideoResult = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  thumbnail_url: string | null;
  category: string | null;
};

type SeriesResult = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  thumbnail_url: string | null;
};

type SearchData = {
  videos: VideoResult[];
  series: SeriesResult[];
};

export default function SearchPage() {
  const [query, setQuery] =
    useState("");

  const [data, setData] =
    useState<SearchData>({
      videos: [],
      series: [],
    });

  const [loading, setLoading] =
    useState(false);

  const normalizedQuery =
    query.trim();

  useEffect(() => {
    if (
      normalizedQuery.length < 2
    ) {
      setData({
        videos: [],
        series: [],
      });

      setLoading(false);

      return;
    }

    const controller =
      new AbortController();

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);

            const response =
              await fetch(
                `/api/search?q=${encodeURIComponent(
                  normalizedQuery
                )}`,
                {
                  signal:
                    controller.signal,
                }
              );

            if (!response.ok) {
              throw new Error(
                "Search request failed."
              );
            }

            const result =
              (await response.json()) as SearchData;

            setData(result);
          } catch (error) {
            if (
              error instanceof DOMException &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            console.error(
              "SEARCH ERROR:",
              error
            );

            setData({
              videos: [],
              series: [],
            });
          } finally {
            setLoading(false);
          }
        },
        300
      );

    return () => {
      window.clearTimeout(
        timeout
      );

      controller.abort();
    };
  }, [normalizedQuery]);

  const totalResults =
    useMemo(
      () =>
        data.videos.length +
        data.series.length,
      [
        data.videos.length,
        data.series.length,
      ]
    );

  return (
    <main className="min-h-screen bg-black text-white">
      <TopNavigation />

      <section className="mx-auto max-w-[1600px] px-6 pb-24 pt-32 lg:px-10">
        <div className="max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Search
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Find something to watch
          </h1>

          <div className="relative mt-8">
            <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-zinc-500" />

            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search videos and series..."
              autoFocus
              className="h-16 w-full rounded-2xl border border-zinc-800 bg-zinc-950 pl-14 pr-14 text-lg text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 focus:bg-zinc-900"
            />

            {query ? (
              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
                className="absolute right-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>

        {normalizedQuery.length <
        2 ? (
          <div className="py-24 text-center">
            <Search className="mx-auto h-10 w-10 text-zinc-700" />

            <p className="mt-5 text-zinc-500">
              Enter at least two characters to search.
            </p>
          </div>
        ) : loading ? (
          <div className="py-24 text-center text-zinc-500">
            Searching...
          </div>
        ) : (
          <div className="mt-14">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Results
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {totalResults === 1
                    ? "1 result"
                    : `${totalResults} results`}{" "}
                  for &ldquo;
                  {normalizedQuery}
                  &rdquo;
                </p>
              </div>
            </div>

            {totalResults > 0 ? (
              <div className="space-y-16">

                {/* VIDEOS */}

                {data.videos.length >
                0 ? (
                  <section>
                    <h3 className="mb-6 text-xl font-semibold">
                      Videos
                    </h3>

                    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {data.videos.map(
                        (video) => (
                          <Link
                            key={
                              video.id
                            }
                            href={`/watch/${video.id}`}
                            className="group"
                          >
                            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
                              {video.thumbnail_url ? (
                                <img
                                  src={
                                    video.thumbnail_url
                                  }
                                  alt={
                                    video.title
                                  }
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                                />
                              ) : (
                                <div className="h-full w-full bg-zinc-900" />
                              )}

                              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/35" />

                              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl">
                                  <Play className="ml-1 h-6 w-6 fill-current" />
                                </div>
                              </div>
                            </div>

                            <h4 className="mt-4 text-lg font-semibold">
                              {
                                video.title
                              }
                            </h4>

                            {video.subtitle ? (
                              <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                                {
                                  video.subtitle
                                }
                              </p>
                            ) : null}

                            {video.category ? (
                              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                {
                                  video.category
                                }
                              </p>
                            ) : null}
                          </Link>
                        )
                      )}
                    </div>
                  </section>
                ) : null}

                {/* SERIES */}

                {data.series.length >
                0 ? (
                  <section>
                    <h3 className="mb-6 text-xl font-semibold">
                      Series
                    </h3>

                    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {data.series.map(
                        (series) => (
                          <Link
                            key={
                              series.id
                            }
                            href={`/series/${series.id}`}
                            className="group"
                          >
                            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
                              {series.thumbnail_url ? (
                                <img
                                  src={
                                    series.thumbnail_url
                                  }
                                  alt={
                                    series.title
                                  }
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                                />
                              ) : (
                                <div className="h-full w-full bg-zinc-900" />
                              )}

                              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />
                            </div>

                            <h4 className="mt-4 text-lg font-semibold">
                              {
                                series.title
                              }
                            </h4>

                            {series.subtitle ? (
                              <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                                {
                                  series.subtitle
                                }
                              </p>
                            ) : null}
                          </Link>
                        )
                      )}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-8 py-20 text-center">
                <Search className="mx-auto h-10 w-10 text-zinc-700" />

                <h2 className="mt-5 text-xl font-semibold">
                  No results found
                </h2>

                <p className="mt-2 text-zinc-500">
                  Try another title, series, or category.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}