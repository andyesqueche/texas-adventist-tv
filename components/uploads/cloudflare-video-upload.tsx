"use client";

import { useRef, useState } from "react";
import { FileVideo, UploadCloud } from "lucide-react";
import * as tus from "tus-js-client";
import { toast } from "sonner";

type CloudflareVideoUploadProps = {
  label?: string;
  currentUid?: string | null;
  accept?: string;
  onUploaded: (data: {
    uid: string;
    playbackUrl: string;
  }) => void;
};

export function CloudflareVideoUpload({
  label = "Full Video",
  currentUid,
  accept = "video/*",
  onUploaded,
}: CloudflareVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<tus.Upload | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [status, setStatus] =
    useState(
      currentUid
        ? "Video connected to Cloudflare Stream."
        : "No video uploaded."
    );

  function startUpload(file: File) {
    let streamUid = "";

    setSelectedFile(file);
    setUploading(true);
    setProgress(0);
    setStatus("Preparing resumable upload...");

    const upload = new tus.Upload(file, {
      endpoint: "/api/cloudflare/direct-upload",
      uploadSize: file.size,
      chunkSize: 50 * 1024 * 1024,

      retryDelays: [
        0,
        3000,
        5000,
        10000,
        20000,
      ],

      metadata: {
        name: file.name,
        filetype: file.type || "video/mp4",
      },

      removeFingerprintOnSuccess: true,

      onAfterResponse(_request, response) {
        const mediaId = response.getHeader(
          "stream-media-id"
        );

        if (mediaId) {
          streamUid = mediaId;
        }

        return Promise.resolve();
      },

      onProgress(bytesUploaded, bytesTotal) {
        const percentage = Math.round(
          (bytesUploaded / bytesTotal) * 100
        );

        setProgress(percentage);
        setStatus("Uploading video...");
      },

      onError(error) {
        console.error(
          "TUS UPLOAD ERROR:",
          error
        );

        setUploading(false);
        setStatus("Upload failed.");

        toast.error(
          error.message ||
            "Video upload failed."
        );
      },

      onSuccess() {
        if (!streamUid) {
          setUploading(false);
          setStatus(
            "Upload completed, but the Stream UID was not returned."
          );

          toast.error(
            "Cloudflare did not return the video ID."
          );

          return;
        }

        const playbackUrl =
          `https://videodelivery.net/${streamUid}/manifest/video.m3u8`;

        setProgress(100);
        setUploading(false);
        setStatus(
          "Upload completed. Cloudflare is processing the video."
        );

        onUploaded({
          uid: streamUid,
          playbackUrl,
        });

        toast.success(
          "Video uploaded to Cloudflare Stream."
        );
      },
    });

    uploadRef.current = upload;
    upload.start();
  }

  function cancelUpload() {
    uploadRef.current?.abort(true);
    uploadRef.current = null;

    setUploading(false);
    setProgress(0);
    setStatus("Upload cancelled.");

    toast.info("Upload cancelled.");
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800">
          <FileVideo className="h-6 w-6 text-zinc-300" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            {label}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Uploads directly to Cloudflare Stream using a resumable connection.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-300">
          {status}
        </p>

        {selectedFile ? (
          <p className="mt-2 truncate text-sm text-zinc-500">
            {selectedFile.name}
          </p>
        ) : null}

        {currentUid ? (
          <p className="mt-2 break-all text-xs text-zinc-600">
            Stream UID: {currentUid}
          </p>
        ) : null}

        {uploading ? (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm text-zinc-300">
              <span>Uploading</span>
              <span>{progress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-[#003B5C] transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            inputRef.current?.click()
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#003B5C] px-5 py-3 font-semibold text-white transition hover:bg-[#004d78] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UploadCloud className="h-5 w-5" />

          {currentUid
            ? "Replace Video"
            : "Select Video"}
        </button>

        {uploading ? (
          <button
            type="button"
            onClick={cancelUpload}
            className="rounded-lg border border-red-800 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-950/40"
          >
            Cancel Upload
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file =
            event.target.files?.[0];

          if (file) {
            startUpload(file);
          }

          event.target.value = "";
        }}
      />
    </section>
  );
}