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

function extractErrorMessage(
  body: unknown,
  fallback: string,
) {
  if (!body || typeof body !== "object") {
    return fallback;
  }

  if ("error" in body && typeof body.error === "string" && body.error.trim()) {
    return body.error.trim();
  }

  if ("message" in body && typeof body.message === "string" && body.message.trim()) {
    return body.message.trim();
  }

  return fallback;
}

function extractLeadId(body: unknown) {
  if (!body || typeof body !== "object") {
    return null;
  }

  if ("leadId" in body && typeof body.leadId === "string" && body.leadId.trim()) {
    return body.leadId.trim();
  }

  if (
    "data" in body &&
    body.data &&
    typeof body.data === "object" &&
    "leadId" in body.data &&
    typeof body.data.leadId === "string" &&
    body.data.leadId.trim()
  ) {
    return body.data.leadId.trim();
  }

  return null;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const webhookToken = process.env.LEAD_WEBHOOK_TOKEN?.trim();
  const redirectUrl = process.env.LEAD_REDIRECT_URL?.trim();

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "LEAD_WEBHOOK_URL is not configured." },
      { status: 500 },
    );
  }

  if (!webhookToken) {
    return NextResponse.json(
      { error: "LEAD_WEBHOOK_TOKEN is not configured." },
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
        Authorization: `Bearer ${webhookToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadPayload),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");

    if (!response.ok) {
      return NextResponse.json(
        {
          error: extractErrorMessage(
            responseBody,
            `Webhook returned status ${response.status}.`,
          ),
          status: response.status,
          response: responseBody,
        },
        { status: 502 },
      );
    }

    const leadId = extractLeadId(responseBody);

    if (!leadId) {
      return NextResponse.json(
        {
          error: "Webhook response did not include leadId.",
          response: responseBody,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      leadId,
      redirectUrl: redirectUrl || null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the configured webhook." },
      { status: 502 },
    );
  }
}
