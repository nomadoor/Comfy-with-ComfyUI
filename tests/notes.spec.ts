import { test, expect } from "@playwright/test";

const NOTES_FIND = "/ja/notes/find/";

test.describe("Notes views sorting", () => {
  test("finder cards switch from updated order to views order", async ({ page }) => {
    await page.goto(NOTES_FIND);

    const cards = page.locator("[data-note-grid] [data-note-card]");
    await expect(cards.first()).toContainText("ComfyUI Panorama Stickers");

    const viewsButton = page.locator('[data-note-sort="views"]');
    await expect(viewsButton).toBeEnabled();
    await viewsButton.click();

    await expect(cards.first()).toContainText("torch.cuda.OutOfMemoryError");
  });

  test("sidebar Notes list switches from updated order to views order", async ({ page }) => {
    await page.goto(NOTES_FIND);

    const items = page.locator("[data-notes-list] .notes-nav__item");
    await expect(items.first()).toContainText("ComfyUI Panorama Stickers");

    const viewsButton = page.locator('[data-notes-sort="views"]');
    await expect(viewsButton).toBeEnabled();
    await viewsButton.click();

    await expect(items.first()).toContainText("torch.cuda.OutOfMemoryError");
  });
});
