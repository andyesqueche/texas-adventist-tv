import Link from "next/link";
import { CalendarDays, ChevronRight, Settings, Watch } from "lucide-react";
import { PageHeader } from "@/components/studio/page-header";

const sections = [
  {
    title: "Daily Content",
    description:
      "Manage the daily Bible verse and prayer displayed on Texas Adventist Watch.",
    href: "/admin/watch/daily",
    icon: Watch,
  },
  {
    title: "Events",
    description:
      "Manage upcoming events and event notification availability for Apple Watch.",
    href: "/admin/watch/events",
    icon: CalendarDays,
  },
  {
    title: "Settings",
    description:
      "Configure Apple Watch content and application settings.",
    href: "/admin/watch/settings",
    icon: Settings,
  },
];

export default function AppleWatchPage() {
  return (
    <div>
      <PageHeader
        title="Apple Watch"
        description="Manage content and settings for Texas Adventist Watch."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-800/70"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#003B5C]">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <ChevronRight className="h-5 w-5 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </div>

              <h2 className="text-lg font-semibold text-white">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {section.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
