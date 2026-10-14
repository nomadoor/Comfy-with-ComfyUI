// Media layer: resolves `/media/<logical name>` (R2 via src/_data/media.json), Gyazo and external
// URLs into what a renderer needs, and renders video figures.
import fsSync from "node:fs";
import path from "node:path";
import { logicalNameFromRef, mediaRef, publicUrl, transformUrl } from "../scripts/lib/media-names.mjs";
import { localPreview, originalsRootFromEnv } from "../scripts/lib/media-local-preview.mjs";
import { escapeHTML, siteData } from "./site.mjs";

const GYAZO_HOST = "i.gyazo.com";
const MEDIA_MANIFEST_PATH = path.join("src", "_data", "media.json");
// Test builds (COMFY_MEDIA_FIXTURES=1) add fixture media and the fixture page; production builds never read them.
export const MEDIA_FIXTURES_ENABLED = process.env.COMFY_MEDIA_FIXTURES === "1";
export const MEDIA_ORIGINALS_ROOT = originalsRootFromEnv();
const CHECK_CHANGED_MEDIA = process.env.COMFY_MEDIA_PREVIEW_CHANGED === "1";
export const MEDIA_FIXTURE_MANIFEST_PATH = path.join("tests", "fixtures", "media", "media.json");
export const MEDIA_FIXTURE_PAGE_PATH = path.join("tests", "fixtures", "media", "media-fixtures.md");
const MEDIA_HOST = siteData?.media?.host || "";
// Cloudflare Image Transformations presets. They must match the WAF allowlist exactly
// (print it with `npm run media:waf-expression`).
const MEDIA_TRANSFORMS = siteData?.media?.transforms || {};
// Cards request size <= this and get the thumbnail preset; everything else uses the article preset.
const MEDIA_THUMBNAIL_MAX_SIZE = 640;

let mediaManifest = {};
function readJsonFile(filePath) {
  return fsSync.existsSync(filePath) ? JSON.parse(fsSync.readFileSync(filePath, "utf-8")) : {};
}
export function loadMediaManifest() {
  const manifest = readJsonFile(MEDIA_MANIFEST_PATH);
  if (MEDIA_FIXTURES_ENABLED) {
    for (const [name, entry] of Object.entries(readJsonFile(MEDIA_FIXTURE_MANIFEST_PATH))) {
      if (manifest[name]) throw new Error(`[media] fixture manifest redefines ${name}`);
      manifest[name] = entry;
    }
  }
  mediaManifest = manifest;
}
loadMediaManifest();

function normalizeGyazoUrl(url = "") {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("gyazo.com")) return null;
    const id = extractGyazoId(url);
    if (!id) return null;
    const extMatch = url.match(/\.(jpg|png|gif|mp4)(?:$|\?)/i);
    const extCandidate = extMatch ? extMatch[1].toLowerCase() : "jpg";
    const ext = extCandidate === "png" || extCandidate === "gif" ? extCandidate : "jpg";
    return `https://${GYAZO_HOST}/${id}.${ext}`;
  } catch {
    return null;
  }
}

export function getPreviewDimensions(meta, targetSize = 1000) {
  if (!meta || !meta.width || !meta.height) {
    // Fallback to a stable 16:9 box to reduce CLS when metadata is missing.
    const height = Math.round(targetSize * 9 / 16);
    return { width: targetSize, height };
  }
  const { width, height } = meta;
  const longest = Math.max(width, height);
  const scale = longest > targetSize ? targetSize / longest : 1;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale)
  };
}

function createImageVariants(url = "", size = 2000) {
  const fallback = { preview: url, large: url, full: url };
  if (typeof url !== "string" || !url) {
    return fallback;
  }
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== GYAZO_HOST) {
      return fallback;
    }
    const normalized = normalizeGyazoUrl(url);
    if (!normalized) {
      return fallback;
    }
    const normalizedUrl = new URL(normalized);
    const normalizedPath = normalizedUrl.pathname.replace(/^\//, "");
    const extMatch = normalizedPath.match(/(\.[a-z0-9]+)$/i);
    if (!extMatch) {
      return fallback;
    }
    const ext = extMatch[1];
    const id = normalizedPath.slice(0, -ext.length);
    const preview = `${normalizedUrl.origin}/${id}/max_size/${size}${ext}`;
    const fullSize = Math.max(size, 2000);
    const large = `${normalizedUrl.origin}/${id}/max_size/${fullSize}${ext}`;
    const full = `https://gyazo.com/${id}/raw`;
    const previewDims = getPreviewDimensions(null, size);
    const largeDims = getPreviewDimensions(null, fullSize);
    return {
      preview,
      large,
      full,
      width: previewDims.width,
      height: previewDims.height,
      largeWidth: largeDims.width,
      largeHeight: largeDims.height,
      originalWidth: undefined,
      originalHeight: undefined
    };
  } catch {
    return fallback;
  }
}

