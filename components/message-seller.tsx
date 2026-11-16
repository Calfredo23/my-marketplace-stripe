"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CheckIcon, CloseIcon, MessageIcon } from "@/components/icons";
import { messageErrorMessage } from "@/lib/errors";
import { messageErrors, normalizeText, type MessageErrors } from "@/lib/listings";
import { getSupabaseClient } from "@/lib/supabase/client";

const initialFields = {
  name: "",
  email: "",
  body: "",
};

export function MessageSeller({ listingId }: { listingId: string }) {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<MessageErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "sent" | "not_configured" | "failed" | null
  >(null);

  function updateField(key: keyof typeof initialFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = messageErrors(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    if (!supabase) {
      setFormError("Supabase is not configured.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const { error } = await supabase.from("messages").insert({
      listing_id: listingId,
      buyer_name: normalizeText(fields.name),
      buyer_email: fields.email.trim(),
      body: normalizeText(fields.body),
    });

    if (error) {
      setSubmitting(false);
      setFormError(messageErrorMessage(error.message));
      return;
    }

    let nextEmailStatus: "sent" | "not_configured" | "failed" = "failed";
    try {
      const response = await fetch("/api/notify-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          buyerName: normalizeText(fields.name),
          buyerEmail: fields.email.trim(),
          body: normalizeText(fields.body),
        }),
      });
      const result = (await response.json()) as {
        sent?: boolean;
        reason?: string;
      };
      if (result.sent) {
        nextEmailStatus = "sent";
      } else if (result.reason === "not_configured") {
        nextEmailStatus = "not_configured";
      }
    } catch {
      nextEmailStatus = "failed";
    }

    setEmailStatus(nextEmailStatus);
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="message-success" role="status" data-testid="message-sent">
        <CheckIcon />
        <div>
          <p className="message-success-title">
            {emailStatus === "sent" ? "Message sent" : "Message saved"}
          </p>
          <p
            className="message-success-copy"
            data-testid="message-email-status"
          >
            {emailStatus === "sent"
              ? "The seller was emailed and can reply directly."
              : emailStatus === "not_configured"
                ? "The seller can reply to your email. Email notifications are not configured yet."
                : "The seller can reply to your email. The email notification failed, but your message is saved."}
          </p>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        className="button button-primary message-button"
        data-testid="message-seller"
        aria-expanded="false"
        aria-controls="message-seller-form"
        onClick={() => setOpen(true)}
      >
        <MessageIcon />
        Message Seller
      </button>
    );
  }

  return (
    <form
      id="message-seller-form"
      className="message-form"
      onSubmit={handleSubmit}
      noValidate
      data-testid="message-form"
    >
      <div className="message-form-head">
        <div>
          <p className="message-form-title">Message the seller</p>
          <p className="message-form-copy">
            Your message is saved with the listing.
          </p>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Close message form"
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="field">
        <label htmlFor="buyer-name">Your name</label>
        <input
          id="buyer-name"
          name="name"
          data-testid="buyer-name"
          className="input"
          autoComplete="name"
          value={fields.name}
          onChange={(event) => updateField("name", event.target.value)}
          maxLength={80}
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? <p className="field-error">{errors.name}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="buyer-email">Your email</label>
        <input
          id="buyer-email"
          name="email"
          data-testid="buyer-email"
          className="input"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? <p className="field-error">{errors.email}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="buyer-message">Message</label>
        <textarea
          id="buyer-message"
          name="message"
          data-testid="buyer-message"
          className="input textarea"
          rows={4}
          value={fields.body}
          onChange={(event) => updateField("body", event.target.value)}
          maxLength={1000}
          placeholder="Hi, is this still available?"
          aria-invalid={Boolean(errors.body)}
        />
        {errors.body ? <p className="field-error">{errors.body}</p> : null}
      </div>

      {formError ? (
        <p className="form-error" role="alert" data-testid="message-error">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        className="button button-primary message-submit"
        data-testid="send-message"
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
