import { NextResponse } from "next/server";
import { CONNECT_API_VERSION, getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: { email?: unknown };
  try {
    payload = (await request.json()) as { email?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  const admin = getSupabaseAdminClient();
  if (!stripe || !admin) {
    return NextResponse.json(
      { error: "Stripe or the database is not configured." },
      { status: 503 },
    );
  }

  try {
    const { data: existing, error: lookupError } = await admin
      .from("seller_accounts")
      .select("stripe_account_id")
      .eq("email", email)
      .maybeSingle();

    if (lookupError) {
      console.error("Seller lookup failed:", lookupError.message);
      return NextResponse.json(
        { error: "The seller record couldn't be read." },
        { status: 500 },
      );
    }

    let accountId = existing?.stripe_account_id as string | undefined;

    if (!accountId) {
      const account = await stripe.v2.core.accounts.create(
        {
          contact_email: email,
          display_name: "The Market seller",
          dashboard: "express",
          identity: {
            country: "us",
            entity_type: "individual",
          },
          configuration: {
            merchant: {
              capabilities: {
                card_payments: { requested: true },
              },
            },
          },
          defaults: {
            currency: "usd",
            responsibilities: {
              fees_collector: "application",
              losses_collector: "stripe",
            },
          },
        },
        { apiVersion: CONNECT_API_VERSION },
      );
      accountId = account.id;

      const { error: insertError } = await admin
        .from("seller_accounts")
        .insert({
          email,
          stripe_account_id: accountId,
        });

      if (insertError) {
        console.error("Seller insert failed:", insertError.message);
        return NextResponse.json(
          { error: "The seller record couldn't be saved." },
          { status: 500 },
        );
      }
    }

    const origin = new URL(request.url).origin;
    type OnboardingParams = NonNullable<
      Parameters<
        typeof stripe.v2.core.accountLinks.create
      >[0]["use_case"]["account_onboarding"]
    > & { configurations: string[] };

    const accountOnboarding: OnboardingParams = {
      configurations: ["merchant"],
      refresh_url: `${origin}/stripe?email=${encodeURIComponent(email)}`,
      return_url: `${origin}/stripe/return?account=${accountId}`,
    };

    const link = await stripe.v2.core.accountLinks.create(
      {
        account: accountId,
        use_case: {
          type: "account_onboarding",
          account_onboarding: accountOnboarding,
        },
      },
      { apiVersion: CONNECT_API_VERSION },
    );

    return NextResponse.json({ url: link.url });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown Stripe error.";
    console.error("Stripe onboarding failed:", detail);
    return NextResponse.json(
      {
        error: "Stripe onboarding couldn't start. Check the Stripe keys.",
        detail,
      },
      { status: 502 },
    );
  }
}
