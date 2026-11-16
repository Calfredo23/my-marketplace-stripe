# MEASUREMENTS

## Tests

- Vitest: 18 passing (marketplace validation plus platform fee and sold status).
- Playwright: 7 marketplace tests inherited from Test 3. Stripe flows need env and a
  deployed webhook before adding end-to-end coverage.
- Typecheck, lint, build: pass.

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
