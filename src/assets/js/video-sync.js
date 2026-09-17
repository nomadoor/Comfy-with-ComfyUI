// Keep side-by-side loop videos in step, so comparison clips (same prompt, different models or
// settings) show the same moment at the same time.
//
// A row (`.article-media-row`) with two or more videos in Loop mode forms a group when their durations
// differ by at most MAX_DURATION_DIFF seconds (small differences come from how files were saved).
// The group replaces native looping: all videos start together, the longest one decides when everyone
// restarts from 0, and followers are nudged (playback rate) or seeked back to the leader's time.
// Videos switched to Player mode leave the group. Off-screen rows pause and restart together when
// visible again.

import { MEDIA_ACTIVATE, isNear } from "./video-lazy.js";

export const MAX_DURATION_DIFF = 0.5;
const SEEK_THRESHOLD = 0.3;
const NUDGE_THRESHOLD = 0.04;
const MAX_RATE_ADJUST = 0.1;
const CHECK_INTERVAL_MS = 250;
const READY_TIMEOUT_MS = 8000;

/** @param {number[]} durations */
export function canSyncDurations(durations) {
  if (durations.length < 2 || durations.some((duration) => !Number.isFinite(duration) || duration <= 0)) return false;
  return Math.max(...durations) - Math.min(...durations) <= MAX_DURATION_DIFF;
}

/**
 * @param {number} diff follower time minus leader time, in seconds
 * @returns {{ action: "none" | "nudge" | "seek", playbackRate: number }}
 */
export function driftCorrection(diff) {
  const distance = Math.abs(diff);
  if (distance > SEEK_THRESHOLD) return { action: "seek", playbackRate: 1 };
  if (distance > NUDGE_THRESHOLD) {
    const adjust = Math.min(MAX_RATE_ADJUST, distance);
    return { action: "nudge", playbackRate: diff > 0 ? 1 - adjust : 1 + adjust };
  }
  return { action: "none", playbackRate: 1 };
}

function waitForReadyState(video, readyState, signal) {
  if (video.readyState >= readyState) return Promise.resolve(true);
  return new Promise((resolve) => {
    const events = readyState >= 3 ? ["canplay", "canplaythrough"] : ["loadedmetadata"];
    const done = (value) => {
      clearTimeout(timer);
      events.forEach((type) => video.removeEventListener(type, check));
      signal.removeEventListener("abort", abort);
      resolve(value);
    };
    const check = () => video.readyState >= readyState && done(true);
    const abort = () => done(false);
    const timer = setTimeout(() => done(video.readyState >= readyState), READY_TIMEOUT_MS);
    events.forEach((type) => video.addEventListener(type, check));
    signal.addEventListener("abort", abort, { once: true });
  });
}

function loopVideosIn(row) {
  return [...row.querySelectorAll("figure[data-media-toggle]")]
    .filter((figure) => (figure.dataset.mediaMode || figure.getAttribute("data-media-initial")) !== "player")
    .map((figure) => figure.querySelector("video"))
    .filter(Boolean);
}

