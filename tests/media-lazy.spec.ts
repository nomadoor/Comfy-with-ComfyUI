import { test, expect, routeExternalMedia } from "./support/test";
import type { Page } from "@playwright/test";

// Lazy video loading (src/assets/js/video-lazy.js) and the layout it depends on: a media box must keep
// its size from first paint, because with lazy loading a clip arrives while the reader looks at it.

const FIXTURE_PAGE = "/internal/media-fixtures/";
const FAR_VIDEO = "https://media.comfyui.nomadoor.net/videos/3333333333333333.mp4";
const FAR_PLAYER_VIDEO = "https://media.comfyui.nomadoor.net/videos/4444444444444444.mp4";
const fixture = (page: Page, name: string) => page.locator(`[data-fixture="${name}"]`);

/** Requests for the clip used only by the two fixtures far down the page. */
function trackFarVideo(page: Page, url = FAR_VIDEO) {
  const urls: string[] = [];
  page.on("request", (request) => {
    if (request.url() === url) urls.push(request.url());
  });
  return urls;
}

test.describe("lazy video loading", () => {
  test("article videos start unloaded, with the poster held back", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);
    const videos = page.locator("main video[data-media-lazy]");
    expect(await videos.count()).toBeGreaterThan(0);
    const attrs = await videos.evaluateAll((elements) =>
      elements.map((el) => ({
        preload: el.getAttribute("preload"),
        autoplay: el.hasAttribute("autoplay"),
        dataPoster: el.getAttribute("data-poster")
      }))
    );
    // A poster is attached lazily when the manifest has one for the clip.
    expect(await fixture(page, "r2-loop").locator("video").getAttribute("data-poster")).toBeTruthy();
    for (const attr of attrs) {
      expect(attr.preload).toBe("none");
      expect(attr.autoplay).toBe(false);
    }
  });

  test("a video far down the page is not fetched until the reader approaches it", async ({ page }) => {
    const requested = trackFarVideo(page);
    await page.goto(FIXTURE_PAGE);
    const far = fixture(page, "far-loop").locator("video");
    await expect(far).toHaveAttribute("preload", "none");
    // Three viewports below the fold: outside the one-viewport activation range.
    expect(requested, "no request for the far video while it is out of range").toHaveLength(0);
    expect(await far.getAttribute("poster")).toBeNull();

    await far.scrollIntoViewIfNeeded();
    await expect(far).toHaveAttribute("preload", "auto");
    await expect(far).toHaveAttribute("poster", /.+/);
    await expect.poll(() => requested.length, { timeout: 5000 }).toBe(1);
    // Playback itself is covered by tests/video-sync.spec.ts, which uses clips this browser can decode.
    await expect.poll(() => far.evaluate((el: HTMLVideoElement) => !el.paused || el.error !== null), { timeout: 5000 }).toBe(true);
  });

  test("a Player video stays unloaded until it is played", async ({ page }) => {
    const requested = trackFarVideo(page, FAR_PLAYER_VIDEO);
    await page.goto(FIXTURE_PAGE);
    const player = fixture(page, "far-player").locator("video");
    await player.scrollIntoViewIfNeeded();
    await expect(player).toHaveAttribute("poster", /.+/);
    await page.waitForTimeout(500);
    expect(requested, "scrolling to a Player video must not download it").toHaveLength(0);

    await player.evaluate((el: HTMLVideoElement) => el.play().catch(() => {}));
    await expect.poll(() => requested.length, { timeout: 5000 }).toBeGreaterThan(0);
  });

  test("media rows are laid out by CSS alone, before and without JavaScript", async ({ browser, baseURL }) => {
    const sizes = async (javaScriptEnabled: boolean, width: number) => {
      const context = await browser.newContext({ viewport: { width, height: 844 }, javaScriptEnabled });
      const page = await context.newPage();
      await routeExternalMedia(page);
      await page.goto(new URL(FIXTURE_PAGE, baseURL).href);
      await page.waitForTimeout(javaScriptEnabled ? 1500 : 400);
      const rows = await page.evaluate(() =>
        [...document.querySelectorAll(".article-media-row")].map((row) =>
          [...row.querySelectorAll(".article-video__frame, .article-media__frame")]
            .map((frame) => {
              const rect = frame.getBoundingClientRect();
              return `${Math.round(rect.width)}x${Math.round(rect.height)}`;
            })
            .join(" ")
        )
      );

      await context.close();
      return rows;
    };

    for (const width of [1440, 390]) {
      const withoutJs = await sizes(false, width);
      const withJs = await sizes(true, width);
      expect(withoutJs.length, `rows at ${width}px`).toBeGreaterThan(0);
      // Rows must not be resized once scripts run: that resize was visible as a jump on every load.
      expect(withJs, `rows at ${width}px`).toEqual(withoutJs);
      expect(withoutJs.some((row) => row.startsWith("0x")), "no row item may collapse").toBe(false);
      // Items of a row share one height, whatever their own proportions are.
      for (const row of withoutJs) {
        const rowHeights = row.split(" ").map((box) => Number(box.split("x")[1]));
        expect(Math.max(...rowHeights) - Math.min(...rowHeights), `row heights at ${width}px: ${row}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test("media boxes keep their size from first paint", async ({ page }) => {
    const sizesOf = async (blocked: boolean) => {
      const context = page.context();
      const fresh = await context.newPage();
      if (blocked) {
        await fresh.route(/media\.comfyui\.nomadoor\.net|gyazo\.com/, (route) => route.abort());
      } else {
        const { routeExternalMedia } = await import("./support/test");
        await routeExternalMedia(fresh);
      }
      await fresh.setViewportSize({ width: 390, height: 844 });
      await fresh.goto(FIXTURE_PAGE);
      await fresh.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        scrollTo(0, 0);
      });
      await fresh.waitForTimeout(blocked ? 500 : 2500);
      const sizes = await fresh.evaluate(() =>
        [...document.querySelectorAll(".article-video__frame, .article-media__frame, .media-inline__media")].map((el) => {
          const rect = el.getBoundingClientRect();
          return `${Math.round(rect.width)}x${Math.round(rect.height)}`;
        })
      );
      await fresh.close();
      return sizes;
    };

    const blocked = await sizesOf(true);
    const loaded = await sizesOf(false);
    expect(blocked.length).toBeGreaterThan(0);
    // Every box must already have its final size while its media is still missing.
    expect(blocked).toEqual(loaded);
    expect(blocked.some((size) => size.startsWith("0x")), "no media box may collapse to zero").toBe(false);
  });
});
