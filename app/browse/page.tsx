import Link from "next/link";
import {
  ArrowRight,
  Grid3X3,
} from "lucide-react";

import { TopNavigation } from "@/components/public/top-navigation";
import { ContentRow } from "@/components/public/content-row";

import {
  getPublishedCategories,
} from "@/lib/repositories/category.repository";

import {
  getPublishedVideos,
} from "@/lib/repositories/video.repository";

import {
  getPublishedSeries,
} from "@/lib/repositories/series.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BrowsePage() {
  const [
    categories,
    videos,
    series,
  ] = await Promise.all([
    getPublishedCategories(),
    getPublishedVideos(),
    getPublishedSeries(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <TopNavigation />

      {/* HEADER */}

      <section className="mx-auto max-w-[1600px] px-6 pb-12 pt-32 lg:px-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
            <Grid3X3 className="h-4 w-4" />
            Browse
          </div>

          <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
            Explore Texas Adventist TV
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Discover sermons, Bible studies, leadership resources,
            programs, conversations, and original Texas Adventist TV
            content.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}

      {categories.length > 0 ? (
        <section className="mx-auto max-w-[1600px] px-6 pb-16 lg:px-10">
          <div className="mb-7">
            <h2 className="text-3xl font-semibold tracking-tight">
              Categories
            </h2>

            <p className="mt-2 text-zinc-500">
              Browse content by topic.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map(
              (category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group relative min-h-[190px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-7 transition duration-300 hover:-translate-y-1 hover:border-white/20"
                  style={{
                    background:
                      category.color
                        ? `linear-gradient(
                            135deg,
                            ${category.color},
                            #050505 78%
                          )`
                        : undefined,
                  }}
                >
                  <div className="relative z-10 flex h-full min-h-[136px] flex-col justify-between">
                    <div>
                      {category.icon ? (
                        <div className="mb-5 text-2xl">
                          {category.icon}
                        </div>
                      ) : (
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                          <Grid3X3 className="h-5 w-5" />
                        </div>
                      )}

                      <h3 className="text-2xl font-semibold">
                        {category.name}
                      </h3>

                      {category.description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
                          {category.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white/80 transition group-hover:text-white">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-white/5 blur-2xl" />
                </Link>
              )
            )}
          </div>
        </section>
      ) : null}

      {/* LATEST VIDEOS */}

      <section className="mx-auto max-w-[1600px] space-y-16 px-6 pb-24 lg:px-10">
        <ContentRow
          title="All Videos"
          subtitle="Explore the latest programs available on Texas Adventist TV"
          items={videos.map(
            (video) => ({
              id: video.id,
              title: video.title,
              subtitle: video.subtitle,
              imageUrl:
                video.thumbnail_url,
              href:
                `/watch/${video.id}`,
            })
          )}
        />

        <ContentRow
          title="Series"
          subtitle="Browse teaching series, programs, and original productions"
          items={series.map(
            (item) => ({
              id: item.id,
              title: item.title,
              subtitle: item.subtitle,
              imageUrl:
                item.thumbnail_url,
              href:
                `/series/${item.id}`,
            })
          )}
        />
      </section>
    </main>
  );
}