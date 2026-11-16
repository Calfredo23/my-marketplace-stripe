import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyNowButton } from "@/components/buy-now-button";
import { ArrowLeftIcon } from "@/components/icons";
import { MessageSeller } from "@/components/message-seller";
import { Photo } from "@/components/photo";
import { SetupNotice } from "@/components/setup-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  formatListedAt,
  formatPrice,
  initialsFromEmail,
  parseListing,
} from "@/lib/listings";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="site-shell">
        <SiteHeader />
        <main className="site-main container form-page">
          <SetupNotice />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { data, error } = await supabase
    .from("listings")
    .select("id,title,description,price,email,category,image_url,status,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase listing fetch failed:", error.message);
  }

  const listing = parseListing(data);
  if (!listing) {
    notFound();
  }

  let buyable = false;
  const admin = getSupabaseAdminClient();
  if (admin) {
    const { data: seller } = await admin
      .from("seller_accounts")
      .select("onboarding_complete,charges_enabled")
      .eq("email", listing.email)
      .maybeSingle();
    buyable = Boolean(
      seller?.onboarding_complete && seller?.charges_enabled,
    );
  }

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main container detail-page">
        <Link href="/" className="back-link">
          <ArrowLeftIcon />
          Back to listings
        </Link>

        <div className="detail-layout">
          <div className="detail-main">
            <div className="detail-photo">
              <Photo
                src={listing.imageUrl}
                alt={listing.title}
                data-testid="listing-detail-image"
                loading="eager"
              />
            </div>
            <div className="detail-copy">
              <div className="detail-title-row">
                <h1>{listing.title}</h1>
                {listing.status === "sold" ? (
                  <span className="sold-badge">Sold</span>
                ) : null}
              </div>
              <p className="detail-price">{formatPrice(listing.price)}</p>
              <p className="detail-description">{listing.description}</p>
            </div>
          </div>

          <aside className="detail-sidebar">
            <div className="seller-card">
              <div className="seller-avatar">
                {initialsFromEmail(listing.email)}
              </div>
              <div className="seller-meta">
                <p className="seller-label">Seller</p>
                <a href={`mailto:${listing.email}`} className="seller-email">
                  {listing.email}
                </a>
              </div>
            </div>
            <div className="detail-facts">
              <div className="detail-fact">
                <span>Category</span>
                <strong>{listing.category}</strong>
              </div>
              <div className="detail-fact">
                <span>Listed</span>
                <strong>{formatListedAt(listing.createdAt)}</strong>
              </div>
            </div>
            {listing.status === "active" && buyable ? (
              <BuyNowButton listingId={listing.id} />
            ) : null}
            {listing.status === "active" && !buyable ? (
              <p className="payments-note">
                This seller hasn&apos;t connected Stripe yet.
              </p>
            ) : null}
            {listing.status === "sold" ? (
              <p className="payments-note">This item has been sold.</p>
            ) : null}
            <MessageSeller listingId={listing.id} />
            <p className="safety-note">
              Meet in a public place and check the item before paying.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
