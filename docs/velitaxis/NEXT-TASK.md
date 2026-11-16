# NEXT TASK

## Task ID

TASK-0002

## Title

The Market — Test 4 Stripe Connect

## Objective

Add seller Stripe onboarding, Buy Now Checkout, a 10% platform fee, a Connect webhook, order
records, and sold listings to the Test 3 marketplace, then deploy and submit.

## Status

Schema and application code are written. Local env, Vercel env, webhook registration, seller
onboarding, and a real test purchase are still pending.

## Next action

1. Screenshot the paid `orders` row in Supabase.
2. Submit at `apply.capm.us` choosing **4) Stripe Connect**.
3. Include the webhook-limit note in the reviewer notes.

## Acceptance criteria

1. Seller can click Connect with Stripe and finish test onboarding.
2. Onboarded seller's listings show Buy Now and open Checkout.
3. Test payment succeeds and seller receives the amount minus 10%.
4. Success page, order row, and Sold listing state are visible.
