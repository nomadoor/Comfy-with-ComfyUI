import { test, expect } from "@playwright/test";

const SAMPLE_PAGE = "/ja/basic-workflows/sd15-basics/";
const PLAYWRIGHT_PORT = Number(process.env.PLAYWRIGHT_PORT || 8080);
const BASE_TEST_URL =
  process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PLAYWRIGHT_PORT}`;

test.describe("Layout rails", () => {
  test("heading permalink icon copies the heading URL", async ({ page }) => {
    await page.addInitScript(() => {
      window.__copied = "";
      const clipboard = navigator.clipboard || {};
      try {
        Object.defineProperty(navigator, "clipboard", {
          value: clipboard,
          configurable: true
        });
      } catch {
        // ignore
      }
      clipboard.writeText = async (value) => {
        window.__copied = String(value || "");
      };
    });

    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto("/en/basic-workflows/sd15-hires-fix/");

    const heading = page.locator(".article-body h2", { hasText: "Basic Method" });
    await expect(heading).toBeVisible();

    await expect
      .poll(async () => heading.getAttribute("id"))
      .toBe("basic-method");

    const button = heading.locator(".heading-anchor");
    await expect(button).toHaveCount(1);

    await button.focus();
    await expect(button).toBeVisible();

    await button.click();

    await expect(button).toHaveClass(/is-success/);

    await expect
      .poll(() => page.evaluate(() => window.__copied))
      .toContain("#basic-method");
  });

  test("Gyazo hero images always use max_size variants", async ({ page }) => {
    await page.setViewportSize({ width: 1700, height: 900 });
    await page.goto("/ja/begin-with/what-is-comfyui/");

    const heroImage = page.locator(".hero img.hero__media");
    await expect(heroImage).toBeVisible();

    await expect
      .poll(async () => heroImage.evaluate((img) => img.complete && img.naturalWidth > 0))
      .toBeTruthy();

    const currentSrc = await heroImage.evaluate((img) => img.currentSrc || img.src);
    expect(currentSrc).toContain("/max_size/");
  });

  test("Gyazo lightbox requests raw only after opening", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    let rawRequests = 0;
    await page.route(/^https:\/\/gyazo\.com\/[a-f0-9]{32}\/raw$/i, async (route) => {
      rawRequests += 1;
      await route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="3394" height="2136"><rect width="3394" height="2136" fill="#777"/></svg>'
      });
    });

    await page.goto("/ja/basic-workflows/anima/");
    expect(rawRequests).toBe(0);
    const articleImage = page.locator(".article-body .article-media img").first();
    const fullSrc = await articleImage.getAttribute("data-full-src");
    await articleImage.click();

    const lightboxImage = page.locator("[data-lightbox-image]");
    const rawImage = page.locator("[data-lightbox-raw]");
    await expect(rawImage).toHaveAttribute("src", fullSrc!);
    await expect
      .poll(() => rawImage.evaluate((image) => image.complete && image.naturalWidth))
      .toBe(3394);
    expect(rawRequests).toBe(1);
    await expect(lightboxImage).toHaveCSS("display", "grid");
    await expect(lightboxImage).toHaveCSS("background-image", "none");
    await expect(lightboxImage).toHaveCSS("transform", "none");
    await expect(lightboxImage).toHaveCSS("will-change", "auto");
    await expect(rawImage).toBeVisible();
    await expect(rawImage).not.toHaveClass(/img-fade/);
    await expect(page.locator("[data-lightbox-help]")).toHaveText(
      "クリックで拡大・＋／−／ホイール／ピンチで拡大縮小・ドラッグで移動"
    );

    const zoomIn = page.locator("[data-lightbox-zoom-in]");
    const readDimensions = () => lightboxImage.evaluate((stack) => {
      const raw = stack.querySelector<HTMLImageElement>("[data-lightbox-raw]");
      return {
        maxScale: Number((stack as HTMLElement).dataset.zoomMax),
        fittedWidth: (stack as HTMLElement).clientWidth,
        fittedHeight: (stack as HTMLElement).clientHeight,
        rawWidth: raw?.naturalWidth || 0,
        rawHeight: raw?.naturalHeight || 0
      };
    });
    const mobileDimensions = await readDimensions();
    const expectedMobileMax = Math.max(
      1,
      mobileDimensions.rawWidth / mobileDimensions.fittedWidth,
      mobileDimensions.rawHeight / mobileDimensions.fittedHeight
    );
    expect(mobileDimensions.maxScale).toBeCloseTo(expectedMobileMax, 5);
    expect(mobileDimensions.maxScale).not.toBe(5);
    for (let step = 0; step < Math.ceil((mobileDimensions.maxScale - 1) / 0.5); step += 1) {
      await zoomIn.click();
    }
    await expect(page.locator("[data-lightbox-zoom-value]")).toHaveText(
      `${Math.round(mobileDimensions.maxScale * 100)}%`
    );
    await expect(zoomIn).toBeDisabled();

    await page.setViewportSize({ width: 1200, height: 800 });
    await expect.poll(async () => (await readDimensions()).maxScale).not.toBe(mobileDimensions.maxScale);
    const desktopDimensions = await readDimensions();
    const expectedDesktopMax = Math.max(
      1,
      desktopDimensions.rawWidth / desktopDimensions.fittedWidth,
      desktopDimensions.rawHeight / desktopDimensions.fittedHeight
    );
    expect(desktopDimensions.maxScale).toBeCloseTo(expectedDesktopMax, 5);
    expect(desktopDimensions.maxScale).not.toBe(5);
    await expect(page.locator("[data-lightbox-zoom-value]")).toHaveText(
      `${Math.round(desktopDimensions.maxScale * 100)}%`
    );
    await expect(zoomIn).toBeDisabled();
  });

  test("Gyazo lightbox loads raw media and supports pan and continuous zoom", async ({ page }) => {
    await page.goto("/ja/basic-workflows/anima/");

    const articleImage = page.locator(".article-body .article-media img").first();
    const previewSrc = await articleImage.getAttribute("src");
    const fullSrc = await articleImage.getAttribute("data-full-src");

    expect(previewSrc).toContain("/max_size/");
    expect(fullSrc).toMatch(/^https:\/\/gyazo\.com\/[a-f0-9]{32}\/raw$/);
    expect(fullSrc).not.toContain("/max_size/");

    await page.route(fullSrc!, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'
      });
    });

    await articleImage.click();
    const lightboxImage = page.locator("[data-lightbox-image]");
    const rawImage = page.locator("[data-lightbox-raw]");
    await expect(lightboxImage).toHaveCSS("background-image", /max_size/);
    await expect(rawImage).toHaveAttribute("src", fullSrc!, { timeout: 500 });
    await expect(rawImage).toHaveAttribute("fetchpriority", "high");
    await expect(rawImage).toBeVisible();
    await expect(rawImage).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

    const lightbox = page.locator(".lightbox");
    const media = page.locator(".lightbox__media");
    const zoomIn = page.locator("[data-lightbox-zoom-in]");
    const zoomReset = page.locator("[data-lightbox-zoom-reset]");

    await expect(page.locator("[data-lightbox-help]")).toContainText(
      "クリックで拡大・＋／−／ホイール／ピンチで拡大縮小・ドラッグで移動"
    );
    await expect(page.locator(".lightbox__controls")).toHaveCSS("border-top-style", "none");
    await expect(page.locator("[data-lightbox-close]")).toHaveAttribute("aria-label", "閉じる");
    await expect(zoomReset.locator(".lightbox__icon")).toBeVisible();
    await expect(zoomReset).toBeDisabled();
    await expect(zoomReset).toHaveCSS("color", "rgba(255, 255, 255, 0.34)");
    await expect(page.locator(".lightbox__zoom-controls")).toHaveCSS("display", "flex");
    await expect(page.locator(".lightbox__zoom-controls")).toHaveCSS("align-items", "center");
    await expect(page.locator(".lightbox__zoom-controls")).toHaveCSS("gap", "normal");
    await expect(page.locator(".lightbox__zoom-level")).toHaveCSS("display", "flex");
    await expect(page.locator(".lightbox__zoom-level")).toHaveCSS("align-items", "center");
    await expect(page.locator("[data-lightbox-zoom-value]")).toHaveCSS("transform", "none");
    const browserZoomAllowed = await page.evaluate(() => document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "+", ctrlKey: true, bubbles: true, cancelable: true })
    ));
    expect(browserZoomAllowed).toBe(true);
    await expect(lightboxImage).toHaveAttribute("data-zoom-scale", "1");

    const controlBoxes = await Promise.all([
      zoomReset.locator(".lightbox__icon").boundingBox(),
      page.locator("[data-lightbox-zoom-out] .lightbox__icon").boundingBox(),
      page.locator("[data-lightbox-zoom-in] .lightbox__icon").boundingBox()
    ]);
    if (controlBoxes.some((box) => !box)) throw new Error("Unable to measure the zoom icons");
    const iconCenters = controlBoxes.map((box) => box!.y + box!.height / 2);
    expect(Math.max(...iconCenters) - Math.min(...iconCenters)).toBeLessThan(0.1);

    const zoomOutBox = await page.locator("[data-lightbox-zoom-out]").boundingBox();
    const zoomValueBox = await page.locator("[data-lightbox-zoom-value]").boundingBox();
    const zoomInBox = await zoomIn.boundingBox();
    const zoomResetBox = await zoomReset.boundingBox();
    const zoomLevelBox = await page.locator(".lightbox__zoom-level").boundingBox();
    if (!zoomOutBox || !zoomValueBox || !zoomInBox || !zoomResetBox || !zoomLevelBox) {
      throw new Error("Unable to measure the zoom controls");
    }
    const zoomOutCenter = zoomOutBox.x + zoomOutBox.width / 2;
    const zoomValueCenter = zoomValueBox.x + zoomValueBox.width / 2;
    const zoomInCenter = zoomInBox.x + zoomInBox.width / 2;
    expect(Math.abs(zoomValueCenter - (zoomOutCenter + zoomInCenter) / 2)).toBeLessThan(0.1);
    const resetCenterY = zoomResetBox.y + zoomResetBox.height / 2;
    const zoomLevelCenterY = zoomLevelBox.y + zoomLevelBox.height / 2;
    expect(Math.abs(resetCenterY - zoomLevelCenterY)).toBeLessThan(0.1);

    const initialImageBox = await lightboxImage.boundingBox();
    const previousBox = await page.locator("[data-lightbox-prev]").boundingBox();
    const nextBox = await page.locator("[data-lightbox-next]").boundingBox();
    if (!initialImageBox || !previousBox || !nextBox) {
      throw new Error("Unable to measure the initial Lightbox layout");
    }
    expect(initialImageBox.x).toBeGreaterThanOrEqual(previousBox.x + previousBox.width);
    expect(initialImageBox.x + initialImageBox.width).toBeLessThanOrEqual(nextBox.x);

    await lightboxImage.click();
    await expect(lightboxImage).toHaveAttribute("data-zoom-scale", "2");
    await expect(lightboxImage).toHaveCSS("cursor", "grab");
    await expect(lightboxImage).toHaveCSS("will-change", "transform");
    await expect(zoomReset).toBeEnabled();
    await expect(page.locator("[data-lightbox-help]")).toHaveText(
      "クリックで拡大・＋／−／ホイール／ピンチで拡大縮小・ドラッグで移動"
    );

    await zoomReset.click();
    await expect(lightboxImage).toHaveAttribute("data-zoom-scale", "1");
    await expect(lightboxImage).toHaveCSS("cursor", "zoom-in");
    await expect(zoomReset).toBeDisabled();

    await zoomIn.click();
    await expect(lightboxImage).toHaveAttribute("data-zoom-scale", "1.5");
    await expect(page.locator("[data-lightbox-zoom-value]")).toHaveText("150%");

    const mediaBox = await media.boundingBox();
    if (!mediaBox) throw new Error("Unable to measure the lightbox media");
    const centerX = mediaBox.x + mediaBox.width / 2;
    const centerY = mediaBox.y + mediaBox.height / 2;

    await page.mouse.move(centerX, centerY);
    await page.mouse.wheel(0, -100);
    await expect(lightboxImage).toHaveAttribute("data-zoom-scale", "2");

    const transformBeforeDrag = await lightboxImage.evaluate((image) => image.style.transform);
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 60, centerY + 35);
    await page.mouse.up();
    await expect
      .poll(() => lightboxImage.evaluate((image) => image.style.transform))
      .not.toBe(transformBeforeDrag);

    const enlargedImageBox = await lightboxImage.boundingBox();
    if (!enlargedImageBox) throw new Error("Unable to measure the enlarged image");
    expect(enlargedImageBox.width).toBeGreaterThan(mediaBox.width);

    await zoomReset.click();
    await expect(lightboxImage).toHaveAttribute("data-zoom-scale", "1");

    await media.click({ position: { x: 5, y: 5 } });
    await expect(lightbox).not.toHaveClass(/is-open/);
  });

  test("direct hash links scroll to the target heading", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto("/en/basic-workflows/sd15-hires-fix/#basic-method");

    const header = page.locator(".site-header");
    const target = page.locator("#basic-method");

    await expect(target).toBeVisible();

    const headerBox = await header.boundingBox();
    const targetBox = await target.boundingBox();

    if (!headerBox || !targetBox) {
      throw new Error("Unable to measure layout boxes");
    }

    // Target heading should be below the sticky header area.
    expect(targetBox.y).toBeGreaterThan(headerBox.height - 1);
  });

  test("in-page article hash links scroll to the target heading", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto("/ja/begin-with/setup/");

    await page
      .locator(".article-body")
      .getByRole("link", { name: "デスクトップ版（インストーラー形式）" })
      .click();
    await expect(page).toHaveURL(/#%E3%83%87%E3%82%B9%E3%82%AF%E3%83%88%E3%83%83%E3%83%97%E7%89%88$/);

    const header = page.locator(".site-header");
    const target = page.locator(".article-body h2", { hasText: "デスクトップ版" });

    await expect(target).toBeVisible();

    const headerBox = await header.boundingBox();
    const targetBox = await target.boundingBox();

    if (!headerBox || !targetBox) {
      throw new Error("Unable to measure layout boxes");
    }

    expect(targetBox.y).toBeGreaterThan(headerBox.height - 1);
  });

  test("sidebar and TOC rails stay sticky with proper offsets", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto(SAMPLE_PAGE);

    const sidebarColumn = page.locator(".app-shell__sidebar");
    const tocColumn = page.locator(".app-shell__toc");
    const sidebarRail = page.locator(".rail--sidebar");
    const tocRail = page.locator(".rail--toc");
    const content = page.locator(".app-shell__content");
    const header = page.locator(".site-header");

    await expect(sidebarColumn).toHaveCSS("position", "sticky");
    await expect(tocColumn).toHaveCSS("position", "sticky");

    const sidebarBox = await sidebarRail.boundingBox();
    const tocBox = await tocRail.boundingBox();
    const contentBox = await content.boundingBox();
    const headerBox = await header.boundingBox();

    if (!sidebarBox || !tocBox || !contentBox || !headerBox) {
      throw new Error("Unable to measure layout boxes");
    }

    expect(sidebarBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 1);
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

  test("assistant rail choices do not scroll the article", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
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

    const rail = page.locator(".assistant-rail");
    const openChoiceWithoutScroll = async (viewId: string) => {
      await page.evaluate(() => window.scrollTo(0, 260));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(260);

      await page.evaluate((targetViewId) => {
        const avatar = document.querySelector<HTMLElement>(".assistant-rail__avatar");
        avatar?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        document.querySelector<HTMLElement>(`[data-assistant-target="${targetViewId}"]`)?.click();
      }, viewId);
      await expect(rail).toHaveAttribute("data-view", viewId);

      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBe(260);

      await page.evaluate((targetViewId) => {
        document
          .querySelector<HTMLElement>(`.assistant-rail__view[data-assistant-view="${targetViewId}"] [data-assistant-close]`)
          ?.click();
      }, viewId);
      await expect(rail).toHaveAttribute("data-view", "panel");
    };

    await openChoiceWithoutScroll("json-help");
    await openChoiceWithoutScroll("form-correction");
    await openChoiceWithoutScroll("form-request");
  });

  test("assistant rail form flows through confirm and send", async ({ page }) => {
    const csrfValue = "test-csrf";
    await page.addInitScript(() => {
      const callbacks = new Map();
      let nextId = 1;
      window.turnstile = {
        render(element, options) {
          const id = nextId++;
          callbacks.set(id, options?.callback);
          // Simulate solved captcha immediately.
          if (typeof options?.callback === "function") {
            options.callback("playwright-turnstile-token");
          }
          return id;
        },
        reset(id) {
          const cb = callbacks.get(id);
          if (typeof cb === "function") {
            cb("playwright-turnstile-token");
          }
        },
        execute(id) {
          const cb = callbacks.get(id);
          if (typeof cb === "function") {
            cb("playwright-turnstile-token");
          }
          return "playwright-turnstile-token";
        },
        remove(id) {
          callbacks.delete(id);
        },
        getResponse() {
          return "playwright-turnstile-token";
        }
      };
    });
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
