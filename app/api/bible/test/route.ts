import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NKJV_BIBLE_ID = "63097d2a0a2f7db3-01";

export async function GET() {
  try {
    const apiKey = process.env.API_BIBLE_KEY;
    const baseUrl =
      process.env.API_BIBLE_BASE_URL || "https://rest.api.bible/v1";

    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "API_BIBLE_KEY is not configured",
        },
        { status: 500 }
      );
    }

    const passageId = "JOS.1.9";

    const response = await fetch(
      `${baseUrl}/bibles/${NKJV_BIBLE_ID}/passages/${passageId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`,
      {
        method: "GET",
        headers: {
          "api-key": apiKey,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: response.status,
          apiBibleResponse: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      bible: "NKJV",
      bibleId: NKJV_BIBLE_ID,
      reference: data?.data?.reference,
      content: data?.data?.content,
    });
  } catch (error) {
    console.error("API.Bible passage test error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
