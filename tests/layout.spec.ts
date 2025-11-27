import { test, expect } from "@playwright/test";

const SAMPLE_PAGE = "/ja/basic-workflows/sd15-basics/";
const PLAYWRIGHT_PORT = Number(process.env.PLAYWRIGHT_PORT || 8080);
const BASE_TEST_URL =
  process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PLAYWRIGHT_PORT}`;

test.describe("Layout rails", () => {
  test("sidebar and TOC rails stay fixed with proper offsets", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto(SAMPLE_PAGE);

    const sidebarRail = page.locator(".rail--sidebar");
    const tocRail = page.locator(".rail--toc");
    const content = page.locator(".app-shell__content");
    const header = page.locator(".site-header");

    await expect(sidebarRail).toHaveCSS("position", "fixed");
    await expect(tocRail).toHaveCSS("position", "fixed");

    const sidebarBox = await sidebarRail.boundingBox();
    const tocBox = await tocRail.boundingBox();
    const contentBox = await content.boundingBox();
    const headerBox = await header.boundingBox();

    if (!sidebarBox || !tocBox || !contentBox || !headerBox) {
      throw new Error("Unable to measure layout boxes");
    }

    expect(sidebarBox.y).toBeGreaterThan(headerBox.y + headerBox.height + 8);
    expect(contentBox.x).toBeGreaterThan(sidebarBox.x + sidebarBox.width + 8);
    expect(tocBox.x).toBeGreaterThan(contentBox.x + contentBox.width + 8);
  });

  test("workflow copy button provides visual success feedback", async ({ page }) => {
    await page.goto(SAMPLE_PAGE);
    const copyButton = page.locator("[data-copy-json]").first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(copyButton).toHaveClass(/is-success/);
  });

  test("assistant rail opens info window and closes via the close button", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(SAMPLE_PAGE);
    // Ensure the assistant trigger is visible even if responsive styles would hide it at smaller sizes.
    await page.evaluate(() => {
      const btn = document.querySelector<HTMLButtonElement>(".assistant-rail__avatar");
      if (btn) {
        btn.style.opacity = "1";
        btn.style.visibility = "visible";
        btn.style.display = "inline-flex";
        btn.style.pointerEvents = "auto";
      }
    });
    const rail = page.locator(".assistant-rail");
    await page.locator(".assistant-rail__avatar").hover();
    const jsonButton = page.locator('[data-assistant-target="json-help"]').first();
    await expect(jsonButton).toBeVisible();
    await jsonButton.click();
    await expect(rail).toHaveAttribute("data-view", "json-help");
    await page
      .locator('.assistant-rail__view[data-assistant-view="json-help"] [data-assistant-close]')
      .click();
    await expect(rail).toHaveAttribute("data-view", "panel");
  });

  test("assistant rail form flows through confirm and send", async ({ page }) => {
    const csrfValue = "test-csrf";
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.context().addCookies([
      {
        name: "assistant_feedback_csrf",
        value: csrfValue,
        url: BASE_TEST_URL
      }
    ]);
    await page.route("**/__assistant-test", async (route) => {
      const headers = route.request().headers();
      expect(headers["x-csrf-token"]).toBe(csrfValue);
      const body = route.request().postDataJSON();
      expect(body.url).toBe(`${BASE_TEST_URL}${SAMPLE_PAGE}`);
      expect(body).not.toHaveProperty("userAgent");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true })
      });
    });
    await page.goto(SAMPLE_PAGE);
    await page.evaluate(() => {
      const btn = document.querySelector<HTMLButtonElement>(".assistant-rail__avatar");
      if (btn) {
        btn.style.opacity = "1";
        btn.style.visibility = "visible";
        btn.style.display = "inline-flex";
        btn.style.pointerEvents = "auto";
      }
    });
    await page.evaluate(() => {
      const rail = document.querySelector(".assistant-rail");
      if (rail) {
        rail.dataset.feedbackEndpoint = "/__assistant-test";
      }
    });
    const avatar = page.locator(".assistant-rail__avatar");
    await avatar.hover();
    await page.locator('[data-assistant-target="form-correction"]').click();
    const formView = page.locator('.assistant-rail__view[data-assistant-view="form-correction"]');
    const textarea = formView.locator("textarea");
    await textarea.fill("このページのタグ一覧が最新ではありません。最新のControlNet書式を確認してください。");
    await formView.locator('[data-assistant-action="confirm"]').click();
    await expect(formView.locator("form")).toHaveAttribute("data-form-state", "confirm");
    await formView.locator('[data-assistant-action="send"]').click();
    const rail = page.locator(".assistant-rail");
    await expect(rail).toHaveAttribute("data-view", "submitted");
    await expect(page.locator("[data-assistant-submitted-detail]")).toContainText("誤り報告");
  });
});
