"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { CameraIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { listingErrorMessage, storageErrorMessage } from "@/lib/errors";
import {
  IMAGE_BUCKET,
  IMAGE_ACCEPT,
  imageFileError,
  imageObjectName,
} from "@/lib/images";
import {
  CATEGORIES,
  listingErrors,
  normalizeText,
  type ListingErrors,
} from "@/lib/listings";
import { getSupabaseClient } from "@/lib/supabase/client";

const initialFields = {
  title: "",
  description: "",
  price: "",
  email: "",
  category: "",
};

export function SellForm() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<ListingErrors>({});
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(key: keyof typeof initialFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setFormError(null);
  }

  function validateField(key: keyof ListingErrors) {
    const nextErrors = listingErrors(fields);
    setErrors((current) => ({ ...current, [key]: nextErrors[key] }));
  }

  function clearImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function pickFile(file: File | null) {
    if (!file) {
      clearImage();
      setImageError(null);
      return;
    }
    const nextError = imageFileError(file);
    if (nextError) {
      clearImage();
      setImageError(nextError);
      return;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError(null);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = listingErrors(fields);
    setErrors(nextErrors);

    if (!image) {
      setImageError("Add a photo for the listing.");
    }
    if (Object.keys(nextErrors).length > 0 || !image) {
      setFormError("Check the highlighted fields and try again.");
      return;
    }
    if (!supabase) {
      setFormError("Supabase is not configured. Add the environment variables.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const objectName = imageObjectName(image.type);
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(objectName, image, {
        contentType: image.type,
        cacheControl: "31536000",
      });

    if (uploadError) {
      setSubmitting(false);
      setFormError(storageErrorMessage(uploadError.message));
      return;
    }

    const imageUrl = supabase.storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(objectName).data.publicUrl;

    const { data, error } = await supabase
      .from("listings")
      .insert({
        title: normalizeText(fields.title),
        description: normalizeText(fields.description),
        price: Number(fields.price),
        email: fields.email.trim().toLowerCase(),
        category: fields.category,
        image_url: imageUrl,
      })
      .select("id")
      .single();

    if (error) {
      await supabase.storage.from(IMAGE_BUCKET).remove([objectName]);
      setSubmitting(false);
      setFormError(listingErrorMessage(error.message));
      return;
    }

    if (!data?.id) {
      setSubmitting(false);
      setFormError("The listing was saved but the response was incomplete.");
      return;
    }

    router.push(`/listing/${data.id}`);
    router.refresh();
  }

  return (
    <section className="container form-page">
      <div className="seller-connect-banner">
        <div>
          <strong>Getting paid?</strong>
          <p>Connect Stripe so buyers can use Buy Now.</p>
        </div>
        <Link href="/stripe" className="button button-secondary">
          Connect with Stripe
        </Link>
      </div>

      <div className="form-heading">
        <p className="eyebrow">New listing</p>
        <h1>Sell something</h1>
        <p className="page-copy">
          Add a clear photo and a few details. Buyers will message you through
          the listing.
        </p>
      </div>

      <form className="panel form-card" onSubmit={handleSubmit} noValidate>
        <div className="photo-field">
          <label className={previewUrl ? "photo-drop photo-drop-filled" : "photo-drop"}>
            {previewUrl ? (
              <Photo
                src={previewUrl}
                alt="Selected listing photo"
                className="photo-preview-image"
                loading="eager"
              />
            ) : (
              <span className="photo-drop-inner">
                <CameraIcon width={28} height={28} />
                <span className="photo-drop-title">Add a photo</span>
                <span className="photo-drop-hint">
                  JPEG, PNG, or WebP, up to 5 MB
                </span>
              </span>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              data-testid="listing-photo"
              className="sr-only"
              disabled={submitting}
              onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
            />
          </label>
          {previewUrl ? (
            <button
              type="button"
              className="photo-remove"
              data-testid="remove-listing-photo"
              onClick={() => {
                clearImage();
                setImageError(null);
              }}
            >
              Remove photo
            </button>
          ) : null}
          {imageError ? (
            <p className="field-error" data-testid="listing-photo-error">
              {imageError}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="listing-title">Title</label>
          <input
            id="listing-title"
            name="title"
            data-testid="listing-title-input"
            className="input"
            value={fields.title}
            onChange={(event) => updateField("title", event.target.value)}
            onBlur={() => validateField("title")}
            maxLength={80}
            placeholder="What are you selling?"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? <p className="field-error">{errors.title}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="listing-category">Category</label>
          <select
            id="listing-category"
            name="category"
            data-testid="listing-category"
            className="input"
            value={fields.category}
            onChange={(event) => updateField("category", event.target.value)}
            onBlur={() => validateField("category")}
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Choose one</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className="field-error">{errors.category}</p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="listing-price">Price</label>
          <div className="input-prefix-wrap">
            <span className="input-prefix">$</span>
            <input
              id="listing-price"
              name="price"
              data-testid="listing-price-input"
              className="input input-with-prefix"
              type="number"
              inputMode="decimal"
              min="0"
              max="1000000"
              step="0.01"
              value={fields.price}
              onChange={(event) => updateField("price", event.target.value)}
              onBlur={() => validateField("price")}
              placeholder="0"
              aria-invalid={Boolean(errors.price)}
            />
          </div>
          <p className="field-help">Use 0 for free items.</p>
          {errors.price ? <p className="field-error">{errors.price}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="listing-email">Your email</label>
          <input
            id="listing-email"
            name="email"
            data-testid="listing-email"
            className="input"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => validateField("email")}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          <p className="field-help">
            Shown on the listing so buyers can reach you.
          </p>
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="listing-description">Description</label>
          <textarea
            id="listing-description"
            name="description"
            data-testid="listing-description"
            className="input textarea"
            rows={6}
            value={fields.description}
            onChange={(event) => updateField("description", event.target.value)}
            onBlur={() => validateField("description")}
            maxLength={2000}
            placeholder="Condition, size, pickup details, anything a buyer should know."
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? (
            <p className="field-error">{errors.description}</p>
          ) : null}
        </div>

        {formError ? (
          <p className="form-error" role="alert" data-testid="sell-error">
            {formError}
          </p>
        ) : null}

        <div className="form-actions">
          <Link href="/" className="button button-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="button button-primary"
            data-testid="publish-listing"
            disabled={submitting}
          >
            {submitting ? "Publishing..." : "Publish listing"}
          </button>
        </div>
      </form>
    </section>
  );
}
