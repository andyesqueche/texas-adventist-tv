import { NextResponse } from "next/server";

export async function GET() {
  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID;

  const apiToken =
    process.env.CLOUDFLARE_API_TOKEN;

  const liveInputId =
    process.env.CLOUDFLARE_LIVE_INPUT_ID;

  const customerCode =
    process.env.NEXT_PUBLIC_CLOUDFLARE_LIVE_HLS_URL
      ?.match(/customer-([^.]+)\.cloudflarestream\.com/)
      ?.[1];

  if (!accountId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "CLOUDFLARE_ACCOUNT_ID is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  if (!apiToken) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "CLOUDFLARE_API_TOKEN is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  if (!liveInputId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "CLOUDFLARE_LIVE_INPUT_ID is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  if (!customerCode) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unable to determine Cloudflare customer code.",
      },
      {
        status: 500,
      }
    );
  }

  const lifecycleURL =
    `https://customer-${customerCode}.cloudflarestream.com/${liveInputId}/lifecycle`;

  try {
    const response = await fetch(
      lifecycleURL,
      {
        method: "GET",
        headers: {
          Authorization:
            `Bearer ${apiToken}`,
        },
        cache: "no-store",
      }
    );

    const text =
      await response.text();

    let data: unknown = null;

    try {
      data = text
        ? JSON.parse(text)
        : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      console.error(
        "CLOUDFLARE LIVE STATUS ERROR:",
        {
          status: response.status,
          statusText:
            response.statusText,
          data,
        }
      );

      return NextResponse.json(
        {
          ok: false,
          status:
            response.status,
          error:
            "Unable to read Cloudflare Live status.",
          cloudflare: data,
        },
        {
          status:
            response.status,
        }
      );
    }

    return NextResponse.json({
      ok: true,
      cloudflare: data,
    });
  } catch (error) {
    console.error(
      "CLOUDFLARE LIVE STATUS FETCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Cloudflare request error.",
      },
      {
        status: 500,
      }
    );
  }
}