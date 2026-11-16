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

1. Add the four Stripe env names to Vercel:
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`,
   `STRIPE_PLATFORM_FEE_PERCENT=10`, and later `STRIPE_WEBHOOK_SECRET`.
2. Set `STRIPE_WEBHOOK_URL=https://my-marketplace-stripe.vercel.app/api/stripe/webhook`.
3. Register the webhook, add its secret, redeploy.
4. Onboard a demo seller with a real inbox, test `4242 4242 4242 4242`, verify order + sold,
   capture screenshots, and submit at `apply.capm.us` choosing 4) Stripe Connect.

## Acceptance criteria

1. Seller can click Connect with Stripe and finish test onboarding.
2. Onboarded seller's listings show Buy Now and open Checkout.
3. Test payment succeeds and seller receives the amount minus 10%.
4. Success page, order row, and Sold listing state are visible.
