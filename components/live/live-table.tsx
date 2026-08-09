"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Radio, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  deleteLiveBroadcast,
  type LiveBroadcastRecord,
} from "@/lib/repositories/live.repository";

type Props = {
  broadcasts: LiveBroadcastRecord[];
};

export function LiveTable({
  broadcasts,
}: Props) {
  const router = useRouter();

  async function removeBroadcast(id: string) {
    const confirmed = window.confirm(
      "Delete this broadcast?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteLiveBroadcast(id);

      toast.success("Broadcast deleted.");

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE LIVE BROADCAST ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete broadcast."
      );
    }
  }

  function statusBadge(
    status: LiveBroadcastRecord["status"]
  ) {
    if (status === "live") {
      return (
        <Badge>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500" />
          LIVE
        </Badge>
      );
    }

    if (status === "scheduled") {
      return (
        <Badge variant="secondary">
          Scheduled
        </Badge>
      );
    }

    if (status === "starting_soon") {
      return (
        <Badge variant="secondary">
          Starting Soon
        </Badge>
      );
    }

    if (status === "replay") {
      return (
        <Badge variant="secondary">
          Replay
        </Badge>
      );
    }

    if (status === "ended") {
      return (
        <Badge variant="secondary">
          Ended
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        Draft
      </Badge>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead className="bg-zinc-900">
          <tr>
            <th className="p-4 text-left">
              Broadcast
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-left">
              Scheduled Start
            </th>

            <th className="p-4 text-left">
              Published
            </th>

            <th className="p-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {broadcasts.map((broadcast) => (
            <tr
              key={broadcast.id}
              className="border-t border-zinc-800 transition hover:bg-zinc-900"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                    <Radio className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      {broadcast.title}
                    </p>

                    {broadcast.subtitle ? (
                      <p className="mt-1 text-sm text-zinc-400">
                        {broadcast.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>
              </td>

              <td className="p-4">
                {statusBadge(broadcast.status)}
              </td>

              <td className="p-4 text-zinc-300">
                {broadcast.scheduled_start
                  ? new Date(
                      broadcast.scheduled_start
                    ).toLocaleString()
                  : "—"}
              </td>

              <td className="p-4">
                {broadcast.published ? (
                  <Badge>Published</Badge>
                ) : (
                  <Badge variant="secondary">
                    Draft
                  </Badge>
                )}
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/live/${broadcast.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      removeBroadcast(broadcast.id)
                    }
                    className="inline-flex items-center gap-2 rounded-md border border-red-800 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {broadcasts.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-10 text-center text-zinc-400"
              >
                No broadcasts found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}