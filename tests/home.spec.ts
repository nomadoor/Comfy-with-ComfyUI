import fs from "node:fs";
import path from "node:path";
import { test, expect } from "./support/test";

const NEWS_ROWS = [...fs.readFileSync(path.resolve("src/content/ja/news.md"), "utf8").matchAll(/<a class="news-row" href="([^"]+)"/g)].map(
  (match) => match[1]
);

test.describe("Language home", () => {
  test("the root sends visitors to the Japanese home", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/ja/");
    await expect(page.locator("h1").first()).toContainText("Comfyに使う ComfyUI");
  });

  test("shows the monthly picks as cards with thumbnails linking to their articles", async ({ page }) => {
    await page.goto("/ja/");
    const picks = page.locator("[data-home-picks]");
    await expect(page.locator(".article-body > h2").filter({ hasText: "おすすめモデル" })).toBeVisible();
    await expect(page.locator(".toc")).toContainText("おすすめモデル");
    const cards = picks.locator("a.home-pick");
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toHaveAttribute("href", "/ja/basic-workflows/krea-2/");
    await expect(cards.nth(1)).toHaveAttribute("href", "/ja/basic-workflows/anima/");
    await expect(cards.nth(2)).toHaveAttribute("href", "/ja/basic-workflows/qwen-image-2-1/");
    await expect(cards.nth(3)).toHaveAttribute("href", "/ja/basic-workflows/minimax-h3/");
    await expect(picks.locator(".home-picks__category")).toHaveText(["画像生成", "画像編集", "動画生成"]);
    await expect(picks.locator(".home-picks__category").nth(0).locator("+ .home-picks__grid a.home-pick")).toHaveCount(2);
    for (let i = 0; i < 4; i += 1) {
      await expect(cards.nth(i).locator("[data-hero]")).toHaveAttribute("data-hero", /\S/);
      await expect(cards.nth(i).locator(".home-pick__text")).not.toBeEmpty();
    }
  });

  test("lists the five newest updates from the news page", async ({ page }) => {
    await page.goto("/ja/");
    const rows = page.locator("[data-home-updates] a.news-row");
    await expect(rows).toHaveCount(5);
    const hrefs = await rows.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(hrefs).toEqual(NEWS_ROWS.slice(0, 5));
    await expect(page.locator('[data-home-updates] a[href="/ja/news/"]')).toBeVisible();
  });

  test("the video pick plays its hero video in the card", async ({ page }) => {
    await page.goto("/ja/");
    const video = page.locator('a.home-pick[href="/ja/basic-workflows/minimax-h3/"] video');
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute("autoplay", "");
    await expect(video).toHaveAttribute("loop", "");
    await expect(video).toHaveAttribute("src", /\S/);
  });

  test("carries the welcome text, contact, Twitter, and the license", async ({ page }) => {
    await page.goto("/ja/");
    await expect(page.locator(".article-body")).toContainText("ようこそ！Comfyに使うComfyUIへ");
    await expect(page.locator('.article-body a[href^="/ja/contact/"]').first()).toBeVisible();
    await expect(page.locator('.article-body a[href="https://x.com/noma_door"]').first()).toBeVisible();
    await expect(page.locator(".article-body")).toContainText("CC0");
  });

  test("the header logo leads to the language home", async ({ page }) => {
    await page.goto("/ja/basic-workflows/sdxl/");
    await expect(page.locator(".site-header__logo")).toHaveAttribute("href", "/ja/");
    await page.goto("/en/basic-workflows/sdxl/");
    await expect(page.locator(".site-header__logo")).toHaveAttribute("href", "/en/begin-with/how-to-use-this-site/");
  });

  test("the language menu only offers pages that exist", async ({ page }) => {
    const hrefs = async () =>
      page.locator("[data-lang-menu] a").evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute("href")))]);
    const assertAllExist = async () => {
      for (const href of await hrefs()) {
        const response = await page.request.get(href!);
        expect(response.status(), href!).toBe(200);
      }
    };
    await page.goto("/ja/");
    expect(await hrefs()).toContain("/ja/");
    await assertAllExist();
    // After in-site navigation away and back, the rewritten links must still resolve.
    await page.locator('.sidebar a[href="/ja/begin-with/setup/"]').first().click();
    await expect(page).toHaveURL("/ja/begin-with/setup/");
    expect(await hrefs()).toContain("/en/begin-with/setup/");
    await page.goBack();
    await expect(page).toHaveURL("/ja/");
    await expect(page.locator("h1").first()).toContainText("Comfyに使う ComfyUI");
    await assertAllExist();
  });

  test("the language menu keeps noindex pages that exist", async ({ page }) => {
    await page.goto("/ja/ai-capabilities/tts/");
    const hrefs = await page.locator("header [data-lang-menu] a").evaluateAll((links) =>
      Object.fromEntries(links.map((link) => [link.getAttribute("data-lang"), link.getAttribute("href")]))
    );
    expect(hrefs).toEqual({
      ja: "/ja/ai-capabilities/tts/",
      en: "/en/ai-capabilities/tts/",
      zh: "/zh/ai-capabilities/tts/"
    });
  });

  test("the Japanese footer links to the home instead of the guide", async ({ page }) => {
    await page.goto("/ja/basic-workflows/sdxl/");
    await expect(page.locator('.article-footer__links a[href="/ja/"]')).toHaveText("トップ");
    await page.goto("/en/basic-workflows/sdxl/");
    await expect(page.locator('.article-footer__links a[href="/en/begin-with/how-to-use-this-site/"]')).toHaveCount(1);
  });

  test("every page footer names the author with a link to X", async ({ page }) => {
    for (const url of ["/ja/", "/ja/basic-workflows/sdxl/", "/en/basic-workflows/sdxl/"]) {
      await page.goto(url);
      const author = page.locator(".article-footer__author");
      await expect(author).toHaveText("CC0 · by nomadoor");
      await expect(author.locator("a")).toHaveAttribute("href", "https://x.com/noma_door");
    }
  });
});
