import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import fg from "fast-glob";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";
import { logicalNameFromRef, mediaRef, publicUrl, transformUrl } from "./scripts/lib/media-names.mjs";
import { createOriginalsMiddleware, localPreview, originalsRootFromEnv } from "./scripts/lib/media-local-preview.mjs";

const GYAZO_HOST = "i.gyazo.com";
const CACHE_DIR = ".cache";
const GYAZO_CACHE_PATH = path.join(CACHE_DIR, "gyazo-images.json");
const GYAZO_URL_REGEX = /https:\/\/(?:[a-z]+\.)?gyazo\.com\/[^\s"'`)]+/gi;
const GYAZO_FETCH_TIMEOUT_MS = 5000;
const GYAZO_FETCH_DELAY_MS = 200;
const sleep = (ms = 0) => (ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve());
const SITE_DATA_PATH = path.join("src", "_data", "site.json");
const MEDIA_MANIFEST_PATH = path.join("src", "_data", "media.json");
// Test builds (COMFY_MEDIA_FIXTURES=1) add fixture media and the fixture page; production builds never read them.
const MEDIA_FIXTURES_ENABLED = process.env.COMFY_MEDIA_FIXTURES === "1";
const MEDIA_FIXTURE_MANIFEST_PATH = path.join("tests", "fixtures", "media", "media.json");
const MEDIA_FIXTURE_PAGE_PATH = path.join("tests", "fixtures", "media", "media-fixtures.md");
const ICON_SPRITES = {
  copy: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="var(--icon-stroke-width, 1.5)" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>',
  download: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="var(--icon-stroke-width, 1.5)" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
};
let siteData = {};
try {
  if (fsSync.existsSync(SITE_DATA_PATH)) {
    siteData = JSON.parse(fsSync.readFileSync(SITE_DATA_PATH, "utf-8"));
  }
} catch {
  siteData = {};
}
const WORKFLOW_I18N = siteData?.i18n?.workflow || {};
const DEFAULT_LANG = siteData?.defaultLang || "ja";
const MEDIA_HOST = siteData?.media?.host || "";
// Cloudflare Image Transformations presets. They must match the WAF allowlist exactly
// (print it with `npm run media:waf-expression`).
const MEDIA_TRANSFORMS = siteData?.media?.transforms || {};
// Cards request size <= this and get the thumbnail preset; everything else uses the article preset.
const MEDIA_THUMBNAIL_MAX_SIZE = 640;
const WORKFLOW_ROOT = path.join(process.cwd(), "src", "workflows");
const WORKFLOW_LABELS = {
  copyLabel: "Copy",
  downloadLabel: "Download",
  copiedLabel: "Copied",
  downloadedLabel: "Downloaded"
};

loadLanguages(["bash", "shell", "json", "yaml", "javascript", "typescript", "css", "markup", "powershell", "python"]);

let mediaManifest = {};
function readJsonFile(filePath) {
  return fsSync.existsSync(filePath) ? JSON.parse(fsSync.readFileSync(filePath, "utf-8")) : {};
}
function loadMediaManifest() {
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

let gyazoMeta = {};
try {
  if (fsSync.existsSync(GYAZO_CACHE_PATH)) {
    const raw = fsSync.readFileSync(GYAZO_CACHE_PATH, "utf-8");
    gyazoMeta = JSON.parse(raw);
  }
} catch {
  gyazoMeta = {};
}

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

function getPreviewDimensions(meta, targetSize = 1000) {
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
    const meta = gyazoMeta[normalized];
    const previewDims = getPreviewDimensions(meta, size);
    const largeDims = getPreviewDimensions(meta, fullSize);
    return {
      preview,
      large,
      full,
      width: previewDims.width,
      height: previewDims.height,
      largeWidth: largeDims.width,
      largeHeight: largeDims.height,
      originalWidth: meta?.width,
      originalHeight: meta?.height
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

function enhanceStandaloneImages(markdownLib) {
  markdownLib.core.ruler.after("inline", "mark-standalone-images", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      const open = tokens[i];
      const inlineToken = tokens[i + 1];
      const close = tokens[i + 2];
      if (
        open.type !== "paragraph_open" ||
        inlineToken.type !== "inline" ||
        close.type !== "paragraph_close" ||
        !inlineToken.children
      ) {
        continue;
      }

      const meaningfulChildren = inlineToken.children.filter((child) => {
        if (child.type === "text") {
          return child.content.trim().length > 0;
        }
        return child.type !== "softbreak" && child.type !== "hardbreak";
      });

      if (meaningfulChildren.length === 1 && meaningfulChildren[0].type === "image") {
        const imageToken = meaningfulChildren[0];
        imageToken.meta = imageToken.meta || {};
        imageToken.meta.isStandalone = true;
        open.meta = { ...(open.meta || {}), wrapsStandaloneImage: true };
        close.meta = { ...(close.meta || {}), wrapsStandaloneImage: true };
      }
    }
  });

  const defaultParagraphOpen =
    markdownLib.renderer.rules.paragraph_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownLib.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
    if (tokens[idx]?.meta?.wrapsStandaloneImage) {
      return "";
    }
    return defaultParagraphOpen(tokens, idx, options, env, self);
  };

  const defaultParagraphClose =
    markdownLib.renderer.rules.paragraph_close ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownLib.renderer.rules.paragraph_close = function (tokens, idx, options, env, self) {
    if (tokens[idx]?.meta?.wrapsStandaloneImage) {
      return "";
    }
    return defaultParagraphClose(tokens, idx, options, env, self);
  };
}

function preserveManualNumberedBullets(markdownLib) {
  const findParentListOpen = (tokens, index, itemLevel) => {
    for (let cursor = index - 1; cursor >= 0; cursor--) {
      const token = tokens[cursor];
      if (token.level === itemLevel - 1 && token.nesting === 1 && token.type.endsWith("_list_open")) {
        return token;
      }
    }
    return null;
  };

  markdownLib.core.ruler.after("block", "preserve-manual-numbered-bullets", (state) => {
    const tokens = state.tokens;
    for (let i = tokens.length - 8; i >= 0; i--) {
      const bulletItemOpen = tokens[i];
      const outerListOpen = findParentListOpen(tokens, i, bulletItemOpen?.level);
      const orderedListOpen = tokens[i + 1];
      const orderedItemOpen = tokens[i + 2];
      const paragraphOpen = tokens[i + 3];
      const inlineToken = tokens[i + 4];
      const paragraphClose = tokens[i + 5];
      const orderedItemClose = tokens[i + 6];
      const orderedListClose = tokens[i + 7];

      if (
        outerListOpen?.type !== "bullet_list_open" ||
        bulletItemOpen?.type !== "list_item_open" ||
        orderedListOpen?.type !== "ordered_list_open" ||
        orderedItemOpen?.type !== "list_item_open" ||
        paragraphOpen?.type !== "paragraph_open" ||
        inlineToken?.type !== "inline" ||
        paragraphClose?.type !== "paragraph_close" ||
        orderedItemClose?.type !== "list_item_close" ||
        orderedListClose?.type !== "ordered_list_close" ||
        orderedListOpen.level !== bulletItemOpen.level + 1 ||
        orderedItemOpen.level !== orderedListOpen.level + 1
      ) {
        continue;
      }

      const startAttr = orderedListOpen.attrGet("start");
      const parsedNumber = startAttr == null ? 1 : Number(startAttr);
      const number = Number.isFinite(parsedNumber) ? parsedNumber : 1;
      paragraphOpen.level = bulletItemOpen.level + 1;
      inlineToken.level = paragraphOpen.level + 1;
      paragraphClose.level = paragraphOpen.level;
      const manualNumberPrefix = `${number}. `;
      if (Array.isArray(inlineToken.children)) {
        const firstTextChild = inlineToken.children[0]?.type === "text" ? inlineToken.children[0] : null;
        if (firstTextChild) {
          firstTextChild.content = `${manualNumberPrefix}${firstTextChild.content}`;
        } else {
          const numberTextToken = new inlineToken.constructor("text", "", 0);
          numberTextToken.content = manualNumberPrefix;
          numberTextToken.level = inlineToken.level + 1;
          inlineToken.children.unshift(numberTextToken);
        }
      } else {
        inlineToken.content = `${manualNumberPrefix}${inlineToken.content}`;
      }
      tokens.splice(i + 1, 7, paragraphOpen, inlineToken, paragraphClose);
    }
  });
}

function enhanceJsonLinks(markdownLib) {
  markdownLib.core.ruler.after("inline", "convert-json-links", (state) => {
    state.env = state.env || {};
    state.env.__jsonLinkCounter = state.env.__jsonLinkCounter || 0;
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      const open = tokens[i];
      const inlineToken = tokens[i + 1];
      const close = tokens[i + 2];
      if (
        !open ||
        !inlineToken ||
        !close ||
        open.type !== "paragraph_open" ||
        inlineToken.type !== "inline" ||
        close.type !== "paragraph_close"
      ) {
        continue;
      }
      const linkInfo = extractInlineJsonLink(inlineToken.children || []);
      if (!linkInfo) continue;
      const html = renderJsonLinkRow(linkInfo, state.env);
      if (!html) continue;
      const htmlToken = new state.Token("html_block", "", 0);
      htmlToken.block = true;
      htmlToken.content = `${html}\n`;
      tokens.splice(i, 3, htmlToken);
      i--;
    }
  });
}

