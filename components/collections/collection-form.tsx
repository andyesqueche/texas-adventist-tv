"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  CollectionVideo,
  getVideosForCollection,
} from "@/lib/repositories/collection.repository";

import { saveCollection } from "@/lib/services/collection.service";

export function CollectionForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [videos, setVideos] = useState<
    CollectionVideo[]
  >([]);

  const [selected, setSelected] = useState<
    string[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      const data =
        await getVideosForCollection();

      setVideos(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to load videos."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id]
    );
  }

  async function handleSave() {

    if (!title.trim()) {
      toast.error(
        "Collection title is required."
      );
      return;
    }

    try {

      setSaving(true);

      await saveCollection({
        title: title.trim(),
        subtitle: subtitle.trim(),
        videoIds: selected,
      });

      toast.success(
        "Collection created successfully."
      );

      router.push(
        "/admin/collections"
      );

      router.refresh();

    } catch (error) {

      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save collection."
      );

    } finally {

      setSaving(false);

    }

  }

  return (
    <div className="space-y-8">

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">

        <h2 className="mb-6 text-xl font-semibold">
          Collection Information
        </h2>

        <div className="space-y-5">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Camp Meeting 2026"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Subtitle
            </label>

            <input
              value={subtitle}
              onChange={(e) =>
                setSubtitle(e.target.value)
              }
              placeholder="Featured videos"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
            />

          </div>

        </div>

      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">

        <h2 className="mb-6 text-xl font-semibold">
          Videos
        </h2>

        {loading ? (

          <p className="text-zinc-500">
            Loading videos...
          </p>

        ) : (

          <div className="space-y-3">

            {videos.map((video) => (

              <label
                key={video.id}
                className="flex cursor-pointer items-center gap-4 rounded-lg border border-zinc-800 p-3 hover:bg-zinc-900"
              >

                <input
                  type="checkbox"
                  checked={selected.includes(
                    video.id
                  )}
                  onChange={() =>
                    toggle(video.id)
                  }
                />

                {video.thumbnail_url ? (

                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    width={120}
                    height={68}
                    className="rounded-md object-cover"
                  />

                ) : (

                  <div className="h-[68px] w-[120px] rounded-md bg-zinc-800" />

                )}

                <span className="font-medium">
                  {video.title}
                </span>

              </label>

            ))}

          </div>

        )}

      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-[#003B5C] px-6 py-3 font-semibold text-white transition hover:bg-[#004d78] disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : "Save Collection"}
      </button>

    </div>
  );
}