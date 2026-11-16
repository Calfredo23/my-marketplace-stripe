import { describe, expect, it } from "vitest";
import { platformFeeCents } from "../../lib/stripe";

describe("platform fee", () => {
  it("takes 10 percent and rounds to cents", () => {
    expect(platformFeeCents(10000)).toBe(1000);
    expect(platformFeeCents(2550)).toBe(255);
    expect(platformFeeCents(999)).toBe(100);
  });
});
