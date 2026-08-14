"use client";

import Image from "next/image";
import {
  FileVideo,
  ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";

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

  compact?: boolean;
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
  compact = false,
}: MediaUploadProps) {
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    onFileChange(file);
    onValueChange(
      URL.createObjectURL(file)
    );
  }

  function removeFile() {
    onFileChange(null);
    onValueChange(null);
  }

  return (
    <section
      className={
        compact
          ? "h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
          : "rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
      }
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            className={
              compact
                ? "text-lg font-semibold text-white"
                : "text-xl font-semibold text-white"
            }
          >
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
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
          >
            <X className="h-4 w-4" />

            <span className="hidden sm:inline">
              Remove
            </span>
          </button>
        ) : null}
      </div>

      {value ? (
        <div
          className={`overflow-hidden rounded-xl border border-zinc-800 bg-black ${
            compact ? "mb-4" : "mb-5"
          }`}
        >
          {mediaType === "image" ? (
            <Image
              src={value}
              alt={label}
              width={1280}
              height={720}
              unoptimized={value.startsWith(
                "blob:"
              )}
              className={
                compact
                  ? "aspect-video w-full object-cover"
                  : "aspect-video w-full object-cover"
              }
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
        <div
          className={`flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950 ${
            compact ? "mb-4" : "mb-5"
          }`}
        >
          <div className="text-center text-zinc-500">
            {mediaType === "image" ? (
              <ImageIcon
                className={
                  compact
                    ? "mx-auto h-8 w-8"
                    : "mx-auto h-10 w-10"
                }
              />
            ) : (
              <FileVideo
                className={
                  compact
                    ? "mx-auto h-8 w-8"
                    : "mx-auto h-10 w-10"
                }
              />
            )}

            <p className="mt-3 text-sm">
              No file selected
            </p>
          </div>
        </div>
      )}

      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800"
      >
        <UploadCloud className="h-4 w-4" />

        {selectedFile
          ? "Choose another file"
          : value
            ? "Replace image"
            : "Choose file"}
      </label>

      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <p className="mt-3 truncate text-xs text-zinc-500">
          Selected: {selectedFile.name}
        </p>
      ) : null}
    </section>
  );
}