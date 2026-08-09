import { notFound } from "next/navigation";

import { SeriesForm } from "@/components/series/series-form";
import { getPublishedCategoryOptions } from "@/lib/repositories/category.repository";
import { getSeriesById } from "@/lib/repositories/series.repository";

type EditSeriesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSeriesPage({
  params,
}: EditSeriesPageProps) {
  const { id } = await params;

  const [series, categories] =
    await Promise.all([
      getSeriesById(id),
      getPublishedCategoryOptions(),
    ]);

  if (!series) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Show
      </h1>

      <SeriesForm
        initialData={series}
        categories={categories}
      />
    </div>
  );
}