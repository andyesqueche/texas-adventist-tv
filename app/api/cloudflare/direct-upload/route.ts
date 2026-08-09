import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CLOUDFLARE_API_URL =
  "https://api.cloudflare.com/client/v4";

export async function POST(request: NextRequest) {
  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID;

  const apiToken =
    process.env.CLOUDFLARE_STREAM_TOKEN;

  if (!accountId || !apiToken) {
    return NextResponse.json(
      {
        error:
          "Cloudflare Stream credentials are missing.",
      },
      {
        status: 500,
      }
    );
  }

  const uploadLength =
    request.headers.get("upload-length");

  const uploadMetadata =
    request.headers.get("upload-metadata");

  if (!uploadLength) {
    return NextResponse.json(
      {
        error:
          "Upload-Length header is required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const response = await fetch(
      `${CLOUDFLARE_API_URL}/accounts/${accountId}/stream?direct_user=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Tus-Resumable": "1.0.0",
          "Upload-Length": uploadLength,
          ...(uploadMetadata
            ? {
                "Upload-Metadata": uploadMetadata,
              }
            : {}),
        },
        cache: "no-store",
      }
    );

    const location =
      response.headers.get("location");

    const streamMediaId =
      response.headers.get("stream-media-id");

    if (!response.ok || !location) {
      const responseText =
        await response.text();

      console.error(
        "CLOUDFLARE TUS ERROR:",
        responseText
      );

      return NextResponse.json(
        {
          error:
            responseText ||
            "Cloudflare did not create the upload.",
        },
        {
          status: response.status,
        }
      );
    }

    const headers = new Headers({
      Location: location,
      "Tus-Resumable": "1.0.0",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Expose-Headers":
        "Location, Stream-Media-Id",
    });

    if (streamMediaId) {
      headers.set(
        "Stream-Media-Id",
        streamMediaId
      );
    }

    return new NextResponse(null, {
      status: 201,
      headers,
    });
  } catch (error) {
    console.error(
      "CLOUDFLARE CONNECTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to connect to Cloudflare.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Expose-Headers":
        "Location, Stream-Media-Id",
    },
  });
}