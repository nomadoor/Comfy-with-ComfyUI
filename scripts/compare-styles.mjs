// Compares the computed styles of two builds in a real browser, to prove that a CSS clean-up
// does not change how pages look. Run `npm run compare:build` first; it leaves the base and
// working-tree builds in .cache/compare/{base,head}. Then:
//
//   npm run compare:styles
//
// Every element and its ::before / ::after are compared on a fixed set of pages, viewport widths
// and both themes. Pages are served from the build folders through request interception, so no
// server is started. Hover and focus states are not covered. Exit code 0 means no difference.

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = path.join(ROOT, ".cache", "compare", "base");
const HEAD = path.join(ROOT, ".cache", "compare", "head");
const ORIGIN = "http://site.test";

const PAGES = [
  "/ja/",
  "/ja/basic-workflows/qwen-image-2-1/",
  "/ja/basic-workflows/sd15-inpainting/",
  "/ja/notes/find/",
  "/ja/contact/",
  "/ja/news/",
  "/en/basic-workflows/ltx-2-5/",
  "/zh/ai-capabilities/conditioning/",
  "/404.html"
];
const WIDTHS = [390, 899, 901, 1101, 1600];
// 900 px tall falls under the compact-sidebar query (max-height: 950px); desktop widths are also
// read 1100 px tall, where the full sidebar shows.
const HEIGHTS = [900, 1100];
const TALL_MIN_WIDTH = 1101;
const THEMES = ["dark", "light"];
const MAX_REPORTED = Number(process.env.COMPARE_STYLES_MAX) || 40;

const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2"
};

for (const dir of [BASE, HEAD]) {
  if (!fs.existsSync(dir)) {
    console.error(`[compare:styles] ${path.relative(ROOT, dir)} is missing; run npm run compare:build first.`);
    process.exit(2);
  }
}

const serveFrom = (root) => async (route) => {
  const url = new URL(route.request().url());
  if (url.origin !== ORIGIN) return route.fulfill({ status: 204, body: "" }); // fonts, media, analytics
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: "" });
  return route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: TYPES[path.extname(file)] || "application/octet-stream" });
};

// In the page: one entry per element and pseudo-element, keyed by a DOM path.
const collect = () => {
  // Running animations (the language menu glow, fades) would be caught mid-way; stop every one
  // at its start so both builds are read in the same state.
  for (const animation of document.getAnimations()) {
    animation.pause();
    animation.currentTime = 0;
  }
  const out = {};
  const keyOf = (el) => {
    const parts = [];
    for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
      const index = node.parentElement ? Array.prototype.indexOf.call(node.parentElement.children, node) : 0;
      parts.unshift(`${node.tagName.toLowerCase()}:${index}`);
    }
    return parts.join(">");
  };
  const snapshot = (style) => {
    const values = [];
    for (let i = 0; i < style.length; i += 1) {
      const name = style[i];
      values.push(`${name}:${style.getPropertyValue(name)}`);
    }
    // Custom properties are listed in no fixed order; sort so equal styles give equal strings.
    return values.sort().join("\u0001");
  };
  for (const el of document.querySelectorAll("*")) {
    const key = keyOf(el);
    out[key] = snapshot(getComputedStyle(el));
    for (const pseudo of ["::before", "::after"]) {
      const style = getComputedStyle(el, pseudo);
      if (style.content && style.content !== "none") out[key + pseudo] = snapshot(style);
    }
  }
  return out;
};

const browser = await chromium.launch();
const differences = [];
const variableChanges = new Set();
let compared = 0;

