import { Radio } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";

import {
  getPublicLiveBroadcast,
  type LiveBroadcastRecord,
} from "@/lib/repositories/live.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TIME_ZONE = "America/Chicago";

export default async function LivePage() {
  const broadcast =
    await getPublicLiveBroadcast();

  if (!broadcast) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <Radio className="mx-auto mb-6 h-12 w-12 text-zinc-500" />

              <h1 className="text-4xl font-semibold">
                Texas Adventist TV
              </h1>

              <p className="mt-4 text-lg text-zinc-400">
                There is no live broadcast scheduled at this time.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section
        className="relative min-h-[72vh] overflow-hidden"
        style={{
          backgroundImage:
            broadcast.hero_url
              ? `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,.25)), url(${broadcast.hero_url})`
              : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-end px-6 pb-16 pt-24 lg:px-10">
          <div className="max-w-3xl">
            <StatusLabel status={broadcast.status} />

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {broadcast.title}
            </h1>

            {broadcast.subtitle ? (
              <p className="mt-4 text-xl text-zinc-300">
                {broadcast.subtitle}
              </p>
            ) : null}

            {broadcast.description ? (
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                {broadcast.description}
              </p>
            ) : null}

            {broadcast.scheduled_start ? (
              <p className="mt-6 text-sm text-zinc-400">
                {formatInTimeZone(
                  broadcast.scheduled_start,
                  TIME_ZONE,
                  "EEEE, MMMM d, yyyy 'at' h:mm a"
                )}{" "}
                CT
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <PlayerArea broadcast={broadcast} />
      </section>
    </main>
  );
}

function PlayerArea({
  broadcast,
}: {
  broadcast: LiveBroadcastRecord;
}) {
  if (
    broadcast.status === "live" ||
    broadcast.status === "replay"
  ) {
    if (!broadcast.playback_url) {
      return (
        <MessageCard
          title="Playback unavailable"
          message="The video source is not available yet."
        />
      );
    }

    return (
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {broadcast.status === "live"
                ? "Watch Live"
                : "Watch Replay"}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              {broadcast.status === "live"
                ? "Texas Adventist TV live broadcast"
                : "Replay of the completed broadcast"}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <video
            controls
            autoPlay={
              broadcast.status === "live"
            }
            playsInline
            className="aspect-video w-full bg-black"
            src={broadcast.playback_url}
          />
        </div>
      </div>
    );
  }

  if (
    broadcast.status ===
    "starting_soon"
  ) {
    return (
      <MessageCard
        title="Starting Soon"
        message="The live broadcast is preparing to begin."
      />
    );
  }

  if (
    broadcast.status === "ended"
  ) {
    return (
      <MessageCard
        title="Broadcast Ended"
        message="The replay is being prepared and will be available shortly."
      />
    );
  }

  return (
    <MessageCard
      title="Upcoming Broadcast"
      message="This broadcast has not started yet."
    />
  );
}

function StatusLabel({
  status,
}: {
  status: LiveBroadcastRecord["status"];
}) {
  if (status === "live") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
        Live Now
      </div>
    );
  }

  if (
    status === "starting_soon"
  ) {
    return (
      <div className="inline-flex rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-black">
        Starting Soon
      </div>
    );
  }

  if (status === "replay") {
    return (
      <div className="inline-flex rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold">
        Replay
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="inline-flex rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold">
        Ended
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold">
      Scheduled
    </div>
  );
}

function MessageCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
      <Radio className="mx-auto h-10 w-10 text-zinc-500" />

      <h2 className="mt-5 text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 text-zinc-400">
        {message}
      </p>
    </div>
  );
}