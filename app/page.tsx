import Link from "next/link";
import {
  Info,
  Play,
  Radio,
} from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";

import { TopNavigation } from "@/components/public/top-navigation";
import { ContentRow } from "@/components/public/content-row";

import {
  getFeaturedVideo,
  getPublishedVideos,
} from "@/lib/repositories/video.repository";

import {
  getPublishedSeries,
} from "@/lib/repositories/series.repository";

import {
  getPublicCollections,
} from "@/lib/repositories/collection.repository";

import {
  getPublicLiveBroadcast,
} from "@/lib/repositories/live.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TIME_ZONE = "America/Chicago";

export default async function Home() {
  const [
    featuredVideo,
    videos,
    series,
    collections,
    liveBroadcast,
  ] = await Promise.all([
    getFeaturedVideo(),
    getPublishedVideos(),
    getPublishedSeries(),
    getPublicCollections(),
    getPublicLiveBroadcast(),
  ]);

  const hero =
    featuredVideo ??
    videos[0] ??
    null;

  return (
    <main className="min-h-screen bg-black text-white">
      <TopNavigation />

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      {hero ? (
        <section
          className="relative min-h-[70vh] overflow-hidden"
          style={{
            backgroundImage: hero.hero_url
              ? `
                linear-gradient(
                  to top,
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,.78) 22%,
                  rgba(0,0,0,.30) 58%,
                  rgba(0,0,0,.10) 100%
                ),
                linear-gradient(
                  to right,
                  rgba(0,0,0,.95) 0%,
                  rgba(0,0,0,.68) 32%,
                  rgba(0,0,0,.20) 65%,
                  rgba(0,0,0,0) 82%
                ),
                url(${hero.hero_url})
              `
              : undefined,

            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto flex min-h-[70vh] max-w-[1600px] items-end px-6 pb-24 pt-32 lg:px-10">
            <div className="max-w-2xl">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300">
                Featured
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>

              {hero.subtitle ? (
                <p className="mt-4 text-lg text-zinc-300 lg:text-xl">
                  {hero.subtitle}
                </p>
              ) : null}

              {hero.description ? (
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                  {hero.description}
                </p>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/watch/${hero.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
                >
                  <Play className="h-5 w-5 fill-current" />

                  Watch Now
                </Link>

                <Link
                  href={`/watch/${hero.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/25"
                >
                  <Info className="h-5 w-5" />

                  More Info
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-24" />
      )}

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <div className="relative z-10 mx-auto -mt-8 max-w-[1600px] space-y-14 px-6 pb-24 lg:px-10">

        {/* =================================================== */}
        {/* LIVE / REPLAY / UPCOMING */}
        {/* =================================================== */}

        {liveBroadcast ? (
          <section>
            <div className="mb-5 flex items-center gap-3">
              {liveBroadcast.status === "live" ? (
                <div className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

                  Live Now
                </div>
              ) : liveBroadcast.status === "replay" ? (
                <div className="flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
                  <Play className="h-3.5 w-3.5" />

                  Replay
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
                  <Radio className="h-3.5 w-3.5" />

                  Live TV
                </div>
              )}

              <h2 className="text-2xl font-semibold">
                {liveBroadcast.status === "live"
                  ? "Now Streaming"
                  : liveBroadcast.status === "replay"
                    ? "Latest Broadcast"
                    : "Upcoming Broadcast"}
              </h2>
            </div>

            <Link
              href="/live"
              className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition duration-300 hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <div className="flex flex-col md:flex-row">

                {/* Broadcast image */}

                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-zinc-900 md:w-[360px] lg:w-[430px]">
                  {liveBroadcast.thumbnail_url ||
                  liveBroadcast.hero_url ? (
                    <img
                      src={
                        liveBroadcast.thumbnail_url ??
                        liveBroadcast.hero_url ??
                        ""
                      }
                      alt={liveBroadcast.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                      <Radio className="h-10 w-10 text-zinc-700" />
                    </div>
                  )}

                  {/* Dark image gradient */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* LIVE badge */}

                  {liveBroadcast.status === "live" ? (
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

                      Live
                    </div>
                  ) : null}

                  {/* Play icon */}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                      <Play className="ml-1 h-6 w-6 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Broadcast information */}

                <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-6 md:px-8 lg:px-10">

                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {liveBroadcast.status === "live"
                      ? "Live Broadcast"
                      : liveBroadcast.status === "replay"
                        ? "Latest Replay"
                        : "Scheduled Broadcast"}
                  </div>

                  <h3 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                    {liveBroadcast.title}
                  </h3>

                  {liveBroadcast.subtitle ? (
                    <p className="mt-2 text-base text-zinc-400">
                      {liveBroadcast.subtitle}
                    </p>
                  ) : null}

                  {liveBroadcast.description ? (
                    <p className="mt-3 max-w-2xl line-clamp-2 text-sm leading-6 text-zinc-500">
                      {liveBroadcast.description}
                    </p>
                  ) : null}

                  {liveBroadcast.scheduled_start ? (
                    <p className="mt-4 text-sm text-zinc-500">
                      {formatInTimeZone(
                        liveBroadcast.scheduled_start,
                        TIME_ZONE,
                        "EEEE, MMMM d 'at' h:mm a"
                      )}{" "}
                      CT
                    </p>
                  ) : null}

                  <div className="mt-5">
                    <span className="inline-flex items-center gap-2 font-semibold text-white transition group-hover:text-zinc-200">
                      <Play className="h-4 w-4 fill-current" />

                      {liveBroadcast.status === "live"
                        ? "Watch Live"
                        : liveBroadcast.status === "replay"
                          ? "Watch Replay"
                          : "View Broadcast"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        ) : null}

        {/* =================================================== */}
        {/* LATEST */}
        {/* =================================================== */}

        {videos.length > 0 ? (
          <ContentRow
            title="Latest"
            subtitle="Recently published on Texas Adventist TV"
            items={videos
              .slice(0, 12)
              .map((video) => ({
                id: video.id,
                title: video.title,
                subtitle: video.subtitle,
                imageUrl: video.thumbnail_url,
                href: `/watch/${video.id}`,
              }))}
          />
        ) : null}

        {/* =================================================== */}
        {/* COLLECTIONS */}
        {/* =================================================== */}

        {collections.map((collection) => (
          <ContentRow
            key={collection.id}
            title={collection.title}
            subtitle={collection.subtitle}
            items={collection.videos.map(
              (video) => ({
                id: video.id,
                title: video.title,
                subtitle: video.subtitle,
                imageUrl: video.thumbnail_url,
                href: `/watch/${video.id}`,
              })
            )}
          />
        ))}

        {/* =================================================== */}
        {/* SERIES */}
        {/* =================================================== */}

        {series.length > 0 ? (
          <ContentRow
            title="Series"
            subtitle="Explore programs and teaching series"
            items={series.map((item) => ({
              id: item.id,
              title: item.title,
              subtitle: item.subtitle,
              imageUrl: item.thumbnail_url,
              href: `/series/${item.id}`,
            }))}
          />
        ) : null}
      </div>
    </main>
  );
}