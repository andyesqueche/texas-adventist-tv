import { CloudflareVideoUpload } from "@/components/uploads/cloudflare-video-upload";

type Props = {
  trailerURL: string | null;

  streamUid: string;
  playbackUrl: string;

  setTrailerURL: (value: string | null) => void;

  setStreamUid: (uid: string) => void;
  setPlaybackUrl: (url: string) => void;
};

export function MediaSection({
  trailerURL,
  streamUid,
  playbackUrl,
  setTrailerURL,
  setStreamUid,
  setPlaybackUrl,
}: Props) {
  return (
    <>
      <CloudflareVideoUpload
        label="Trailer"
        currentUid={trailerURL ?? ""}
        accept="video/mp4"
        onUploaded={({ playbackUrl }) => {
          setTrailerURL(playbackUrl);
        }}
      />

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