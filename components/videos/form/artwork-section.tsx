import { MediaUpload } from "@/components/uploads/media-upload";

type ArtworkSectionProps = {
  thumbnailURL: string | null;
  heroURL: string | null;

  thumbnailFile: File | null;
  heroFile: File | null;

  setThumbnailURL: (
    value: string | null
  ) => void;

  setHeroURL: (
    value: string | null
  ) => void;

  setThumbnailFile: (
    file: File | null
  ) => void;

  setHeroFile: (
    file: File | null
  ) => void;
};

export function ArtworkSection({
  thumbnailURL,
  heroURL,
  thumbnailFile,
  heroFile,
  setThumbnailURL,
  setHeroURL,
  setThumbnailFile,
  setHeroFile,
}: ArtworkSectionProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Artwork
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Manage the images used to
          present this show across
          Texas Adventist TV.
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <MediaUpload
          id="thumbnail"
          label="Thumbnail"
          description="Recommended: 1280 × 720 px · 16:9"
          accept="image/jpeg,image/png,image/webp"
          mediaType="image"
          value={thumbnailURL}
          selectedFile={
            thumbnailFile
          }
          onFileChange={
            setThumbnailFile
          }
          onValueChange={
            setThumbnailURL
          }
          compact
        />

        <MediaUpload
          id="hero-image"
          label="Hero Image"
          description="Recommended: 3840 × 2160 px · 16:9"
          accept="image/jpeg,image/png,image/webp"
          mediaType="image"
          value={heroURL}
          selectedFile={heroFile}
          onFileChange={
            setHeroFile
          }
          onValueChange={
            setHeroURL
          }
          compact
        />
      </div>
    </section>
  );
}