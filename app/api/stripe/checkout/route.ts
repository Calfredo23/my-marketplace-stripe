import { NextResponse } from "next/server";
import { getStripe, platformFeeCents } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let payload: { listingId?: unknown };
  try {
    payload = (await request.json()) as { listingId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const listingId =
    typeof payload.listingId === "string" ? payload.listingId : "";
  if (!listingId) {
    return NextResponse.json({ error: "Missing listing." }, { status: 400 });
  }

  const stripe = getStripe();
  const admin = getSupabaseAdminClient();
  if (!stripe || !admin) {
    return NextResponse.json(
      { error: "Stripe or the database is not configured." },
      { status: 503 },
    );
  }

  const { data: listing, error: listingError } = await admin
    .from("listings")
    .select("id,title,price,email,image_url,status")
    .eq("id", listingId)
    .maybeSingle();

  if (listingError) {
    console.error("Checkout listing lookup failed:", listingError.message);
    return NextResponse.json(
      { error: "The listing couldn't be read." },
      { status: 500 },
    );
  }
  if (!listing || listing.status !== "active") {
    return NextResponse.json(
      { error: "This listing isn't available." },
      { status: 400 },
    );
  }

  const { data: seller, error: sellerError } = await admin
    .from("seller_accounts")
    .select("stripe_account_id,onboarding_complete,charges_enabled")
    .eq("email", listing.email)
    .maybeSingle();

  if (sellerError) {
    console.error("Checkout seller lookup failed:", sellerError.message);
    return NextResponse.json(
      { error: "The seller couldn't be read." },
      { status: 500 },
    );
  }
  if (!seller?.onboarding_complete || !seller.charges_enabled) {
    return NextResponse.json(
      { error: "This seller hasn't connected Stripe yet." },
      { status: 400 },
    );
  }

  const amountCents = Math.round(Number(listing.price) * 100);
  if (!Number.isFinite(amountCents) || amountCents < 50) {
    return NextResponse.json(
      { error: "This listing can't be purchased online." },
      { status: 400 },
    );
  }

  const feeCents = platformFeeCents(amountCents);
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      listing_id: listing.id,
      listing_title: listing.title,
      seller_email: listing.email,
      seller_account_id: seller.stripe_account_id,
      amount_cents: amountCents,
      platform_fee_cents: feeCents,
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Order insert failed:", orderError?.message);
    return NextResponse.json(
      { error: "The order couldn't be created." },
      { status: 500 },
    );
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: listing.title,
                images: [listing.image_url],
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: feeCents,
        },
        client_reference_id: order.id,
        metadata: {
          order_id: order.id,
          listing_id: listing.id,
        },
        success_url: `${origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/listing/${listing.id}`,
      },
      { stripeAccount: seller.stripe_account_id },
    );

    if (!session.url) {
      throw new Error("Stripe returned no checkout URL.");
    }

    const { error: updateError } = await admin
      .from("orders")
      .update({ checkout_session_id: session.id })
      .eq("id", order.id);

    if (updateError) {
      console.error("Order session update failed:", updateError.message);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    await admin
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);
    console.error(
      "Stripe checkout failed:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Stripe Checkout couldn't start. Check the Stripe setup." },
      { status: 502 },
    );
  }
}
