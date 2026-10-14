// Site data and small helpers shared by the Eleventy modules.
import fsSync from "node:fs";
import path from "node:path";

const SITE_DATA_PATH = path.join("src", "_data", "site.json");

export let siteData = {};
try {
  if (fsSync.existsSync(SITE_DATA_PATH)) {
    siteData = JSON.parse(fsSync.readFileSync(SITE_DATA_PATH, "utf-8"));
  }
} catch {
  siteData = {};
}

export const DEFAULT_LANG = siteData?.defaultLang || "ja";

export function escapeHTML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function hashString(value = "") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Language of the page a shortcode or Markdown rule is rendering.
export function getRenderLang(env = {}) {
  return env.lang || env.ctx?.lang || env.page?.lang || env.ctx?.page?.lang || DEFAULT_LANG;
}

// A line icon in the site's stroke style; `paths` is the SVG body.
export const iconSvg = (paths) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
