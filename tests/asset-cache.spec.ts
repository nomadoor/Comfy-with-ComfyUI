import fs from "node:fs/promises";
import { test, expect } from "./support/test";

test("mutable site assets are deployment-versioned and revalidated", async ({ page }) => {
  await page.goto("/ja/begin-with/how-to-use-this-site/");

  const stylesheetUrl = await page.locator('link[href^="/assets/css/site.css"]').getAttribute("href");
  const scriptUrl = await page.locator('script[src^="/assets/js/"][src$="/app.js"]').getAttribute("src");
  const stylesheetVersion = new URL(stylesheetUrl!, page.url()).searchParams.get("v");
  const scriptVersion = scriptUrl!.split("/").at(-2);

  expect(stylesheetVersion).toBeTruthy();
  expect(scriptVersion).toBe(stylesheetVersion);
  expect(scriptUrl).not.toBe("/assets/js/app.js");
  const childModule = await page.request.get(new URL("page.js", new URL(scriptUrl!, page.url())).href);
  expect(childModule.ok()).toBe(true);

  const headers = await fs.readFile(new URL("../src/_headers", import.meta.url), "utf8");
  expect(headers).toContain("/assets/css/*\n  Cache-Control: public, max-age=0, must-revalidate");
  expect(headers).toContain("/assets/js/*\n  Cache-Control: public, max-age=0, must-revalidate");
});

test("client navigation reloads when fetched HTML belongs to another deployment", async ({ page }) => {
  const destination = "/ja/basic-workflows/sd15-text2image/";
  let documentNavigations = 0;

  await page.goto("/ja/begin-with/how-to-use-this-site/");
  const currentVersion = await page.locator("html").getAttribute("data-asset-version");
  expect(currentVersion).toBeTruthy();

  await page.route(`**${destination}`, async (route) => {
    const request = route.request();
    const response = await route.fetch();
    let body = await response.text();
    if (request.headers()["x-requested-with"] === "view-transition-router") {
      body = body.replace(
        `data-asset-version="${currentVersion}"`,
        'data-asset-version="next-deployment"'
      );
    } else if (request.isNavigationRequest()) {
      documentNavigations += 1;
    }
    await route.fulfill({ response, body });
  });

  await page.evaluate((href) => {
    const anchor = document.createElement("a");
    anchor.id = "cross-deployment-link";
    anchor.href = href;
    anchor.textContent = "cross deployment";
    document.body.append(anchor);
  }, destination);

  await page.locator("#cross-deployment-link").click();
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
  await expect.poll(() => documentNavigations).toBe(1);
});

test("client navigation reloads when fetched HTML has no deployment version", async ({ page }) => {
  const destination = "/ja/basic-workflows/sd15-text2image/";
  let documentNavigations = 0;

  await page.goto("/ja/begin-with/how-to-use-this-site/");
  const currentVersion = await page.locator("html").getAttribute("data-asset-version");
  expect(currentVersion).toBeTruthy();

  await page.route(`**${destination}`, async (route) => {
    const request = route.request();
    const response = await route.fetch();
    let body = await response.text();
    if (request.headers()["x-requested-with"] === "view-transition-router") {
      body = body.replace(` data-asset-version="${currentVersion}"`, "");
    } else if (request.isNavigationRequest()) {
      documentNavigations += 1;
    }
    await route.fulfill({ response, body });
  });

  await page.evaluate((href) => {
    const anchor = document.createElement("a");
    anchor.id = "unversioned-deployment-link";
    anchor.href = href;
    anchor.textContent = "unversioned deployment";
    document.body.append(anchor);
  }, destination);

  await page.locator("#unversioned-deployment-link").click();
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
  await expect.poll(() => documentNavigations).toBe(1);
});
