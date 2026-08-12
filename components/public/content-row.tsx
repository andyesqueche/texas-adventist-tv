import { ContentCard } from "@/components/public/content-card";

type Item = {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  href: string;
};

type Props = {
  title: string;
  subtitle?: string | null;
  items: Item[];
};

export function ContentRow({
  title,
  subtitle,
  items,
}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          {title}
        </h2>

        {subtitle ? (
          <p className="mt-1 text-sm text-zinc-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex gap-5 overflow-x-auto pb-3">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            href={item.href}
            title={item.title}
            subtitle={item.subtitle}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}