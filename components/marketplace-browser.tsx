"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { ListingsView } from "@/components/listings-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  browseHref,
  type Category,
  type Listing,
} from "@/lib/listings";

export function MarketplaceBrowser({
  initialListings,
  initialCategory,
  initialQuery,
  initialError,
  buyableSellerEmails,
}: {
  initialListings: readonly Listing[];
  initialCategory: Category | null;
  initialQuery: string;
  initialError: string | null;
  buyableSellerEmails: readonly string[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const deferredQuery = useDeferredValue(query);

  const visibleListings = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    const filtered = initialListings.filter((listing) => {
      if (category && listing.category !== category) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return (
        listing.title.toLowerCase().includes(needle) ||
        listing.description.toLowerCase().includes(needle)
      );
    });

    return [...filtered].sort((left, right) => {
      const leftBuyable =
        left.status === "active" && buyableSellerEmails.includes(left.email);
      const rightBuyable =
        right.status === "active" && buyableSellerEmails.includes(right.email);

      if (leftBuyable !== rightBuyable) {
        return leftBuyable ? -1 : 1;
      }
      if (left.status !== right.status) {
        return left.status === "active" ? -1 : 1;
      }
      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    });
  }, [initialListings, category, deferredQuery, buyableSellerEmails]);

  useEffect(() => {
    window.history.replaceState(null, "", browseHref(category, query));
  }, [category, query]);

  const filtered = Boolean(category || query.trim());
  const heading = query.trim()
    ? category
      ? `${category} results for “${query.trim()}”`
      : `Results for “${query.trim()}”`
    : category ?? "Find something good.";

  function resetFilters() {
    setQuery("");
    setCategory(null);
  }

  return (
    <div className="site-shell">
      <SiteHeader
        query={query}
        onSearchChange={setQuery}
        onSearchSubmit={(value) => setQuery(value.trim())}
        onClearSearch={() => {
          setQuery("");
          setCategory(null);
        }}
      />

      <main className="site-main container">
        <section className="page-intro">
          <div className="page-intro-head">
            <h1>{heading}</h1>
            {filtered ? (
              <button
                type="button"
                className="text-action"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            ) : null}
          </div>
          <p className="page-copy">
            Buy from people nearby, sell what you no longer need, and keep good
            things moving.
          </p>
        </section>

        <CategoryTabs active={category} onSelect={setCategory} />

        {initialError ? (
          <div className="error-panel" role="alert">
            <p className="error-panel-title">The marketplace could not load.</p>
            <p className="error-panel-copy">{initialError}</p>
          </div>
        ) : (
          <ListingsView
            listings={visibleListings}
            buyableSellerEmails={buyableSellerEmails}
            onReset={resetFilters}
            filtered={filtered}
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
