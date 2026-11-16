"use client";

import { useState } from "react";

export function BuyNowButton({
  listingId,
  compact = false,
}: {
  listingId: string;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url) {
        setError(result.error ?? "Checkout isn't available right now.");
        setLoading(false);
        return;
      }
      window.location.assign(result.url);
    } catch {
      setError("Checkout couldn't start. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className={compact ? "buy-now buy-now-compact" : "buy-now"}>
      <button
        type="button"
        className="button button-primary"
        data-testid="buy-now"
        onClick={buy}
        disabled={loading}
      >
        {loading ? "Opening..." : "Buy now"}
      </button>
      {error ? (
        <p className="buy-now-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
