import type Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function syncSellerAccount(account: Stripe.V2.Core.Account) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return;
  }

  const cardPayments =
    account.configuration?.merchant?.capabilities?.card_payments;
  const active = cardPayments?.status === "active";

  await admin
    .from("seller_accounts")
    .update({
      onboarding_complete: active,
      charges_enabled: active,
      payouts_enabled: active,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_account_id", account.id);
}
