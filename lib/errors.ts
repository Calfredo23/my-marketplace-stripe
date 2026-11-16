function detail(message: string | null | undefined): string | null {
  const value = message?.trim();
  return value && value.length > 0 ? value : null;
}

export function storageErrorMessage(message: string | null | undefined): string {
  const value = detail(message);
  if (!value) {
    return "The photo upload failed and Supabase returned no reason.";
  }
  const text = value.toLowerCase();

  if (text.includes("bucket not found")) {
    return "The listing-images bucket is missing. Run supabase/storage.sql, then try again.";
  }
  if (
    text.includes("row-level security") ||
    text.includes("unauthorized") ||
    text.includes("permission")
  ) {
    return "The photo bucket rejected the upload. Check the Storage insert policy for listing-images.";
  }
  if (
    text.includes("too large") ||
    text.includes("maximum allowed size") ||
    text.includes("payload")
  ) {
    return "The photo is over the 5 MB bucket limit.";
  }
  if (text.includes("mime") || text.includes("content type")) {
    return "The bucket does not allow that file type. Use JPEG, PNG, or WebP.";
  }
  if (text.includes("failed to fetch") || text.includes("network")) {
    return "The upload could not reach Supabase. Check your connection and try again.";
  }

  return `The photo upload failed. Supabase said: ${value}`;
}

export function listingErrorMessage(message: string | null | undefined): string {
  const value = detail(message);
  if (!value) {
    return "The listing wasn't saved and Supabase returned no reason.";
  }
  const text = value.toLowerCase();

  if (text.includes("relation") && text.includes("listings")) {
    return "The listings table is missing. Run supabase/schema.sql, then try again.";
  }
  if (text.includes("row-level security")) {
    return "The listings insert policy rejected this listing.";
  }
  if (text.includes("check constraint")) {
    return "The database rejected one of the listing fields.";
  }

  return `The listing wasn't saved. Supabase said: ${value}`;
}

export function messageErrorMessage(message: string | null | undefined): string {
  const value = detail(message);
  if (!value) {
    return "The message wasn't saved and Supabase returned no reason.";
  }
  const text = value.toLowerCase();

  if (text.includes("relation") && text.includes("messages")) {
    return "The messages table is missing. Run supabase/schema.sql, then try again.";
  }
  if (text.includes("row-level security")) {
    return "The messages insert policy rejected this message.";
  }
  if (text.includes("check constraint")) {
    return "The database rejected one of the message fields.";
  }

  return `The message wasn't saved. Supabase said: ${value}`;
}
