import Link from "next/link";
import { Plus } from "lucide-react";

import {
  getCollections,
} from "@/lib/repositories/collection.repository";

import { CollectionTable } from "@/components/collections/collection-table";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="mx-auto max-w-7xl p-10">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Collections
          </h1>

          <p className="mt-2 text-zinc-500">
            Organize rows displayed on Apple TV.
          </p>

        </div>

        <Link
          href="/admin/collections/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#003B5C] px-5 py-3 font-semibold text-white hover:bg-[#004d78]"
        >
          <Plus className="h-5 w-5" />
          New Collection
        </Link>

      </div>

      <CollectionTable
        collections={collections}
      />

    </div>
  );
}