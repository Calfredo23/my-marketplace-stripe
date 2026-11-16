export const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Sports",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type ListingStatus = "active" | "sold";

export type Listing = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly email: string;
  readonly category: Category;
  readonly imageUrl: string;
  readonly status: ListingStatus;
  readonly createdAt: string;
};

export type ListingField =
  | "title"
  | "description"
  | "price"
  | "email"
  | "category";

export type ListingErrors = Partial<Record<ListingField, string>>;

export type MessageField = "name" | "email" | "body";
export type MessageErrors = Partial<Record<MessageField, string>>;

export const LISTING_LIMIT = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PRICE = 1_000_000;

export function isCategory(value: unknown): value is Category {
  return (
    typeof value === "string" &&
    (CATEGORIES as readonly string[]).includes(value)
  );
}

export function categoryFromParam(value: string | undefined): Category | null {
  return isCategory(value) ? value : null;
}

export function normalizeText(value: string): string {
  return value.replace(/\r\n?/g, "\n").trim();
}

export function searchFromParam(value: string | undefined): string {
  return value?.replace(/\s+/g, " ").trim().slice(0, 80) ?? "";
}

export function listingErrors(input: {
  readonly title: string;
  readonly description: string;
  readonly price: string;
  readonly email: string;
  readonly category: string;
}): ListingErrors {
  const errors: ListingErrors = {};
  const title = normalizeText(input.title);
  const description = normalizeText(input.description);
  const email = input.email.trim();
  const priceText = input.price.trim();

  if (title.length < 3) {
    errors.title = "Give the listing a title with at least 3 characters.";
  } else if (title.length > 80) {
    errors.title = "Keep the title under 80 characters.";
  }

  if (description.length < 10) {
    errors.description = "Add at least 10 characters of description.";
  } else if (description.length > 2000) {
    errors.description = "Keep the description under 2,000 characters.";
  }

  if (priceText.length === 0) {
    errors.price = "Add a price. Use 0 for free items.";
  } else if (!/^\d+(\.\d{1,2})?$/.test(priceText)) {
    errors.price = "Use a number with up to 2 decimal places.";
  } else {
    const price = Number(priceText);
    if (!Number.isFinite(price) || price < 0 || price > MAX_PRICE) {
      errors.price = "Keep the price between 0 and 1,000,000.";
    }
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isCategory(input.category)) {
    errors.category = "Choose a category.";
  }

  return errors;
}

export function messageErrors(input: {
  readonly name: string;
  readonly email: string;
  readonly body: string;
}): MessageErrors {
  const errors: MessageErrors = {};
  const name = normalizeText(input.name);
  const email = input.email.trim();
  const body = normalizeText(input.body);

  if (name.length < 2) {
    errors.name = "Add your name.";
  } else if (name.length > 80) {
    errors.name = "Keep your name under 80 characters.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (body.length < 5) {
    errors.body = "Write at least 5 characters.";
  } else if (body.length > 1000) {
    errors.body = "Keep the message under 1,000 characters.";
  }

  return errors;
}

export function firstError(errors: Record<string, string | undefined>): string | null {
  return Object.values(errors).find((value) => Boolean(value)) ?? null;
}

export function parseListing(value: unknown): Listing | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || row.id.length === 0) {
    return null;
  }
  if (typeof row.title !== "string" || row.title.trim().length < 3) {
    return null;
  }
  if (typeof row.description !== "string" || row.description.trim().length < 10) {
    return null;
  }
  const price =
    typeof row.price === "number" ? row.price : Number(row.price);
  if (!Number.isFinite(price) || price < 0) {
    return null;
  }
  if (typeof row.email !== "string" || !EMAIL_PATTERN.test(row.email.trim())) {
    return null;
  }
  if (!isCategory(row.category)) {
    return null;
  }
  const imageUrl = parseHttpsUrl(row.image_url);
  if (!imageUrl) {
    return null;
  }
  if (typeof row.created_at !== "string") {
    return null;
  }
  if (Number.isNaN(Date.parse(row.created_at))) {
    return null;
  }
  return {
    id: row.id,
    title: row.title.trim(),
    description: row.description.trim(),
    price,
    email: row.email.trim().toLowerCase(),
    category: row.category,
    imageUrl,
    status: row.status === "sold" ? "sold" : "active",
    createdAt: row.created_at,
  };
}

function parseHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export function formatPrice(price: number): string {
  const hasCents = Math.round(price * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatListedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  }).format(date);
}

export function listingPath(id: string): string {
  return `/listing/${id}`;
}

export function browseHref(category: Category | null, query: string): string {
  const params = new URLSearchParams();
  if (category) {
    params.set("category", category);
  }
  if (query.trim()) {
    params.set("q", query.trim());
  }
  const value = params.toString();
  return value ? `/?${value}` : "/";
}

export function initialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || "S";
}
