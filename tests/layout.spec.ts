import { test, expect } from "@playwright/test";

const SAMPLE_PAGE = "/ja/basic-workflows/sd15-basics/";

test.describe("Layout rails", () => {
  test("sidebar and TOC rails stay fixed with proper offsets", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto(SAMPLE_PAGE);

    const sidebarRail = page.locator(".rail--sidebar");
    const tocRail = page.locator(".rail--toc");
    const content = page.locator(".app-shell__content");
    const header = page.locator(".site-header");

    await expect(sidebarRail).toHaveCSS("position", "fixed");
    await expect(tocRail).toHaveCSS("position", "fixed");

    const sidebarBox = await sidebarRail.boundingBox();
    const tocBox = await tocRail.boundingBox();
    const contentBox = await content.boundingBox();
    const headerBox = await header.boundingBox();

    if (!sidebarBox || !tocBox || !contentBox || !headerBox) {
      throw new Error("Unable to measure layout boxes");
    }

    expect(sidebarBox.y).toBeGreaterThan(headerBox.y + headerBox.height + 8);
    expect(contentBox.x).toBeGreaterThan(sidebarBox.x + sidebarBox.width + 8);
    expect(tocBox.x).toBeGreaterThan(contentBox.x + contentBox.width + 8);
  });

  test("workflow copy button provides visual success feedback", async ({ page }) => {
    await page.goto(SAMPLE_PAGE);
    const copyButton = page.locator("[data-copy-json]").first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(copyButton).toHaveClass(/is-success/);
  });
});
