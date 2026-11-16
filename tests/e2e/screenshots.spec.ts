import { mkdir } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const OUT = process.env.SCREENSHOT_OUT ?? "submission/screenshots";

test("capture marketplace screenshots", async ({ browser }) => {
  test.setTimeout(90_000);
  await mkdir(OUT, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");

  if (await page.getByTestId("setup-notice").isVisible()) {
    test.skip(true, "Supabase environment variables are not set");
  }
  if ((await page.getByTestId("listing-card").count()) === 0) {
    test.skip(true, "Seed demo listings before capturing screenshots");
  }

  await expect(page.getByTestId("listing-card").first()).toBeVisible();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/market-home-desktop.png`, fullPage: true });

  await page.getByTestId("listing-title").first().click();
  await expect(page.getByTestId("listing-detail-image")).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/market-detail-desktop.png`, fullPage: true });

  await page.goto("/sell");
  await expect(page.getByTestId("publish-listing")).toBeVisible();
  await page.screenshot({ path: `${OUT}/market-sell-desktop.png`, fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByTestId("listing-card").first()).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/market-home-mobile.png`, fullPage: true });

  await page.getByTestId("listing-title").first().click();
  await expect(page.getByTestId("listing-detail-image")).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/market-detail-mobile.png`, fullPage: true });

  await page.goto("/sell");
  await expect(page.getByTestId("publish-listing")).toBeVisible();
  await page.screenshot({ path: `${OUT}/market-sell-mobile.png`, fullPage: true });

  await context.close();
});
