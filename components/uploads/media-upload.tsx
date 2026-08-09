"use client";

import Image from "next/image";
import { FileVideo, ImageIcon, UploadCloud, X } from "lucide-react";

type MediaUploadProps = {
  id: string;
  label: string;
  description: string;
  accept: string;
  mediaType: "image" | "video";
  value: string | null;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  onValueChange: (value: string | null) => void;
};

export function MediaUpload({
  id,
  label,
  description,
  accept,
  mediaType,
  value,
  selectedFile,
  onFileChange,
  onValueChange,
}: MediaUploadProps) {
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    onFileChange(file);
    onValueChange(URL.createObjectURL(file));
  }

  function removeFile() {
    onFileChange(null);
    onValueChange(null);
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {label}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {description}
          </p>
        </div>

        {value ? (
          <button
            type="button"
            onClick={removeFile}
            className="inline-flex items-center gap-2 rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
          >
            <X className="h-4 w-4" />
            Remove
          </button>
        ) : null}
      </div>

      {value ? (
        <div className="mb-5 overflow-hidden rounded-xl border border-zinc-800 bg-black">
          {mediaType === "image" ? (
            <Image
              src={value}
              alt={label}
              width={1280}
              height={720}
              unoptimized={value.startsWith("blob:")}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <video
              src={value}
              controls
              preload="metadata"
              className="aspect-video w-full bg-black object-contain"
            />
          )}
        </div>
      ) : (
        <div className="mb-5 flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950">
          <div className="text-center text-zinc-500">
            {mediaType === "image" ? (
              <ImageIcon className="mx-auto h-10 w-10" />
            ) : (
              <FileVideo className="mx-auto h-10 w-10" />
            )}

            <p className="mt-3 text-sm">
              No file selected
            </p>
          </div>
        </div>
      )}

      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
      >
        <UploadCloud className="h-5 w-5" />

        {selectedFile ? "Choose another file" : "Choose file"}
      </label>

      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <p className="mt-3 truncate text-sm text-zinc-500">
          Selected: {selectedFile.name}
        </p>
      ) : null}
    </section>
  );
}