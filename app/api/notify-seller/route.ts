import { NextResponse } from "next/server";
import { messageErrors } from "@/lib/listings";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type EmailPayload = {
  listingId?: unknown;
  buyerName?: unknown;
  buyerEmail?: unknown;
  body?: unknown;
};

function emailConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim();
  const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return null;
  }
  return { serviceId, templateId, publicKey, privateKey };
}

export async function POST(request: Request) {
  let payload: EmailPayload;
  try {
    payload = (await request.json()) as EmailPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const listingId = typeof payload.listingId === "string" ? payload.listingId : "";
  const buyerName = typeof payload.buyerName === "string" ? payload.buyerName : "";
  const buyerEmail = typeof payload.buyerEmail === "string" ? payload.buyerEmail : "";
  const body = typeof payload.body === "string" ? payload.body : "";

  if (!listingId) {
    return NextResponse.json({ error: "Missing listing." }, { status: 400 });
  }

  const errors = messageErrors({
    name: buyerName,
    email: buyerEmail,
    body,
  });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  const config = emailConfig();
  if (!config) {
    return NextResponse.json({ sent: false, reason: "not_configured" });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { sent: false, reason: "database_unavailable" },
      { status: 503 },
    );
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .select("title,email")
    .eq("id", listingId)
    .maybeSingle();

  if (error) {
    console.error("Seller email listing lookup failed:", error.message);
    return NextResponse.json(
      { sent: false, reason: "listing_lookup_failed" },
      { status: 500 },
    );
  }
  if (!listing || typeof listing.email !== "string") {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  if (
    listing.email.endsWith(".test") ||
    listing.email.endsWith("@example.com")
  ) {
    return NextResponse.json({ sent: false, reason: "test_recipient" });
  }

  const origin = new URL(request.url).origin;
  const templateParams = {
    to_email: listing.email,
    from_name: "The Market",
    reply_to: buyerEmail,
    listing_title: listing.title,
    listing_url: `${origin}/listing/${listingId}`,
    buyer_name: buyerName.trim(),
    buyer_email: buyerEmail.trim(),
    buyer_message: body.trim(),
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      accessToken: config.privateKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(
      "EmailJS send failed:",
      response.status,
      detail.slice(0, 300),
    );
    return NextResponse.json(
      { sent: false, reason: "send_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ sent: true });
}
