import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NKJV_BIBLE_ID = "63097d2a0a2f7db3-01";

function cleanBibleText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.API_BIBLE_KEY;
    const baseUrl =
      process.env.API_BIBLE_BASE_URL || "https://rest.api.bible/v1";

    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Bible API is not configured" },
        { status: 500 }
      );
    }

    const params = request.nextUrl.searchParams;

    const book = params.get("book")?.trim().toUpperCase();
    const chapter = Number(params.get("chapter"));
    const verseStart = Number(params.get("verseStart"));

    const verseEndRaw = params.get("verseEnd");
    const verseEnd =
      verseEndRaw && verseEndRaw.trim() !== ""
        ? Number(verseEndRaw)
        : undefined;

    if (
      !book ||
      !Number.isInteger(chapter) ||
      chapter < 1 ||
      !Number.isInteger(verseStart) ||
      verseStart < 1
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid book, chapter, or verseStart" },
        { status: 400 }
      );
    }

    if (
      verseEnd !== undefined &&
      (!Number.isInteger(verseEnd) || verseEnd < verseStart)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "verseEnd must be greater than or equal to verseStart",
        },
        { status: 400 }
      );
    }

    const passageId =
      verseEnd !== undefined && verseEnd !== verseStart
        ? `${book}.${chapter}.${verseStart}-${book}.${chapter}.${verseEnd}`
        : `${book}.${chapter}.${verseStart}`;

    const apiUrl =
      `${baseUrl}/bibles/${NKJV_BIBLE_ID}/passages/` +
      `${encodeURIComponent(passageId)}` +
      "?content-type=text" +
      "&include-notes=false" +
      "&include-titles=false" +
      "&include-chapter-numbers=false" +
      "&include-verse-numbers=false";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "api-key": apiKey,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: response.status,
          error: "Bible passage could not be retrieved",
          details: data,
        },
        { status: response.status }
      );
    }

    const reference =
      typeof data?.data?.reference === "string"
        ? data.data.reference.trim()
        : "";

    const rawContent =
      typeof data?.data?.content === "string"
        ? data.data.content
        : "";

    return NextResponse.json({
      ok: true,
      translation: "NKJV",
      bibleId: NKJV_BIBLE_ID,
      reference,
      text: cleanBibleText(rawContent),
      selection: {
        book,
        chapter,
        verseStart,
        verseEnd: verseEnd ?? null,
      },
    });
  } catch (error) {
    console.error("Bible passage API error:", error);

    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
