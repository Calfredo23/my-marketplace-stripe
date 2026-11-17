# LOG

## 2026-11-16 — Test 4 scaffolded

- Mode: QUALITY. New `marketplace-stripe` repo cloned from Test 3; Test 3 stays separate.
- Applied additive Stripe schema to the existing Marketplace Supabase project:
  `listings.status`/`sold_at`, `seller_accounts`, `orders`.
- Added Stripe server libs, admin client, Connect onboarding routes, Checkout direct charges
  with a 10% application fee, Connect webhook, success page, Buy Now gating, and sold states.
- Added `/stripe`, `/stripe/return`, `/sell` connect banner, footer payouts link, and the
  webhook registration script.
- Typecheck, lint, build, and unit tests pass. Stripe onboarding and payment are pending env
  and deployment.
- Next: local/Vercel env, webhook, demo seller onboarding, test payment, screenshots.

## 2026-11-16 — Vercel and Supabase env

- Repo imported to Vercel. Production URL is `https://my-marketplace-stripe.vercel.app`.
- Supabase envs were added, including the new Secret key; the admin client now accepts
  `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY`.
- Updated the canonical fallback and README. Stripe keys and webhook are still pending.

## 2026-11-17 — Onboarding, payment, and screenshots

- Completed Stripe Express onboarding with test data for
  `catimbangcedrickalfredo+stripe@gmail.com`.
- Updated the Sony listing to that seller. Buy Now appeared, Checkout opened, and the
  `4242` card paid $120. The order is paid with a $12 platform fee; the listing is Sold.
- The books and camera listings are active and buyable for the reviewer.
- Captured home, onboarding, connected, checkout, and success screenshots.
- Webhook registration is blocked by the shared sandbox’s 16-endpoint cap; all 16 belong to
  other candidates. The webhook route is implemented; the success page reconciles paid/sold.
- Next: screenshot the Supabase order row and submit with the webhook-limit note.

## 2026-11-17 — Expanded catalog and availability UI

- Added six buyable listings from the onboarded seller: keyboard, planters, speaker, tote,
  lamp, and running shoes.
- Catalog is now 12: 8 buyable, 3 “Payments not enabled,” 1 sold. Buyable listings sort first,
  unavailable next, sold last.
- Added image overlays and grayscale treatment for sold items; unavailable cards show a
  “Payments not enabled” badge.
- Refreshed the live home screenshot. Removed the sold-card body opacity after axe flagged
  contrast; axe now passes.
