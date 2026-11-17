import Link from "next/link";
import { BuyNowButton } from "@/components/buy-now-button";
import { Photo } from "@/components/photo";
import {
  formatListedAt,
  formatPrice,
  listingPath,
  type Listing,
} from "@/lib/listings";

export function ListingCard({
  listing,
  buyable,
}: {
  listing: Listing;
  buyable: boolean;
}) {
  return (
    <article
      className={
        listing.status === "sold"
          ? "listing-card listing-card-sold"
          : buyable
            ? "listing-card"
            : "listing-card listing-card-unavailable"
      }
      data-testid="listing-card"
    >
      <div className="listing-image-wrap">
        <Link
          href={listingPath(listing.id)}
          className="listing-image-link"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Photo
            src={listing.imageUrl}
            alt={listing.title}
            className="listing-image"
            loading="lazy"
          />
        </Link>
        {listing.status === "sold" ? (
          <span className="listing-status listing-status-sold">Sold</span>
        ) : buyable ? null : (
          <span className="listing-status listing-status-unavailable">
            Payments not enabled
          </span>
        )}
      </div>
      <div className="listing-body">
        <p className="listing-price" data-testid="listing-price">
          {formatPrice(listing.price)}
        </p>
        <Link
          href={listingPath(listing.id)}
          className="listing-title"
          data-testid="listing-title"
        >
          {listing.title}
        </Link>
        <div className="listing-meta">
          <span className="category-chip">{listing.category}</span>
          <span className="listing-time">
            {formatListedAt(listing.createdAt)}
          </span>
        </div>
        {listing.status === "active" && buyable ? (
          <BuyNowButton listingId={listing.id} compact />
        ) : null}
      </div>
    </article>
  );
}