function createImageSrcset(variants = {}) {
  const previewWidth = Number(variants.width);
  const largeWidth = Number(variants.largeWidth);
  if (
    !variants.preview ||
    !variants.large ||
    variants.preview === variants.large ||
    !previewWidth ||
    !largeWidth ||
    largeWidth <= previewWidth
  ) {
    return "";
  }
  return `${variants.preview} ${previewWidth}w, ${variants.large} ${largeWidth}w`;
}

function extractGyazoId(url = "") {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/([a-f0-9]{32})/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// --- Media layer -------------------------------------------------------------
// `mode` is how media is displayed (image / loop / player) and is independent of where it is
// stored. Storage-specific rules live only in the source resolvers below.
const MEDIA_MODES = new Set(["image", "loop", "player"]);
const VIDEO_TOGGLE_ICON = '<span class="media-toggle__pill"><span class="media-toggle__knob"></span><span class="media-toggle__text"></span></span>';

export function normalizeMediaMode(mode) {
  const value = String(mode || "").toLowerCase();
  return MEDIA_MODES.has(value) ? value : "";
}

const reportedMissingMedia = new Set();
function isDevServer() {
  return process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch";
}

// A `/media/` reference is owned by this site, so a missing entry fails production builds.
// Dev servers (serve/watch) only warn so that work in progress stays viewable.
function reportMissingMedia(message) {
  if (isDevServer()) {
    if (!reportedMissingMedia.has(message)) {
      reportedMissingMedia.add(message);
      console.warn(`[media] ${message}`);
    }
    return;
  }
  throw new Error(`[media] ${message}`);
}

function getHostname(url = "") {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function isVideoUrl(url = "") {
  return /\.mp4(?:$|[?#])/i.test(url);
}

function managedImageUrls(entry, size) {
  const preset = size <= MEDIA_THUMBNAIL_MAX_SIZE ? MEDIA_TRANSFORMS.thumbnail : MEDIA_TRANSFORMS.article;
  return {
    display: preset ? transformUrl(MEDIA_HOST, preset, entry.key) : publicUrl(MEDIA_HOST, entry.key),
    og: MEDIA_TRANSFORMS.og ? transformUrl(MEDIA_HOST, MEDIA_TRANSFORMS.og, entry.key) : publicUrl(MEDIA_HOST, entry.key)
  };
}

// R2 stores one object per logical name: a full-size WebP for images (resized variants come from
// transformation presets) or the mp4 itself for videos.
function resolveManagedMedia(name, kind, size) {
  const empty = { kind, src: "", fullSrc: "", width: undefined, height: undefined, srcset: "", poster: "", og: "" };
  const entry = mediaManifest[name];
  // Dev server: unregistered originals render straight from COMFY_MEDIA_ORIGINALS. Registered
  // originals are checked only in the opt-in replacement-preview mode to keep startup fast.
  if (isDevServer()) {
    const preview = localPreview(MEDIA_ORIGINALS_ROOT, name, entry, { checkChanged: CHECK_CHANGED_MEDIA });
    if (preview) {
      const poster = kind === "image" ? preview.url : "";
      return { kind, src: preview.url, fullSrc: preview.url, width: preview.width, height: preview.height, srcset: "", poster, og: "" };
    }
  }
  if (!entry) {
    reportMissingMedia(`${mediaRef(name)} is not registered in src/_data/media.json`);
    return empty;
  }
  if (!MEDIA_HOST) {
    reportMissingMedia("media.host is missing in src/_data/site.json");
    return empty;
  }
  const objectUrl = publicUrl(MEDIA_HOST, entry.key);
  const base = { kind, width: entry.width, height: entry.height, srcset: "" };

  if (kind === "image") {
    const { display, og } = managedImageUrls(entry, size);
    return { ...base, src: display, fullSrc: objectUrl, poster: display, og };
  }

  let poster = "";
  let og = "";
  // `poster` is either a frame generated by media:sync ({ key, width, height, bytes }) or the logical
  // name of a registered image.
  if (entry.poster && typeof entry.poster === "object") {
    ({ display: poster, og } = managedImageUrls(entry.poster, size));
  } else if (entry.poster) {
    const posterEntry = mediaManifest[entry.poster];
    if (posterEntry) ({ display: poster, og } = managedImageUrls(posterEntry, size));
    else reportMissingMedia(`poster ${mediaRef(entry.poster)} of ${mediaRef(name)} is not registered`);
  }
  return { ...base, src: objectUrl, fullSrc: objectUrl, poster, og };
}

function resolveGyazoMedia(url, kind, size) {
  const id = extractGyazoId(url);
  const stillUrl = normalizeGyazoUrl(url) || url;
  const still = createImageVariants(stillUrl, size);
  if (kind === "video") {
    const src = isVideoUrl(url) || !id ? url : `https://${GYAZO_HOST}/${id}.mp4`;
    return { kind, src, fullSrc: src, width: undefined, height: undefined, srcset: "", poster: id ? still.preview : "" };
  }
  return {
    kind,
    src: still.preview,
    fullSrc: still.full || still.preview,
    width: still.originalWidth || still.width,
    height: still.originalHeight || still.height,
    srcset: createImageSrcset(still),
    poster: still.preview
  };
}

/**
 * Resolve a media URL into the URLs and dimensions a renderer needs.
 * @param {string} url `/media/<logical name>` (R2 via media.json), a Gyazo URL, or any external URL.
 * @param {{ mode?: "image"|"loop"|"player", size?: number }} options
 *   Without `mode`, video vs. image is inferred from the manifest type or the `.mp4` extension.
 * @returns {{ kind: "image"|"video", mode: string, src: string, fullSrc: string, width?: number,
 *   height?: number, srcset: string, poster: string, og: string }} `poster` is a still image URL for
 *   thumbnails and `og` one for social cards ("" when none is known). For `/media/` images, `src` is a
 *   thumbnail (size <= 640) or article transformation and `fullSrc` is the full-size WebP.
 */
export function resolveMedia(url = "", { mode, size = 1000 } = {}) {
  const source = typeof url === "string" ? url.trim() : "";
  const logicalName = logicalNameFromRef(source);
  const host = getHostname(source);
  let resolvedMode = normalizeMediaMode(mode);
  if (!resolvedMode) {
    const manifestType = logicalName !== null ? String(mediaManifest[logicalName]?.type || "") : "";
    resolvedMode = manifestType.startsWith("video/") || isVideoUrl(source) ? "loop" : "image";
  }
  const kind = resolvedMode === "image" ? "image" : "video";

  let media;
  if (logicalName !== null) {
    media = resolveManagedMedia(logicalName, kind, size);
  } else if (host.endsWith("gyazo.com")) {
    media = resolveGyazoMedia(source, kind, size);
  } else {
    // Third-party media (e.g. a GIF on GitHub) is shown in the article but never offered as the
    // social preview image: its size and content type are outside our control.
    media = { kind, src: source, fullSrc: source, width: undefined, height: undefined, srcset: "", poster: kind === "image" ? source : "", og: "", external: true };
  }
  return { og: media.poster, ...media, mode: resolvedMode };
}

export function renderVideoFigure(media, { caption = "", maxHeight = 320 } = {}) {
  const hasDims = media.width > 0 && media.height > 0;
  const baseWidth = hasDims ? media.width : 720;
  const baseHeight = hasDims ? media.height : 360;
  const height = Math.min(baseHeight, maxHeight);
  const width = Math.round(baseWidth * (height / baseHeight));
  const aspect = hasDims ? `${media.width} / ${media.height}` : "16 / 9";
  const initial = media.mode === "player" ? "player" : "loop";
  // `preload="none"` and no `autoplay`: video-lazy.js loads and plays a clip once it nears the
  // viewport, so opening a page does not download every video on it. The poster frame fills the box
  // in the meantime.
  const playback = initial === "player" ? 'controls playsinline preload="none"' : 'muted loop playsinline preload="none"';
  // The poster is attached by video-lazy.js together with the clip; as a plain `poster` attribute it
  // would be fetched for every video on the page as soon as the page renders.
  const poster = media.poster ? ` data-poster="${escapeHTML(media.poster)}"` : "";
  return `<figure class="article-video article-video--${initial} article-video--toggleable" data-media-toggle data-media-initial="${initial}" style="--article-video-height:${height}px; --article-video-width:${width}px; --article-video-aspect:${aspect};"><div class="article-video__frame"><video src="${escapeHTML(media.src)}" data-full-src="${escapeHTML(media.fullSrc)}"${poster} data-media-lazy ${playback}></video><button type="button" class="media-toggle" aria-label="Toggle video playback mode" data-loop-label="Loop" data-player-label="Player">${VIDEO_TOGGLE_ICON}</button></div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
}