function extractInlineJsonLink(children = []) {
  if (!children.length) return null;
  const meaningful = children.filter((token) => {
    if (!token) return false;
    if (token.type === "softbreak" || token.type === "hardbreak") return false;
    if (token.type === "text" && token.content.trim().length === 0) return false;
    return true;
  });
  if (meaningful.length < 2) return null;
  const open = meaningful[0];
  const closeIdx = meaningful.findIndex((token) => token.type === "link_close");
  if (open.type !== "link_open" || closeIdx === -1) {
    return null;
  }
  if (closeIdx !== meaningful.length - 1) {
    return null;
  }
  const href = open.attrGet("href") || "";
  if (!href.toLowerCase().endsWith(".json")) {
    return null;
  }
  const textContent = meaningful.slice(1, closeIdx).map((token) => token.content || "").join("").trim();
  return { href, text: textContent };
}

function getWorkflowLabel(key, lang = DEFAULT_LANG) {
  const langKey = lang || DEFAULT_LANG;
  const localized = WORKFLOW_I18N?.[key]?.[langKey];
  if (localized) return localized;
  const fallback = WORKFLOW_I18N?.[key]?.[DEFAULT_LANG];
  if (fallback) return fallback;
  return WORKFLOW_LABELS[key] || "";
}

function resolveJsonDiskPath(href = "", env = {}) {
  if (!href || /^https?:\/\//i.test(href)) {
    return null;
  }
  const cleanHref = href.split("?")[0].split("#")[0];
  if (!cleanHref.toLowerCase().endsWith(".json")) {
    return null;
  }
  let candidate;
  if (cleanHref.startsWith("/")) {
    candidate = path.join(process.cwd(), "src", cleanHref.replace(/^\//, ""));
  } else if (cleanHref.startsWith(".")) {
    const baseInput = env.page?.inputPath
      ? path.dirname(path.join(process.cwd(), env.page.inputPath))
      : path.join(process.cwd(), "src");
    candidate = path.resolve(baseInput, cleanHref);
  } else {
    return null;
  }
  const normalized = path.normalize(candidate);
  if (!normalized.startsWith(WORKFLOW_ROOT)) {
    return null;
  }
  return normalized;
}

function getIconMarkup(name) {
  return ICON_SPRITES[name] || "";
}

function hashString(value = "") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function getWorkflowBasename(file = "") {
  const clean = String(file).split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || clean;
}

function renderJsonLinkRow(linkInfo, env) {
  const diskPath = resolveJsonDiskPath(linkInfo.href, env);
  if (!diskPath) {
    return null;
  }
  let raw;
  try {
    raw = fsSync.readFileSync(diskPath, "utf-8");
  } catch {
    return null;
  }
  env.__jsonLinkCounter += 1;
  const pageKey = (env.page?.url || "page").replace(/[^a-z0-9]+/gi, "-");
  const fileName = path.basename(linkInfo.href.split("?")[0]);
  const baseKey = path.basename(fileName, path.extname(fileName)).replace(/[^a-z0-9]+/gi, "-") || "wf";
  const copyTargetId = `workflow-json-inline-${pageKey}-${baseKey}-${env.__jsonLinkCounter}`;
  const lang = env.lang || env.page?.lang || DEFAULT_LANG;
  const copyLabel = getWorkflowLabel("copyLabel", lang);
  const downloadLabel = getWorkflowLabel("downloadLabel", lang);
  const copiedLabel = getWorkflowLabel("copiedLabel", lang);
  const downloadedLabel = getWorkflowLabel("downloadedLabel", lang);
  const copyIcon = getIconMarkup("copy");
  const downloadIcon = getIconMarkup("download");
  const escapedFile = escapeHTML(fileName);
  return `<div class="workflow-json workflow-json--inline">
  <div class="workflow-json__row">
    <span class="workflow-json__filename">${escapedFile}</span>
    <div class="workflow-json__actions">
      <button class="workflow-json__icon" type="button" aria-label="${escapeHTML(copyLabel)} ${escapedFile}" data-copy-json="${copyTargetId}" data-label="${escapeHTML(copyLabel)}" data-success-label="${escapeHTML(copiedLabel)}">
        ${copyIcon}
      </button>
      <a class="workflow-json__icon" href="${linkInfo.href}" download="${escapedFile}" data-no-swup aria-label="${escapeHTML(downloadLabel)} ${escapedFile}" data-download-json="${copyTargetId}-download" data-label="${escapeHTML(downloadLabel)}" data-success-label="${escapeHTML(downloadedLabel)}">
        ${downloadIcon}
      </a>
    </div>
  </div>
  <pre id="${copyTargetId}" class="sr-only" hidden aria-hidden="true">${escapeHTML(raw)}</pre>
</div>`;
}

function getGyazoDimensionsFromId(id) {
  if (!id) return null;
  const candidates = [
    normalizeGyazoUrl(`https://${GYAZO_HOST}/${id}.png`),
    normalizeGyazoUrl(`https://${GYAZO_HOST}/${id}.jpg`),
    normalizeGyazoUrl(`https://${GYAZO_HOST}/${id}.gif`)
  ].filter(Boolean);
  for (const norm of candidates) {
    const meta = gyazoMeta[norm];
    if (meta && meta.width && meta.height) {
      return { width: meta.width, height: meta.height };
    }
  }
  return null;
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

function normalizeMediaMode(mode) {
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
  // Dev server: unregistered or changed originals render straight from COMFY_MEDIA_ORIGINALS.
  if (isDevServer()) {
    const preview = localPreview(originalsRootFromEnv(), name, entry);
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
    const dims = getGyazoDimensionsFromId(id);
    const src = isVideoUrl(url) || !id ? url : `https://${GYAZO_HOST}/${id}.mp4`;
    return { kind, src, fullSrc: src, width: dims?.width, height: dims?.height, srcset: "", poster: id ? still.preview : "" };
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
function resolveMedia(url = "", { mode, size = 1000 } = {}) {
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
    media = { kind, src: source, fullSrc: source, width: undefined, height: undefined, srcset: "", poster: kind === "image" ? source : "" };
  }
  return { og: media.poster, ...media, mode: resolvedMode };
}

function renderVideoFigure(media, { caption = "", maxHeight = 320 } = {}) {
  const hasDims = media.width > 0 && media.height > 0;
  const baseWidth = hasDims ? media.width : 720;
  const baseHeight = hasDims ? media.height : 360;
  const height = Math.min(baseHeight, maxHeight);
  const width = Math.round(baseWidth * (height / baseHeight));
  const aspect = hasDims ? `${media.width} / ${media.height}` : "16 / 9";
  const initial = media.mode === "player" ? "player" : "loop";
  const playback = initial === "player" ? 'controls playsinline preload="metadata"' : "muted loop autoplay playsinline";
  return `<figure class="article-video article-video--${initial} article-video--toggleable" data-media-toggle data-media-initial="${initial}" style="--article-video-height:${height}px; --article-video-width:${width}px; --article-video-aspect:${aspect};"><div class="article-video__frame"><video src="${escapeHTML(media.src)}" data-full-src="${escapeHTML(media.fullSrc)}" ${playback}></video><button type="button" class="media-toggle" aria-label="Toggle video playback mode" data-loop-label="Loop" data-player-label="Player">${VIDEO_TOGGLE_ICON}</button></div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
}

function escapeHTML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toDateKey(value = "") {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

function normalizeSitePath(value = "") {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const parsed = new URL(value, "https://example.invalid");
    return parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    const pathOnly = value.split(/[?#]/)[0];
    const withLeadingSlash = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
    return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
  }
}

function getPageViewCount(entry, pageViews = {}) {
  if (!entry || !entry.data) return 0;
  const pages = pageViews?.pages && typeof pageViews.pages === "object" ? pageViews.pages : {};
  const candidates = [
    entry.url,
    `/${entry.data.lang || ""}/notes/${entry.data.slug || ""}/`
  ]
    .map(normalizeSitePath)
    .filter(Boolean);

  for (const key of candidates) {
    const value = pages[key];
    const count = Number(value || 0);
    if (Number.isFinite(count) && count > 0) {
      return count;
    }
  }
  return 0;
}

async function fetchGyazoMeta(url) {
  try {
    const endpoint = `https://api.gyazo.com/api/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(GYAZO_FETCH_TIMEOUT_MS) });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data.width && data.height) {
      return { width: data.width, height: data.height };
    }
  } catch {
    return null;
  }
  return null;
}

async function saveGyazoCache() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(GYAZO_CACHE_PATH, JSON.stringify(gyazoMeta, null, 2), "utf-8");
}

async function refreshGyazoMetadata() {
  const files = await fg(["src/**/*.{md,njk,json}"], { dot: false });
  const urls = new Map();
  for (const file of files) {
    try {
      const text = await fs.readFile(file, "utf-8");
      GYAZO_URL_REGEX.lastIndex = 0;
      let match;
      while ((match = GYAZO_URL_REGEX.exec(text)) !== null) {
        const rawUrl = match[0];
        const id = extractGyazoId(rawUrl);
        if (!id) {
          continue;
        }
        const normalized = normalizeGyazoUrl(rawUrl) || `https://${GYAZO_HOST}/${id}.jpg`;
        urls.set(normalized, `https://gyazo.com/${id}`);
      }
    } catch {
      // ignore unreadable files
    }
  }
  let updated = false;
  for (const [normalized, fetchUrl] of urls) {
    if (!gyazoMeta[normalized] || !gyazoMeta[normalized].width || !gyazoMeta[normalized].height) {
      const meta = await fetchGyazoMeta(fetchUrl);
      if (GYAZO_FETCH_DELAY_MS) {
        await sleep(GYAZO_FETCH_DELAY_MS);
      }
      if (meta) {
        gyazoMeta[normalized] = meta;
        updated = true;
      }
    }
  }
  const missing = Object.entries(gyazoMeta).filter(([, m]) => !m.width || !m.height).length;
  if (updated) {
    await saveGyazoCache();
  }
  if (missing > 0) {
    console.warn(`[gyazo] ${missing} items missing dimensions; using fallback aspect (16:9).`);
  }
}

export default function (eleventyConfig) {
  // Passthrough static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/workflows": "workflows" });
  eleventyConfig.addPassthroughCopy({ "src/search": "search" });
  eleventyConfig.addPassthroughCopy({ "src/.well-known": ".well-known" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  eleventyConfig.addWatchTarget("ops");

  if (MEDIA_FIXTURES_ENABLED) {
    eleventyConfig.addWatchTarget(MEDIA_FIXTURE_MANIFEST_PATH);
    eleventyConfig.addTemplate("internal/media-fixtures.md", fsSync.readFileSync(MEDIA_FIXTURE_PAGE_PATH, "utf-8"));
  }

  eleventyConfig.on("beforeBuild", async () => {
    loadMediaManifest();
    await refreshGyazoMetadata();
  });

  const TAG_CHANNELS = ["tags", "noteTags"];

  const normalizeTagList = (value) => {
    const values = Array.isArray(value) ? value : [value];
    return [
      ...new Set(
        values
          .filter(Boolean)
          .map((tag) => String(tag).trim().toLowerCase())
          .filter(Boolean)
      )
    ];
  };

  const tagChannelsFor = (data = {}) =>
    TAG_CHANNELS.reduce((channels, channel) => {
      channels[channel] = normalizeTagList(data[channel]);
      return channels;
    }, {});

  const relatedKeysFor = (data = {}) => {
    const channels = tagChannelsFor(data);

    if (data.section === "ai-capabilities" && data.slug) {
      channels.tags = normalizeTagList([...channels.tags, data.slug]);
    }

    return channels;
  };

  const countSharedTags = (left = [], right = []) => left.filter((tag) => right.includes(tag)).length;

  const relatedScoreFor = (currentKeys, entryKeys, sameSection) => {
    const matchScore = TAG_CHANNELS.reduce(
      (score, channel) => score + (countSharedTags(currentKeys[channel], entryKeys[channel]) * 100),
      0
    );

    if (matchScore > 0) {
      return matchScore + (sameSection ? 20 : 0);
    }

    return 0;
  };

  const relatedEntryFor = (entry) => ({
    url: entry.url,
    title: entry.data.title,
    summary: entry.data.summary || "",
    hero: entry.data.hero || {}
  });

  eleventyConfig.addFilter("relatedPages", function (collection = [], currentUrl, currentData = {}, limit = 6) {
    if (!Array.isArray(collection)) {
      return [];
    }

    const currentLang = currentData.lang;
    const currentSection = currentData.section;
    const maxResults = Math.max(1, Math.min(Number(limit) || 6, 12));

    if (!currentUrl || !currentSection) {
      return [];
    }

    const currentKeys = relatedKeysFor(currentData);

    return collection
      .filter((entry) => {
        if (!entry || !entry.data) return false;
        if (entry.url === currentUrl) return false;
        if (!entry.data.section) return false;
        if (entry.data.section === "notes" && entry.data.slug === "find") return false;
        if (currentLang && entry.data.lang && entry.data.lang !== currentLang) return false;
        return true;
      })
      .map((entry, index) => {
        const entryKeys = relatedKeysFor(entry.data);
        const sameSection = entry.data.section === currentSection;
        const score = relatedScoreFor(currentKeys, entryKeys, sameSection);

        return {
          entry,
          index,
          score,
          updated: entry.data.updated || entry.data.date || entry.data.created || ""
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.updated !== a.updated) return String(b.updated).localeCompare(String(a.updated));
        return a.index - b.index;
      })
      .slice(0, maxResults)
      .map((item) => relatedEntryFor(item.entry));
  });

  eleventyConfig.addFilter("notesForLang", function (collection = [], currentLang, includeFinder = false, pageViews = {}) {
    if (!Array.isArray(collection)) {
      return [];
    }

    return collection
      .filter((entry) => {
        if (!entry || !entry.data) return false;
        if (entry.data.section !== "notes") return false;
        if (currentLang && entry.data.lang !== currentLang) return false;
        if (!includeFinder && entry.data.slug === "find") return false;
        return true;
      })
      .map((entry) => ({
        url: entry.url,
        slug: entry.data.slug,
        title: entry.data.title || entry.data.slug,
        summary: entry.data.summary || "",
        noteTags: normalizeTagList(entry.data.noteTags),
        created: toDateKey(entry.data.created),
        updated: toDateKey(entry.data.updated || entry.data.created),
        views: getPageViewCount(entry, pageViews),
        hero: entry.data.hero || {}
      }))
      .sort((a, b) => {
        const updatedCompare = String(b.updated || "").localeCompare(String(a.updated || ""));
        if (updatedCompare !== 0) return updatedCompare;
        return String(a.title || "").localeCompare(String(b.title || ""));
      });
  });

  eleventyConfig.addFilter("noteTags", function (notes = []) {
    const tags = new Set();
    if (!Array.isArray(notes)) return [];
    notes.forEach((note) => {
      normalizeTagList(note.noteTags).forEach((tag) => {
        if (tag) tags.add(tag);
      });
    });
    return [...tags].sort((a, b) => String(a).localeCompare(String(b)));
  });

  eleventyConfig.addFilter("notesHaveViews", function (notes = []) {
    if (!Array.isArray(notes)) return false;
    return notes.some((note) => Number(note?.views || 0) > 0);
  });

  eleventyConfig.addFilter("navPrevNext", function (navData, sectionKey, currentId) {
    if (!navData || !currentId) {
      return { prev: null, next: null };
    }

    const sections = navData.sections || [];
    let section = sectionKey
      ? sections.find((entry) => entry.key === sectionKey)
      : null;

    if (!section) {
      const hasId = (pages = []) => pages.some((page) => {
        if (!page) return false;
        if (page.id === currentId) return true;
        if (Array.isArray(page.children) && hasId(page.children)) return true;
        return false;
      });

      section = sections.find((entry) => hasId(entry.pages || [])) || null;
    }

    if (!section || !Array.isArray(section.pages)) {
      return { prev: null, next: null };
    }

    const ordered = [];
    const addPages = (pages = []) => {
      pages.forEach((page) => {
        if (page && page.id && !page.noLink) {
          ordered.push({ id: page.id, title: page.title || page.id });
        }
        if (page && Array.isArray(page.children)) {
          addPages(page.children);
        }
      });
    };

    addPages(section.pages);

    const index = ordered.findIndex((entry) => entry.id === currentId);
    if (index === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: ordered[index - 1] || null,
      next: ordered[index + 1] || null
    };
  });

  eleventyConfig.addFilter("basename", function (value = "") {
    if (typeof value !== "string") return "";
    const segments = value.split("/");
    return segments[segments.length - 1] || "";
  });

  eleventyConfig.addFilter("svgDataUri", function (inputPath = "") {
    if (!inputPath) return "";
    const cleanPath = inputPath.replace(/^[\/]/, "");
    const diskPath = path.join(process.cwd(), cleanPath);
    try {
      const raw = fsSync.readFileSync(diskPath, "utf-8");
      const minified = raw.replace(/\s+/g, " ").trim();
      const encoded = encodeURIComponent(minified)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
      return `url("data:image/svg+xml,${encoded}")`;
    } catch (error) {
      console.warn("svgDataUri failed for", inputPath, error);
      return "";
    }
  });

  eleventyConfig.addFilter("resolveMedia", function (url, options = {}) {
    return resolveMedia(url, options);
  });

  eleventyConfig.addFilter("stripUrlQuery", function (value = "") {
    if (typeof value !== "string") return "";
    return value.split(/[?#]/)[0];
  });

  eleventyConfig.addFilter("urlEncode", function (value = "") {
    return encodeURIComponent(String(value));
  });

  eleventyConfig.addFilter("jsonLd", function (value = {}) {
    return JSON.stringify(value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");
  });

  // Kept for compatibility with older templates; both accept any media URL.
  eleventyConfig.addShortcode("gyazoVideoLoop", function (url, caption = "") {
    return renderVideoFigure(resolveMedia(url, { mode: "loop" }), { caption: escapeHTML(caption), maxHeight: 360 });
  });

  eleventyConfig.addShortcode("gyazoVideoPlayer", function (url, caption = "") {
    return renderVideoFigure(resolveMedia(url, { mode: "player" }), { caption: escapeHTML(caption), maxHeight: 360 });
  });

  const markdownLib = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false
  });

  markdownLib.set({
    highlight: function (str, lang) {
      const language = lang && Prism.languages[lang];
      if (language) {
        const highlighted = Prism.highlight(str, language, lang);
        return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
      }
      return `<pre class="language-text"><code class="language-text">${escapeHTML(str)}</code></pre>`;
    }
  });

  // --- Media Markdown helper -------------------------------------------------
  function parseBraceAttrs(text = "") {
    const match = text.trim().match(/^\{([^}]*)\}$/);
    if (!match) return null;
    const body = match[1];
    const attrs = {};
    body.split(/\s+/).forEach((chunk) => {
      if (!chunk) return;
      const [k, v] = chunk.split("=");
      if (k) {
        attrs[k] = v || "";
      }
    });
    return Object.keys(attrs).length ? attrs : null;
  }

  function renderMarkdownMedia(token) {
    const alt = escapeHTML(token.content || token.attrGet("alt") || "");
    const media = resolveMedia(token.attrGet("src") || "", { mode: token.meta.mediaMode, size: 1200 });
    if (media.kind === "video") {
      return renderVideoFigure(media, { caption: alt });
    }
    // Display box is fitted to 1200px on the longest side regardless of the media source.
    const { width, height } = getPreviewDimensions(media, 1200);
    const figureStyle = `--article-media-width:${width}px; --article-media-height:${height}px; --article-media-aspect:${width} / ${height};`;
    const caption = alt ? `<figcaption>${alt}</figcaption>` : "";
    return `<figure class="article-media" style="${figureStyle}"><div class="article-media__frame"><img src="${escapeHTML(media.src)}" data-full-src="${escapeHTML(media.fullSrc)}" alt="${alt}" loading="lazy" decoding="async" width="${width}" height="${height}" /></div>${caption}</figure>`;
  }

  // Detect `{media=...}` (or the compatible `{gyazo=...}`) right after an image and mark the token.
  markdownLib.core.ruler.after("inline", "media_attrs", function (state) {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 1; i++) {
      const tok = tokens[i];
      if (tok.type === "inline" && tok.children) {
        const children = tok.children;
        for (let j = 0; j < children.length - 1; j++) {
          const img = children[j];
          const txt = children[j + 1];
          if (img.type === "image" && txt && txt.type === "text") {
            const attrs = parseBraceAttrs(txt.content || "");
            const mediaMode = attrs && (attrs.media || attrs.gyazo);
            if (mediaMode) {
              img.meta = img.meta || {};
              img.meta.mediaMode = String(mediaMode).toLowerCase();
              // remove the brace text token
              children.splice(j + 1, 1);
            }
          }
        }
      }
    }
  });

  // Rewrap paragraphs that contain only attributed media into a media row.
  markdownLib.core.ruler.after("media_attrs", "media_row", function (state) {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      if (tokens[i].type !== "paragraph_open") continue;
      const inline = tokens[i + 1];
      const close = tokens[i + 2];
      if (!inline || inline.type !== "inline" || close.type !== "paragraph_close") continue;
      const children = inline.children || [];
      if (!children.length) continue;
      const onlyMedia = children.every((c) => (c.type === "image" && c.meta?.mediaMode) || (c.type === "text" && !c.content.trim()));
      if (!onlyMedia) continue;
      tokens[i].type = "media_row_open";
      tokens[i].tag = "div";
      tokens[i].attrSet("class", "article-media-row");
      tokens[i + 2].type = "media_row_close";
      tokens[i + 2].tag = "div";
    }
  });

  markdownLib.renderer.rules.media_row_open = (tokens, idx) => `<div class="${tokens[idx].attrGet("class")}">`;
  markdownLib.renderer.rules.media_row_close = () => `</div>`;

  const defaultImageRenderer = markdownLib.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLib.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    if (token.meta?.mediaMode) {
      return renderMarkdownMedia(token);
    }
    const src = token.attrGet("src");
    if (src) {
      const media = resolveMedia(src, { mode: "image", size: 1000 });
      token.attrSet("src", media.src);
      if (!token.attrGet("loading")) {
        token.attrSet("loading", "lazy");
      }
      if (!token.attrGet("decoding")) {
        token.attrSet("decoding", "async");
      }
      token.attrSet("data-full-src", media.fullSrc);
      if (media.srcset) {
        token.attrSet("srcset", media.srcset);
        if (!token.attrGet("sizes")) {
          token.attrSet("sizes", "(min-width: 768px) 720px, 100vw");
        }
      }
      if (media.width && media.height) {
        token.attrSet("width", String(media.width));
        token.attrSet("height", String(media.height));
      }
    }
    if (token.meta?.isStandalone) {
      token.attrJoin("class", "article-media__image");
    }
    const renderedImage = defaultImageRenderer(tokens, idx, options, env, self);
    if (!token.meta?.isStandalone) {
      return renderedImage;
    }
    const widthAttr = Number(token.attrGet("width"));
    const heightAttr = Number(token.attrGet("height"));
    const hasDimensions =
      Number.isFinite(widthAttr) && Number.isFinite(heightAttr) && widthAttr > 0 && heightAttr > 0;
    const styleChunks = [];

    if (hasDimensions) {
      const ratioValue = widthAttr / heightAttr;
      const limitedHeight = Math.min(heightAttr, 320);
      styleChunks.push(`--article-media-aspect:${widthAttr} / ${heightAttr}`);
      styleChunks.push(`--article-media-height:${limitedHeight}px`);
      const constrainedWidth = Math.min(widthAttr, Math.round(ratioValue * limitedHeight));
      styleChunks.push(`--article-media-width:${constrainedWidth}px`);
    } else {
      styleChunks.push(`--article-media-height:320px`);
    }

    const styleAttr = styleChunks.length ? ` style="${styleChunks.join("; ")}"` : "";
    return `<figure class="article-media"${styleAttr}><div class="article-media__frame">${renderedImage}</div></figure>`;
  };


  enhanceStandaloneImages(markdownLib);
  preserveManualNumberedBullets(markdownLib);
  enhanceJsonLinks(markdownLib);
  eleventyConfig.setLibrary("md", markdownLib);

  // Paired shortcode: side-by-side media + text
  // Usage (in Markdown):
  // {% mediaRow img="https://... {media=image}", alt="説明", align="left", width=33 %}
  // 任意のMarkdown（箇条書きなど）
  // {% mediaFooter %}画像の下に置きたいリンクや補足{% endmediaFooter %}
  // {% endmediaRow %}
  eleventyConfig.addPairedShortcode("mediaFooter", function (content = "") {
    return `@@MEDIA_FOOTER_START@@${content}@@MEDIA_FOOTER_END@@`;
  });

  eleventyConfig.addPairedShortcode("mediaRow", function (content, opts = {}) {
    let { img = "", alt = "", align = "left", width = 33, gyazo = "", media = "", mode = "" } = opts;
    const reverse = String(align).toLowerCase() === "right";
    const safeAlt = String(alt).replace(/"/g, "&quot;");
    const footerRegex = /@@MEDIA_FOOTER_START@@([\s\S]*?)@@MEDIA_FOOTER_END@@/g;
    let footerContent = "";

    if (typeof content === "string") {
      const matches = Array.from(content.matchAll(footerRegex));
      if (matches.length) {
        footerContent = matches.map((match) => match[1]).join("\n");
        content = content.replace(footerRegex, "");
      }
    }

    // Allow braces style in img param: "https://... {media=loop}" (compatible: {gyazo=loop})
    let modeFromBrace = "";
    if (typeof img === "string") {
      const m = img.match(/\{(?:media|gyazo)=([^}]+)\}/i);
      if (m) {
        modeFromBrace = m[1];
        img = img.replace(/\s*\{(?:media|gyazo)=[^}]+\}\s*/i, "");
      }
    }

    const mediaMode = normalizeMediaMode(mode || modeFromBrace || media || gyazo) || "image";

    let mediaPart = "";
    if (img) {
      const resolved = resolveMedia(img, { mode: mediaMode, size: 1000 });
      let mediaMarkup;
      if (resolved.kind === "video") {
        mediaMarkup = renderVideoFigure(resolved, { caption: safeAlt, maxHeight: 360 });
      } else {
        const attrs = [
          `src="${escapeHTML(resolved.src)}"`,
          `alt="${safeAlt}"`,
          `loading="lazy"`,
          `decoding="async"`,
          `data-full-src="${escapeHTML(resolved.fullSrc)}"`
        ];
        if (resolved.srcset) {
          attrs.push(`srcset="${escapeHTML(resolved.srcset)}"`);
          attrs.push(`sizes="(min-width: 900px) ${width}vw, 100vw"`);
        }
        if (resolved.width && resolved.height) {
          attrs.push(`width="${resolved.width}"`);
          attrs.push(`height="${resolved.height}"`);
        }
        mediaMarkup = `<img ${attrs.join(" ")}>`;
      }
      mediaPart = `<div class="media-inline__media-stack" style="--media-inline-width:${width}%;">
  <div class="media-inline__media">
    ${mediaMarkup}
  </div>
</div>`;
    }

    const renderedBody = markdownLib.render(content);
    const renderedFooter = footerContent.trim() ? markdownLib.render(footerContent) : "";
    if (renderedFooter && mediaPart) {
      const marker = "MEDIA_FOOTER_ANCHOR";
      const footerMarkup = `  <div class="media-inline__footer">${renderedFooter}</div>\n`;
      const lastCloseIndex = mediaPart.lastIndexOf("</div>");
      if (lastCloseIndex !== -1) {
        mediaPart =
          mediaPart.slice(0, lastCloseIndex) +
          footerMarkup +
          mediaPart.slice(lastCloseIndex);
      } else {
        mediaPart = mediaPart.replace(marker, footerMarkup);
      }
    }

    // Fix: Swap DOM order when reversed to match visual order (fixes Lightbox navigation)
    const innerHTML = reverse
      ? `<div class="media-inline__body">${renderedBody}</div>${mediaPart}`
      : `${mediaPart}<div class="media-inline__body">${renderedBody}</div>`;

    return `
<div class="media-inline${reverse ? " media-inline--reverse" : ""}">
  ${innerHTML}
</div>`;
  });

  eleventyConfig.addShortcode("workflowPicker", function (...rawArgs) {
    const env = this || {};
    const inputArgs = rawArgs.length === 1 && Array.isArray(rawArgs[0]) ? rawArgs[0] : rawArgs;
    const normalized = inputArgs
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);

    if (!normalized.length) return "";

    const items = [];
    let defaultIndex = -1;

    normalized.forEach((raw, index) => {
      const isDefault = raw.startsWith("!");
      const file = isDefault ? raw.slice(1).trim() : raw;
      if (!file) return;
      const name = getWorkflowBasename(file);
      if (isDefault && defaultIndex === -1) {
        defaultIndex = items.length;
      }
      items.push({ file, name });
    });

    if (!items.length) return "";
    if (defaultIndex < 0) defaultIndex = 0;

    env.__workflowPickerCounter = env.__workflowPickerCounter || 0;
    env.__workflowPickerCounter += 1;
    const pickerKey = hashString(items.map((item) => item.file).join("|"));
    const pickerId = `workflow-picker-${pickerKey}-${env.__workflowPickerCounter}`;
    const lang = env.lang || env.page?.lang || DEFAULT_LANG;
    const copyLabel = getWorkflowLabel("copyLabel", lang);
    const downloadLabel = getWorkflowLabel("downloadLabel", lang);
    const copiedLabel = getWorkflowLabel("copiedLabel", lang);
    const downloadedLabel = getWorkflowLabel("downloadedLabel", lang);
    const copyErrorLabel = lang === "ja" ? "コピーに失敗しました" : "Copy failed";
    const selectLabel = lang === "ja" ? "workflow JSONを選択" : "Select workflow JSON";
    const copyIcon = getIconMarkup("copy");
    const downloadIcon = getIconMarkup("download");

    const defaultFile = items[defaultIndex].file;
    const defaultName = items[defaultIndex].name;
    const listId = `${pickerId}-list`;
    const toggleId = `${pickerId}-toggle`;
    const options = items.map((item, index) => {
      const isSelected = index === defaultIndex;
      return `<li class="workflow-picker__option${isSelected ? " is-selected" : ""}" role="option" data-value="${escapeHTML(item.file)}" aria-selected="${isSelected ? "true" : "false"}">${escapeHTML(item.name)}</li>`;
    }).join("");

    return `<div class="workflow-json workflow-json--picker" data-workflow-picker="${pickerId}" data-error-label="${escapeHTML(copyErrorLabel)}">
  <div class="workflow-json__row workflow-json__row--picker">
    <div class="workflow-picker" data-workflow-picker-control>
      <button class="workflow-picker__button" type="button" id="${toggleId}" aria-haspopup="listbox" aria-expanded="false" aria-controls="${listId}" aria-label="${escapeHTML(selectLabel)}" data-workflow-picker-toggle>
        <span class="workflow-picker__label">${escapeHTML(defaultName)}</span>
        <span class="workflow-picker__caret" aria-hidden="true"></span>
      </button>
      <ul class="workflow-picker__list" id="${listId}" role="listbox" aria-labelledby="${toggleId}" data-workflow-picker-list>
        ${options}
      </ul>
    </div>
    <div class="workflow-json__actions">
      <button class="workflow-json__icon" type="button" aria-label="${escapeHTML(copyLabel)} ${escapeHTML(defaultName)}" data-workflow-picker-copy data-label="${escapeHTML(copyLabel)}" data-success-label="${escapeHTML(copiedLabel)}">
        ${copyIcon}
      </button>
      <a class="workflow-json__icon" href="${escapeHTML(defaultFile)}" download="${escapeHTML(defaultName)}" data-no-swup aria-label="${escapeHTML(downloadLabel)} ${escapeHTML(defaultName)}" data-workflow-picker-download data-label="${escapeHTML(downloadLabel)}" data-success-label="${escapeHTML(downloadedLabel)}">
        ${downloadIcon}
      </a>
    </div>
  </div>
  <span class="workflow-json__message" role="status" aria-live="polite" data-workflow-picker-message></span>
</div>`;
  });

  eleventyConfig.setServerOptions({
    showAllHosts: true,
    port: 8080,
    watch: ["src/assets/**/*", "src/workflows/**/*"],
    // `/__media-originals/<logical name>` previews local originals on the dev server (see resolveManagedMedia).
    middleware: [createOriginalsMiddleware()]
  });

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["md", "njk", "11ty.js"],
    pathPrefix: "/"
  };
}
