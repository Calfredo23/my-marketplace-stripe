import Stripe from "stripe";

let client: Stripe | null = null;

export const PLATFORM_FEE_PERCENT = Number(
  process.env.STRIPE_PLATFORM_FEE_PERCENT ?? "10",
);

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    return null;
  }
  if (!client) {
    client = new Stripe(key);
  }
  return client;
}

export function platformFeeCents(amountCents: number): number {
  return Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));
}
