"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MediaUpload } from "@/components/uploads/media-upload";
import { uploadFile } from "@/lib/storage/upload-file";
import { saveLiveBroadcast } from "@/lib/services/live.service";

import type {
    LiveBroadcastRecord,
    SaveLiveBroadcastInput,
} from "@/lib/repositories/live.repository";

type Props = {
    initialData?: LiveBroadcastRecord;
};

export function LiveForm({
    initialData,
}: Props) {
    const router = useRouter();

    const isEditing = Boolean(initialData?.id);

    // -------------------------------------------------------
    // Broadcast Information
    // -------------------------------------------------------

    const [title, setTitle] = useState(
        initialData?.title ?? ""
    );

    const [subtitle, setSubtitle] = useState(
        initialData?.subtitle ?? ""
    );

    const [description, setDescription] = useState(
        initialData?.description ?? ""
    );

    // -------------------------------------------------------
    // Artwork
    // -------------------------------------------------------

    const [thumbnailUrl, setThumbnailUrl] =
        useState<string | null>(
            initialData?.thumbnail_url ?? null
        );

    const [thumbnailFile, setThumbnailFile] =
        useState<File | null>(null);

    const [heroUrl, setHeroUrl] =
        useState<string | null>(
            initialData?.hero_url ?? null
        );

    const [heroFile, setHeroFile] =
        useState<File | null>(null);

    // -------------------------------------------------------
    // Stream
    // -------------------------------------------------------

    const cloudflareLiveHLS =
        process.env.NEXT_PUBLIC_CLOUDFLARE_LIVE_HLS_URL ?? "";

    const [playbackUrl] = useState(
        initialData?.playback_url ||
        cloudflareLiveHLS
    );

    // -------------------------------------------------------
    // Schedule
    // -------------------------------------------------------

    const [scheduledStart, setScheduledStart] =
        useState(
            initialData?.scheduled_start
                ? toLocalDateTimeInput(
                    initialData.scheduled_start
                )
                : ""
        );

    const [scheduledEnd, setScheduledEnd] =
        useState(
            initialData?.scheduled_end
                ? toLocalDateTimeInput(
                    initialData.scheduled_end
                )
                : ""
        );

    // -------------------------------------------------------
    // Status
    // -------------------------------------------------------

    const [status, setStatus] =
        useState<LiveBroadcastRecord["status"]>(
            initialData?.status ?? "draft"
        );

    const [featured, setFeatured] =
        useState(
            initialData?.featured ?? true
        );

    const [published, setPublished] =
        useState(
            initialData?.published ?? false
        );

    const [displayOrder, setDisplayOrder] =
        useState(
            initialData?.display_order ?? 0
        );

    const [saving, setSaving] =
        useState(false);

    // -------------------------------------------------------
    // Save
    // -------------------------------------------------------

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!title.trim()) {
            toast.error(
                "Title is required."
            );

            return;
        }
        if (
            scheduledStart &&
            scheduledEnd &&
            new Date(scheduledEnd) <= new Date(scheduledStart)
        ) {
            toast.error(
                "Scheduled End must be later than Scheduled Start."
            );

            return;
        }
        try {
            setSaving(true);

            let finalThumbnailUrl =
                thumbnailUrl;

            let finalHeroUrl =
                heroUrl;

            // Upload new thumbnail when selected

            if (thumbnailFile) {
                finalThumbnailUrl =
                    await uploadFile({
                        file: thumbnailFile,
                        bucket: "thumbnails",
                        folder: "live",
                    });
            }

            if (heroFile) {
                finalHeroUrl =
                    await uploadFile({
                        file: heroFile,
                        bucket: "hero-images",
                        folder: "live",
                    });
            }

            const values: SaveLiveBroadcastInput = {
                title: title.trim(),

                subtitle:
                    subtitle.trim(),

                description:
                    description.trim(),

                thumbnail_url:
                    finalThumbnailUrl,

                hero_url:
                    finalHeroUrl,

                playback_url:
                    playbackUrl.trim() || null,

                scheduled_start:
                    scheduledStart
                        ? new Date(
                            scheduledStart
                        ).toISOString()
                        : null,

                scheduled_end:
                    scheduledEnd
                        ? new Date(
                            scheduledEnd
                        ).toISOString()
                        : null,

                status,

                featured,

                published,

                display_order:
                    displayOrder,
            };

            await saveLiveBroadcast(
                values,
                initialData?.id
            );

            toast.success(
                isEditing
                    ? "Broadcast updated."
                    : "Broadcast created."
            );

            router.push(
                "/admin/live"
            );

            router.refresh();
        } catch (error) {
            console.error(
                "SAVE LIVE BROADCAST ERROR:",
                error
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to save broadcast."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >
            {/* --------------------------------------------------
          Broadcast Information
      -------------------------------------------------- */}

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h2 className="mb-6 text-xl font-semibold">
                    Broadcast Information
                </h2>

                <div className="space-y-5">
                    <Field
                        label="Title"
                        value={title}
                        placeholder="Camp Meeting 2026"
                        onChange={setTitle}
                    />

                    <Field
                        label="Subtitle"
                        value={subtitle}
                        placeholder="Sabbath Morning Service"
                        onChange={setSubtitle}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            className="h-36 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-[#003B5C]"
                            placeholder="Broadcast description"
                        />
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------
          Stream
      -------------------------------------------------- */}

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h2 className="mb-3 text-xl font-semibold">
                    Stream
                </h2>

                <p className="text-sm text-zinc-400">
                    This broadcast will automatically use the Texas Adventist Live
                    streaming channel.
                </p>

                {!cloudflareLiveHLS && (
                    <p className="mt-3 text-sm font-medium text-red-400">
                        Cloudflare Live HLS URL is not configured.
                    </p>
                )}
            </section>

            {/* --------------------------------------------------
          Artwork
      -------------------------------------------------- */}

            <div className="grid gap-8 xl:grid-cols-2">
                <MediaUpload
                    id="live-thumbnail"
                    label="Thumbnail"
                    description="Image displayed on the broadcast card. Recommended 16:9."
                    accept="image/jpeg,image/png,image/webp"
                    mediaType="image"
                    value={thumbnailUrl}
                    selectedFile={thumbnailFile}
                    onFileChange={
                        setThumbnailFile
                    }
                    onValueChange={
                        setThumbnailUrl
                    }
                />

                <MediaUpload
                    id="live-hero"
                    label="Hero Image"
                    description="Large background image displayed when the broadcast is featured."
                    accept="image/jpeg,image/png,image/webp"
                    mediaType="image"
                    value={heroUrl}
                    selectedFile={heroFile}
                    onFileChange={
                        setHeroFile
                    }
                    onValueChange={
                        setHeroUrl
                    }
                />
            </div>

            {/* --------------------------------------------------
          Schedule
      -------------------------------------------------- */}

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h2 className="mb-6 text-xl font-semibold">
                    Schedule
                </h2>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-zinc-200">
                            Scheduled Start
                        </label>

                        <input
                            type="datetime-local"
                            step="60"
                            value={scheduledStart}
                            onChange={(event) =>
                                setScheduledStart(event.target.value)
                            }
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-[#003B5C]"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-zinc-200">
                            Scheduled End
                        </label>

                        <input
                            type="datetime-local"
                            step="60"
                            value={scheduledEnd}
                            min={scheduledStart || undefined}
                            onChange={(event) =>
                                setScheduledEnd(event.target.value)
                            }
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-[#003B5C]"
                        />
                    </div>
                </div>

                <p className="mt-5 text-sm text-zinc-500">
                    Schedule the expected start and end time of the live broadcast.
                </p>
            </section>

            {/* --------------------------------------------------
          Status
      -------------------------------------------------- */}

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h2 className="mb-6 text-xl font-semibold">
                    Status
                </h2>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">
                            Broadcast Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target
                                        .value as LiveBroadcastRecord["status"]
                                )
                            }
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="scheduled">
                                Scheduled
                            </option>

                            <option value="starting_soon">
                                Starting Soon
                            </option>

                            <option value="live">
                                Live
                            </option>

                            <option value="replay">
                                Replay
                            </option>

                            <option value="ended">
                                Ended
                            </option>
                        </select>
                    </div>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={(event) =>
                                setFeatured(
                                    event.target.checked
                                )
                            }
                        />

                        <span>
                            Featured
                        </span>
                    </label>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(event) =>
                                setPublished(
                                    event.target.checked
                                )
                            }
                        />

                        <span>
                            Published
                        </span>
                    </label>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">
                            Display Order
                        </label>

                        <input
                            type="number"
                            value={displayOrder}
                            onChange={(event) =>
                                setDisplayOrder(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
                        />
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------
          Save
      -------------------------------------------------- */}

            <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#003B5C] px-6 py-3 font-semibold text-white transition hover:bg-[#004d78] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {saving
                    ? "Uploading & Saving..."
                    : isEditing
                        ? "Update Broadcast"
                        : "Save Broadcast"}
            </button>
        </form>
    );
}

// ---------------------------------------------------------
// Text Field
// ---------------------------------------------------------

type FieldProps = {
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
};

function Field({
    label,
    value,
    placeholder,
    onChange,
}: FieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">
                {label}
            </label>

            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-[#003B5C]"
            />
        </div>
    );
}

// ---------------------------------------------------------
// Date Time Field
// ---------------------------------------------------------

type DateTimeFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

function DateTimeField({
    label,
    value,
    onChange,
}: DateTimeFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">
                {label}
            </label>

            <input
                type="datetime-local"
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
            />
        </div>
    );
}

// ---------------------------------------------------------
// Date Helper
// ---------------------------------------------------------

function toLocalDateTimeInput(
    value: string
) {
    const date = new Date(value);

    const offset =
        date.getTimezoneOffset();

    const local = new Date(
        date.getTime() -
        offset * 60 * 1000
    );

    return local
        .toISOString()
        .slice(0, 16);
}