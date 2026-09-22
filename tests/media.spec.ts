import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { test, expect } from "./support/test";
import type { Page } from "@playwright/test";

// Media layer checks on the noindex fixture page, which only exists in test builds
// (COMFY_MEDIA_FIXTURES=1, see playwright.config.ts). `/media/fixtures/...` references resolve through
// tests/fixtures/media/media.json. R2 and Gyazo requests are fulfilled from local fixtures by the
// shared test in ./support/test.

const FIXTURE_PAGE = "/internal/media-fixtures/";
const MEDIA = JSON.parse(fs.readFileSync(path.resolve("src", "_data", "site.json"), "utf8")).media;
const HOST = `https://${MEDIA.host}`;
const R2_IMAGE_KEY = "images/c0c91b41afe537e7.webp";
const R2_IMAGE_FULL = `${HOST}/${R2_IMAGE_KEY}`;
const R2_IMAGE_ARTICLE = `${HOST}/cdn-cgi/image/${MEDIA.transforms.article}/${R2_IMAGE_KEY}`;
const R2_IMAGE_THUMBNAIL = `${HOST}/cdn-cgi/image/${MEDIA.transforms.thumbnail}/${R2_IMAGE_KEY}`;
const R2_IMAGE_OG = `${HOST}/cdn-cgi/image/${MEDIA.transforms.og}/${R2_IMAGE_KEY}`;
const R2_VIDEO = "https://media.comfyui.nomadoor.net/videos/23d3bb96df2ebf63.mp4";
const GYAZO_IMAGE_ID = "a0b09641bae0c8b02187e6c6b7bb9c5a";
const GYAZO_LOOP_ID = "8cc0775e0b3f0bf5605f9b3aedf0665c";
const GYAZO_PLAYER_ID = "4e0ce0ea62fc7138ffe7ea1892ec21b8";
const fixture = (page: Page, name: string) => page.locator(`[data-fixture="${name}"]`);

