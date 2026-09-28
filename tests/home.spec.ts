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
    await expect(page.locator("h1").first()).toContainText("Comfyに使うComfyUI");
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
    await expect(page.locator(".site-header__logo")).toHaveAttribute("href", "/en/");
    await page.goto("/zh/basic-workflows/sdxl/");
    await expect(page.locator(".site-header__logo")).toHaveAttribute("href", "/zh/");
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
    await expect(page.locator("h1").first()).toContainText("Comfyに使うComfyUI");
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

  test("the footer links to each language home", async ({ page }) => {
    for (const [lang, label] of [["ja", "トップ"], ["en", "Home"], ["zh", "首页"]]) {
      await page.goto(`/${lang}/basic-workflows/sdxl/`);
      await expect(page.locator(`.article-footer__links a[href="/${lang}/"]`)).toHaveText(label);
    }
  });

  test("every language home exists and the language menu moves between them", async ({ page }) => {
    for (const lang of ["ja", "en", "zh"]) {
      await page.goto(`/${lang}/`);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("[data-home-picks] a.home-pick")).toHaveCount(4);
      await expect(page.locator("[data-home-updates] a.news-row")).toHaveCount(5);
      const menu = await page.locator("header [data-lang-menu] a").evaluateAll((links) =>
        Object.fromEntries(links.map((link) => [link.getAttribute("data-lang"), link.getAttribute("href")]))
      );
      expect(menu).toEqual({ ja: "/ja/", en: "/en/", zh: "/zh/" });
    }
  });

  test("every page footer names the author with a link to X", async ({ page }) => {
    for (const url of ["/ja/", "/ja/basic-workflows/sdxl/", "/en/basic-workflows/sdxl/"]) {
      await page.goto(url);
      const author = page.locator(".article-footer__author");
      await expect(author).toHaveText("CC0 · by nomadoor");
      await expect(author.locator("a")).toHaveAttribute("href", "https://x.com/noma_door");
    }
  });

  test("placeholder and 404 pages keep a sensible language menu", async ({ page }) => {
    const menu = () =>
      page.locator("header [data-lang-menu] a").evaluateAll((links) =>
        Object.fromEntries(links.map((link) => [link.getAttribute("data-lang"), link.getAttribute("href")]))
      );
    await page.goto("/ja/begin-with/pc-basics/");
    expect(await menu()).toEqual({
      ja: "/ja/begin-with/pc-basics/",
      en: "/en/begin-with/pc-basics/",
      zh: "/zh/begin-with/pc-basics/"
    });
    await page.goto("/404.html");
    expect((await menu()).ja).toBe("/ja/");
  });

  test("arriving at the home by in-site navigation shows the same sidebar section as a direct load", async ({ page }) => {
    await page.goto("/ja/");
    const directSection = await page.locator(".sidebar__section-btn.is-active").first().getAttribute("data-section-key");
    await page.goto("/ja/basic-workflows/sdxl/");
    await page.locator(".site-header__logo").click();
    await expect(page).toHaveURL("/ja/");
    await expect(page.locator(".sidebar__section-btn.is-active").first()).toHaveAttribute("data-section-key", directSection!);
  });

  test("Escape closes the language menu and returns focus to its button", async ({ page }) => {
    await page.goto("/ja/basic-workflows/sdxl/");
    const toggle = page.locator("header [data-lang-toggle]");
    const menu = page.locator("header [data-lang-menu]");
    await toggle.click();
    await expect(menu).toHaveClass(/is-open/);
    await page.keyboard.press("Escape");
    await expect(menu).not.toHaveClass(/is-open/);
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
