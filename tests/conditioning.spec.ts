import { test, expect } from "@playwright/test";

const GYAZO_IMAGE =
  "https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg";

test.describe("Conditioning page", () => {
  test("hero uses Gyazo image and JSON controls render", async ({ page }) => {
    await page.goto("/ja/ai-capabilities/conditioning/");

    const heroMedia = page.locator(".hero__media");
    await expect(heroMedia).toHaveAttribute("data-full-src", GYAZO_IMAGE);
    await expect(heroMedia).toHaveAttribute("src", /max_size\/\d+\.jpg$/);

    await expect(page.locator(".workflow-json__row"))
      .toContainText("clip-conditioning.json");

    await expect(
      page.locator('[data-copy-json="clip-conditioning-json"]')
    ).toBeVisible();
    await expect(
      page.locator('a[href$="clip-conditioning.json"]')
    ).toBeVisible();

    await expect(page.locator(".tag-chips")).toHaveCount(0);
  });
});
