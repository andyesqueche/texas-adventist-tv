import Link from "next/link";
import {
  ArrowLeft,
  Grid3X3,
} from "lucide-react";
import { notFound } from "next/navigation";

import { TopNavigation } from "@/components/public/top-navigation";
import { ContentRow } from "@/components/public/content-row";

import {
  getPublicCategoryContent,
} from "@/lib/repositories/category.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const result =
    await getPublicCategoryContent(slug);

  if (!result) {
    notFound();
  }

  const {
    category,
    videos,
    series,
  } = result;

  return (
    <main className="min-h-screen bg-black text-white">
      <TopNavigation />

      {/* HEADER */}

      <section
        className="relative overflow-hidden border-b border-white/5"
        style={{
          background: category.color
            ? `
              radial-gradient(
                circle at 80% 20%,
                ${category.color}55,
                transparent 38%
              ),
              linear-gradient(
                135deg,
                ${category.color}55,
                #000000 58%
              )
            `
            : `
              linear-gradient(
                135deg,
                #003B5C55,
                #000000 58%
              )
            `,
        }}
      >
        <div className="mx-auto max-w-[1600px] px-6 pb-16 pt-32 lg:px-10">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            Browse
          </Link>

          <div className="mt-12 max-w-3xl">
            {category.icon ? (
              <div className="mb-5 text-4xl">
                {category.icon}
              </div>
            ) : (
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Grid3X3 className="h-6 w-6" />
              </div>
            )}

            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
              Category
            </div>

            <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {category.name}
            </h1>

            {category.description ? (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                {category.description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-zinc-500">
              <span>
                {videos.length === 1
                  ? "1 video"
                  : `${videos.length} videos`}
              </span>

              <span>
                {series.length === 1
                  ? "1 series"
                  : `${series.length} series`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-[1600px] space-y-16 px-6 py-16 pb-24 lg:px-10">

        {/* VIDEOS */}

        {videos.length > 0 ? (
          <ContentRow
            title="Videos"
            subtitle={`Explore ${category.name} content`}
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
        ) : null}

        {/* SERIES */}

        {series.length > 0 ? (
          <ContentRow
            title="Series"
            subtitle={`Series in ${category.name}`}
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
        ) : null}

        {/* EMPTY STATE */}

        {videos.length === 0 &&
        series.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-8 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900">
              <Grid3X3 className="h-6 w-6 text-zinc-500" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              No content available
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-zinc-500">
              Published content in this category will appear here.
            </p>

            <Link
              href="/browse"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Browse
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}