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