const render = async (root, url, width, height, theme) => {
  const context = await browser.newContext({ viewport: { width, height } });
  await context.addInitScript((value) => {
    try {
      localStorage.setItem("cw-theme", value);
    } catch {}
  }, theme);
  const page = await context.newPage();
  await page.route("**/*", serveFrom(root));
  const response = await page.goto(ORIGIN + url, { waitUntil: "networkidle" });
  // A page or stylesheet missing on both sides would otherwise compare as "identical".
  if (!response || response.status() !== 200) throw new Error(`${root} ${url}: HTTP ${response?.status()}`);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const state = await page.evaluate(() => ({ sheets: document.styleSheets.length, theme: document.documentElement.dataset.theme }));
  if (!state.sheets) throw new Error(`${root} ${url}: no stylesheet loaded`);
  if (state.theme !== theme) throw new Error(`${root} ${url}: theme ${state.theme}, expected ${theme}`);
  const result = await page.evaluate(collect);
  await context.close();
  return result;
};

// Style strings are "name:value" entries joined with "\u0001" (values may contain ";").
const entries = (snapshot = "") => new Set(snapshot.split("\u0001"));
const changedProps = (before = "", after = "") => {
  const a = entries(before);
  const b = entries(after);
  const removed = [...a].filter((entry) => !b.has(entry));
  const added = [...b].filter((entry) => !a.has(entry));
  const names = new Set([...removed, ...added].map((entry) => entry.split(":")[0]));
  const value = (list, name) => list.find((entry) => entry.split(":")[0] === name)?.slice(name.length + 1) ?? "∅";
  return [...names].map((name) => `${name}: ${value(removed, name)} → ${value(added, name)}`);
};
const diffKeys = (before, after) =>
  [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((key) => before[key] !== after[key]);

const compareCase = async ({ url, width, height, theme }) => {
  let before = await render(BASE, url, width, height, theme);
  let after = await render(HEAD, url, width, height, theme);
  compared += new Set([...Object.keys(before), ...Object.keys(after)]).size;
  let keys = diffKeys(before, after);
  // Late loads and timers can still shift a frame; a real difference survives a second look.
  if (keys.length) {
    before = await render(BASE, url, width, height, theme);
    after = await render(HEAD, url, width, height, theme);
    const again = new Set(diffKeys(before, after));
    keys = keys.filter((key) => again.has(key));
  }
  for (const key of keys) {
    const props = changedProps(before[key], after[key]);
    // Custom properties are tracked once for the whole run: adding or removing a token shows up
    // on every element, while what matters is whether a real property changed.
    props.filter((line) => line.startsWith("--")).forEach((line) => variableChanges.add(line));
    const real = props.filter((line) => !line.startsWith("--"));
    if (real.length) differences.push({ url, width: `${width}x${height}`, theme, key, props: real });
  }
};

const sizes = WIDTHS.flatMap((width) => HEIGHTS.filter((height) => height === HEIGHTS[0] || width >= TALL_MIN_WIDTH).map((height) => ({ width, height })));
const cases = PAGES.flatMap((url) => sizes.flatMap(({ width, height }) => THEMES.map((theme) => ({ url, width, height, theme }))));
const WORKERS = 4;
let next = 0;
await Promise.all(
  Array.from({ length: WORKERS }, async () => {
    while (next < cases.length) await compareCase(cases[next++]);
  })
);
differences.sort((a, b) => `${a.url} ${a.width} ${a.theme} ${a.key}`.localeCompare(`${b.url} ${b.width} ${b.theme} ${b.key}`));
await browser.close();

for (const diff of differences.slice(0, MAX_REPORTED)) {
  console.log(`~ ${diff.url} ${diff.width} ${diff.theme} ${diff.key}`);
  diff.props.slice(0, 6).forEach((line) => console.log(`    ${line}`));
}
if (variableChanges.size) {
  console.log("[compare:styles] custom properties that changed somewhere:");
  [...variableChanges].sort().slice(0, MAX_REPORTED).forEach((line) => console.log(`    ${line}`));
}
console.log(
  differences.length
    ? `[compare:styles] ${differences.length} element(s) differ (${compared} compared; first ${Math.min(MAX_REPORTED, differences.length)} shown).`
    : `[compare:styles] identical computed styles (${compared} element states compared).`
);
process.exit(differences.length ? 1 : 0);
