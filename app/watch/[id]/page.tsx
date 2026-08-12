import Link from "next/link";
import {
  ArrowLeft,
  Layers3,
  Play,
} from "lucide-react";
import { notFound } from "next/navigation";

import { TopNavigation } from "@/components/public/top-navigation";
import { ContentRow } from "@/components/public/content-row";

import {
  getRelatedVideos,
  getVideoById,
  getVideosFromSeries,
} from "@/lib/repositories/video.repository";

import {
  getSeriesById,
} from "@/lib/repositories/series.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type WatchPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WatchPage({
  params,
}: WatchPageProps) {
  const { id } = await params;

  let video;

  try {
    video = await getVideoById(id);
  } catch {
    notFound();
  }

  if (!video || !video.published) {
    notFound();
  }

  const [
    seriesVideos,
    relatedVideos,
  ] = await Promise.all([
    video.series_id
      ? getVideosFromSeries(
          video.series_id,
          video.id
        )
      : Promise.resolve([]),

    getRelatedVideos(video),
  ]);

  let series = null;

  if (video.series_id) {
    try {
      series =
        await getSeriesById(
          video.series_id
        );
    } catch {
      series = null;
    }
  }

  const hasCloudflareVideo =
    video.stream_provider ===
      "cloudflare" &&
    Boolean(video.stream_uid);

  const customerCode =
    process.env
      .NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE;

  const cloudflarePlayerUrl =
    hasCloudflareVideo &&
    customerCode &&
    video.stream_uid
      ? `https://customer-${customerCode}.cloudflarestream.com/${video.stream_uid}/iframe`
      : null;

  return (
    <main className="min-h-screen bg-black text-white">
      <TopNavigation />

      {/* PLAYER */}

      <section className="mx-auto max-w-[1600px] px-6 pb-10 pt-28 lg:px-10">
        <Link
          href={
            series
              ? `/series/${series.id}`
              : "/"
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />

          {series
            ? `Back to ${series.title}`
            : "Back"}
        </Link>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="relative aspect-video w-full bg-black">
            {cloudflarePlayerUrl ? (
              <iframe
                src={
                  cloudflarePlayerUrl
                }
                title={video.title}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : video.hero_url ||
              video.thumbnail_url ? (
              <>
                <img
                  src={
                    video.hero_url ??
                    video.thumbnail_url ??
                    ""
                  }
                  alt={video.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/55" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black">
                    <Play className="ml-1 h-8 w-8 fill-current" />
                  </div>

                  <div className="text-sm text-zinc-300">
                    Video unavailable
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                Video unavailable
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INFORMATION */}

      <section className="mx-auto max-w-[1600px] px-6 pb-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* MAIN INFORMATION */}

          <div>
            <div className="flex flex-wrap items-center gap-3">
              {video.category ? (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  {video.category}
                </span>
              ) : null}

              {series ? (
                <Link
                  href={`/series/${series.id}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition hover:text-white"
                >
                  <Layers3 className="h-3.5 w-3.5" />

                  {series.title}
                </Link>
              ) : null}
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {video.title}
            </h1>

            {video.subtitle ? (
              <p className="mt-4 text-xl text-zinc-400">
                {video.subtitle}
              </p>
            ) : null}

            {video.description ? (
              <div className="mt-8 max-w-4xl">
                <h2 className="text-xl font-semibold">
                  About
                </h2>

                <p className="mt-3 whitespace-pre-line text-base leading-8 text-zinc-400">
                  {video.description}
                </p>
              </div>
            ) : null}
          </div>

          {/* DETAILS */}

          <aside className="border-t border-zinc-800 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h2 className="text-lg font-semibold">
              Details
            </h2>

            <div className="mt-6 space-y-5 text-sm">
              {series ? (
                <div>
                  <div className="text-zinc-500">
                    Series
                  </div>

                  <Link
                    href={`/series/${series.id}`}
                    className="mt-1 block text-zinc-200 transition hover:text-white"
                  >
                    {series.title}
                  </Link>
                </div>
              ) : null}

              {video.category ? (
                <div>
                  <div className="text-zinc-500">
                    Category
                  </div>

                  <div className="mt-1 text-zinc-200">
                    {video.category}
                  </div>
                </div>
              ) : null}

              <div>
                <div className="text-zinc-500">
                  Network
                </div>

                <div className="mt-1 text-zinc-200">
                  Texas Adventist TV
                </div>
              </div>

              <div>
                <div className="text-zinc-500">
                  Streaming
                </div>

                <div className="mt-1 text-zinc-200">
                  Cloudflare Stream
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* MORE FROM SERIES */}

      {series &&
      seriesVideos.length > 0 ? (
        <section className="mx-auto max-w-[1600px] px-6 pb-16 lg:px-10">
          <ContentRow
            title={`More from ${series.title}`}
            subtitle="Continue watching this series"
            items={seriesVideos.map(
              (item) => ({
                id: item.id,
                title: item.title,
                subtitle:
                  item.subtitle,
                imageUrl:
                  item.thumbnail_url,
                href:
                  `/watch/${item.id}`,
              })
            )}
          />

          <div className="mt-5">
            <Link
              href={`/series/${series.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-white"
            >
              <Layers3 className="h-4 w-4" />

              View all episodes
            </Link>
          </div>
        </section>
      ) : null}

      {/* RELATED */}

      {relatedVideos.length > 0 ? (
        <section className="mx-auto max-w-[1600px] px-6 pb-24 lg:px-10">
          <ContentRow
            title="You May Also Like"
            subtitle={
              video.category
                ? `More from ${video.category}`
                : "More from Texas Adventist TV"
            }
            items={relatedVideos.map(
              (item) => ({
                id: item.id,
                title: item.title,
                subtitle:
                  item.subtitle,
                imageUrl:
                  item.thumbnail_url,
                href:
                  `/watch/${item.id}`,
              })
            )}
          />
        </section>
      ) : null}
    </main>
  );
}