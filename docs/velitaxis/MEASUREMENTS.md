# MEASUREMENTS

## Tests

- Vitest: 18 passing (marketplace validation plus platform fee and sold status).
- Playwright: 7 marketplace tests inherited from Test 3.
- Live Stripe: onboarding completed, Buy Now → Checkout, `4242` payment succeeded.
- Order: $120.00, platform fee $12.00, status paid.
- Listing: catalog of 12 — 8 buyable active, 3 active without payments, 1 sold.
- Screenshots: home, onboarding, connected, checkout, success. Supabase order row pending.
- Webhook: route implemented; registration blocked by the shared sandbox’s 16-endpoint cap.
- Typecheck, lint, build: pass; axe passes at 390/1440.

## Database

- `seller_accounts`: email, Stripe account ID, onboarding/charges/payouts flags.
- `orders`: listing snapshot, seller/buyer, amount, fee, Checkout session, payment intent,
  status, paid_at.
- `listings`: status active/sold, sold_at.
- RLS enabled on seller_accounts and orders with no public policies; server routes use the
  service role.

## Pending evidence

- Stripe Express onboarding with test data.
- Checkout with 4242 card and 10% application fee.
- Connect webhook signature verification and paid/sold updates.
- Live screenshots: onboarding, checkout, success, order, sold listing.
