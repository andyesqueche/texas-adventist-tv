import { CloudflareVideoUpload } from "@/components/uploads/cloudflare-video-upload";

type Props = {
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
  trailerStreamUid,
  trailerPlaybackUrl,
  streamUid,
  playbackUrl,
  setTrailerStreamUid,
  setTrailerPlaybackUrl,
  setStreamUid,
  setPlaybackUrl,
}: Props) {
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

      {trailerStreamUid && (
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
        </div>
      )}

      {/* FULL VIDEO — unchanged */}
      <CloudflareVideoUpload
        label="Full Video"
        currentUid={streamUid}
        accept="video/*"
        onUploaded={({ uid, playbackUrl }) => {
          setStreamUid(uid);
          setPlaybackUrl(playbackUrl);
        }}
      />

      {streamUid && (
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
      )}
    </>
  );
}