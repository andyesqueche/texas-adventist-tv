import { CategoryForm } from "@/components/categories/category-form";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">
        New Category
      </h1>

      <CategoryForm />
    </div>
  );
}