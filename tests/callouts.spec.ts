import { test, expect } from "./support/test";

test.describe("Callouts", () => {
  test("marked blockquotes render as callouts of their kind without the marker", async ({ page }) => {
    await page.goto("/ja/begin-with/nodes/");
    for (const kind of ["note", "tip", "warning"]) {
      const callout = page.locator(`blockquote.callout--${kind}`).first();
      await expect(callout).toBeVisible();
      await expect(callout).not.toContainText("[!");
    }
    const warning = page.locator("blockquote.callout--warning").first();
    const note = page.locator("blockquote.callout--note").first();
    const fill = (el: typeof note) => el.evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(await fill(warning)).not.toBe(await fill(note));
  });

  test("a blockquote without a marker stays a plain quotation", async ({ page }) => {
    await page.goto("/ja/ai-capabilities/instruction-based-image-editing/");
    const quote = page.locator(".article-body blockquote:not(.callout)").first();
    await expect(quote).toContainText("Turn the car red");
    expect(await quote.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
    expect(await quote.evaluate((node) => getComputedStyle(node, "::before").content)).toBe("none");
  });
});
