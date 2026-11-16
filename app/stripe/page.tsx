import Link from "next/link";
import { StripeConnectForm } from "@/components/stripe-connect-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

type StripePageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function StripePage({ searchParams }: StripePageProps) {
  const params = await searchParams;
  const initialEmail = params.email?.trim() ?? "";

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main container form-page">
        <div className="form-heading">
          <p className="eyebrow">Seller payouts</p>
          <h1>Get paid on The Market</h1>
          <p className="page-copy">
            Connect a Stripe account to turn on Buy Now for your listings.
          </p>
        </div>

        <StripeConnectForm initialEmail={initialEmail} />

        <p className="stripe-back">
          <Link href="/sell">Back to selling</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