function createGroup(row) {
  const videos = loopVideosIn(row);
  const controller = new AbortController();
  const { signal } = controller;
  let leader = null;
  let visible = true;
  let restarting = false;
  let buffering = false;
  let timer = null;
  let observer = null;

  const playAll = () => Promise.allSettled(videos.map((video) => video.play()));
  const pauseAll = () => videos.forEach((video) => video.pause());

  async function restart() {
    if (signal.aborted || restarting) return;
    restarting = true;
    pauseAll();
    videos.forEach((video) => {
      video.currentTime = 0;
      video.playbackRate = 1;
    });
    await Promise.all(videos.map((video) => waitForReadyState(video, 3, signal)));
    restarting = false;
    if (!signal.aborted && visible) await playAll();
  }

  function tick() {
    if (signal.aborted) return;
    // The router swaps page content without reloading; tear down groups whose row left the document.
    if (!row.isConnected) {
      destroy();
      groups.delete(row);
      return;
    }
    if (restarting || buffering || !visible || leader.paused) return;
    for (const video of videos) {
      if (video === leader) continue;
      // A slightly shorter follower waits on its last frame until the leader ends.
      if (leader.currentTime >= video.duration - 0.05) {
        video.playbackRate = 1;
        continue;
      }
      const correction = driftCorrection(video.currentTime - leader.currentTime);
      if (correction.action === "seek") video.currentTime = leader.currentTime;
      video.playbackRate = correction.playbackRate;
      if (video.paused) video.play().catch(() => {});
    }
  }

  async function start() {
    // video-lazy.js keeps videos at `preload="none"` until the reader is close; a group needs the
    // metadata of every member, so ask for it as soon as the row is being set up.
    videos.forEach((video) => { if (video.preload !== "auto") video.preload = "auto"; });
    const ready = await Promise.all(videos.map((video) => waitForReadyState(video, 1, signal)));
    // The row may have been removed by client-side navigation while waiting for metadata.
    if (signal.aborted) return;
    if (!row.isConnected) {
      groups.delete(row);
      return;
    }
    if (!ready.every(Boolean) || !canSyncDurations(videos.map((video) => video.duration))) {
      row.dataset.videoSync = "skipped";
      return;
    }

    leader = videos.reduce((longest, video) => (video.duration > longest.duration ? video : longest));
    videos.forEach((video) => {
      video.loop = false;
      video.addEventListener("waiting", () => {
        if (restarting) return;
        buffering = true;
        pauseAll();
      }, { signal });
      video.addEventListener("canplay", () => {
        if (!buffering || videos.some((other) => other.readyState < 3)) return;
        buffering = false;
        videos.forEach((other) => {
          if (other !== leader && leader.currentTime < other.duration) other.currentTime = leader.currentTime;
        });
        if (visible) playAll();
      }, { signal });
    });
    leader.addEventListener("ended", () => restart(), { signal });

    observer = new IntersectionObserver((entries) => {
      const nowVisible = entries.some((entry) => entry.isIntersecting);
      if (nowVisible === visible) return;
      visible = nowVisible;
      if (visible) restart();
      else pauseAll();
    });
    observer.observe(row);
    timer = setInterval(tick, CHECK_INTERVAL_MS);
    row.dataset.videoSync = "active";
    await restart();
  }

  function destroy() {
    controller.abort();
    clearInterval(timer);
    observer?.disconnect();
    delete row.dataset.videoSync;
    videos.forEach((video) => {
      video.playbackRate = 1;
      const figure = video.closest("figure[data-media-toggle]");
      if (figure?.dataset.mediaMode !== "player") {
        video.loop = true;
        // Only resume looping for videos still on the page and still close to the reader.
        if (video.isConnected && isNear(video)) video.play().catch(() => {});
      }
    });
  }

  return { videos, start, destroy };
}

const groups = new WeakMap();

function setupRow(row) {
  const videos = loopVideosIn(row);
  const current = groups.get(row);
  // Activation fires once per video, and again whenever a row is scrolled back into range; rebuild
  // only when the set of Loop videos actually changed (a Loop/Player switch).
  if (current && current.videos.length === videos.length && current.videos.every((video, index) => video === videos[index])) return;
  current?.destroy();
  groups.delete(row);
  if (videos.length < 2) return;
  const group = createGroup(row);
  groups.set(row, group);
  group.start();
}

const initVideoSync = (root = document) => {
  root.querySelectorAll(".article-media-row").forEach((row) => {
    if (row.dataset.videoSyncBound) return;
    row.dataset.videoSyncBound = "true";
    // media-toggle.js announces Loop/Player switches; rebuild the group from the current modes.
    row.addEventListener("media-modechange", () => setupRow(row));
    // video-lazy.js announces videos the reader has come close to; a row is synchronized from that
    // point on, not while it is still far down the page and unloaded.
    row.addEventListener(MEDIA_ACTIVATE, () => setupRow(row));
    if (loopVideosIn(row).some(isNear)) setupRow(row);
  });
};

export default initVideoSync;
