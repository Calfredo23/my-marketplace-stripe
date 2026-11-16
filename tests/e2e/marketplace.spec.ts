import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function requireSupabase(page: Page) {
  await page.goto("/");
  if (await page.getByTestId("setup-notice").isVisible()) {
    test.skip(true, "Supabase environment variables are not set");
  }
  await expect(page.getByRole("heading", { name: "Find something good." })).toBeVisible();
}

test("the marketplace renders its shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /the market/i })).toBeVisible();
  await expect(page.getByTestId("search-input")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /sell something/i }).first(),
  ).toBeVisible();
});

test("the marketplace has no axe violations", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  }
});

test("the opening page has no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto("/");
  await expect(page.getByRole("link", { name: /the market/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test("layouts fit 360, 768 and 1440 without horizontal scroll", async ({
  page,
}) => {
  for (const width of [320, 360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const report = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(report.scrollWidth).toBeLessThanOrEqual(report.innerWidth + 1);
  }
});

test("search and category filters update without a page reload", async ({
  page,
}) => {
  let documentRequests = 0;
  page.on("request", (request) => {
    if (request.resourceType() === "document") {
      documentRequests += 1;
    }
  });

  await requireSupabase(page);
  const afterLoad = documentRequests;

  await page.getByTestId("search-input").fill("sofa");
  await expect(page.getByTestId("listing-count")).toHaveText("1 listing");
  await expect(page).toHaveURL(/q=sofa/);

  await page.getByRole("button", { name: "Furniture" }).click();
  await expect(page.getByTestId("listing-count")).toHaveText("1 listing");
  await page.getByTestId("clear-search").click();
  await expect(page.getByTestId("listing-count")).toHaveText("6 listings");

  await page.getByRole("button", { name: "All" }).click();
  await expect(page.getByTestId("listing-count")).toHaveText("6 listings");
  expect(documentRequests).toBe(afterLoad);
});

test.describe("Supabase flow", () => {
  test("a listing can be created, found, and messaged", async ({ page }) => {
    await requireSupabase(page);
    const title = `E2E Market Test ${Date.now()}`;
    const email = "e2e@themarket.test";

    await page.goto("/sell");
    await page.getByTestId("listing-photo").setInputFiles({
      name: "listing.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nC8AAAAASUVORK5CYII=",
        "base64",
      ),
    });
    await expect(page.getByRole("img", { name: "Selected listing photo" })).toBeVisible();
    await page.getByTestId("listing-title-input").fill(title);
    await page.getByTestId("listing-category").selectOption("Electronics");
    await page.getByTestId("listing-price-input").fill("125.50");
    await page.getByTestId("listing-email").fill(email);
    await page
      .getByTestId("listing-description")
      .fill("A small test listing with enough description to pass validation.");
    await page.getByTestId("publish-listing").click();

    await expect(page).toHaveURL(/\/listing\//);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.getByTestId("listing-detail-image")).toBeVisible();

    await page.getByTestId("message-seller").click();
    await page.getByTestId("buyer-name").fill("Test Buyer");
    await page.getByTestId("buyer-email").fill("buyer@example.com");
    await page.getByTestId("buyer-message").fill("Is this still available?");
    await page.getByTestId("send-message").click();
    await expect(page.getByTestId("message-sent")).toBeVisible();
    await expect(page.getByTestId("message-email-status")).toBeVisible();

    await page.goto(`/?q=${encodeURIComponent(title)}`);
    await expect(page.getByTestId("listing-title").first()).toHaveText(title);
  });
});
