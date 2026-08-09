import { MediaUploadForm } from "@/components/media/media-upload-form";

export default function UploadMediaPage() {
  return (
    <div className="space-y-8 p-10">

      <h1 className="text-3xl font-bold">
        Upload Media
      </h1>

      <MediaUploadForm />

    </div>
  );
}