import { describe, expect, it } from "vitest";
import {
  listingErrorMessage,
  messageErrorMessage,
  storageErrorMessage,
} from "../../lib/errors";

describe("storage errors", () => {
  it("maps missing bucket and policy failures", () => {
    expect(storageErrorMessage("Bucket not found")).toMatch(/storage.sql/);
    expect(
      storageErrorMessage("new row violates row-level security policy"),
    ).toMatch(/policy/i);
  });

  it("maps size and type failures", () => {
    expect(storageErrorMessage("The object is too large")).toMatch(/5 MB/);
    expect(storageErrorMessage("invalid mime type")).toMatch(/JPEG, PNG, or WebP/);
  });

  it("keeps an unknown reason", () => {
    expect(storageErrorMessage("The resource already exists")).toContain(
      "The resource already exists",
    );
    expect(storageErrorMessage(undefined)).toMatch(/no reason/i);
  });
});

describe("listing errors", () => {
  it("maps missing table and policy failures", () => {
    expect(
      listingErrorMessage('relation "public.listings" does not exist'),
    ).toMatch(/schema.sql/);
    expect(
      listingErrorMessage("new row violates row-level security policy"),
    ).toMatch(/policy/i);
  });

  it("keeps an unknown reason", () => {
    expect(listingErrorMessage("connection reset")).toContain("connection reset");
  });
});

describe("message errors", () => {
  it("maps missing table and policy failures", () => {
    expect(
      messageErrorMessage('relation "public.messages" does not exist'),
    ).toMatch(/schema.sql/);
    expect(
      messageErrorMessage("new row violates row-level security policy"),
    ).toMatch(/policy/i);
  });

  it("keeps an unknown reason", () => {
    expect(messageErrorMessage("timeout")).toContain("timeout");
  });
});
