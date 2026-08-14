"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import {
  updateSeriesVideoOrder,
} from "@/lib/repositories/video.repository";

import type {
  VideoRecord,
} from "@/types/video";

type SeriesVideoOrderProps = {
  videos: VideoRecord[];
};

export function SeriesVideoOrder({
  videos,
}: SeriesVideoOrderProps) {
  const [items, setItems] =
    useState(videos);

  const [saving, setSaving] =
    useState(false);

  const [changed, setChanged] =
    useState(false);

  function moveVideo(
    index: number,
    direction: "up" | "down"
  ) {
    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= items.length
    ) {
      return;
    }

    const updated = [...items];

    const [movedItem] =
      updated.splice(index, 1);

    updated.splice(
      newIndex,
      0,
      movedItem
    );

    setItems(updated);
    setChanged(true);
  }

  async function handleSave() {
    try {
      setSaving(true);

      await updateSeriesVideoOrder(
        items.map(
          (video, index) => ({
            id: video.id,
            display_order: index,
          })
        )
      );

      setItems((current) =>
        current.map(
          (video, index) => ({
            ...video,
            display_order: index,
          })
        )
      );

      setChanged(false);

      toast.success(
        "Video order saved successfully."
      );
    } catch (error) {
      console.error(
        "SAVE VIDEO ORDER ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save video order."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="mb-6 flex items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Videos in this Show
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Change the order in which
            videos appear inside this
            show.
          </p>
        </div>

        {items.length > 0 ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving || !changed
            }
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#003B5C] px-4 py-2 font-semibold text-white transition hover:bg-[#004d78] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Order"}
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-700 px-6 py-10 text-center">
          <p className="text-sm text-zinc-400">
            This show does not have any
            videos yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          {items.map(
            (video, index) => (
              <div
                key={video.id}
                className="flex items-center gap-4 border-b border-zinc-800 bg-zinc-950/50 p-4 last:border-b-0"
              >
                <GripVertical
                  size={20}
                  className="shrink-0 text-zinc-600"
                />

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-sm font-semibold text-zinc-300">
                  {index + 1}
                </div>

                {video.thumbnail_url ? (
                  <img
                    src={
                      video.thumbnail_url
                    }
                    alt={
                      video.title
                    }
                    className="h-16 w-28 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-xs text-zinc-500">
                    No image
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-white">
                    {video.title}
                  </div>

                  {video.subtitle ? (
                    <div className="mt-1 truncate text-sm text-zinc-400">
                      {
                        video.subtitle
                      }
                    </div>
                  ) : null}
                </div>

                <div
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    video.published
                      ? "bg-green-950 text-green-300"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {video.published
                    ? "Published"
                    : "Draft"}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    title="Move up"
                    disabled={
                      index === 0
                    }
                    onClick={() =>
                      moveVideo(
                        index,
                        "up"
                      )
                    }
                    className="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    <ArrowUp
                      size={18}
                    />
                  </button>

                  <button
                    type="button"
                    title="Move down"
                    disabled={
                      index ===
                      items.length - 1
                    }
                    onClick={() =>
                      moveVideo(
                        index,
                        "down"
                      )
                    }
                    className="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    <ArrowDown
                      size={18}
                    />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}