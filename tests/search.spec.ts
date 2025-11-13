import { test, expect } from "@playwright/test";

const PAGE = "/ja/basic-workflows/sd15-basics/";

test("search dropdown shows localized hits", async ({ page }) => {
  await page.goto(PAGE);
  const input = page.locator("[data-search-input]");
  await input.fill("SD1.5");
  const results = page.locator(".search-result");
  await expect(results).not.toHaveCount(0);
  await expect(results.first()).toContainText("SD1.5");
});
