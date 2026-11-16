import type Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function syncSellerAccount(account: Stripe.Account) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return;
  }

  const onboardingComplete = Boolean(
    account.details_submitted &&
      account.charges_enabled &&
      account.payouts_enabled,
  );

  await admin
    .from("seller_accounts")
    .update({
      onboarding_complete: onboardingComplete,
      charges_enabled: Boolean(account.charges_enabled),
      payouts_enabled: Boolean(account.payouts_enabled),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_account_id", account.id);
}
