"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  House,
  Image,
  LayoutDashboard,
  Layers,
  Radio,
  Settings,
  Tv,
  Users,
  Video,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
  title: "Home Layout",
  href: "/admin/home",
  icon: House,
},
  {
    title: "Videos",
    href: "/admin/videos",
    icon: Video,
  },
  {
    title: "Series",
    href: "/admin/series",
    icon: FolderOpen,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Collections",
    href: "/admin/collections",
    icon: Layers,
  },
  {
    title: "Speakers",
    href: "/admin/speakers",
    icon: Users,
  },
  {
    title: "Live TV",
    href: "/admin/live",
    icon: Radio,
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003B5C]">
            <Tv className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              Texas Adventist TV
            </h1>

            <p className="text-sm text-zinc-400">
              Studio
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-lg px-4 py-3 transition",
                isActive
                  ? "bg-[#003B5C] text-white"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <p className="px-4 text-xs text-zinc-500">
          Texas Conference Cloud
        </p>
      </div>
    </aside>
  );
}