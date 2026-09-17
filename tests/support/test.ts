import fs from "node:fs";
import path from "node:path";
import { test as base, expect, type Page } from "@playwright/test";

// Shared Playwright `test`: every page fulfills R2 and Gyazo requests from local fixtures, so tests
// never depend on either service (a slow Gyazo response can otherwise hold the `load` event past the
// test timeout). Routes registered inside a test are added later and take precedence.

const FIXTURE_PNG = fs.readFileSync(path.resolve("tests", "fixtures", "media", "r2_image.png"));
const FIXTURE_MP4 = fs.readFileSync(path.resolve("tests", "fixtures", "media", "r2_video.mp4"));

export async function routeExternalMedia(page: Page) {
  const fulfill = async (route) => {
    const url = route.request().url();
    if (/\.mp4(?:$|\?)/i.test(url)) {
      await route.fulfill({ status: 200, contentType: "video/mp4", body: FIXTURE_MP4 });
    } else {
      await route.fulfill({ status: 200, contentType: "image/png", body: FIXTURE_PNG });
    }
  };
  await page.route(/^https:\/\/media\.comfyui\.nomadoor\.net\//, fulfill);
  await page.route(/^https:\/\/(?:[a-z0-9-]+\.)?gyazo\.com\//, fulfill);
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await routeExternalMedia(page);
    await use(page);
  }
});

export { expect };
