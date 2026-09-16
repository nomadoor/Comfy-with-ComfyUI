import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";

// Validates src/_data/media.json and how R2 media is referenced. Gyazo and other external media
// are valid sources; only their display-mode syntax is checked.

const SITE_DATA_PATH = path.resolve("src", "_data", "site.json");
const MANIFEST_PATH = path.resolve("src", "_data", "media.json");
const MODES = new Set(["image", "loop", "player"]);
const TYPE_BY_EXTENSION = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  mp4: "video/mp4"
};
const failures = [];

const { media: config = {} } = JSON.parse(fs.readFileSync(SITE_DATA_PATH, "utf8"));
const host = config.host || "";
const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) : {};
const isR2 = (url) => Boolean(host) && url.startsWith(`https://${host}/`);
const extensionOf = (url) => (url.split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i)?.[1] || "").toLowerCase();
const isPositiveInt = (value) => Number.isInteger(value) && value > 0;

if (!host) failures.push("src/_data/site.json: media.host is required");
if (!config.bucket) failures.push("src/_data/site.json: media.bucket is required");

// --- Manifest entries
for (const [url, entry] of Object.entries(manifest)) {
  const label = `src/_data/media.json: ${url}`;
  if (!isR2(url)) failures.push(`${label}: key must start with https://${host}/`);
  if (!isPositiveInt(entry?.width) || !isPositiveInt(entry?.height)) failures.push(`${label}: width/height must be positive integers`);
  if (!isPositiveInt(entry?.bytes)) failures.push(`${label}: bytes must be a positive integer`);
  const expectedType = TYPE_BY_EXTENSION[extensionOf(url)];
  if (!expectedType) failures.push(`${label}: unsupported file extension`);
  else if (entry?.type !== expectedType) failures.push(`${label}: type must be ${expectedType} (got ${entry?.type})`);
  if (entry?.poster !== undefined) {
    if (!String(entry.type || "").startsWith("video/")) failures.push(`${label}: poster is only allowed for video entries`);
    else if (!String(manifest[entry.poster]?.type || "").startsWith("image/")) {
      failures.push(`${label}: poster must be an image URL recorded in media.json`);
    }
  }
}

// --- References
function checkReference(file, url, mode) {
  if (mode !== undefined && !MODES.has(mode)) {
    failures.push(`${file}: ${url} uses unknown display mode "${mode}" (image, loop, player)`);
    return;
  }
  if (!isR2(url)) return;
  const entry = manifest[url];
  if (!entry) {
    failures.push(`${file}: ${url} is not recorded in src/_data/media.json`);
    return;
  }
  if (mode === undefined) return;
  const isVideo = String(entry.type).startsWith("video/");
  if (mode === "image" && isVideo) failures.push(`${file}: ${url} is ${entry.type} but is displayed with {media=image}`);
  if (mode !== "image" && !isVideo) failures.push(`${file}: ${url} is ${entry.type} but is displayed with {media=${mode}}`);
}

const URL_CHARS = "[^\\s\"'`)<>{}]+";
const MARKDOWN_IMAGE = new RegExp(`!\\[[^\\]]*\\]\\(\\s*(https?://${URL_CHARS})(?:\\s+"[^"]*")?\\s*\\)(?:\\{(?:media|gyazo)=([^}\\s]*)\\})?`, "g");
const MEDIA_ROW = /\{%-?\s*mediaRow\b([\s\S]*?)-?%\}/g;
const escapedHost = host.replace(/\./g, "\\.");
const R2_URL = new RegExp(`https://${escapedHost}/${URL_CHARS}`, "g");

const files = await fg(
  ["src/content/**/*.{md,njk}", "src/internal/**/*.{md,njk}", "src/includes/**/*.njk", "src/layouts/**/*.njk", "src/_data/**/*.{json,yml,yaml}"],
  { ignore: ["src/_data/media.json", "src/_data/pageViews.json"] }
);

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const withMode = new Set();

  for (const match of text.matchAll(MARKDOWN_IMAGE)) {
    const [, url, mode] = match;
    checkReference(file, url, mode === undefined ? "image" : mode.toLowerCase());
    withMode.add(url);
  }

  for (const match of text.matchAll(MEDIA_ROW)) {
    const args = match[1];
    const img = args.match(/\bimg\s*=\s*"([^"]*)"/)?.[1];
    if (!img) continue;
    const url = img.replace(/\s*\{(?:media|gyazo)=[^}]*\}\s*/i, "").trim();
    const braceMode = img.match(/\{(?:media|gyazo)=([^}]*)\}/i)?.[1];
    const paramMode = args.match(/\b(?:mode|media|gyazo)\s*=\s*"([^"]*)"/)?.[1];
    checkReference(file, url, (paramMode || braceMode || "image").toLowerCase());
    withMode.add(url);
  }

  // Any other R2 URL (front matter hero, data files): must exist and match its extension.
  if (host) {
    for (const url of new Set(text.match(R2_URL) || [])) {
      if (withMode.has(url)) continue;
      checkReference(file, url, undefined);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Media checks passed (${Object.keys(manifest).length} manifest entries, ${files.length} files scanned).`);
