import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  source?: string;
  attribution?: Record<string, string>;
  page?: {
    title?: string;
    path?: string;
    url?: string;
  };
};

export async function POST(request: Request) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "LEAD_WEBHOOK_URL is not configured." },
      { status: 500 },
    );
  }

  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const phone = payload.phone?.trim();

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required." },
      { status: 400 },
    );
  }

  const leadPayload = {
    name,
    phone,
    source: payload.source?.trim() || "cta",
    attribution: payload.attribution ?? {},
    page: payload.page ?? {},
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadPayload),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Webhook returned status ${response.status}.` },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the configured webhook." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
