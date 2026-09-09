"use client";

import { useState } from "react";
import { toast } from "sonner";
import { bibleBooks } from "@/lib/bible-books";

type BibleResponse = {
  ok: boolean;
  translation?: string;
  reference?: string;
  text?: string;
  error?: string;
};

export function WatchDailyForm() {
  const [contentDate, setContentDate] = useState("");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verseStart, setVerseStart] = useState("");
  const [verseEnd, setVerseEnd] = useState("");

  const [referenceEn, setReferenceEn] = useState("");
  const [verseTextEn, setVerseTextEn] = useState("");

  const [loadingBible, setLoadingBible] = useState(false);

  async function fetchNKJV() {
    if (!book || !chapter || !verseStart) {
      toast.error("Select a book, chapter, and starting verse.");
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
                setReferenceEn("");
                setVerseTextEn("");
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
                setReferenceEn("");
                setVerseTextEn("");
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
                setReferenceEn("");
                setVerseTextEn("");
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
                setReferenceEn("");
                setVerseTextEn("");
              }}
              placeholder="Optional"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-sky-600"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={fetchNKJV}
          disabled={loadingBible}
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
    </div>
  );
}
