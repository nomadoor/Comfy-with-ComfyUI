import { test, expect } from "./support/test";

const FIXTURE_PAGE = "/internal/workflow-performance-fixtures/";

test.describe("Workflow performance", () => {
  test("shows configured reference data and omits the meter when data is absent", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const rows = page.locator(".workflow-json--inline");
    const configured = rows.filter({ hasText: "sd1_5_text2image.json" });
    const unconfigured = rows.filter({ hasText: "sd1_5_inpainting.json" });

    const meter = configured.getByRole("button", { name: /パフォーマンス|performance/i });
    await expect(meter).toHaveCount(1);
    await expect(meter).toHaveAttribute("data-level", "1");
    await expect(configured.locator(".workflow-performance__run")).toHaveCount(2);
    await expect(configured.locator(".workflow-performance__popup")).toContainText("RTX 4070 Ti 12GB");
    await expect(configured.locator(".workflow-performance__popup")).toContainText("DDR5 64GB");
    await expect(configured.locator(".workflow-performance__popup")).toContainText("Sage");
    await expect(configured.locator(".workflow-performance__popup")).toContainText("51s");
    const heading = configured.locator(".workflow-performance__heading");
    const download = configured.locator("[data-download-json]");
    await expect(heading).toHaveText("パフォーマンス");
    const [headingType, downloadType, headingColor, mutedColor] = await Promise.all([
      heading.evaluate((element) => {
        const style = getComputedStyle(element);
        return { fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight };
      }),
      download.evaluate((element) => {
        const style = getComputedStyle(element, "::after");
        return { fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight };
      }),
      heading.evaluate((element) => getComputedStyle(element).color),
      heading.evaluate((element) => {
        const probe = document.createElement("span");
        probe.style.color = "var(--color-text-muted)";
        element.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      })
    ]);
    expect(headingType).toEqual(downloadType);
    expect(headingColor).toBe(mutedColor);
    await expect(unconfigured.locator(".workflow-performance")).toHaveCount(0);
  });

  test("opens from hover, keyboard focus, and tap-style activation", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const configured = page.locator(".workflow-json--inline").filter({ hasText: "sd1_5_text2image.json" });
    const meter = configured.getByRole("button", { name: /パフォーマンス|performance/i });
    const popup = configured.locator(".workflow-performance__popup");

    await expect(popup).not.toBeVisible();
    await meter.hover();
    await expect(popup).toBeVisible();

    await page.locator("h1").hover();
    await meter.focus();
    await expect(popup).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(meter).toHaveAttribute("aria-expanded", "false");
    await expect(meter).toBeFocused();
    await expect(popup).not.toBeVisible();

    await page.keyboard.press("Tab");
    await meter.focus();
    await meter.click();
    await expect(meter).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(meter).toHaveAttribute("aria-expanded", "false");
    await expect(meter).toBeFocused();
    await expect(popup).not.toBeVisible();

    await page.keyboard.press("Tab");
    await meter.focus();
    await expect(popup).toBeVisible();
    await meter.click();
    await meter.click();
    await expect(meter).toHaveAttribute("aria-expanded", "false");
    await expect(popup).not.toBeVisible();

    await meter.click();
    await page.getByRole("heading", { name: "Inline without performance" }).click();
    await expect(meter).toHaveAttribute("aria-expanded", "false");
    await expect(popup).not.toBeVisible();
  });

  test("closes an open popup when another performance trigger is activated", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const inline = page.locator(".workflow-json--inline").filter({ hasText: "sd1_5_text2image.json" });
    const inlineMeter = inline.getByRole("button", { name: /パフォーマンス|performance/i });
    const inlinePopup = inline.locator(".workflow-performance__popup");
    const picker = page.locator(".workflow-json--picker");
    const pickerMeter = picker.getByRole("button", { name: /パフォーマンス|performance/i });
    const pickerPopup = picker.locator(".workflow-performance__popup:not([hidden])");

    await inlineMeter.click();
    await expect(inlineMeter).toHaveAttribute("aria-expanded", "true");
    await expect(inlinePopup).toBeVisible();

    await pickerMeter.click();
    await expect(pickerMeter).toHaveAttribute("aria-expanded", "true");
    await expect(pickerPopup).toBeVisible();
    await expect(inlineMeter).toHaveAttribute("aria-expanded", "false");
    await expect(inlinePopup).not.toBeVisible();
  });

  test("uses the supplied level icon and centers the popup over the meter", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const configured = page.locator(".workflow-json--inline").filter({ hasText: "sd1_5_text2image.json" });
    const meter = configured.getByRole("button", { name: /パフォーマンス|performance/i });
    const meterGraphic = meter.locator(".workflow-performance__meter");
    const popup = configured.locator(".workflow-performance__popup");
    const firstRun = popup.locator(".workflow-performance__run").first();
    const secondRun = popup.locator(".workflow-performance__run").nth(1);
    const ram = firstRun.locator(".workflow-performance__ram");
    const tag = firstRun.locator(".workflow-performance__tag", { hasText: "Sage" });
    const time = firstRun.locator(".workflow-performance__time");

    await meter.hover();
    await expect(popup).toBeVisible();

    const [triggerBox, popupBox, ramBox, tagBox, timeBox, firstEnvironmentBox, secondEnvironmentBox, runGaps, popupRightInset] = await Promise.all([
      meter.boundingBox(),
      popup.boundingBox(),
      ram.boundingBox(),
      tag.boundingBox(),
      time.boundingBox(),
      firstRun.locator(".workflow-performance__environment").boundingBox(),
      secondRun.locator(".workflow-performance__environment").boundingBox(),
      popup.locator(".workflow-performance__run").evaluateAll((runs) => runs.map((run) => {
        const environment = run.querySelector(".workflow-performance__environment")!.getBoundingClientRect();
        const time = run.querySelector(".workflow-performance__time")!.getBoundingClientRect();
        const probe = document.createElement("span");
        probe.style.width = "var(--space-sm)";
        run.append(probe);
        const spaceSm = Number.parseFloat(getComputedStyle(probe).width);
        probe.remove();
        return {
          actual: time.left - environment.right,
          configured: Number.parseFloat(getComputedStyle(run).columnGap),
          spaceSm
        };
      })),
      popup.evaluate((element) => {
        const popupBox = element.getBoundingClientRect();
        const paddingRight = Number.parseFloat(getComputedStyle(element).paddingRight);
        const rightmostTime = Math.max(...Array.from(element.querySelectorAll(".workflow-performance__time"), (time) => time.getBoundingClientRect().right));
        return popupBox.right - paddingRight - rightmostTime;
      })
    ]);

    expect(triggerBox).not.toBeNull();
    expect(popupBox).not.toBeNull();
    expect(ramBox).not.toBeNull();
    expect(tagBox).not.toBeNull();
    expect(timeBox).not.toBeNull();
    expect(firstEnvironmentBox).not.toBeNull();
    expect(secondEnvironmentBox).not.toBeNull();
    const maskImage = decodeURIComponent(await meterGraphic.evaluate((element) => getComputedStyle(element).maskImage));
    expect(maskImage).toContain("/assets/icons/Performance 1 SVG.svg");
    expect(Math.abs((popupBox!.x + popupBox!.width / 2) - (triggerBox!.x + triggerBox!.width / 2))).toBeLessThanOrEqual(2);
    expect(triggerBox!.y - (popupBox!.y + popupBox!.height)).toBeGreaterThanOrEqual(8);
    expect(Math.abs(ramBox!.y - tagBox!.y)).toBeLessThanOrEqual(2);
    expect(Math.abs((timeBox!.y + timeBox!.height) - (tagBox!.y + tagBox!.height))).toBeLessThanOrEqual(2);
    expect(Math.abs(firstEnvironmentBox!.x - secondEnvironmentBox!.x)).toBeLessThanOrEqual(2);
    for (const gap of runGaps) {
      expect(Math.abs(gap.actual - gap.configured)).toBeLessThanOrEqual(1);
      expect(gap.configured).toBe(gap.spaceSm);
    }
    expect(Math.abs(popupRightInset)).toBeLessThanOrEqual(1);
    const popupColors = await popup.evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.color = "var(--color-heading)";
      element.append(probe);
      const heading = getComputedStyle(probe).color;
      probe.remove();
      return {
        heading,
        gpu: getComputedStyle(element.querySelector(".workflow-performance__gpu")!).color,
        time: getComputedStyle(element.querySelector(".workflow-performance__time")!).color
      };
    });
    expect(popupColors.gpu).toBe(popupColors.heading);
    expect(popupColors.time).toBe(popupColors.heading);
  });

  test("identifies GPU and RAM with compact hardware icons", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const popup = page.locator(".workflow-json--inline")
      .filter({ hasText: "sd1_5_text2image.json" })
      .locator(".workflow-performance__popup");
    const gpu = popup.locator(".workflow-performance__gpu").first();
    const ram = popup.locator(".workflow-performance__ram").first();
    const gpuIcon = gpu.locator(".workflow-performance__data-icon");
    const ramIcon = ram.locator(".workflow-performance__data-icon");

    await expect(gpuIcon).toHaveAttribute("aria-hidden", "true");
    await expect(ramIcon).toHaveAttribute("aria-hidden", "true");

    const styles = await Promise.all([
      gpu.evaluate((element) => ({
        fontWeight: getComputedStyle(element).fontWeight,
        paddingInline: getComputedStyle(element).paddingInline
      })),
      gpuIcon.evaluate((element) => decodeURIComponent(getComputedStyle(element).maskImage)),
      ramIcon.evaluate((element) => decodeURIComponent(getComputedStyle(element).maskImage))
    ]);

    expect(styles[0].fontWeight).toBe("600");
    expect(Number.parseFloat(styles[0].paddingInline)).toBeGreaterThanOrEqual(6.5);
    expect(styles[1]).toContain("/assets/icons/microchip.svg");
    expect(styles[2]).toContain("/assets/icons/memory-stick.svg");
  });

  test("aligns the lower edge of Copy and Download tooltips with the performance popup", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const configured = page.locator(".workflow-json--inline").filter({ hasText: "sd1_5_text2image.json" });
    const popup = configured.locator(".workflow-performance__popup");
    const copy = configured.locator("[data-copy-json]");
    const download = configured.locator("[data-download-json]");

    const [popupBottom, copyTooltipBottom, downloadTooltipBottom] = await Promise.all([
      popup.evaluate((element) => getComputedStyle(element).bottom),
      copy.evaluate((element) => getComputedStyle(element, "::after").bottom),
      download.evaluate((element) => getComputedStyle(element, "::after").bottom)
    ]);

    expect(copyTooltipBottom).toBe(popupBottom);
    expect(downloadTooltipBottom).toBe(popupBottom);
  });

  test("keeps the existing Copy and Download controls adjacent", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const configured = page.locator(".workflow-json--inline").filter({ hasText: "sd1_5_text2image.json" });
    const [copyBox, downloadBox, performanceBox] = await Promise.all([
      configured.locator("[data-copy-json]").boundingBox(),
      configured.locator("[data-download-json]").boundingBox(),
      configured.locator(".workflow-performance").boundingBox()
    ]);

    expect(copyBox).not.toBeNull();
    expect(downloadBox).not.toBeNull();
    expect(performanceBox).not.toBeNull();
    expect(Math.abs(downloadBox!.x - (copyBox!.x + copyBox!.width))).toBeLessThanOrEqual(1);
    expect(performanceBox!.x - (downloadBox!.x + downloadBox!.width)).toBeGreaterThanOrEqual(3);
  });

  test("follows the selected workflow and hides when the selection has no data", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const picker = page.locator(".workflow-json--picker");
    const toggle = picker.locator("[data-workflow-picker-toggle]");
    const performance = picker.locator(".workflow-performance");
    const meter = performance.getByRole("button", { name: /パフォーマンス|performance/i });

    await expect(performance).toBeVisible();
    await expect(meter).toHaveAttribute("data-level", "1");
    await expect(performance.locator(".workflow-performance__popup:not([hidden])")).toContainText("51s");

    await toggle.click();
    await picker.locator(".workflow-picker__option", { hasText: "sd1_5_image2image.json" }).click();
    await expect(meter).toHaveAttribute("data-level", "3");
    const maskImage = decodeURIComponent(await meter.locator(".workflow-performance__meter").evaluate((element) => getComputedStyle(element).maskImage));
    expect(maskImage).toContain("/assets/icons/Performance 3 SVG.svg");
    const selectedPopup = performance.locator(".workflow-performance__popup:not([hidden])");
    await expect(selectedPopup).toContainText("13s");
    await expect(selectedPopup).toContainText("INT8");
    await expect(selectedPopup).not.toContainText("51s");

    await meter.hover();
    const selectedRun = selectedPopup.locator(".workflow-performance__run").first();
    const [popupBox, gpuBox, ramBox, tagBoxes] = await Promise.all([
      selectedPopup.boundingBox(),
      selectedRun.locator(".workflow-performance__gpu").boundingBox(),
      selectedRun.locator(".workflow-performance__ram").boundingBox(),
      selectedRun.locator(".workflow-performance__tag").evaluateAll((tags) => tags.map((tag) => tag.getBoundingClientRect().y))
    ]);
    expect(popupBox).not.toBeNull();
    expect(gpuBox).not.toBeNull();
    expect(ramBox).not.toBeNull();
    expect(popupBox!.width).toBeGreaterThan(222);
    expect(gpuBox!.y).toBeLessThan(ramBox!.y);
    expect(tagBoxes.every((tagY) => Math.abs(tagY - ramBox!.y) <= 2)).toBe(true);

    await toggle.click();
    await picker.locator(".workflow-picker__option", { hasText: "sd1_5_inpainting.json" }).click();
    await expect(performance).toBeHidden();
  });

  test("does not apply article list markers to workflow picker options", async ({ page }) => {
    await page.goto(FIXTURE_PAGE);

    const picker = page.locator(".workflow-json--picker");
    await picker.locator("[data-workflow-picker-toggle]").click();
    const markerContent = await picker.locator(".workflow-picker__option").first().evaluate(
      (element) => getComputedStyle(element, "::before").content
    );

    expect(markerContent).toBe("none");
  });
});
