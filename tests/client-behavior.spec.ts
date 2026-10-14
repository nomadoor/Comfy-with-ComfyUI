import { test, expect } from "./support/test";

// Characterization tests for client modules that had no coverage (link-behavior, theme-toggle,
// image-fade, search history and keyboard). They pin today's behavior ahead of the client JS
// refactor; a failure here means behavior changed, not necessarily that it broke.

const ARTICLE = "/ja/basic-workflows/sd15-inpainting/";
const SEARCH_PAGE = "/ja/basic-workflows/sd15-basics/";

test("external article links open in a new tab with rel and an icon; internal links do not", async ({ page }) => {
  await page.goto(ARTICLE);
  const external = page.locator('.article-body a[href^="https://"]').first();
  await expect(external).toHaveAttribute("target", "_blank");
  await expect(external).toHaveAttribute("rel", /\bnoopener\b/);
  await expect(external).toHaveAttribute("rel", /\bnoreferrer\b/);
  await expect(external).toHaveClass(/\blink--external\b/);
  await expect(external.locator(".article-link__icon")).toHaveCount(1);

  const internal = page.locator('.article-body a[href^="/ja/"]').first();
  await expect(internal).toHaveClass(/\blink--internal\b/);
  await expect(internal).not.toHaveAttribute("target", "_blank");
  await expect(internal.locator(".article-link__icon")).toHaveCount(0);
});

test("the sidebar marks the current page link", async ({ page }) => {
  await page.goto(ARTICLE);
  const current = page.locator('.nav-list__link[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveAttribute("href", ARTICLE);
  await expect(current).toHaveClass(/\bis-active\b/);
});

test("theme toggle switches to light, persists across reloads, and switches back", async ({ page }) => {
  await page.goto(ARTICLE);
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");
  const toggle = page.locator("[data-theme-toggle]:visible").first();
  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.locator("[data-theme-toggle]:visible").first().click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("[data-theme-toggle]:visible").first()).toHaveAttribute("aria-pressed", "false");
});

test("article images fade in: they get img-fade and then is-loaded", async ({ page }) => {
  await page.goto(ARTICLE);
  const image = page.locator(".article-body img").first();
  await expect(image).toHaveClass(/\bimg-fade\b/);
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveClass(/\bis-loaded\b/);
});

test("search keyboard: arrows move the active result and Enter opens it", async ({ page }) => {
  await page.goto(SEARCH_PAGE);
  const input = page.locator("[data-search-input]");
  await input.fill("LTX");
  const results = page.locator(".search-result");
  await expect(results).not.toHaveCount(0);

  await input.press("ArrowDown");
  await expect(results.nth(0)).toHaveClass(/\bis-active\b/);
  await input.press("ArrowUp");
  await expect(results.last()).toHaveClass(/\bis-active\b/);
  await input.press("ArrowDown");
  await expect(results.nth(0)).toHaveClass(/\bis-active\b/);

  const href = await results.nth(0).getAttribute("href");
  // The first hit must be another page, or the URL check below would pass without navigating.
  expect(href).not.toBe(SEARCH_PAGE);
  await input.press("Enter");
  await expect(page).toHaveURL((url) => url.pathname === href);
});

test("search Escape hides the results", async ({ page }) => {
  await page.goto(SEARCH_PAGE);
  const input = page.locator("[data-search-input]");
  await input.fill("SD1.5");
  await expect(page.locator(".search-result")).not.toHaveCount(0);
  await input.press("Escape");
  await expect(page.locator("[data-search-results]").first()).toBeHidden();
});

test("search history: an opened result is remembered, reusable, and clearable", async ({ page }) => {
  await page.goto(SEARCH_PAGE);
  const input = page.locator("[data-search-input]");
  await input.fill("LTX");
  await page.locator('.search-result[href="/ja/basic-workflows/ltx-2-5/"]').click();
  await expect(page).toHaveURL(/\/ja\/basic-workflows\/ltx-2-5\/$/);

  await input.fill("");
  await input.focus();
  const remembered = page.locator('[data-history-term="LTX"]');
  await expect(remembered).toBeVisible();

  await remembered.click();
  await expect(input).toHaveValue("LTX");
  await expect(page.locator(".search-result[href]")).not.toHaveCount(0);

  await input.fill("");
  await page.locator("[data-clear-search-history]").click();
  await expect(page.locator("[data-history-term]")).toHaveCount(0);
});
