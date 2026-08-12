"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ArtworkSection } from "@/components/videos/form/artwork-section";
import { InformationSection } from "@/components/videos/form/information-section";
import { PublishingSection } from "@/components/videos/form/publishing-section";
import { SelectField } from "@/components/ui/select-field";

import { saveSeries } from "@/lib/services/series.service";
import { uploadFile } from "@/lib/storage/upload-file";

import type {
  SeriesOrientation,
} from "@/lib/repositories/series.repository";

type CategoryOption = {
  id: string;
  name: string;
};

type SeriesFormProps = {
  categories: CategoryOption[];

  initialData?: {
    id?: string;

    title: string;
    subtitle: string | null;
    slug: string;
    description: string | null;

    category_id: string | null;

    thumbnail_url: string | null;
    hero_url: string | null;
    logo_url: string | null;

    orientation: SeriesOrientation;

    featured: boolean;
    published: boolean;
  };
};

export function SeriesForm({
  categories,
  initialData,
}: SeriesFormProps) {
  const router = useRouter();

  const isEditing =
    Boolean(initialData?.id);

  const [title, setTitle] =
    useState(
      initialData?.title ?? ""
    );

  const [subtitle, setSubtitle] =
    useState(
      initialData?.subtitle ?? ""
    );

  const [slug, setSlug] =
    useState(
      initialData?.slug ?? ""
    );

  const [description, setDescription] =
    useState(
      initialData?.description ?? ""
    );

  const [categoryId, setCategoryId] =
    useState(
      initialData?.category_id ?? ""
    );

  const [orientation, setOrientation] =
    useState<SeriesOrientation>(
      initialData?.orientation ??
        "landscape"
    );

  const [published, setPublished] =
    useState(
      initialData?.published ?? true
    );

  const [featured, setFeatured] =
    useState(
      initialData?.featured ?? false
    );

  const [
    thumbnailURL,
    setThumbnailURL,
  ] = useState<string | null>(
    initialData?.thumbnail_url ?? null
  );

  const [
    heroURL,
    setHeroURL,
  ] = useState<string | null>(
    initialData?.hero_url ?? null
  );

  const [
    thumbnailFile,
    setThumbnailFile,
  ] = useState<File | null>(null);

  const [
    heroFile,
    setHeroFile,
  ] = useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [
    uploadStatus,
    setUploadStatus,
  ] = useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error(
        "Title is required."
      );
      return;
    }

    if (!slug.trim()) {
      toast.error(
        "Slug is required."
      );
      return;
    }

    try {
      setSaving(true);

      let savedThumbnailURL =
        thumbnailURL;

      let savedHeroURL =
        heroURL;

      if (thumbnailFile) {
        setUploadStatus(
          "Uploading thumbnail..."
        );

        savedThumbnailURL =
          await uploadFile({
            file: thumbnailFile,
            bucket: "thumbnails",
          });
      }

      if (heroFile) {
        setUploadStatus(
          "Uploading hero image..."
        );

        savedHeroURL =
          await uploadFile({
            file: heroFile,
            bucket: "hero-images",
          });
      }

      setUploadStatus(
        "Saving show information..."
      );

      await saveSeries(
        {
          title:
            title.trim(),

          subtitle:
            subtitle.trim(),

          slug:
            slug.trim(),

          description:
            description.trim(),

          category_id:
            categoryId || null,

          thumbnail_url:
            savedThumbnailURL,

          hero_url:
            savedHeroURL,

          logo_url:
            initialData?.logo_url ??
            null,

          orientation,

          featured,

          published,
        },
        initialData?.id
      );

      toast.success(
        isEditing
          ? "Show updated successfully."
          : "Show created successfully."
      );

      router.push(
        "/admin/series"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "SAVE SHOW ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save show."
      );
    } finally {
      setSaving(false);
      setUploadStatus(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <InformationSection
        title={title}
        subtitle={subtitle}
        slug={slug}
        category=""
        description={description}
        showCategoryField={false}
        onTitleChange={setTitle}
        onSubtitleChange={setSubtitle}
        onSlugChange={setSlug}
        onCategoryChange={() => {}}
        onDescriptionChange={
          setDescription
        }
      />

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Category
        </h2>

        <SelectField
          id="category"
          label="Show Category"
          value={categoryId}
          placeholder="Select a category"
          options={categories.map(
            (category) => ({
              value:
                category.id,
              label:
                category.name,
            })
          )}
          onChange={setCategoryId}
        />
      </section>

      {/* CONTENT FORMAT */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Content Format
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Choose how this show
            should be presented on
            Texas Adventist TV.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setOrientation(
                "landscape"
              )
            }
            className={`rounded-xl border p-5 text-left transition ${
              orientation ===
              "landscape"
                ? "border-[#0a79b8] bg-[#003B5C]/25 ring-1 ring-[#0a79b8]"
                : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-5">
              <div
                className={`flex h-16 w-28 items-center justify-center rounded-lg border ${
                  orientation ===
                  "landscape"
                    ? "border-[#0a79b8] bg-[#003B5C]/30"
                    : "border-zinc-700 bg-zinc-900"
                }`}
              >
                <span className="text-xs font-semibold text-zinc-300">
                  16:9
                </span>
              </div>

              <div>
                <div className="font-semibold text-white">
                  Landscape
                </div>

                <div className="mt-1 text-sm text-zinc-400">
                  Standard TV
                  presentation
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setOrientation(
                "portrait"
              )
            }
            className={`rounded-xl border p-5 text-left transition ${
              orientation ===
              "portrait"
                ? "border-[#0a79b8] bg-[#003B5C]/25 ring-1 ring-[#0a79b8]"
                : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-5">
              <div
                className={`flex h-24 w-14 items-center justify-center rounded-lg border ${
                  orientation ===
                  "portrait"
                    ? "border-[#0a79b8] bg-[#003B5C]/30"
                    : "border-zinc-700 bg-zinc-900"
                }`}
              >
                <span className="text-xs font-semibold text-zinc-300">
                  9:16
                </span>
              </div>

              <div>
                <div className="font-semibold text-white">
                  Portrait
                </div>

                <div className="mt-1 text-sm text-zinc-400">
                  Vertical video
                  presentation
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>

      <ArtworkSection
        thumbnailURL={
          thumbnailURL
        }
        heroURL={heroURL}
        thumbnailFile={
          thumbnailFile
        }
        heroFile={heroFile}
        setThumbnailURL={
          setThumbnailURL
        }
        setHeroURL={
          setHeroURL
        }
        setThumbnailFile={
          setThumbnailFile
        }
        setHeroFile={
          setHeroFile
        }
      />

      <PublishingSection
        published={published}
        featured={featured}
        onPublishedChange={
          setPublished
        }
        onFeaturedChange={
          setFeatured
        }
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
          ? uploadStatus ??
            "Saving..."
          : isEditing
            ? "Update Show"
            : "Save Show"}
      </button>
    </form>
  );
}