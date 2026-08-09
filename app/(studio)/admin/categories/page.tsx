import Link from "next/link";
import { Plus } from "lucide-react";

import { CategoryTable } from "@/components/categories/category-table";
import { PageHeader } from "@/components/studio/page-header";
import { getCategories } from "@/lib/repositories/category.repository";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8 p-10">
      <PageHeader
        title="Categories"
        description="Manage the content categories used by videos and shows."
        actions={
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#003B5C] px-4 py-2 text-white transition hover:bg-[#004d78]"
          >
            <Plus className="h-4 w-4" />
            New Category
          </Link>
        }
      />

      <CategoryTable
        categories={categories}
      />
    </div>
  );
}