# PROJECT MEMORY — The Market (Stripe Connect)

Framework Version: 1.22.1
Current Execution Mode: QUALITY
Project Status: SUBMISSION_READY
Lifecycle Stage: 10 — DELIVERY AND SUBMISSION
Owner: Cedrick Alfredo Catimbang (Calfredo)

## What this is

Test 4 builds on the Test 3 marketplace. Sellers connect a Stripe Express account by
listing email, onboarded sellers get Buy Now, Checkout runs as a direct charge with a 10%
application fee, and a Connect webhook records the order and marks the listing sold.

## Scope

- Seller onboarding by listing email, no login
- Stripe Express hosted onboarding
- Buy Now only for active listings from onboarded sellers
- Direct-charge Checkout with 10% platform fee
- Success page, order row, webhook-confirmed paid state, listing marked sold
- Reuse the Test 3 marketplace UI and Supabase project

## Stack

Next.js 16.4.6 (App Router), React 19.3, TypeScript strict, Tailwind 4,
@supabase/supabase-js 2.119.0, Stripe Node SDK 23.1.0, Vitest, Playwright, axe-core.

## Current state

The app is live at `https://my-marketplace-stripe.vercel.app`. The seller
`catimbangcedrickalfredo+stripe@gmail.com` completed Stripe Express onboarding. The catalog
now has 12 listings: 8 buyable active listings, 3 active listings from a seller without
payments (“Payments not enabled”), and the sold Sony headphones last. The sold order is paid
in Supabase with a $12 platform fee.

Buyable listings are sorted first; unavailable listings follow; sold items are last. Five
final app screenshots are in `submission/screenshots/`: home, onboarding, connected, checkout,
and success. The reviewer still needs to screenshot the Supabase `orders` row.

The webhook route is implemented at `/api/stripe/webhook`, but registration is blocked:
the shared sandbox already has 16 test webhook endpoints, all belonging to other candidates.
I did not delete anyone else's endpoint. The success page reconciles the Checkout session and
marks the order paid and listing sold, so the live purchase flow works without the webhook.

## Risks

- Email-only seller identity is spoofable. A confirmation email would fix it, but the brief
  allows email-only and this is a sandbox.
- The Stripe sandbox is shared. The webhook must ignore unknown accounts/orders and return 200.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never reach the browser.
- Direct charges require the connected account to have card payments and payouts enabled.
- The webhook signing secret is for the Connect endpoint, not the platform endpoint.
