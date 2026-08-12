import Link from "next/link";
import {
  ArrowRight,
  Layers3,
  Play,
} from "lucide-react";

import { TopNavigation } from "@/components/public/top-navigation";

import {
  getPublishedSeries,
} from "@/lib/repositories/series.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SeriesPage() {
  const series =
    await getPublishedSeries();

  const featuredSeries =
    series.find(
      (item) => item.featured
    ) ??
    series[0] ??
    null;

  const remainingSeries =
    featuredSeries
      ? series.filter(
          (item) =>
            item.id !==
            featuredSeries.id
        )
      : series;

  return (
    <main className="min-h-screen bg-black text-white">
      <TopNavigation />

      {/* FEATURED SERIES */}

      {featuredSeries ? (
        <section
          className="relative min-h-[65vh] overflow-hidden"
          style={{
            backgroundImage:
              featuredSeries.hero_url
                ? `
                  linear-gradient(
                    to top,
                    rgba(0,0,0,1) 0%,
                    rgba(0,0,0,.72) 35%,
                    rgba(0,0,0,.20) 75%
                  ),
                  linear-gradient(
                    to right,
                    rgba(0,0,0,.98) 0%,
                    rgba(0,0,0,.65) 42%,
                    rgba(0,0,0,0) 78%
                  ),
                  url(${featuredSeries.hero_url})
                `
                : `
                  linear-gradient(
                    135deg,
                    #003B5C,
                    #050505 70%
                  )
                `,
            backgroundSize:
              "cover",
            backgroundPosition:
              "center",
          }}
        >
          <div className="mx-auto flex min-h-[65vh] max-w-[1600px] items-end px-6 pb-16 pt-32 lg:px-10">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-300">
                <Layers3 className="h-4 w-4" />

                Featured Series
              </div>

              {featuredSeries.logo_url ? (
                <img
                  src={
                    featuredSeries.logo_url
                  }
                  alt={
                    featuredSeries.title
                  }
                  className="mb-7 max-h-32 max-w-[440px] object-contain object-left"
                />
              ) : (
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                  {
                    featuredSeries.title
                  }
                </h1>
              )}

              {featuredSeries.subtitle ? (
                <p className="mt-5 text-xl text-zinc-300">
                  {
                    featuredSeries.subtitle
                  }
                </p>
              ) : null}

              {featuredSeries.description ? (
                <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 lg:text-lg">
                  {
                    featuredSeries.description
                  }
                </p>
              ) : null}

              <div className="mt-8">
                <Link
                  href={`/series/${featuredSeries.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
                >
                  <Play className="h-5 w-5 fill-current" />

                  View Series
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-24" />
      )}

      {/* SERIES LIBRARY */}

      <section className="mx-auto max-w-[1600px] px-6 pb-24 pt-14 lg:px-10">
        <div className="mb-9">
          <div className="flex items-center gap-3">
            <Layers3 className="h-6 w-6 text-zinc-500" />

            <h2 className="text-3xl font-semibold tracking-tight">
              Series
            </h2>
          </div>

          <p className="mt-3 text-zinc-500">
            Explore programs, teaching series,
            conversations, and original productions.
          </p>
        </div>

        {remainingSeries.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {remainingSeries.map(
              (item) => (
                <Link
                  key={item.id}
                  href={`/series/${item.id}`}
                  className="group block"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
                    {item.thumbnail_url ? (
                      <img
                        src={
                          item.thumbnail_url
                        }
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : item.hero_url ? (
                      <img
                        src={
                          item.hero_url
                        }
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-900">
                        <Layers3 className="h-10 w-10 text-zinc-700" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />

                    <div className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-semibold transition group-hover:text-zinc-300">
                      {item.title}
                    </h3>

                    {item.subtitle ? (
                      <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                        {item.subtitle}
                      </p>
                    ) : null}

                    {item.description ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              )
            )}
          </div>
        ) : featuredSeries ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-8 py-12 text-center text-zinc-500">
            More series will appear here as they are published.
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-8 py-20 text-center">
            <Layers3 className="mx-auto h-10 w-10 text-zinc-700" />

            <h2 className="mt-5 text-xl font-semibold">
              No series available
            </h2>

            <p className="mt-2 text-zinc-500">
              Published series will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}