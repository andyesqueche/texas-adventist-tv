import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    // First test:
    // Ask API.Bible which Bibles are available to this API key.
    const response = await fetch(`${baseUrl}/bibles`, {
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
          apiBibleResponse: data,
        },
        { status: response.status }
      );
    }

    const bibles = Array.isArray(data?.data)
      ? data.data.map(
          (bible: {
            id?: string;
            name?: string;
            abbreviation?: string;
            language?: {
              id?: string;
              name?: string;
            };
          }) => ({
            id: bible.id,
            name: bible.name,
            abbreviation: bible.abbreviation,
            language: bible.language,
          })
        )
      : [];

    return NextResponse.json({
      ok: true,
      count: bibles.length,
      bibles,
    });
  } catch (error) {
    console.error("API.Bible test error:", error);

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
