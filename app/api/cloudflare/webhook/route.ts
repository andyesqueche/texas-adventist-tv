import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log(
      "CLOUDFLARE LIVE WEBHOOK:",
      JSON.stringify(body)
    );

    return NextResponse.json({
      ok: true,
      received: true,
      eventType:
        body?.data?.event_type ?? null,
      inputId:
        body?.data?.input_id ?? null,
    });
  } catch (error) {
    console.error(
      "CLOUDFLARE WEBHOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Invalid webhook payload",
      },
      {
        status: 400,
      }
    );
  }
}