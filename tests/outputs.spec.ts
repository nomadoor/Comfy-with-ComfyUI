import { test, expect } from "./support/test";

test.describe("Output examples", () => {
  test("render as a tray with the Outputs label and their media", async ({ page }) => {
    await page.goto("/ja/basic-workflows/scail-2/");
    const tray = page.locator(".outputs").first();
    await expect(tray.locator(".outputs__label")).toHaveText("Outputs");
    await expect(tray.locator(".outputs__icon svg")).toHaveCount(1);
    expect(await tray.locator(".article-media-row").count()).toBeGreaterThan(0);
    await expect(page.locator(".article-body strong").filter({ hasText: /^出力例$/ })).toHaveCount(0);
  });

  test("the label stays out of the table of contents", async ({ page }) => {
    await page.goto("/ja/basic-workflows/scail-2/");
    await expect(page.locator(".toc")).not.toContainText("Outputs");
  });
});
