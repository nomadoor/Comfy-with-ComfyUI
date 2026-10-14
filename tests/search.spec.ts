import { test, expect } from "./support/test";

const PAGE = "/ja/basic-workflows/sd15-basics/";

test("search dropdown shows localized hits", async ({ page }) => {
  await page.goto(PAGE);
  const input = page.locator("[data-search-input]");
  await input.fill("SD1.5");
  const results = page.locator(".search-result");
  await expect(results).not.toHaveCount(0);
  await expect(results.first()).toHaveAttribute("data-highlight-term", "SD1.5");
});

test("search index leaves out noindex pages such as 404 and placeholders", async ({ request }) => {
  const response = await request.get("/search/index-ja.json");
  expect(response.ok()).toBe(true);
  const items: Array<{ url: string; section?: string }> = await response.json();
  expect(items.length).toBeGreaterThan(0);
  expect(items.map((item) => item.url)).not.toContain("/404.html");
  expect(items.filter((item) => item.section === "missing")).toHaveLength(0);
});

test("only the latest query renders when the index loads slowly", async ({ page }) => {
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/search/index-ja.json", async (route) => {
    await held;
    await route.continue();
  });
  await page.goto(PAGE);
  const input = page.locator("[data-search-input]");
  const indexRequested = page.waitForRequest("**/search/index-ja.json");
  await input.fill("SD1.5");
  await indexRequested;
  await input.fill("LTX");
  // Let the 150 ms input debounce for "LTX" fire while the index is still held.
  await page.waitForTimeout(400);
  release();
  // The LTX page matches "LTX" but not "SD1.5"; the SD1.5 page is the reverse.
  await expect(page.locator('.search-result[href="/ja/basic-workflows/ltx-2-5/"]')).toHaveCount(1);
  await expect(page.locator('.search-result[href="/ja/basic-workflows/sd15-basics/"]')).toHaveCount(0);
});

test("opening a search result highlights the term after a router navigation", async ({ page }) => {
  await page.goto(PAGE);
  const input = page.locator("[data-search-input]");
  await input.fill("LTX");
  const result = page.locator('.search-result[href="/ja/basic-workflows/ltx-2-5/"]');
  await expect(result).toHaveCount(1);
  await result.click();
  await expect(page).toHaveURL(/\/ja\/basic-workflows\/ltx-2-5\/$/);
  await expect(page.locator(".article-body mark.highlight").first()).toBeVisible();
});

test("pages keep working when browser storage throws", async ({ page }) => {
  await page.addInitScript(() => {
    for (const name of ["localStorage", "sessionStorage"]) {
      Object.defineProperty(window, name, {
        configurable: true,
        get() {
          throw new DOMException("blocked", "SecurityError");
        }
      });
    }
  });
  await page.goto(PAGE);
  // Heading link buttons are added by page.js, which only runs if every module it imports
  // (sidebar.js, theme-toggle.js, …) evaluated without throwing.
  await expect(page.locator(".article-body .heading-anchor").first()).toBeAttached();
  const input = page.locator("[data-search-input]");
  await input.fill("SD1.5");
  await expect(page.locator(".search-result")).not.toHaveCount(0);
});
