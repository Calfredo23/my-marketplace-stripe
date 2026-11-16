# PROJECT MEMORY — The Market (Stripe Connect)

Framework Version: 1.22.1
Current Execution Mode: QUALITY
Project Status: FEATURE_DEVELOPMENT
Lifecycle Stage: 6 — IMPLEMENTATION
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

A separate `marketplace-stripe` repo was cloned from Test 3. The Stripe schema was applied to
the existing Marketplace Supabase project: listing status/sold_at, seller_accounts, and orders.
The app has `/stripe`, `/stripe/return`, `/api/stripe/connect`, `/api/stripe/checkout`,
`/api/stripe/webhook`, and `/purchase/success`, plus Buy Now gating and sold states.

Typecheck, lint, build, and unit tests pass. The new Vercel project is live at
`https://my-marketplace-stripe.vercel.app` and the Supabase envs are connected. The Stripe
keys, webhook secret, seller onboarding, and test purchase are still pending.

## Risks

- Email-only seller identity is spoofable. A confirmation email would fix it, but the brief
  allows email-only and this is a sandbox.
- The Stripe sandbox is shared. The webhook must ignore unknown accounts/orders and return 200.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never reach the browser.
- Direct charges require the connected account to have card payments and payouts enabled.
- The webhook signing secret is for the Connect endpoint, not the platform endpoint.
