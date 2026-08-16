"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CloudflareVideoUpload } from "@/components/uploads/cloudflare-video-upload";

type Props = {
  videoId?: string;

  trailerStreamUid: string;
  trailerPlaybackUrl: string;

  streamUid: string;
  playbackUrl: string;

  setTrailerStreamUid: (uid: string) => void;
  setTrailerPlaybackUrl: (url: string) => void;

  setStreamUid: (uid: string) => void;
  setPlaybackUrl: (url: string) => void;
};

export function MediaSection({
  videoId,
  trailerStreamUid,
  trailerPlaybackUrl,
  streamUid,
  playbackUrl,
  setTrailerStreamUid,
  setTrailerPlaybackUrl,
  setStreamUid,
  setPlaybackUrl,
}: Props) {
  const [deletingTrailer, setDeletingTrailer] =
    useState(false);

  async function deleteTrailer() {
    if (!videoId) {
      toast.error(
        "Save the video before deleting its trailer."
      );

      return;
    }

    if (!trailerStreamUid) {
      return;
    }

    const confirmed = window.confirm(
      "Permanently delete this trailer?\n\n" +
        "The trailer will be deleted from Cloudflare Stream " +
        "and removed from this video. This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTrailer(true);

      const response = await fetch(
        "/api/cloudflare/delete-video",
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            uid: trailerStreamUid,
            videoId,
            type: "trailer",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to delete trailer."
        );
      }

      setTrailerStreamUid("");
      setTrailerPlaybackUrl("");

      toast.success(
        "Trailer deleted successfully."
      );
    } catch (error) {
      console.error(
        "DELETE TRAILER ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete trailer."
      );
    } finally {
      setDeletingTrailer(false);
    }
  }

  return (
    <>
      {/* TRAILER */}

      <CloudflareVideoUpload
        label="Trailer"
        currentUid={trailerStreamUid}
        accept="video/*"
        onUploaded={({ uid, playbackUrl }) => {
          setTrailerStreamUid(uid);
          setTrailerPlaybackUrl(playbackUrl);
        }}
      />

      {trailerStreamUid ? (
        <div className="rounded-xl border border-blue-900 bg-blue-950/30 p-5">
          <h3 className="font-semibold text-blue-300">
            Trailer — Cloudflare Stream
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <span className="text-zinc-400">
                Trailer Stream UID
              </span>

              <p className="break-all text-blue-400">
                {trailerStreamUid}
              </p>
            </div>

            <div>
              <span className="text-zinc-400">
                Trailer Playback URL
              </span>

              <p className="break-all text-blue-400">
                {trailerPlaybackUrl}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-blue-900/50 pt-5">
            <button
              type="button"
              onClick={deleteTrailer}
              disabled={deletingTrailer}
              className="inline-flex items-center gap-2 rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />

              {deletingTrailer
                ? "Deleting..."
                : "Delete Trailer"}
            </button>

            <p className="mt-3 text-xs text-zinc-500">
              Permanently deletes this trailer from
              Cloudflare Stream and removes it from this
              video.
            </p>
          </div>
        </div>
      ) : null}

      {/* FULL VIDEO — UNCHANGED */}

      <CloudflareVideoUpload
        label="Full Video"
        currentUid={streamUid}
        accept="video/*"
        onUploaded={({ uid, playbackUrl }) => {
          setStreamUid(uid);
          setPlaybackUrl(playbackUrl);
        }}
      />

      {streamUid ? (
        <div className="rounded-xl border border-green-900 bg-green-950/30 p-5">
          <h3 className="font-semibold text-green-300">
            Cloudflare Stream
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <span className="text-zinc-400">
                Stream UID
              </span>

              <p className="break-all text-green-400">
                {streamUid}
              </p>
            </div>

            <div>
              <span className="text-zinc-400">
                Playback URL
              </span>

              <p className="break-all text-green-400">
                {playbackUrl}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}