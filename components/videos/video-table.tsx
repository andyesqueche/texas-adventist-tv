"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { deleteVideo } from "@/lib/repositories/video.repository";
import type { VideoRecord } from "@/types/video";

type Props = {
  videos: VideoRecord[];
};

type SortKey =
  | "title"
  | "category"
  | "published"
  | "featured"
  | "created_at";

type SortDirection = "asc" | "desc";

type StatusFilter =
  | "all"
  | "published"
  | "draft"
  | "featured";

export function VideoTable({ videos }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [sortKey, setSortKey] =
    useState<SortKey>("created_at");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        videos
          .map((video) => video.category)
          .filter(
            (category): category is string =>
              Boolean(category)
          )
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const result = videos.filter((video) => {
      const matchesSearch =
        !normalizedSearch ||
        video.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        (video.subtitle ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (video.category ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "all" ||
        video.category === categoryFilter;

      let matchesStatus = true;

      if (statusFilter === "published") {
        matchesStatus = video.published;
      }

      if (statusFilter === "draft") {
        matchesStatus = !video.published;
      }

      if (statusFilter === "featured") {
        matchesStatus = video.featured;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });

    return [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "title":
          comparison = a.title.localeCompare(
            b.title,
            undefined,
            {
              sensitivity: "base",
            }
          );
          break;

        case "category":
          comparison = (
            a.category ?? ""
          ).localeCompare(
            b.category ?? "",
            undefined,
            {
              sensitivity: "base",
            }
          );
          break;

        case "published":
          comparison =
            Number(a.published) -
            Number(b.published);
          break;

        case "featured":
          comparison =
            Number(a.featured) -
            Number(b.featured);
          break;

        case "created_at":
          comparison =
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime();
          break;
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });
  }, [
    videos,
    search,
    categoryFilter,
    statusFilter,
    sortKey,
    sortDirection,
  ]);

  function changeSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );

      return;
    }

    setSortKey(key);

    if (key === "created_at") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  }

  function SortIcon({
    column,
  }: {
    column: SortKey;
  }) {
    if (sortKey !== column) {
      return (
        <ArrowUpDown className="h-4 w-4 text-zinc-600" />
      );
    }

    if (sortDirection === "asc") {
      return (
        <ArrowUp className="h-4 w-4 text-white" />
      );
    }

    return (
      <ArrowDown className="h-4 w-4 text-white" />
    );
  }

  async function removeVideo(id: string) {
    const confirmed = window.confirm(
      "Delete this video?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVideo(id);

      toast.success(
        "Video deleted successfully."
      );

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE VIDEO ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete video.";

      toast.error(message);
    }
  }

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    ).format(date);
  }

  return (
    <div className="space-y-5">
      {/* FILTERS */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 lg:flex-row lg:items-center">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search videos..."
            className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
          />
        </div>

        {/* CATEGORY FILTER */}
        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
          className="h-11 min-w-52 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-500"
        >
          <option value="all">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target
                .value as StatusFilter
            )
          }
          className="h-11 min-w-44 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-500"
        >
          <option value="all">
            All Status
          </option>

          <option value="published">
            Published
          </option>

          <option value="draft">
            Draft
          </option>

          <option value="featured">
            Featured
          </option>
        </select>
      </div>

      {/* RESULT COUNT */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-zinc-500">
          {filteredVideos.length}{" "}
          {filteredVideos.length === 1
            ? "video"
            : "videos"}
        </p>

        {(search ||
          categoryFilter !== "all" ||
          statusFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-4 text-left">
                Thumbnail
              </th>

              <SortableHeader
                label="Title"
                column="title"
                onClick={changeSort}
              >
                <SortIcon column="title" />
              </SortableHeader>

              <SortableHeader
                label="Category"
                column="category"
                onClick={changeSort}
              >
                <SortIcon column="category" />
              </SortableHeader>

              <SortableHeader
                label="Published"
                column="published"
                onClick={changeSort}
              >
                <SortIcon column="published" />
              </SortableHeader>

              <SortableHeader
                label="Featured"
                column="featured"
                onClick={changeSort}
              >
                <SortIcon column="featured" />
              </SortableHeader>

              <SortableHeader
                label="Date"
                column="created_at"
                onClick={changeSort}
              >
                <SortIcon column="created_at" />
              </SortableHeader>

              <th className="p-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredVideos.map((video) => (
              <tr
                key={video.id}
                className="border-t border-zinc-800 transition hover:bg-zinc-900/70"
              >
                {/* THUMBNAIL */}
                <td className="p-4">
                  {video.thumbnail_url ? (
                    <Image
                      src={
                        video.thumbnail_url
                      }
                      alt={video.title}
                      width={144}
                      height={81}
                      className="h-[81px] w-36 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-[81px] w-36 items-center justify-center rounded-lg bg-zinc-800 text-xs text-zinc-600">
                      No image
                    </div>
                  )}
                </td>

                {/* TITLE */}
                <td className="max-w-sm p-4">
                  <p className="font-medium text-white">
                    {video.title}
                  </p>

                  {video.subtitle ? (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {video.subtitle}
                    </p>
                  ) : null}
                </td>

                {/* CATEGORY */}
                <td className="p-4 text-zinc-300">
                  {video.category ?? "—"}
                </td>

                {/* PUBLISHED */}
                <td className="p-4">
                  {video.published ? (
                    <Badge>
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Draft
                    </Badge>
                  )}
                </td>

                {/* FEATURED */}
                <td className="p-4">
                  {video.featured ? (
                    <span
                      title="Featured"
                      className="text-lg"
                    >
                      ⭐
                    </span>
                  ) : (
                    <span className="text-zinc-600">
                      —
                    </span>
                  )}
                </td>

                {/* DATE */}
                <td className="whitespace-nowrap p-4 text-sm text-zinc-400">
                  {formatDate(
                    video.created_at
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/videos/${video.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        removeVideo(video.id)
                      }
                      className="inline-flex items-center gap-2 rounded-md border border-red-800 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredVideos.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-14 text-center"
                >
                  <p className="font-medium text-zinc-300">
                    No videos found
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Try changing your search
                    or filters.
                  </p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type SortableHeaderProps = {
  label: string;
  column: SortKey;
  onClick: (column: SortKey) => void;
  children: React.ReactNode;
};

function SortableHeader({
  label,
  column,
  onClick,
  children,
}: SortableHeaderProps) {
  return (
    <th className="p-4 text-left">
      <button
        type="button"
        onClick={() => onClick(column)}
        className="inline-flex items-center gap-2 text-left transition hover:text-white"
      >
        <span>{label}</span>
        {children}
      </button>
    </th>
  );
}