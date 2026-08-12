import Link from "next/link";
import { Play } from "lucide-react";

type Props = {
  href: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
};

export function ContentCard({
  href,
  title,
  subtitle,
  imageUrl,
}: Props) {
  return (
    <Link
      href={href}
      className="group block min-w-[280px] max-w-[280px] flex-none"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950">
            <Play className="h-10 w-10 text-zinc-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="line-clamp-1 font-medium text-white">
          {title}
        </h3>

        {subtitle ? (
          <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
            {subtitle}
          </p>
        ) : null}
      </div>
    </Link>
  );
}