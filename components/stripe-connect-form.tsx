"use client";

import { useState, type FormEvent } from "react";

export function StripeConnectForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url) {
        setError(result.error ?? "Stripe onboarding couldn't start.");
        setLoading(false);
        return;
      }
      window.location.assign(result.url);
    } catch {
      setError("Stripe onboarding couldn't start. Try again.");
      setLoading(false);
    }
  }

  return (
    <form className="panel form-card stripe-card" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="stripe-email">Email on your listing</label>
        <input
          id="stripe-email"
          data-testid="stripe-email"
          className="input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <p className="field-help">
          Use the same email you entered when you created the listing. No login
          is needed.
        </p>
      </div>

      {error ? (
        <p className="form-error" role="alert" data-testid="stripe-error">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="button button-primary"
        data-testid="connect-stripe"
        disabled={loading}
      >
        {loading ? "Opening Stripe..." : "Connect with Stripe"}
      </button>

      <p className="stripe-fine-print">
        You&apos;ll finish onboarding on Stripe. This uses Stripe&apos;s test
        mode, so no real money moves.
      </p>
    </form>
  );
}
