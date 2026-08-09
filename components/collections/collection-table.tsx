"use client";

import Link from "next/link";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  CollectionRecord,
} from "@/lib/repositories/collection.repository";

type Props = {
  collections: CollectionRecord[];
};

export function CollectionTable({
  collections,
}: Props) {

  return (

    <div className="overflow-hidden rounded-xl border border-zinc-800">

      <table className="w-full">

        <thead className="bg-zinc-900">

          <tr>

            <th className="p-4 text-left">
              Title
            </th>

            <th className="p-4 text-left">
              Subtitle
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="w-44 p-4"></th>

          </tr>

        </thead>

        <tbody>

          {collections.map((collection) => (

            <tr
              key={collection.id}
              className="border-t border-zinc-800"
            >

              <td className="p-4 font-medium">
                {collection.title}
              </td>

              <td className="p-4 text-zinc-400">
                {collection.subtitle ?? "-"}
              </td>

              <td className="p-4">

                {collection.published ? (

                  <Badge>
                    Published
                  </Badge>

                ) : (

                  <Badge variant="secondary">
                    Hidden
                  </Badge>

                )}

              </td>

              <td className="p-4">

                <div className="flex justify-end gap-2">

                  <Link
                    href={`/admin/collections/${collection.id}/edit`}
                    className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-800"
                  >

                    <Pencil className="h-4 w-4" />

                  </Link>

                  <button
                    className="rounded-md border border-red-700 px-3 py-2 text-red-400 hover:bg-red-900/20"
                  >

                    <Trash2 className="h-4 w-4" />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}