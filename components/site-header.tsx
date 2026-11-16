"use client";

import Link from "next/link";
import { CloseIcon, PlusIcon, SearchIcon } from "@/components/icons";

type SiteHeaderProps = {
  query?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onClearSearch?: () => void;
};

export function SiteHeader({
  query = "",
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
}: SiteHeaderProps) {
  const controlled = typeof onSearchChange === "function";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-name">
            the market<span className="brand-dot">.</span>
          </span>
          <span className="brand-tagline">buy / sell</span>
        </Link>

        <form
          action="/"
          className={
            controlled && query
              ? "search-form search-form-with-clear"
              : "search-form"
          }
          role="search"
          onSubmit={(event) => {
            if (!onSearchSubmit) {
              return;
            }
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            onSearchSubmit(String(formData.get("q") ?? "").trim());
          }}
        >
          <SearchIcon className="search-icon" />
          <input
            type="search"
            name="q"
            data-testid="search-input"
            defaultValue={controlled ? undefined : query}
            value={controlled ? query : undefined}
            onChange={
              controlled
                ? (event) => onSearchChange(event.target.value)
                : undefined
            }
            placeholder="Search listings"
            aria-label="Search listings"
            className="search-input"
          />
          {controlled && query ? (
            <button
              type="button"
              className="search-clear"
              data-testid="clear-search"
              aria-label="Clear search and filters"
              onClick={onClearSearch}
            >
              <CloseIcon width={16} height={16} />
            </button>
          ) : null}
          <button type="submit" className="search-submit" aria-label="Search">
            <SearchIcon width={16} height={16} />
          </button>
        </form>

        <Link
          href="/sell"
          className="button button-primary header-sell"
          aria-label="Sell something"
        >
          <PlusIcon />
          <span className="header-sell-long">Sell something</span>
          <span className="header-sell-short">Sell</span>
        </Link>
      </div>
    </header>
  );
}
