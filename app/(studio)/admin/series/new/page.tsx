import { SeriesForm } from "@/components/series/series-form";
import { getPublishedCategoryOptions } from "@/lib/repositories/category.repository";

export default async function NewSeriesPage() {
  const categories =
    await getPublishedCategoryOptions();

  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">
        New Show
      </h1>

      <SeriesForm categories={categories} />
    </div>
  );
}