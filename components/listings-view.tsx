"use client";

import Link from "next/link";
import { useState } from "react";
import { GridIcon, ListIcon } from "@/components/icons";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/lib/listings";

export function ListingsView({
  listings,
  buyableSellerEmails,
  onReset,
  filtered,
}: {
  listings: readonly Listing[];
  buyableSellerEmails: readonly string[];
  onReset: () => void;
  filtered: boolean;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (listings.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <p className="empty-title">
          {filtered ? "Nothing matches that search." : "No listings yet."}
        </p>
        <p className="empty-copy">
          {filtered
            ? "Try a different category or clear the filters."
            : "Be the first person to put something up for sale."}
        </p>
        <div className="empty-actions">
          {filtered ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={onReset}
            >
              Clear filters
            </button>
          ) : null}
          <Link className="button button-primary" href="/sell">
            Sell something
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-view">
      <div className="results-bar">
        <p className="results-count" data-testid="listing-count">
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
        </p>
        <div className="view-toggle" role="group" aria-label="Listing view">
          <button
            type="button"
            className={
              view === "grid" ? "view-button view-button-active" : "view-button"
            }
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            onClick={() => setView("grid")}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            className={
              view === "list" ? "view-button view-button-active" : "view-button"
            }
            aria-pressed={view === "list"}
            aria-label="List view"
            onClick={() => setView("list")}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      <div
        className={`listing-collection listing-collection-${view}`}
        data-testid="listing-collection"
        data-view={view}
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            buyable={buyableSellerEmails.includes(listing.email)}
          />
        ))}
      </div>
    </div>
  );
}
