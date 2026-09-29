import { test, expect } from "./support/test";

const BREAKDOWN_PAGE = "/ja/basic-workflows/ltx-2/";
const WORKFLOWS_PAGE = "/ja/basic-workflows/flux-2-klein/";

test.describe("Media step cards", () => {
  test("every media row is gathered into a card that lists all its steps", async ({ page }) => {
    for (const url of [BREAKDOWN_PAGE, WORKFLOWS_PAGE, "/ja/notes/panorama-stickers/"]) {
      await page.goto(url);
      await expect(page.locator(".media-step")).toHaveCount(0);
      const card = page.locator(".media-steps").first();
      const steps = card.locator(".media-steps__step");
      expect(await steps.count()).toBeGreaterThan(1);
      for (let i = 0; i < (await steps.count()); i += 1) await expect(steps.nth(i)).toBeVisible();
    }
  });

  test("labels cards by kind", async ({ page }) => {
    await page.goto(BREAKDOWN_PAGE);
    await expect(page.locator(".media-steps").first()).toHaveClass(/media-steps--breakdown/);
    await expect(page.locator(".media-steps__kicker").first()).toHaveText("Deep dive");
    await page.goto(WORKFLOWS_PAGE);
    await expect(page.locator(".media-steps").first()).toHaveClass(/media-steps--workflows/);
    await expect(page.locator(".media-steps__kicker").first()).toHaveText("Workflows");
    await page.goto("/ja/notes/panorama-stickers/");
    await expect(page.locator(".media-steps__kicker").first()).toHaveText("Walkthrough");
  });

  test("steps written with a heading keep it as a title outside the TOC", async ({ page }) => {
    await page.goto("/ja/basic-workflows/sd15-text2image/");
    await expect(page.locator(".media-steps__title").first()).toHaveText("Load Checkpoint ノード");
    await expect(page.locator(".media-steps h3")).toHaveCount(0);
  });

  test("a step image opens the lightbox with its explanation beside it", async ({ page }) => {
    await page.goto(BREAKDOWN_PAGE);
    const steps = page.locator(".media-steps").first().locator(".media-steps__step");
    const title = await steps.nth(1).locator(".media-steps__title").textContent();
    await steps.nth(1).locator("img").click();
    await expect(page.locator(".lightbox.is-open")).toBeVisible();
    const notes = page.locator("[data-lightbox-notes]");
    await expect(notes).toBeVisible();
    await expect(notes.locator(".media-steps__title")).toHaveText(title || "");
  });

  test("the lightbox steps through every image on the page, showing notes only for step media", async ({ page }) => {
    await page.goto(BREAKDOWN_PAGE);
    const all = page.locator(".article-body img, .article-body figure[data-media-toggle] video");
    const firstStep = await all.evaluateAll((els) => els.findIndex((el) => el.closest(".media-steps__step")));
    expect(firstStep).toBeGreaterThan(0);
    // The media just before the first step card is outside it: no notes there.
    await page.locator(".media-steps__step").first().locator("img").click();
    await expect(page.locator("[data-lightbox-notes]")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("[data-lightbox-notes]")).toBeHidden();
  });

  test("step media opens in a window; other media starts at window size and zooms past it", async ({ page }) => {
    await page.goto(BREAKDOWN_PAGE);
    const viewport = page.viewportSize()!;
    await page.locator(".media-steps__step").first().locator("img").click();
    const win = (await page.locator(".lightbox__window").boundingBox())!;
    expect(win.width).toBeLessThan(viewport.width);
    expect(win.height).toBeLessThan(viewport.height);
    await page.keyboard.press("Escape");

    await page.locator(".article-body img:not(.media-steps img)").first().click();
    const stack = page.locator("[data-lightbox-image]");
    const start = (await stack.boundingBox())!;
    expect(start.width).toBeLessThan(viewport.width);
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    for (let i = 0; i < 4; i += 1) await page.mouse.wheel(0, -400);
    // Zoomed media spreads over the screen instead of being cropped to its starting frame.
    await expect.poll(async () => (await stack.boundingBox())!.width).toBeGreaterThan(viewport.width);
  });
  test("videos zoom too, and arrow keys still move on while a video has focus", async ({ page }) => {
    await page.goto(BREAKDOWN_PAGE);
    await page.locator(".article-body figure[data-media-toggle] video").first().click();
    const video = page.locator("[data-lightbox-video]");
    await expect(video).toBeVisible();
    const box = (await video.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => video.evaluate((el) => el.style.transform)).toContain("scale(");
    await video.focus();
    const before = await video.getAttribute("src");
    await page.keyboard.press("ArrowRight");
    await expect.poll(async () => (await video.isVisible()) ? await video.getAttribute("src") : "moved").not.toBe(before);
  });
});
