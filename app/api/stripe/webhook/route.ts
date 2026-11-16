import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripe = getStripe();
  const admin = getSupabaseAdminClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !admin || !secret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    console.error(
      "Stripe webhook signature failed:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "account.updated") {
    return NextResponse.json({ received: true });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  let order = null;
  if (
    session.client_reference_id &&
    /^[0-9a-f-]{36}$/i.test(session.client_reference_id)
  ) {
    const { data } = await admin
      .from("orders")
      .select("id,listing_id,seller_account_id,status")
      .eq("id", session.client_reference_id)
      .maybeSingle();
    order = data;
  }

  if (!order) {
    const { data } = await admin
      .from("orders")
      .select("id,listing_id,seller_account_id,status")
      .eq("checkout_session_id", session.id)
      .maybeSingle();
    order = data;
  }

  if (!order) {
    return NextResponse.json({ received: true });
  }

  if (event.account && order.seller_account_id !== event.account) {
    return NextResponse.json({ received: true });
  }

  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : null;
  const now = new Date().toISOString();

  const { error: orderError } = await admin
    .from("orders")
    .update({
      status: "paid",
      paid_at: now,
      checkout_session_id: session.id,
      payment_intent_id: paymentIntent,
      buyer_email: session.customer_details?.email ?? null,
    })
    .eq("id", order.id);

  if (orderError) {
    console.error("Order update failed:", orderError.message);
    return NextResponse.json(
      { error: "The order couldn't be updated." },
      { status: 500 },
    );
  }

  const { error: listingError } = await admin
    .from("listings")
    .update({ status: "sold", sold_at: now })
    .eq("id", order.listing_id)
    .eq("status", "active");

  if (listingError) {
    console.error("Listing sold update failed:", listingError.message);
    return NextResponse.json(
      { error: "The listing couldn't be marked sold." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
