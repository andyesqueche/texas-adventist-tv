import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/categories/category-form";
import { getCategoryById } from "@/lib/repositories/category.repository";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Category
      </h1>

      <CategoryForm
        initialData={category}
      />
    </div>
  );
}