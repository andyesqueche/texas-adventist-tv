import { PageHeader } from "@/components/studio/page-header";

import {
  HomeLayoutManager,
} from "@/components/home/home-layout-manager";

import {
  getHomeSections,
  getHomeSeriesOptions,
} from "@/lib/repositories/home-section.repository";

export const dynamic =
  "force-dynamic";

export default async function HomeLayoutPage() {
  const [
    sections,
    series,
  ] = await Promise.all([
    getHomeSections(),
    getHomeSeriesOptions(),
  ]);

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        title="Home Layout"
        description="Control which sections appear on the Texas Adventist TV Home screen and their order."
      />

      <HomeLayoutManager
        initialSections={sections}
        series={series}
      />
    </div>
  );
}