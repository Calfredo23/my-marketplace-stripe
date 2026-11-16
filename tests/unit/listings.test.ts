import { describe, expect, it } from "vitest";
import {
  browseHref,
  categoryFromParam,
  firstError,
  formatListedAt,
  formatPrice,
  initialsFromEmail,
  isCategory,
  listingErrors,
  messageErrors,
  parseListing,
  searchFromParam,
} from "../../lib/listings";

describe("listing validation", () => {
  const valid = {
    title: "Sony headphones",
    description: "Comfortable headphones with the case and cable.",
    price: "120",
    email: "seller@example.com",
    category: "Electronics",
  };

  it("accepts a complete listing", () => {
    expect(listingErrors(valid)).toEqual({});
  });

  it("reports each missing or invalid field", () => {
    const errors = listingErrors({
      title: "x",
      description: "short",
      price: "abc",
      email: "nope",
      category: "",
    });
    expect(errors.title).toMatch(/3 characters/);
    expect(errors.description).toMatch(/10 characters/);
    expect(errors.price).toMatch(/number/);
    expect(errors.email).toMatch(/valid email/);
    expect(errors.category).toMatch(/category/);
    expect(firstError(errors)).not.toBeNull();
  });

  it("rejects a price above the limit", () => {
    expect(listingErrors({ ...valid, price: "1000001" }).price).toMatch(
      /1,000,000/,
    );
  });
});

describe("message validation", () => {
  it("accepts a complete message", () => {
    expect(
      messageErrors({
        name: "Ced",
        email: "buyer@example.com",
        body: "Is this still available?",
      }),
    ).toEqual({});
  });

  it("reports invalid contact details and a short body", () => {
    const errors = messageErrors({ name: "", email: "nope", body: "hi" });
    expect(errors.name).toMatch(/name/);
    expect(errors.email).toMatch(/valid email/);
    expect(errors.body).toMatch(/5 characters/);
  });
});

describe("parsing and formatting", () => {
  it("parses a valid row and numeric price", () => {
    expect(
      parseListing({
        id: "abc",
        title: "Sony headphones",
        description: "Comfortable headphones with the case and cable.",
        price: "120.00",
        email: "seller@example.com",
        category: "Electronics",
        image_url:
          "https://example.supabase.co/storage/v1/object/public/listing-images/a.jpg",
        created_at: "2026-11-16T10:00:00.000Z",
      }),
    ).toMatchObject({
      id: "abc",
      price: 120,
      category: "Electronics",
      status: "active",
    });
  });

  it("keeps a sold status from the row", () => {
    expect(
      parseListing({
        id: "abc",
        title: "Sony headphones",
        description: "Comfortable headphones with the case and cable.",
        price: "120",
        email: "seller@example.com",
        category: "Electronics",
        image_url: "https://example.com/a.jpg",
        status: "sold",
        created_at: "2026-11-16T10:00:00.000Z",
      })?.status,
    ).toBe("sold");
  });

  it("rejects non-https images and unknown categories", () => {
    const row = {
      id: "abc",
      title: "Sony headphones",
      description: "Comfortable headphones with the case and cable.",
      price: "120",
      email: "seller@example.com",
      category: "Electronics",
      image_url: "http://example.com/a.jpg",
      created_at: "2026-11-16T10:00:00.000Z",
    };
    expect(parseListing(row)).toBeNull();
    expect(
      parseListing({
        ...row,
        category: "Unknown",
        image_url: "https://example.com/a.jpg",
      }),
    ).toBeNull();
  });

  it("formats prices, times, and category helpers", () => {
    expect(formatPrice(0)).toBe("$0");
    expect(formatPrice(120)).toBe("$120");
    expect(formatPrice(1234.5)).toBe("$1,234.50");
    expect(formatListedAt("2026-11-16T10:00:00.000Z")).toBe(
      "Nov 16, 2026, 6:00 PM",
    );
    expect(isCategory("Books")).toBe(true);
    expect(categoryFromParam("Nope")).toBeNull();
    expect(categoryFromParam("Sports")).toBe("Sports");
  });

  it("builds browse links and cleans search input", () => {
    expect(browseHref(null, "")).toBe("/");
    expect(browseHref("Books", "design")).toBe("/?category=Books&q=design");
    expect(searchFromParam("  bike   red  ")).toBe("bike red");
    expect(initialsFromEmail("cedrick.catimbang@example.com")).toBe("CC");
    expect(initialsFromEmail("demo@example.com")).toBe("DE");
  });
});
