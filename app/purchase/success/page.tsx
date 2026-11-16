import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

type Order = {
  id: string;
  listing_id: string;
  listing_title: string;
  amount_cents: number;
  currency: string;
  status: "pending" | "paid" | "cancelled";
  seller_account_id: string;
  checkout_session_id: string | null;
};

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim();
  const admin = getSupabaseAdminClient();

  if (!sessionId || !admin) {
    return (
      <div className="site-shell">
        <SiteHeader />
        <main className="site-main container form-page">
          <div className="setup-notice">
            <p className="eyebrow">Order</p>
            <h1>We couldn&apos;t find that order.</h1>
            <p className="setup-copy">
              The payment link may be incomplete. Check your email receipt or
              contact the seller.
            </p>
            <Link href="/" className="button button-primary">
              Back to listings
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { data: initialOrder, error } = await admin
    .from("orders")
    .select(
      "id,listing_id,listing_title,amount_cents,currency,status,seller_account_id,checkout_session_id",
    )
    .eq("checkout_session_id", sessionId)
    .maybeSingle();

  if (error) {
    console.error("Order fetch failed:", error.message);
  }

  let order = initialOrder as Order | null;

  if (order && order.status === "pending" && order.checkout_session_id) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          order.checkout_session_id,
          {},
          { stripeAccount: order.seller_account_id },
        );
        if (session.payment_status === "paid") {
          const now = new Date().toISOString();
          await admin
            .from("orders")
            .update({
              status: "paid",
              paid_at: now,
              payment_intent_id:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : null,
              buyer_email: session.customer_details?.email ?? null,
            })
            .eq("id", order.id);
          await admin
            .from("listings")
            .update({ status: "sold", sold_at: now })
            .eq("id", order.listing_id)
            .eq("status", "active");
          order = { ...order, status: "paid" };
        }
      } catch (reconcileError) {
        console.error(
          "Order reconcile failed:",
          reconcileError instanceof Error
            ? reconcileError.message
            : reconcileError,
        );
      }
    }
  }

  if (!order) {
    return (
      <div className="site-shell">
        <SiteHeader />
        <main className="site-main container form-page">
          <div className="setup-notice">
            <p className="eyebrow">Order</p>
            <h1>We couldn&apos;t find that order.</h1>
            <p className="setup-copy">
              The payment may still be processing. Check again in a moment.
            </p>
            <Link href="/" className="button button-primary">
              Back to listings
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const paid = order.status === "paid";

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main container form-page">
        <div className="success-card" data-testid="purchase-success">
          <p className="eyebrow">Order</p>
          <h1>{paid ? "Payment received." : "Payment is processing."}</h1>
          <p className="page-copy">
            {paid
              ? "The listing is marked as sold. The seller has been paid through Stripe, minus the platform fee."
              : "Stripe accepted the payment. We're waiting for the confirmation to mark the listing as sold."}
          </p>
          <div className="success-summary">
            <span>Item</span>
            <strong>{order.listing_title}</strong>
            <span>Total</span>
            <strong>{formatMoney(order.amount_cents, order.currency)}</strong>
            <span>Status</span>
            <strong>{paid ? "Paid" : "Pending"}</strong>
          </div>
          <div className="success-actions">
            <Link href="/" className="button button-primary">
              Browse more
            </Link>
            <Link
              href={`/listing/${order.listing_id}`}
              className="button button-secondary"
            >
              View listing
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
