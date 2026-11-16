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

1. Copy the Test 3 `.env.local` values into `marketplace-stripe/.env.local`; add the Stripe
   test keys, `SUPABASE_SERVICE_ROLE_KEY`, and `STRIPE_WEBHOOK_URL`.
2. Create the public `my-marketplace-stripe` repo and Vercel project; add the same env names.
3. Deploy, register the Connect webhook, add `STRIPE_WEBHOOK_SECRET`, redeploy.
4. Onboard a demo seller with a real inbox, test `4242 4242 4242 4242`, verify order + sold,
   capture screenshots, and submit at `apply.capm.us` choosing 4) Stripe Connect.

## Acceptance criteria

1. Seller can click Connect with Stripe and finish test onboarding.
2. Onboarded seller's listings show Buy Now and open Checkout.
3. Test payment succeeds and seller receives the amount minus 10%.
4. Success page, order row, and Sold listing state are visible.
