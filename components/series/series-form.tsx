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

    featured: boolean;
    published: boolean;
  };
};

export function SeriesForm({
  categories,
  initialData,
}: SeriesFormProps) {
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

  const [description, setDescription] =
    useState(
      initialData?.description ?? ""
    );

  const [categoryId, setCategoryId] =
    useState(
      initialData?.category_id ?? ""
    );

  const [published, setPublished] =
    useState(
      initialData?.published ?? true
    );

  const [featured, setFeatured] =
    useState(
      initialData?.featured ?? false
    );

  const [thumbnailURL, setThumbnailURL] =
    useState<string | null>(
      initialData?.thumbnail_url ?? null
    );

  const [heroURL, setHeroURL] =
    useState<string | null>(
      initialData?.hero_url ?? null
    );

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [heroFile, setHeroFile] =
    useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

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
        setUploadStatus(
          "Uploading thumbnail..."
        );

        savedThumbnailURL = await uploadFile({
          file: thumbnailFile,
          bucket: "thumbnails",
        });
      }

      if (heroFile) {
        setUploadStatus(
          "Uploading hero image..."
        );

        savedHeroURL = await uploadFile({
          file: heroFile,
          bucket: "hero-images",
        });
      }

      setUploadStatus(
        "Saving show information..."
      );

      await saveSeries(
        {
          title: title.trim(),
          subtitle: subtitle.trim(),
          slug: slug.trim(),
          description: description.trim(),

          category_id:
            categoryId || null,

          thumbnail_url:
            savedThumbnailURL,

          hero_url:
            savedHeroURL,

          logo_url:
            initialData?.logo_url ?? null,

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

      router.push("/admin/series");
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
      className="space-y-8"
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
        onDescriptionChange={setDescription}
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
              value: category.id,
              label: category.name,
            })
          )}
          onChange={setCategoryId}
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
            ? "Update Show"
            : "Save Show"}
      </button>
    </form>
  );
}