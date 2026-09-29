import { test, expect } from "./support/test";

const BREAKDOWN_PAGE = "/ja/basic-workflows/ltx-2/";
const WORKFLOWS_PAGE = "/ja/basic-workflows/flux-2-klein/";

test.describe("Media step cards", () => {
  test("every media row is gathered into a card", async ({ page }) => {
    for (const url of [BREAKDOWN_PAGE, WORKFLOWS_PAGE, "/ja/notes/panorama-stickers/"]) {
      await page.goto(url);
      await expect(page.locator(".media-step")).toHaveCount(0);
      expect(await page.locator(".media-steps").count()).toBeGreaterThan(0);
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

  test("switching steps never changes the card's height or moves the workflow row", async ({ page }) => {
    await page.goto(WORKFLOWS_PAGE);
    const card = page.locator("[data-media-steps]").first();
    await card.scrollIntoViewIfNeeded();
    const segments = card.locator("[data-media-steps-go]");
    const count = await segments.count();
    expect(count).toBeGreaterThan(1);
    const heights = new Set<number>();
    const rowOffsets = new Set<number>();
    for (let i = 0; i < count; i += 1) {
      await segments.nth(i).click();
      await expect(segments.nth(i)).toHaveAttribute("aria-current", "step");
      const { height, rowTop } = await card.evaluate((el, index) => {
        const text = el.querySelectorAll(".media-steps__text")[index];
        const row = text.querySelector(".workflow-json__row");
        const top = el.getBoundingClientRect().top;
        return { height: Math.round(el.getBoundingClientRect().height), rowTop: Math.round((row?.getBoundingClientRect().top ?? top) - top) };
      }, i);
      heights.add(height);
      rowOffsets.add(rowTop);
    }
    expect([...heights]).toHaveLength(1);
    expect([...rowOffsets]).toHaveLength(1);
  });

  test("footer buttons name the neighbouring steps and stop at the ends", async ({ page }) => {
    await page.goto(BREAKDOWN_PAGE);
    const card = page.locator("[data-media-steps]").first();
    await card.scrollIntoViewIfNeeded();
    const prev = card.locator(".media-steps__nav--prev");
    const next = card.locator(".media-steps__nav--next");
    await expect(prev).toBeDisabled();
    const secondTitle = await card.locator("[data-media-steps-go]").nth(1).getAttribute("title");
    await expect(next).toContainText(secondTitle || "");
    await next.click();
    await expect(card.locator("[data-media-steps-go]").nth(1)).toHaveAttribute("aria-current", "step");
    await expect(prev).toBeEnabled();
  });

  test("arrow keys step through the card in view only", async ({ page }) => {
    await page.goto(BREAKDOWN_PAGE);
    const cards = page.locator("[data-media-steps]");
    const activeIndex = (n: number) =>
      cards.nth(n).evaluate((el) => [...el.querySelectorAll(".media-steps__slide")].findIndex((slide) => slide.classList.contains("is-active")));
    await cards.nth(0).evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.mouse.move(2, 2);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => activeIndex(0)).toBe(2);
    expect(await activeIndex(1)).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.keyboard.press("ArrowRight");
    expect(await activeIndex(0)).toBe(2);
  });

  test("the edge zones start at the image, below the header and progress bar", async ({ page }) => {
    await page.goto(BREAKDOWN_PAGE);
    const card = page.locator("[data-media-steps]").first();
    await card.scrollIntoViewIfNeeded();
    const { edgeTop, stageTop } = await card.evaluate((el) => ({
      edgeTop: el.querySelector(".media-steps__edge--next")!.getBoundingClientRect().top,
      stageTop: el.querySelector(".media-steps__stage")!.getBoundingClientRect().top
    }));
    expect(Math.abs(edgeTop - stageTop)).toBeLessThanOrEqual(0.5);
  });

  test("a single step renders as a card without step controls", async ({ page }) => {
    await page.goto("/ja/basic-workflows/qwen-image-2-1/");
    const single = page.locator(".media-steps--single").first();
    await expect(single).toBeVisible();
    await expect(single.locator(".media-steps__progress, .media-steps__footer, .media-steps__edge")).toHaveCount(0);
  });
  test("arrow keys stay with a focused video inside a card", async ({ page }) => {
    await page.goto("/ja/notes/panorama-stickers/");
    const card = page.locator("[data-media-steps]").first();
    await card.evaluate((el) => el.scrollIntoView({ block: "center" }));
    const video = card.locator(".media-steps__slide.is-active video");
    await video.evaluate((el) => {
      el.setAttribute("tabindex", "0");
      (el as HTMLVideoElement).focus();
    });
    await page.keyboard.press("ArrowRight");
    expect(await card.evaluate((el) => [...el.querySelectorAll(".media-steps__slide")].findIndex((s) => s.classList.contains("is-active")))).toBe(0);
  });
});
