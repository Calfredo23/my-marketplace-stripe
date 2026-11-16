# BRIEF — The Market (Stripe Connect)

## L0

- What: Test 4 marketplace with Stripe Connect seller onboarding and Checkout.
- Base: Test 3 marketplace, same Supabase project, separate repo/Vercel project.
- Entry: `app/page.tsx`; sell flow `components/sell-form.tsx`; detail
  `app/listing/[id]/page.tsx`; onboarding `app/stripe/page.tsx`; checkout API
  `app/api/stripe/checkout/route.ts`; webhook `app/api/stripe/webhook/route.ts`.
- Run: `npm run dev`. Verify: `npm run verify`; E2E `npm run test:e2e`.
- Env names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `STRIPE_WEBHOOK_URL`, `STRIPE_PLATFORM_FEE_PERCENT`.
- Setup: `supabase/schema.sql`, `storage.sql`, `stripe.sql`, `demo-listings.sql`.
- Webhook: `npm run stripe:webhook` after deploy; save the printed secret in Vercel.
- Never commit `.env.local` or any Stripe key.
