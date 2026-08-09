"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ArtworkSection } from "@/components/videos/form/artwork-section";
import { InformationSection } from "@/components/videos/form/information-section";
import { MediaSection } from "@/components/videos/form/media-section";
import { PublishingSection } from "@/components/videos/form/publishing-section";
import { SelectField } from "@/components/ui/select-field";

import { saveVideo as saveVideoRecord } from "@/lib/services/video.service";
import { uploadFile } from "@/lib/storage/upload-file";

type SeriesOption = {
  id: string;
  title: string;
};

type VideoFormProps = {
  series: SeriesOption[];

  initialData?: {
    id?: string;

    title: string;
    subtitle: string | null;
    slug: string | null;
    description: string | null;
    category: string | null;
    series_id: string | null;

    published: boolean;
    featured: boolean;

    thumbnail_url?: string | null;
    hero_url?: string | null;
    trailer_url?: string | null;

    stream_provider?: string | null;
    stream_uid?: string | null;
    playback_url?: string | null;
  };
};

export function VideoForm({
  series,
  initialData,
}: VideoFormProps) {
  const router = useRouter();

  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );

  const [subtitle, setSubtitle] = useState(
    initialData?.subtitle ?? ""
  );

  const [slug, setSlug] = useState(
    initialData?.slug ?? ""
  );

  const [category, setCategory] = useState(
    initialData?.category ?? ""
  );

  const [seriesId, setSeriesId] = useState(
    initialData?.series_id ?? ""
  );

  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [published, setPublished] = useState(
    initialData?.published ?? false
  );

  const [featured, setFeatured] = useState(
    initialData?.featured ?? false
  );

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [heroFile, setHeroFile] =
    useState<File | null>(null);

  const [thumbnailURL, setThumbnailURL] =
    useState<string | null>(
      initialData?.thumbnail_url ?? null
    );

  const [heroURL, setHeroURL] =
    useState<string | null>(
      initialData?.hero_url ?? null
    );

  const [trailerURL, setTrailerURL] =
    useState<string | null>(
      initialData?.trailer_url ?? null
    );

  const [streamUid, setStreamUid] = useState(
    initialData?.stream_uid ?? ""
  );

  const [playbackUrl, setPlaybackUrl] = useState(
    initialData?.playback_url ?? ""
  );

  const [saving, setSaving] = useState(false);

  const [uploadStatus, setUploadStatus] =
    useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!slug.trim()) {
      toast.error("Slug is required.");
      return;
    }

    try {
      setSaving(true);

      let savedThumbnailURL = thumbnailURL;
      let savedHeroURL = heroURL;

      if (thumbnailFile) {
        setUploadStatus("Uploading thumbnail...");

        savedThumbnailURL = await uploadFile({
          file: thumbnailFile,
          bucket: "thumbnails",
        });
      }

      if (heroFile) {
        setUploadStatus("Uploading hero image...");

        savedHeroURL = await uploadFile({
          file: heroFile,
          bucket: "hero-images",
        });
      }

      setUploadStatus("Saving video information...");

      await saveVideoRecord(
        {
          title: title.trim(),
          subtitle: subtitle.trim(),
          slug: slug.trim(),
          description: description.trim(),
          category: category.trim(),

          series_id: seriesId || null,

          published,
          featured,

          thumbnail_url: savedThumbnailURL,
          hero_url: savedHeroURL,
          trailer_url: trailerURL,

          stream_provider: streamUid
            ? "cloudflare"
            : null,

          stream_uid: streamUid || null,
          playback_url: playbackUrl || null,
        },
        initialData?.id
      );

      toast.success(
        isEditing
          ? "Video updated successfully."
          : "Video created successfully."
      );

      router.push("/admin/videos");
      router.refresh();
    } catch (error) {
      console.error(
        "SAVE VIDEO ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save video."
      );
    } finally {
      setSaving(false);
      setUploadStatus(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <InformationSection
        title={title}
        subtitle={subtitle}
        slug={slug}
        category={category}
        description={description}
        onTitleChange={setTitle}
        onSubtitleChange={setSubtitle}
        onSlugChange={setSlug}
        onCategoryChange={setCategory}
        onDescriptionChange={setDescription}
      />

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Show
        </h2>

        <SelectField
          id="series"
          label="Assign to Show"
          value={seriesId}
          placeholder="No show"
          options={series.map((show) => ({
            value: show.id,
            label: show.title,
          }))}
          onChange={setSeriesId}
        />
      </section>

      <ArtworkSection
        thumbnailURL={thumbnailURL}
        heroURL={heroURL}
        thumbnailFile={thumbnailFile}
        heroFile={heroFile}
        setThumbnailURL={setThumbnailURL}
        setHeroURL={setHeroURL}
        setThumbnailFile={setThumbnailFile}
        setHeroFile={setHeroFile}
      />

      <MediaSection
        trailerURL={trailerURL}
        streamUid={streamUid}
        playbackUrl={playbackUrl}
        setTrailerURL={setTrailerURL}
        setStreamUid={setStreamUid}
        setPlaybackUrl={setPlaybackUrl}
      />

      <PublishingSection
        published={published}
        featured={featured}
        onPublishedChange={setPublished}
        onFeaturedChange={setFeatured}
      />

      {uploadStatus ? (
        <div className="rounded-lg border border-blue-900 bg-blue-950/40 px-4 py-3 text-sm text-blue-300">
          {uploadStatus}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#003B5C] px-6 py-3 font-semibold text-white transition hover:bg-[#004d78] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? uploadStatus ?? "Saving..."
          : isEditing
            ? "Update Video"
            : "Save Video"}
      </button>
    </form>
  );
}