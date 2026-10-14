import { test, expect, type Page } from "./support/test";

// Characterization tests for the contact page (src/assets/js/contact.js): they pin today's
// behavior so the module can be split without changing it. Turnstile is replaced by a stub
// that always returns a token, and both endpoints are intercepted.

const CONTACT = "/ja/contact/";
const FEEDBACK_ENDPOINT = "https://feedback.test/report";

async function stubTurnstile(page: Page) {
  await page.route(/^https:\/\/challenges\.cloudflare\.com\//, (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
  );
  await page.addInitScript(() => {
    (window as any).turnstile = {
      render(_el: Element, options: { callback?: (token: string) => void }) {
        setTimeout(() => options?.callback?.("test-token"), 0);
        return "widget-1";
      },
      getResponse: () => "test-token",
      reset: () => {}
    };
  });
}

test.beforeEach(async ({ page }) => {
  await stubTurnstile(page);
});

test("fix report: confirm shows the composed message and sends it to the feedback endpoint", async ({ page }) => {
  let posted: any = null;
  await page.route(FEEDBACK_ENDPOINT, async (route) => {
    posted = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await page.goto(CONTACT);
  await page.evaluate((endpoint) => {
    document.querySelector<HTMLElement>(".assistant-rail")!.dataset.feedbackEndpoint = endpoint;
  }, FEEDBACK_ENDPOINT);

  const form = page.locator('[data-contact-form="fix"]');
  await form.locator('input[name="page_url"]').fill("/ja/begin-with/setup/");
  await form.locator('textarea[name="message"]').fill("手順3のコマンドが古いバージョンのままになっています。");
  await form.locator("[data-contact-submit]").click();

  await expect(form).toHaveAttribute("data-form-state", "confirm");
  const preview = form.locator("[data-contact-confirm-message]");
  await expect(preview).toContainText("/ja/begin-with/setup/");
  await expect(preview).toContainText("手順3のコマンドが古いバージョンのままになっています。");

  await form.locator("[data-contact-confirm-send]").click();
  await expect.poll(() => posted).not.toBeNull();
  expect(posted).toMatchObject({ type: "report", lang: "ja", turnstileToken: "test-token", labels: ["report"] });
  expect(posted.message).toContain("手順3のコマンドが古いバージョンのままになっています。");
  expect(posted.url).toContain("/ja/begin-with/setup/");
  await expect(form).toHaveAttribute("data-form-state", "input");
  await expect(form.locator('textarea[name="message"]')).toHaveValue("");
});

test("fix report: a message under the minimum length stays on the input step", async ({ page }) => {
  await page.goto(CONTACT);
  const form = page.locator('[data-contact-form="fix"]');
  await form.locator('input[name="page_url"]').fill("/ja/begin-with/setup/");
  await form.locator('textarea[name="message"]').fill("短い");
  await form.locator("[data-contact-submit]").click();
  await expect(form).not.toHaveAttribute("data-form-state", "confirm");
  await expect(form.locator("[data-contact-status]").first()).not.toBeEmpty();
});

test("fix report: back returns from confirm to input with the text kept", async ({ page }) => {
  await page.goto(CONTACT);
  const form = page.locator('[data-contact-form="fix"]');
  await form.locator('input[name="page_url"]').fill("/ja/begin-with/setup/");
  await form.locator('textarea[name="message"]').fill("手順3のコマンドが古いバージョンのままになっています。");
  await form.locator("[data-contact-submit]").click();
  await expect(form).toHaveAttribute("data-form-state", "confirm");
  await form.locator("[data-contact-confirm-back]").click();
  await expect(form).toHaveAttribute("data-form-state", "input");
  await expect(form.locator('textarea[name="message"]')).toHaveValue("手順3のコマンドが古いバージョンのままになっています。");
});

test("type buttons switch the visible form, and ?type= and ?url= prefill it", async ({ page }) => {
  await page.goto(`${CONTACT}?type=request`);
  await expect(page.locator('[data-contact-form="request"]')).toBeVisible();
  await expect(page.locator('[data-contact-form="fix"]')).toBeHidden();
  await page.locator('[data-contact-type-btn="feedback"]').click();
  await expect(page.locator('[data-contact-form="feedback"]')).toBeVisible();
  await expect(page.locator('[data-contact-type-btn="feedback"]')).toHaveAttribute("aria-pressed", "true");

  await page.goto(`${CONTACT}?url=${encodeURIComponent("https://comfyui.nomadoor.net/ja/begin-with/setup/")}`);
  await expect(page.locator("[data-contact-fix-url]")).not.toHaveValue("");
});

test("operator form: category, confirm and send post the form to /api/contact", async ({ page }) => {
  let body = "";
  await page.route("**/api/contact", async (route) => {
    body = route.request().postData() || "";
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  });
  await page.goto(CONTACT);
  const form = page.locator("[data-operator-form]");
  await form.locator('input[name="reply_to"]').fill("reader@example.com");
  await form.locator("[data-contact-category-toggle]").click();
  await form.locator('[data-contact-category-option][data-value="business"]').click();
  await expect(form.locator("[data-contact-category-input]")).toHaveValue("business");
  await form.locator('textarea[name="body"]').fill("ワークフローの作成をお願いしたいです。");
  await form.locator("[data-operator-preview]").click();

  await expect(form).toHaveAttribute("data-form-state", "confirm");
  await expect(form.locator("[data-operator-confirm-message]")).toContainText("reader@example.com");

  await form.locator("[data-operator-send]").click();
  await expect.poll(() => body).toContain("reader@example.com");
  expect(body).toContain("business");
  expect(body).toContain("test-token");
  await expect(form).toHaveAttribute("data-form-state", "input");
  await expect(form.locator('input[name="reply_to"]')).toHaveValue("");
});

test("report links on articles carry the current page URL", async ({ page }) => {
  await page.goto("/ja/basic-workflows/sd15-basics/");
  const link = page.locator("[data-contact-report-link]").first();
  await expect(link).toHaveAttribute("href", /url=.*%2Fja%2Fbasic-workflows%2Fsd15-basics%2F/);
});
