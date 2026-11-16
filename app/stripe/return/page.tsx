import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { syncSellerAccount } from "@/lib/stripe-accounts";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

type ReturnPageProps = {
  searchParams: Promise<{ account?: string }>;
};

export default async function StripeReturnPage({
  searchParams,
}: ReturnPageProps) {
  const params = await searchParams;
  const accountId = params.account?.trim();
  const stripe = getStripe();

  if (!accountId || !stripe) {
    return (
      <div className="site-shell">
        <SiteHeader />
        <main className="site-main container form-page">
          <div className="setup-notice">
            <p className="eyebrow">Stripe</p>
            <h1>We couldn&apos;t read that return.</h1>
            <p className="setup-copy">
              Open the payouts page and start the Stripe connection again.
            </p>
            <Link href="/stripe" className="button button-primary">
              Back to payouts
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  let account;
  try {
    account = await stripe.accounts.retrieve(accountId);
    await syncSellerAccount(account);
  } catch {
    return (
      <div className="site-shell">
        <SiteHeader />
        <main className="site-main container form-page">
          <div className="setup-notice">
            <p className="eyebrow">Stripe</p>
            <h1>That account couldn&apos;t be loaded.</h1>
            <p className="setup-copy">
              The account may be incomplete, or the Stripe test keys changed.
            </p>
            <Link href="/stripe" className="button button-primary">
              Try again
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const complete = Boolean(
    account.details_submitted &&
      account.charges_enabled &&
      account.payouts_enabled,
  );

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main container form-page">
        <div className="setup-notice">
          <p className="eyebrow">Stripe</p>
          <h1>{complete ? "Stripe is connected." : "One step left."}</h1>
          <p className="setup-copy">
            {complete
              ? "Your listings with this email can now use Buy Now. Payments go to your connected account."
              : "Stripe saved your account, but onboarding isn't complete yet. Finish it to turn on Buy Now."}
          </p>
          <div className="stripe-return-actions">
            {complete ? (
              <Link href="/sell" className="button button-primary">
                Back to selling
              </Link>
            ) : (
              <Link
                href={`/stripe?email=${encodeURIComponent(account.email ?? "")}`}
                className="button button-primary"
              >
                Finish onboarding
              </Link>
            )}
            <Link href="/" className="button button-secondary">
              Browse listings
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
