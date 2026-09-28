import { test, expect } from "./support/test";

const LONG_PAGE = "/ja/basic-workflows/ltx-2/";
const OTHER_PAGE = "/ja/basic-workflows/sdxl/";
const ROUTER_HEADER = "x-requested-with";

// Click a sidebar link without Playwright's scroll-into-view, which can move the window and change
// the very scroll position these tests measure.
const clickSidebarLink = (page, href: string) =>
  page.evaluate((target) => (document.querySelector(`.sidebar a[href="${target}"]`) as HTMLElement).click(), href);

test.describe("View-transition router", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
  });

  test("Back and Forward restore each page's scroll position", async ({ page }) => {
    const scrollY = () => page.evaluate(() => window.scrollY);
    await page.goto(LONG_PAGE);
    await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
    await expect.poll(scrollY).toBeGreaterThan(2000);
    const savedY = await scrollY();

    await clickSidebarLink(page, OTHER_PAGE);
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");
    await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
    await expect.poll(scrollY).toBeGreaterThan(600);
    const otherY = await scrollY();

    await page.goBack();
    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    // The browser may jump briefly before the router swaps content, so require the position to hold.
    await expect.poll(async () => Math.abs((await scrollY()) - savedY), { timeout: 5000 }).toBeLessThan(50);
    await page.waitForTimeout(300);
    expect(Math.abs((await scrollY()) - savedY)).toBeLessThan(50);

    await page.goForward();
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");
    await expect.poll(async () => Math.abs((await scrollY()) - otherY), { timeout: 5000 }).toBeLessThan(50);
  });

  test("Back restores a deep position even when the next page is shorter", async ({ page }) => {
    const SHORT_PAGE = "/ja/basic-workflows/chroma1-hd/";
    const scrollY = () => page.evaluate(() => window.scrollY);
    await page.goto(LONG_PAGE);
    const deepY = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight - 10);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), deepY);
    await expect.poll(scrollY).toBeGreaterThan(deepY - 20);
    const savedY = await scrollY();

    await clickSidebarLink(page, SHORT_PAGE);
    await expect(page).toHaveURL(SHORT_PAGE);
    // The short page cannot scroll as deep as the saved position.
    expect(await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)).toBeLessThan(savedY);
    await page.goBack();
    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    await expect.poll(async () => Math.abs((await scrollY()) - savedY), { timeout: 5000 }).toBeLessThan(50);
  });

  test("a rapid double Back while a page is loading keeps each entry's own position", async ({ page }) => {
    const START_PAGE = "/ja/basic-workflows/chroma1-hd/";
    const scrollY = () => page.evaluate(() => window.scrollY);
    await page.goto(START_PAGE);
    await clickSidebarLink(page, LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
    await expect.poll(scrollY).toBeGreaterThan(2000);
    const longY = await scrollY();
    await clickSidebarLink(page, OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");
    await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
    await expect.poll(scrollY).toBeGreaterThan(250);

    // Hold the long page so the first Back is still loading when the second Back arrives.
    let releaseLong: () => void = () => {};
    const gate = new Promise<void>((resolve) => (releaseLong = resolve));
    await page.route(`**${LONG_PAGE}`, async (route) => {
      await gate;
      await route.continue();
    });
    const longFetch = page.waitForRequest((request) => request.url().endsWith(LONG_PAGE) && Boolean(request.headers()[ROUTER_HEADER]));
    await page.evaluate(() => history.back());
    await longFetch;
    await page.evaluate(() => history.back());
    await expect(page).toHaveURL(START_PAGE);
    await expect(page.locator("h1").first()).toContainText("Chroma1-HD");
    releaseLong();
    await page.unroute(`**${LONG_PAGE}`);

    await page.goForward();
    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    await expect.poll(async () => Math.abs((await scrollY()) - longY), { timeout: 5000 }).toBeLessThan(50);
  });

  test("a restore stops once the page is scrolled without wheel, touch, or keys", async ({ page }) => {
    const scrollY = () => page.evaluate(() => window.scrollY);
    await page.goto(LONG_PAGE);
    await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
    await expect.poll(scrollY).toBeGreaterThan(2000);
    await clickSidebarLink(page, OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");
    await page.goBack();
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    await expect.poll(scrollY).toBeGreaterThan(2000);
    // Like dragging the scrollbar or find-in-page: a scroll with no input events on the page, after the
    // short grace period in which leftover smooth-scroll frames are ignored.
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    await page.waitForTimeout(1500);
    expect(Math.abs((await scrollY()) - 600)).toBeLessThan(50);
  });

  test("reload keeps the scroll position", async ({ page }) => {
    const scrollY = () => page.evaluate(() => window.scrollY);
    await page.goto(LONG_PAGE);
    await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
    await expect.poll(scrollY).toBeGreaterThan(2000);
    const savedY = await scrollY();
    await page.waitForTimeout(400);
    await page.reload();
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    await expect.poll(async () => Math.abs((await scrollY()) - savedY), { timeout: 5000 }).toBeLessThan(50);
  });

  test("Back pressed while the next page is still loading keeps history intact", async ({ page }) => {
    const SLOW_PAGE = "/ja/basic-workflows/sd15-lora/";
    // Hold every request for the slow page (including hover/viewport prefetches) until released.
    let releaseSlow: () => void = () => {};
    const slowGate = new Promise<void>((resolve) => (releaseSlow = resolve));
    await page.route(`**${SLOW_PAGE}`, async (route) => {
      await slowGate;
      await route.continue();
    });

    await page.goto(LONG_PAGE);
    await page.locator(`.sidebar a[href="${OTHER_PAGE}"]`).first().click();
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");

    const routerFetch = page.waitForRequest(
      (request) => request.url().endsWith(SLOW_PAGE) && Boolean(request.headers()[ROUTER_HEADER])
    );
    await page.locator(`.sidebar a[href="${SLOW_PAGE}"]`).first().click();
    await routerFetch;

    await page.goBack();
    releaseSlow();
    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");

    await page.goForward();
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");
  });

  test("Back fired right after a prefetched navigation commits keeps history intact", async ({ page }) => {
    const NEXT_PAGE = "/ja/basic-workflows/sd15-lora/";
    await page.goto(LONG_PAGE);
    await page.locator(`.sidebar a[href="${OTHER_PAGE}"]`).first().click();
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");

    // Make sure the next page is prefetched so the click commits without waiting for the network.
    await page.locator(`.sidebar a[href="${NEXT_PAGE}"]`).first().hover();
    await expect
      .poll(() =>
        page.evaluate(
          (href) => performance.getEntriesByType("resource").some((entry) => entry.name.endsWith(href) && entry.responseEnd > 0),
          NEXT_PAGE
        )
      )
      .toBe(true);
    await page.waitForTimeout(100);

    await page.evaluate((href) => {
      (document.querySelector(`.sidebar a[href="${href}"]`) as HTMLElement).click();
      history.back();
    }, NEXT_PAGE);

    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");

    await page.goForward();
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");
  });

  test("cross-page links with a hash scroll to the target heading", async ({ page }) => {
    await page.goto(LONG_PAGE);
    await page.evaluate(() => {
      const link = document.createElement("a");
      link.href = "/ja/begin-with/setup/#" + encodeURIComponent("デスクトップ版");
      link.textContent = "cross-page hash";
      link.id = "cross-page-hash";
      document.querySelector(".article-body")?.prepend(link);
    });
    await page.locator("#cross-page-hash").click();
    await expect(page).toHaveURL(/\/ja\/begin-with\/setup\/#/);
    const target = page.locator(".article-body h2", { hasText: "デスクトップ版" });
    await expect.poll(async () => (await target.boundingBox())?.y ?? -1).toBeGreaterThan(0);
    await expect.poll(async () => (await target.boundingBox())?.y ?? 9999).toBeLessThan(300);
  });

  test("Back right after a navigation shows the matching page", async ({ page }) => {
    await page.goto(LONG_PAGE);
    await page.locator(`.sidebar a[href="${OTHER_PAGE}"]`).first().click();
    await expect(page).toHaveURL(OTHER_PAGE);
    await page.goBack();
    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    await expect(page).toHaveTitle(/LTX-2/);
  });

  test("Back after an in-page hash link does not refetch the page", async ({ page }) => {
    await page.goto("/ja/begin-with/setup/");
    const routerFetches: string[] = [];
    page.on("request", (request) => {
      if (request.headers()[ROUTER_HEADER]) routerFetches.push(request.url());
    });

    await page
      .locator(".article-body")
      .getByRole("link", { name: "デスクトップ版（インストーラー形式）" })
      .click();
    await expect(page).toHaveURL(/#/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

    await page.goBack();
    await expect(page).toHaveURL("/ja/begin-with/setup/");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
    await page.waitForTimeout(300);
    expect(routerFetches.filter((url) => url.includes("/ja/begin-with/setup/"))).toEqual([]);
  });

  test("with reduced motion, Back after an in-page hash link returns to the starting point", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/ja/begin-with/setup/");
    await page
      .locator(".article-body")
      .getByRole("link", { name: "デスクトップ版（インストーラー形式）" })
      .click();
    await expect(page).toHaveURL(/#/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
    await page.goBack();
    await expect(page).toHaveURL("/ja/begin-with/setup/");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });

  test("keeps the meta description in sync, including pages without one", async ({ page }) => {
    await page.route(`**${OTHER_PAGE}`, async (route) => {
      const response = await route.fetch();
      const html = (await response.text()).replace(/<meta name="description"[^>]*>/, "");
      await route.fulfill({ response, body: html });
    });
    await page.goto(LONG_PAGE);
    const original = await page.locator('meta[name="description"]').getAttribute("content");
    expect(original).toBeTruthy();

    await page.locator(`.sidebar a[href="${OTHER_PAGE}"]`).first().click();
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator('meta[name="description"]')).toHaveCount(0);

    await page.goBack();
    await expect(page).toHaveURL(LONG_PAGE);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", original!);
  });

  test("a link into another language loads the whole page in that language", async ({ page }) => {
    await page.goto(OTHER_PAGE);
    await page.evaluate(() => {
      const link = document.createElement("a");
      link.href = "/zh/basic-workflows/sdxl/";
      link.id = "to-zh";
      link.textContent = "zh";
      document.querySelector(".article-body")?.prepend(link);
      (window as any).__sameDocument = true;
    });
    await page.locator("#to-zh").click();
    await expect(page).toHaveURL("/zh/basic-workflows/sdxl/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh");
    // A full load replaces the header and sidebar too, so nothing Japanese is left in the shell.
    await expect.poll(() => page.evaluate(() => (window as any).__sameDocument ?? false)).toBe(false);
    await expect(page.locator(".sidebar__lang-label").first()).toContainText("中文");
  });

  test("swaps every page-specific head tag on navigation", async ({ page }) => {
    const headState = () =>
      page.evaluate(() => ({
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute("content"),
        jsonLd: document.querySelector('script[type="application/ld+json"]')?.textContent || "",
        hreflangs: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((link) => link.getAttribute("href")),
        robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") || null,
        published: document.querySelector('meta[property="article:published_time"]')?.getAttribute("content") || null,
        pageMetaCount: document.querySelectorAll("head [data-page-meta]").length
      }));

    await page.goto(OTHER_PAGE);
    const direct = await headState();
    await page.goto(LONG_PAGE);
    await clickSidebarLink(page, OTHER_PAGE);
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");
    // After a router navigation the head must match a direct load of the same page.
    expect(await headState()).toEqual(direct);
    expect(direct.canonical).toContain(OTHER_PAGE);
    expect(direct.jsonLd).toContain(`${OTHER_PAGE}#article`);

    // Article -> noindex non-article page: article tags disappear, robots appears.
    await page.evaluate(() => {
      const link = document.createElement("a");
      link.href = "/ja/about/";
      link.id = "to-about";
      link.textContent = "about";
      document.querySelector(".article-body")?.prepend(link);
    });
    await page.locator("#to-about").click();
    await expect(page).toHaveURL("/ja/about/");
    const about = await headState();
    expect(about.robots).toBe("noindex");
    expect(about.published).toBeNull();
    expect(about.hreflangs).toEqual([]);
    expect(about.jsonLd).not.toContain('"Article"');

    await page.goBack();
    await expect(page).toHaveURL(OTHER_PAGE);
    await expect(page.locator("h1").first()).toContainText("SDXL");
    expect(await headState()).toEqual(direct);
  });

  test("document listeners from page widgets do not pile up across navigations", async ({ page }) => {
    await page.addInitScript(() => {
      const records: { type: string; listener: any; signal?: AbortSignal; removed?: boolean }[] = [];
      (window as any).__docListeners = records;
      const add = document.addEventListener.bind(document);
      const remove = document.removeEventListener.bind(document);
      document.addEventListener = ((type: string, listener: any, options?: any) => {
        records.push({ type, listener, signal: typeof options === "object" ? options?.signal : undefined });
        return add(type, listener, options);
      }) as typeof document.addEventListener;
      document.removeEventListener = ((type: string, listener: any, options?: any) => {
        const record = records.find((r) => r.type === type && r.listener === listener && !r.removed);
        if (record) record.removed = true;
        return remove(type, listener, options);
      }) as typeof document.removeEventListener;
    });
    const active = () =>
      page.evaluate(() => (window as any).__docListeners.filter((r: any) => !r.removed && !r.signal?.aborted).length);

    await page.goto(LONG_PAGE);
    await expect(page.locator("h1").first()).toContainText("LTX-2");
    for (let i = 0; i < 2; i += 1) {
      await page.locator(`.sidebar a[href="${OTHER_PAGE}"]`).first().click();
      await expect(page).toHaveURL(OTHER_PAGE);
      await page.goBack();
      await expect(page).toHaveURL(LONG_PAGE);
      await expect(page.locator("h1").first()).toContainText("LTX-2");
    }
    await page.mouse.click(2, 2); // fire pointer events on the document without depending on a target
    const baseline = await active();

    for (let i = 0; i < 3; i += 1) {
      await page.locator(`.sidebar a[href="${OTHER_PAGE}"]`).first().click();
      await expect(page).toHaveURL(OTHER_PAGE);
      await page.goBack();
      await expect(page).toHaveURL(LONG_PAGE);
      await expect(page.locator("h1").first()).toContainText("LTX-2");
    }
    await page.mouse.click(2, 2); // fire pointer events on the document without depending on a target
    expect(await active()).toBe(baseline);
  });
});
