import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { test, expect } from "./support/test";
import type { Page } from "@playwright/test";

// Synchronized playback of side-by-side loop videos (src/assets/js/video-sync.js).
// Playwright's Chromium cannot decode H.264, so the fixture mp4 URLs are fulfilled with generated
// VP9 WebM clips (the browser sniffs the container). Requires ffmpeg with libvpx-vp9.

const KEY_A = "videos/23d3bb96df2ebf63.mp4"; // fixtures/r2_video.mp4, 2.0 s
const KEY_B = "videos/1111111111111111.mp4"; // fixtures/r2_video_b.mp4, 2.2 s (within 0.5 s)
const KEY_LONG = "videos/2222222222222222.mp4"; // fixtures/r2_video_long.mp4, 3.5 s

test.describe("video sync logic", () => {
  test("durations and drift corrections", async () => {
    const { canSyncDurations, driftCorrection } = await import(pathToFileURL(path.resolve("src", "assets", "js", "video-sync.js")).href);
    expect(canSyncDurations([5.875, 5.875])).toBe(true);
    expect(canSyncDurations([5.875, 6.3])).toBe(true);
    expect(canSyncDurations([5.875, 6.5])).toBe(false);
    expect(canSyncDurations([5.875])).toBe(false);
    expect(canSyncDurations([Number.NaN, 5])).toBe(false);
    expect(driftCorrection(0.02)).toEqual({ action: "none", playbackRate: 1 });
    expect(driftCorrection(0.1)).toEqual({ action: "nudge", playbackRate: 0.9 });
    expect(driftCorrection(-0.1)).toEqual({ action: "nudge", playbackRate: 1.1 });
    expect(driftCorrection(0.8)).toEqual({ action: "seek", playbackRate: 1 });
  });
});

function makeWebm(seconds: number) {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "video-sync-")), `${seconds}.webm`);
  const result = spawnSync("ffmpeg", [
    "-v", "error", "-y", "-f", "lavfi", "-i", `testsrc2=size=96x64:rate=24:duration=${seconds}`,
    "-c:v", "libvpx-vp9", "-deadline", "realtime", "-b:v", "200k", file
  ]);
  return result.status === 0 ? fs.readFileSync(file) : null;
}

async function times(page: Page, fixture: string) {
  return page.locator(`[data-fixture="${fixture}"] video`).evaluateAll((videos) =>
    videos.map((video) => ({ t: (video as HTMLVideoElement).currentTime, loop: (video as HTMLVideoElement).loop, paused: (video as HTMLVideoElement).paused }))
  );
}

test.describe("video sync playback", () => {
  test("syncs a row of similar-length loop videos and leaves others independent", async ({ page }) => {
    const clips = { [KEY_A]: makeWebm(2), [KEY_B]: makeWebm(2.2), [KEY_LONG]: makeWebm(3.5) };
    test.skip(Object.values(clips).some((clip) => !clip), "ffmpeg with libvpx-vp9 is required");

    await page.route(/^https:\/\/media\.comfyui\.nomadoor\.net\/videos\//, async (route) => {
      const key = new URL(route.request().url()).pathname.slice(1);
      await route.fulfill({ status: 200, contentType: "video/webm", body: clips[key] || clips[KEY_A] });
    });
    await page.goto("/internal/media-fixtures/");

    const syncRow = page.locator('[data-fixture="sync-row"] .article-media-row');
    const unsyncedRow = page.locator('[data-fixture="unsynced-row"] .article-media-row');
    await syncRow.scrollIntoViewIfNeeded();
    await expect(syncRow).toHaveAttribute("data-video-sync", "active");

    const maxGap = async () => {
      const [a, b] = await times(page, "sync-row");
      return Math.abs(a.t - b.t);
    };
    // Aligned while playing, including across the leader's loop restart (> 2.2 s).
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(350);
      const [a, b] = await times(page, "sync-row");
      expect(a.loop).toBe(false);
      expect(b.loop).toBe(false);
      if (!a.paused && !b.paused && a.t < 1.9) expect(Math.abs(a.t - b.t)).toBeLessThan(0.2);
    }

    // Force a 1 s drift; the group seeks the follower back.
    await page.locator('[data-fixture="sync-row"] video').nth(0).evaluate((video) => {
      (video as HTMLVideoElement).currentTime = Math.min(1.5, (video as HTMLVideoElement).currentTime + 1);
    });
    await expect.poll(maxGap, { timeout: 3000 }).toBeLessThan(0.2);

    // Durations differ by more than 0.5 s: no group, native looping stays on.
    await unsyncedRow.scrollIntoViewIfNeeded();
    await expect(unsyncedRow).toHaveAttribute("data-video-sync", "skipped");
    expect((await times(page, "unsynced-row")).every((video) => video.loop)).toBe(true);

    // Switching one video to Player dissolves the group; the other loops natively again.
    await syncRow.scrollIntoViewIfNeeded();
    const second = page.locator('[data-fixture="sync-row"] figure.article-video').nth(1);
    // The toggle only shows on hover and neighbors overlap it in a narrow row; dispatch the click directly.
    await second.locator("button.media-toggle").dispatchEvent("click");
    await expect(syncRow).not.toHaveAttribute("data-video-sync", /.+/);
    const [first] = await times(page, "sync-row");
    expect(first.loop).toBe(true);

    // Switching back re-forms the group; removing the row (as the router does on navigation) tears it
    // down without resuming playback of the detached videos.
    await second.locator("button.media-toggle").dispatchEvent("click");
    await expect(syncRow).toHaveAttribute("data-video-sync", "active");
    const detached = await syncRow.evaluateHandle((row) => {
      const videos = [...row.querySelectorAll("video")];
      row.remove();
      return { row, videos };
    });
    await expect
      .poll(() => detached.evaluate(({ row, videos }) => !row.dataset.videoSync && videos.every((video) => video.paused)), { timeout: 3000 })
      .toBe(true);
  });
});
