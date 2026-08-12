import Link from "next/link";
import {
  ArrowLeft,
  Play,
} from "lucide-react";
import { notFound } from "next/navigation";

import { TopNavigation } from "@/components/public/top-navigation";

import {
  getPublicSeriesWithVideos,
} from "@/lib/repositories/series.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SeriesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SeriesPage({
  params,
}: SeriesPageProps) {
  const { id } = await params;

  const result =
    await getPublicSeriesWithVideos(id);

  if (!result) {
    notFound();
  }

  const {
    series,
    videos,
  } = result;

  return (
    <main className="min-h-screen bg-black text-white">
      <TopNavigation />

      {/* HERO */}

      <section
        className="relative min-h-[68vh] overflow-hidden"
        style={{
          backgroundImage:
            series.hero_url
              ? `
                linear-gradient(
                  to top,
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,.78) 28%,
                  rgba(0,0,0,.25) 68%,
                  rgba(0,0,0,.12) 100%
                ),
                linear-gradient(
                  to right,
                  rgba(0,0,0,.98) 0%,
                  rgba(0,0,0,.72) 35%,
                  rgba(0,0,0,.15) 75%
                ),
                url(${series.hero_url})
              `
              : undefined,

          backgroundSize:
            "cover",

          backgroundPosition:
            "center",
        }}
      >
        <div className="mx-auto flex min-h-[68vh] max-w-[1600px] items-end px-6 pb-16 pt-32 lg:px-10">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />

              Back
            </Link>

            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Series
            </div>

            {series.logo_url ? (
              <img
                src={series.logo_url}
                alt={series.title}
                className="mb-8 max-h-32 max-w-[420px] object-contain object-left"
              />
            ) : (
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                {series.title}
              </h1>
            )}

            {series.subtitle ? (
              <p className="mt-5 text-xl text-zinc-300">
                {series.subtitle}
              </p>
            ) : null}

            {series.description ? (
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 lg:text-lg">
                {series.description}
              </p>
            ) : null}

            {videos.length > 0 ? (
              <div className="mt-8">
                <Link
                  href={`/watch/${videos[0].id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
                >
                  <Play className="h-5 w-5 fill-current" />

                  Start Watching
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* EPISODES */}

      <section className="mx-auto max-w-[1600px] px-6 pb-24 lg:px-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            Episodes
          </h2>

          <p className="mt-2 text-zinc-500">
            {videos.length === 1
              ? "1 episode"
              : `${videos.length} episodes`}
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map(
              (video, index) => (
                <Link
                  key={video.id}
                  href={`/watch/${video.id}`}
                  className="group block"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
                    {video.thumbnail_url ? (
                      <img
                        src={
                          video.thumbnail_url
                        }
                        alt={video.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : video.hero_url ? (
                      <img
                        src={
                          video.hero_url
                        }
                        alt={video.title}
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

                    <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                      Episode {index + 1}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white transition group-hover:text-zinc-300">
                      {video.title}
                    </h3>

                    {video.subtitle ? (
                      <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                        {video.subtitle}
                      </p>
                    ) : null}

                    {video.description ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {video.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-8 py-16 text-center">
            <h3 className="text-xl font-semibold">
              No episodes available
            </h3>

            <p className="mt-2 text-zinc-500">
              Episodes for this series will appear here when they are published.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}