test.describe("Media layer fixtures", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE_PAGE);
  });

  test("fixture page is noindex and excluded from discovery files", async ({ page, request }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    for (const file of ["/sitemap.xml", "/llms.txt", "/search/index-ja.json"]) {
      const body = await (await request.get(file)).text();
      expect(body, file).not.toContain("/internal/media-fixtures/");
    }
  });

  test("logical /media/ references resolve to R2 URLs, and video posters feed OGP", async ({ page }) => {
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", R2_IMAGE_OG);
    await expect(page.locator("video.hero__media")).toHaveAttribute("src", R2_VIDEO);
    const unresolved = await page.evaluate(
      () => [...document.querySelectorAll("[src], [data-full-src]")].filter((el) =>
        [el.getAttribute("src"), el.getAttribute("data-full-src")].some((value) => value?.startsWith("/media/"))
      ).length
    );
    expect(unresolved).toBe(0);
  });

  test("R2 images render from media.json dimensions in every syntax", async ({ page }) => {
    for (const name of ["r2-image", "r2-plain", "row-r2-image"]) {
      const img = fixture(page, name).locator("img");
      await expect(img, name).toHaveAttribute("src", R2_IMAGE_ARTICLE);
      await expect(img, name).toHaveAttribute("data-full-src", R2_IMAGE_FULL);
      await expect(img, name).toHaveAttribute("width", "320");
      await expect(img, name).toHaveAttribute("height", "180");
      await expect(img, name).not.toHaveAttribute("srcset", /.+/);
    }
    await expect(fixture(page, "r2-image").locator("figcaption")).toHaveText("R2 image");
  });

  test("card-sized requests use the thumbnail preset; transformation URLs match the WAF allowlist", async ({ page }) => {
    const card = fixture(page, "card-resolution");
    await expect(card).toHaveAttribute("data-src", R2_IMAGE_THUMBNAIL);
    await expect(card).toHaveAttribute("data-full-src", R2_IMAGE_FULL);
    await expect(card).toHaveAttribute("data-og", R2_IMAGE_OG);

    const expression = execFileSync("node", ["scripts/media-waf-expression.mjs"], { encoding: "utf8" });
    const urls = await page.evaluate(() =>
      [...document.querySelectorAll("[src], [data-full-src], [data-src], [data-og], meta[content]")]
        .flatMap((el) => ["src", "data-full-src", "data-src", "data-og", "content"].map((name) => el.getAttribute(name) || ""))
        .filter((value) => value.includes("/cdn-cgi/image/"))
    );
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      const { host, pathname } = new URL(url);
      expect(host).toBe(MEDIA.host);
      const allowedPrefix = pathname.match(/^\/cdn-cgi\/image\/[^/]+\/images\//)?.[0];
      expect(allowedPrefix, url).toBeTruthy();
      expect(expression, url).toContain(`"${allowedPrefix}"`);
    }
  });

  test("Gyazo images use preview and raw URLs with both syntaxes", async ({ page }) => {
    for (const name of ["gyazo-image", "gyazo-image-compat"]) {
      const img = fixture(page, name).locator("img");
      await expect(img, name).toHaveAttribute("src", `https://i.gyazo.com/${GYAZO_IMAGE_ID}/max_size/1200.jpg`);
      await expect(img, name).toHaveAttribute("data-full-src", `https://gyazo.com/${GYAZO_IMAGE_ID}/raw`);
    }
  });

  test("R2 and Gyazo loop/player share the storage-independent video figure", async ({ page }) => {
    const cases = [
      ["r2-loop", "loop", R2_VIDEO],
      ["r2-player", "player", R2_VIDEO],
      ["gyazo-loop", "loop", `https://i.gyazo.com/${GYAZO_LOOP_ID}.mp4`],
      ["gyazo-player", "player", `https://i.gyazo.com/${GYAZO_PLAYER_ID}.mp4`]
    ] as const;
    for (const [name, mode, source] of cases) {
      const figure = fixture(page, name).locator("figure.article-video");
      const video = figure.locator("video");
      await expect(figure, name).toHaveAttribute("data-media-initial", mode);
      await expect(figure, name).toHaveAttribute("data-media-mode", mode);
      await expect(video, name).toHaveAttribute("src", source);
      await expect(video, name).toHaveAttribute("data-full-src", source);
      expect(await video.evaluate((el: HTMLVideoElement) => el.controls), name).toBe(mode === "player");
      expect(await video.evaluate((el: HTMLVideoElement) => el.loop), name).toBe(mode === "loop");
    }

    const loopFigure = fixture(page, "gyazo-loop").locator("figure.article-video");
    await loopFigure.hover();
    await loopFigure.locator("button.media-toggle").click();
    await expect(loopFigure).toHaveAttribute("data-media-mode", "player");
    await expect(loopFigure.locator(".media-toggle__text")).toHaveText("Player");

    await expect(fixture(page, "r2-loop").locator("figure.article-video")).toHaveAttribute("style", /--article-video-aspect:32 \/ 32/);
    await expect(fixture(page, "row-gyazo-loop").locator("video")).toHaveAttribute(
      "data-full-src",
      "https://i.gyazo.com/b1c0185c6afc1de67f01acd041169f7c.mp4"
    );
  });

  test("markup exposes no storage-specific UI hooks", async ({ page }) => {
    const count = await page.evaluate(
      () => document.querySelectorAll('[class*="gyazo"], [data-gyazo-toggle], [data-gyazo-initial], [data-gyazo-id]').length
    );
    expect(count).toBe(0);
  });

  test("lightbox opens the data-full-src of R2 images, Gyazo images, and videos", async ({ page }) => {
    const raw = page.locator("[data-lightbox-raw]");
    const lightboxVideo = page.locator("[data-lightbox-video]");
    const closeButton = page.locator(".lightbox__close");

    await fixture(page, "r2-image").locator("img").click();
    await expect(raw).toHaveAttribute("src", R2_IMAGE_FULL);
    await expect.poll(() => raw.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBe(320);
    await closeButton.click();

    await fixture(page, "gyazo-image").locator("img").click();
    await expect(raw).toHaveAttribute("src", `https://gyazo.com/${GYAZO_IMAGE_ID}/raw`);
    await closeButton.click();

    const lightbox = page.locator(".lightbox");
    await fixture(page, "r2-loop").locator("video").click();
    await expect(lightbox).toHaveClass(/is-open/);
    await expect(lightboxVideo).toHaveAttribute("src", R2_VIDEO);
    await closeButton.click();
    await expect(lightbox).not.toHaveClass(/is-open/);

    await fixture(page, "row-gyazo-loop").locator("video").click();
    await expect(lightbox).toHaveClass(/is-open/);
    await expect(lightboxVideo).toHaveAttribute("src", "https://i.gyazo.com/b1c0185c6afc1de67f01acd041169f7c.mp4");
    expect(await lightboxVideo.evaluate((el: HTMLVideoElement) => el.loop)).toBe(true);
    await expect(page.locator("[data-lightbox-image]")).toBeHidden();
    await closeButton.click();
    await expect(lightbox).not.toHaveClass(/is-open/);

    // Clicking the player video area (not its native controls bar) opens the lightbox, as before.
    await fixture(page, "gyazo-player").locator("video").click();
    await expect(lightbox).toHaveClass(/is-open/);
    await expect(lightboxVideo).toHaveAttribute("src", `https://i.gyazo.com/${GYAZO_PLAYER_ID}.mp4`);
    expect(await lightboxVideo.evaluate((el: HTMLVideoElement) => el.loop)).toBe(false);
  });

  test("lightbox keeps the loaded image available to the native context menu", async ({ page }) => {
    await fixture(page, "r2-image").locator("img").click();

    const imageStack = page.locator("[data-lightbox-image]");
    const rawImage = page.locator("[data-lightbox-raw]");
    await expect.poll(() => rawImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBe(320);

    await page.evaluate(() => {
      (window as typeof window & { __lightboxContextTarget?: string }).__lightboxContextTarget = "";
      document.addEventListener("contextmenu", (event) => {
        (window as typeof window & { __lightboxContextTarget?: string }).__lightboxContextTarget = (event.target as Element)?.tagName || "";
      }, { once: true });
    });

    const imageBox = await rawImage.boundingBox();
    expect(imageBox).not.toBeNull();
    await page.mouse.click(imageBox!.x + imageBox!.width / 2, imageBox!.y + imageBox!.height / 2, { button: "right" });
    await expect.poll(() => page.evaluate(
      () => (window as typeof window & { __lightboxContextTarget?: string }).__lightboxContextTarget
    )).toBe("IMG");

    await rawImage.click();
    await expect(imageStack).toHaveAttribute("data-zoom-scale", "2");
  });
});
