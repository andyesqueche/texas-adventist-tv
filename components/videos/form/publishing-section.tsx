type PublishingSectionProps = {
  published: boolean;
  featured: boolean;

  onPublishedChange: (value: boolean) => void;
  onFeaturedChange: (value: boolean) => void;
};

export function PublishingSection({
  published,
  featured,
  onPublishedChange,
  onFeaturedChange,
}: PublishingSectionProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Publishing
      </h2>

      <div className="space-y-4">

        <label className="flex cursor-pointer items-center gap-3">

          <input
            type="checkbox"
            checked={published}
            onChange={(e) =>
              onPublishedChange(e.target.checked)
            }
            className="h-4 w-4"
          />

          <span>Published</span>

        </label>

        <label className="flex cursor-pointer items-center gap-3">

          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              onFeaturedChange(e.target.checked)
            }
            className="h-4 w-4"
          />

          <span>Featured</span>

        </label>

      </div>
    </section>
  );
}