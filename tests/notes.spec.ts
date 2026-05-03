import { test, expect } from "@playwright/test";

const NOTES_FIND = "/ja/notes/find/";

test.describe("Notes views sorting", () => {
  async function expectSortedByUpdated(locator) {
    const count = await locator.count();
    expect(count).toBeGreaterThan(1);

    const firstUpdated = await locator.nth(0).getAttribute("data-updated");
    const secondUpdated = await locator.nth(1).getAttribute("data-updated");
    expect(firstUpdated).toBeTruthy();
    expect(secondUpdated).toBeTruthy();
    const firstUpdatedTime = Date.parse(firstUpdated ?? "");
    const secondUpdatedTime = Date.parse(secondUpdated ?? "");
    expect(firstUpdatedTime).not.toBeNaN();
    expect(secondUpdatedTime).not.toBeNaN();
    expect(firstUpdatedTime).toBeGreaterThanOrEqual(secondUpdatedTime);
  }

  async function expectSortedByViews(locator) {
    const count = await locator.count();
    expect(count).toBeGreaterThan(1);

    const firstViews = Number(await locator.nth(0).getAttribute("data-views"));
    const secondViews = Number(await locator.nth(1).getAttribute("data-views"));
    expect(firstViews).toBeGreaterThan(0);
    expect(firstViews).toBeGreaterThanOrEqual(secondViews);
  }

  test("finder cards switch from updated order to views order", async ({ page }) => {
    await page.goto(NOTES_FIND);

    const cards = page.locator("[data-note-grid] [data-note-card]");
    await expectSortedByUpdated(cards);

    const viewsButton = page.locator('[data-note-sort="views"]');
    await expect(viewsButton).toBeEnabled();
    await viewsButton.click();

    await expectSortedByViews(cards);
  });

  test("sidebar Notes list switches from updated order to views order", async ({ page }) => {
    await page.goto(NOTES_FIND);

    const items = page.locator("[data-notes-list] .notes-nav__item");
    await expectSortedByUpdated(items);

    const viewsButton = page.locator('[data-notes-sort="views"]');
    await expect(viewsButton).toBeEnabled();
    await viewsButton.click();

    await expectSortedByViews(items);
  });
});

test.describe("Notes tag relations", () => {
  test("related pages require a shared note tag", async ({ page }) => {
    await page.goto("/ja/notes/sd15-sdxl-asset-compatibility/");

    const related = page.locator(".workflow-related");
    await expect(related).toBeVisible();
    await expect(related).toContainText("512px × 512pxで生成するのはなぜ？");
    await expect(related).not.toContainText("生成画像で人や物体が分身している");
  });

  test("note tag chips open the finder with that tag as the query", async ({ page }) => {
    await page.goto("/ja/notes/sd15-sdxl-asset-compatibility/");
    await page.locator(".tag-chip", { hasText: "sdxl" }).click();

    await expect(page).toHaveURL(/\/ja\/notes\/find\/\?q=sdxl$/);
    await expect(page.locator("[data-note-query]")).toHaveValue("sdxl");
  });
});
