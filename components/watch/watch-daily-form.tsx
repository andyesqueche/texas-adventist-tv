"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bibleBooks } from "@/lib/bible-books";
import { createWatchDailyContent } from "@/lib/repositories/watch.repository";

type BibleResponse = {
  ok: boolean;
  translation?: string;
  reference?: string;
  text?: string;
  error?: string;
};

export function WatchDailyForm() {
  const router = useRouter();

  const [contentDate, setContentDate] = useState("");

  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verseStart, setVerseStart] = useState("");
  const [verseEnd, setVerseEnd] = useState("");

  const [referenceEn, setReferenceEn] = useState("");
  const [verseTextEn, setVerseTextEn] = useState("");

  const [prayerTitleEn, setPrayerTitleEn] = useState("");
  const [prayerTextEn, setPrayerTextEn] = useState("");

  const [prayerTitleEs, setPrayerTitleEs] = useState("");
  const [prayerTextEs, setPrayerTextEs] = useState("");

  const [isPublished, setIsPublished] = useState(false);

  const [loadingBible, setLoadingBible] = useState(false);
  const [saving, setSaving] = useState(false);

  function clearFetchedVerse() {
    setReferenceEn("");
    setVerseTextEn("");
  }

  async function fetchNKJV() {
    if (!book || !chapter || !verseStart) {
      toast.error("Select a book, chapter, and starting verse.");
      return;
    }

    const chapterNumber = Number(chapter);
    const startNumber = Number(verseStart);
    const endNumber = verseEnd ? Number(verseEnd) : null;

    if (chapterNumber < 1 || startNumber < 1) {
      toast.error("Chapter and verse must be greater than zero.");
      return;
    }

    if (endNumber !== null && endNumber < startNumber) {
      toast.error("Verse End cannot be before Verse Start.");
      return;
    }

    const params = new URLSearchParams({
      book,
      chapter,
      verseStart,
    });

    if (verseEnd) {
      params.set("verseEnd", verseEnd);
    }

    try {
      setLoadingBible(true);

      const response = await fetch(
        `/api/bible/passage?${params.toString()}`
      );

      const data: BibleResponse = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Unable to retrieve Bible passage."
        );
      }

      setReferenceEn(data.reference ?? "");
      setVerseTextEn(data.text ?? "");

      toast.success("NKJV passage loaded.");
    } catch (error) {
      console.error("FETCH NKJV ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to retrieve Bible passage."
      );
    } finally {
      setLoadingBible(false);
    }
  }

  async function saveDailyContent() {
    if (!contentDate) {
      toast.error("Select a date.");
      return;
    }

    if (!book || !chapter || !verseStart) {
      toast.error("Select the Bible passage.");
      return;
    }

    if (!referenceEn || !verseTextEn) {
      toast.error("Fetch the NKJV passage before saving.");
      return;
    }

    if (!prayerTitleEn.trim() || !prayerTextEn.trim()) {
      toast.error("Enter the English prayer title and prayer.");
      return;
    }

    if (!prayerTitleEs.trim() || !prayerTextEs.trim()) {
      toast.error("Enter the Spanish prayer title and prayer.");
      return;
    }

    const chapterNumber = Number(chapter);
    const startNumber = Number(verseStart);
    const endNumber = verseEnd ? Number(verseEnd) : null;

    if (
      !Number.isInteger(chapterNumber) ||
      !Number.isInteger(startNumber) ||
      chapterNumber < 1 ||
      startNumber < 1
    ) {
      toast.error("Invalid chapter or verse.");
      return;
    }

    if (
      endNumber !== null &&
      (!Number.isInteger(endNumber) || endNumber < startNumber)
    ) {
      toast.error("Invalid ending verse.");
      return;
    }

    try {
      setSaving(true);

      await createWatchDailyContent({
        content_date: contentDate,

        bible_book: book,
        bible_chapter: chapterNumber,
        verse_start: startNumber,
        verse_end: endNumber,

        verse_reference_en: referenceEn,
        verse_reference_es: null,
        verse_text_en: verseTextEn,
        verse_text_es: null,

        prayer_title_en: prayerTitleEn.trim(),
        prayer_title_es: prayerTitleEs.trim(),
        prayer_text_en: prayerTextEn.trim(),
        prayer_text_es: prayerTextEs.trim(),

        is_published: isPublished,
      });

      toast.success(
        isPublished
          ? "Daily content published."
          : "Daily content saved as draft."
      );

      router.push("/admin/watch/daily");
      router.refresh();
    } catch (error) {
      console.error("SAVE DAILY CONTENT ERROR:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to save daily content.";

      if (
        message.toLowerCase().includes("duplicate") ||
        message.toLowerCase().includes("unique")
      ) {
        toast.error("Daily content already exists for this date.");
      } else {
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Daily Content
        </h2>

        <div className="max-w-sm">
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Date
          </label>

          <input
            type="date"
            value={contentDate}
            onChange={(event) => setContentDate(event.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
          />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Bible Verse
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Select the passage to retrieve the official NKJV text.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Book
            </label>

            <select
              value={book}
              onChange={(event) => {
                setBook(event.target.value);
                clearFetchedVerse();
              }}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
            >
              <option value="">Select book</option>

              {bibleBooks.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Chapter
            </label>

            <input
              type="number"
              min="1"
              value={chapter}
              onChange={(event) => {
                setChapter(event.target.value);
                clearFetchedVerse();
              }}
              placeholder="1"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Verse Start
            </label>

            <input
              type="number"
              min="1"
              value={verseStart}
              onChange={(event) => {
                setVerseStart(event.target.value);
                clearFetchedVerse();
              }}
              placeholder="1"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Verse End
            </label>

            <input
              type="number"
              min="1"
              value={verseEnd}
              onChange={(event) => {
                setVerseEnd(event.target.value);
                clearFetchedVerse();
              }}
              placeholder="Optional"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={fetchNKJV}
          disabled={loadingBible || saving}
          className="mt-6 rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingBible ? "Loading NKJV..." : "Fetch NKJV"}
        </button>

        {verseTextEn && (
          <div className="mt-6 rounded-lg border border-zinc-800 bg-black/30 p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="font-semibold text-white">
                {referenceEn}
              </h3>

              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400">
                NKJV
              </span>
            </div>

            <p className="leading-7 text-zinc-300">
              {verseTextEn}
            </p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Prayer
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Enter the prayer that will appear with this daily content.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Prayer Title — English
              </label>

              <input
                type="text"
                value={prayerTitleEn}
                onChange={(event) =>
                  setPrayerTitleEn(event.target.value)
                }
                placeholder="Strength for Today"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Prayer — English
              </label>

              <textarea
                rows={7}
                value={prayerTextEn}
                onChange={(event) =>
                  setPrayerTextEn(event.target.value)
                }
                className="w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Prayer Title — Spanish
              </label>

              <input
                type="text"
                value={prayerTitleEs}
                onChange={(event) =>
                  setPrayerTitleEs(event.target.value)
                }
                placeholder="Fortaleza para hoy"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Prayer — Spanish
              </label>

              <textarea
                rows={7}
                value={prayerTextEs}
                onChange={(event) =>
                  setPrayerTextEs(event.target.value)
                }
                className="w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(event) =>
                setIsPublished(event.target.checked)
              }
              className="h-4 w-4"
            />

            <div>
              <div className="font-medium text-white">
                Publish
              </div>

              <div className="text-sm text-zinc-400">
                Published content can be delivered to Texas Adventist Watch.
              </div>
            </div>
          </label>

          <button
            type="button"
            onClick={saveDailyContent}
            disabled={saving || loadingBible}
            className="rounded-md bg-sky-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : isPublished
                ? "Publish Daily Content"
                : "Save as Draft"}
          </button>
        </div>
      </section>
    </div>
  );
}
