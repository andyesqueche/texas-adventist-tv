import { MediaUpload } from "@/components/uploads/media-upload";

type ArtworkSectionProps = {
  thumbnailURL: string | null;
  heroURL: string | null;

  thumbnailFile: File | null;
  heroFile: File | null;

  setThumbnailURL: (value: string | null) => void;
  setHeroURL: (value: string | null) => void;

  setThumbnailFile: (file: File | null) => void;
  setHeroFile: (file: File | null) => void;
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
    <>
      <MediaUpload
        id="thumbnail"
        label="Thumbnail"
        description="Recommended size: 1280 × 720 pixels."
        accept="image/jpeg,image/png,image/webp"
        mediaType="image"
        value={thumbnailURL}
        selectedFile={thumbnailFile}
        onFileChange={setThumbnailFile}
        onValueChange={setThumbnailURL}
      />

      <MediaUpload
        id="hero-image"
        label="Hero Image"
        description="Recommended size: 3840 × 2160 pixels."
        accept="image/jpeg,image/png,image/webp"
        mediaType="image"
        value={heroURL}
        selectedFile={heroFile}
        onFileChange={setHeroFile}
        onValueChange={setHeroURL}
      />
    </>
  );
}