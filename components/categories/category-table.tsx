"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  deleteCategory,
  type CategoryRecord,
} from "@/lib/repositories/category.repository";

type CategoryTableProps = {
  categories: CategoryRecord[];
};

export function CategoryTable({
  categories,
}: CategoryTableProps) {
  const router = useRouter();

  async function removeCategory(id: string) {
    const confirmed = window.confirm(
      "Delete this category?\n\nVideos and shows will remain, but their category relationship may be removed."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(id);

      toast.success("Category deleted.");

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete category."
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead className="bg-zinc-900">
          <tr>
            <th className="p-4 text-left">
              Category
            </th>

            <th className="p-4 text-left">
              Slug
            </th>

            <th className="p-4 text-left">
              Color
            </th>

            <th className="p-4 text-left">
              Order
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="border-t border-zinc-800 transition hover:bg-zinc-900"
            >
              <td className="p-4">
                <p className="font-medium text-white">
                  {category.name}
                </p>

                {category.description ? (
                  <p className="mt-1 max-w-md truncate text-sm text-zinc-400">
                    {category.description}
                  </p>
                ) : null}
              </td>

              <td className="p-4 text-zinc-400">
                {category.slug}
              </td>

              <td className="p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="h-6 w-6 rounded-full border border-zinc-700"
                    style={{
                      backgroundColor:
                        category.color ??
                        "#003B5C",
                    }}
                  />

                  <span className="text-sm text-zinc-400">
                    {category.color ??
                      "#003B5C"}
                  </span>
                </div>
              </td>

              <td className="p-4 text-zinc-300">
                {category.display_order}
              </td>

              <td className="p-4">
                {category.published ? (
                  <Badge>Published</Badge>
                ) : (
                  <Badge variant="secondary">
                    Hidden
                  </Badge>
                )}
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      removeCategory(category.id)
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

          {categories.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-10 text-center text-zinc-400"
              >
                No categories found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}