"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  SeriesRecord,
} from "@/lib/repositories/series.repository";

type Props = {
  series: SeriesRecord[];
};

export function SeriesTable({
  series,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">

      <table className="w-full">

        <thead className="bg-zinc-900">

          <tr>

            <th className="p-4 text-left">
              Thumbnail
            </th>

            <th className="p-4 text-left">
              Show
            </th>

            <th className="p-4 text-left">
              Published
            </th>

            <th className="p-4 text-left">
              Featured
            </th>

            <th className="p-4 text-right">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {series.map((show) => (

            <tr
              key={show.id}
              className="border-t border-zinc-800 hover:bg-zinc-900 transition"
            >

              <td className="p-4">

                {show.thumbnail_url ? (

                  <Image
                    src={show.thumbnail_url}
                    alt={show.title}
                    width={140}
                    height={80}
                    className="h-20 w-36 rounded-lg object-cover"
                  />

                ) : (

                  <div className="h-20 w-36 rounded-lg bg-zinc-800" />

                )}

              </td>

              <td className="p-4">

                <div>

                  <p className="font-medium text-white">
                    {show.title}
                  </p>

                  {show.subtitle && (
                    <p className="mt-1 text-sm text-zinc-400">
                      {show.subtitle}
                    </p>
                  )}

                </div>

              </td>

              <td className="p-4">

                {show.published ? (
                  <Badge>
                    Published
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Draft
                  </Badge>
                )}

              </td>

              <td className="p-4">

                {show.featured
                  ? "⭐"
                  : "—"}

              </td>

              <td className="p-4">

                <div className="flex justify-end gap-2">

                  <Link
                    href={`/admin/series/${show.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>

                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-red-800 px-3 py-2 text-sm text-red-400 hover:bg-red-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

          {series.length === 0 && (

            <tr>

              <td
                colSpan={5}
                className="p-10 text-center text-zinc-500"
              >
                No shows found.
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}