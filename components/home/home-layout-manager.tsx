"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  addSeriesToHome,
  removeSeriesFromHome,
  updateHomeSectionOrder,
  updateHomeSectionVisibility,
  type HomeSectionRecord,
  type HomeSeriesOption,
} from "@/lib/repositories/home-section.repository";

type Props = {
  initialSections: HomeSectionRecord[];
  series: HomeSeriesOption[];
};

export function HomeLayoutManager({
  initialSections,
  series,
}: Props) {
  const router = useRouter();

  const [sections, setSections] =
    useState(initialSections);

  const [selectedSeriesId, setSelectedSeriesId] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const availableSeries =
    series.filter(
      (show) =>
        !sections.some(
          (section) =>
            section.section_type ===
              "series" &&
            section.source_id === show.id
        )
    );

  async function moveSection(
    index: number,
    direction: -1 | 1
  ) {
    const target =
      index + direction;

    if (
      target < 0 ||
      target >= sections.length
    ) {
      return;
    }

    const reordered =
      [...sections];

    [
      reordered[index],
      reordered[target],
    ] = [
      reordered[target],
      reordered[index],
    ];

    setSections(reordered);

    try {
      setSaving(true);

      await updateHomeSectionOrder(
        reordered
      );

      toast.success(
        "Home order updated."
      );
    } catch (error) {
      setSections(sections);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update order."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(
    section: HomeSectionRecord
  ) {
    const newValue =
      !section.is_visible;

    setSections(
      (current) =>
        current.map((item) =>
          item.id === section.id
            ? {
                ...item,
                is_visible:
                  newValue,
              }
            : item
        )
    );

    try {
      await updateHomeSectionVisibility(
        section.id,
        newValue
      );

      toast.success(
        newValue
          ? "Section is now visible."
          : "Section hidden from Home."
      );
    } catch (error) {
      setSections(
        (current) =>
          current.map((item) =>
            item.id === section.id
              ? {
                  ...item,
                  is_visible:
                    !newValue,
                }
              : item
          )
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update section."
      );
    }
  }

  async function handleAddSeries() {
    const show =
      series.find(
        (item) =>
          item.id ===
          selectedSeriesId
      );

    if (!show) {
      toast.error(
        "Select a show first."
      );
      return;
    }

    try {
      setSaving(true);

      const created =
        await addSeriesToHome(
          show
        );

      setSections(
        (current) => [
          ...current,
          created,
        ]
      );

      setSelectedSeriesId("");

      toast.success(
        `${show.title} added to Home.`
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add show."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(
    section: HomeSectionRecord
  ) {
    if (
      section.section_type !==
      "series"
    ) {
      return;
    }

    try {
      await removeSeriesFromHome(
        section.id
      );

      setSections(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              section.id
          )
      );

      toast.success(
        "Show removed from Home."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove show."
      );
    }
  }

  return (
    <div className="space-y-6">

      {/* ADD SHOW */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-xl font-semibold text-white">
          Add Show to Home
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Select a published show.
          Its landscape or portrait
          format will be used
          automatically.
        </p>

        <div className="mt-5 flex max-w-2xl gap-3">
          <select
            value={
              selectedSeriesId
            }
            onChange={(event) =>
              setSelectedSeriesId(
                event.target.value
              )
            }
            className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-500"
          >
            <option value="">
              Select Show
            </option>

            {availableSeries.map(
              (show) => (
                <option
                  key={show.id}
                  value={show.id}
                >
                  {show.title} —{" "}
                  {show.orientation ===
                  "portrait"
                    ? "9:16"
                    : "16:9"}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            disabled={
              saving ||
              !selectedSeriesId
            }
            onClick={
              handleAddSeries
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[#003B5C] px-5 py-3 font-semibold text-white transition hover:bg-[#004d78] disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />

            Add
          </button>
        </div>
      </section>

      {/* HOME SECTIONS */}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Home Sections
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Control what appears on
            the TV Home screen and
            in what order.
          </p>
        </div>

        <div className="space-y-3">
          {sections.map(
            (section, index) => (
              <div
                key={section.id}
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
              >
                <GripVertical className="h-5 w-5 shrink-0 text-zinc-600" />

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-zinc-400">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white">
                    {section.title}
                  </div>

                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>
                      {
                        section.section_type
                      }
                    </span>

                    <span>•</span>

                    <span>
                      {section.card_format ===
                      "portrait"
                        ? "Portrait 9:16"
                        : "Landscape 16:9"}
                    </span>

                    <span>•</span>

                    <span>
                      {section.is_visible
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={
                    index === 0 ||
                    saving
                  }
                  onClick={() =>
                    moveSection(
                      index,
                      -1
                    )
                  }
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-20"
                  title="Move up"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  disabled={
                    index ===
                      sections.length -
                        1 ||
                    saving
                  }
                  onClick={() =>
                    moveSection(
                      index,
                      1
                    )
                  }
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-20"
                  title="Move down"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleVisibility(
                      section
                    )
                  }
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  title={
                    section.is_visible
                      ? "Hide section"
                      : "Show section"
                  }
                >
                  {section.is_visible ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>

                {section.section_type ===
                "series" ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(
                        section
                      )
                    }
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-950 hover:text-red-400"
                    title="Remove from Home"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}