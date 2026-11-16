# The Market — Stripe Connect

Test 4: the Test 3 marketplace plus Stripe Connect seller onboarding, Buy Now, platform fees, webhook-confirmed orders, and sold listings.

Live: https://my-marketplace-stripe.vercel.app

[Source](https://github.com/Calfredo23/my-marketplace-stripe)

## What it does

- Create a listing with a photo, title, description, price, email, and category.
- Browse all listings, filter by category, search titles and descriptions, and switch grid/list.
- Open a listing detail page and message the seller.
- Connect a seller's email to Stripe Express onboarding.
- Buy Now appears only for active listings whose seller completed onboarding.
- Checkout is a direct charge on the seller's connected account with a 10% platform fee.
- The webhook marks the order paid and the listing sold. The success page shows the order.

## Supabase setup

The Marketplace project from Test 3 is reused. Run `supabase/schema.sql`, `supabase/storage.sql`, and `supabase/demo-listings.sql` if starting fresh, then run `supabase/stripe.sql` for the Test 4 tables.

Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. It is used for seller accounts, orders, and status updates.

## Stripe setup

Use the sandbox keys from the challenge. Never commit them.

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_WEBHOOK_URL=https://your-production-url.vercel.app/api/stripe/webhook
STRIPE_PLATFORM_FEE_PERCENT=10
```

1. Deploy the app.
2. Run `npm run stripe:webhook` once. It prints the Connect webhook signing secret.
3. Add that value as `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy.
4. Open `/stripe`, enter the email used on a listing, and finish Stripe's test onboarding.

## Seller onboarding

There is no login. A seller enters the email attached to their listing on `/stripe`. The server creates an Express account, stores the connected account ID, and sends them to Stripe's hosted onboarding.

After onboarding, every active listing with that email shows Buy Now. Listings from sellers who have not connected Stripe stay visible but cannot be purchased.

## Local testing

```bash
npm run verify
npm run test:e2e
```

For webhooks locally, use the Stripe CLI:

```bash
stripe listen --api-key $STRIPE_SECRET_KEY --forward-connect-to localhost:3000/api/stripe/webhook
```

Use `4242 4242 4242 4242`, any future expiry, any CVC, and any ZIP in Stripe Checkout.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run stripe:webhook
npm run verify
```

## License

MIT © Cedrick Alfredo Catimbang
