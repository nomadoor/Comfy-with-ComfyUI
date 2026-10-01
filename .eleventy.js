import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";
import { logicalNameFromRef, mediaRef, publicUrl, transformUrl } from "./scripts/lib/media-names.mjs";
import { createOriginalsMiddleware, localPreview, originalsRootFromEnv } from "./scripts/lib/media-local-preview.mjs";
import envData from "./src/_data/env.js";
import missingPages from "./src/_data/missingPages.js";
import navData from "./src/_data/nav.js";
import { groupMediaSteps, renderMediaStep } from "./scripts/lib/media-steps.mjs";
import { listProfileIds as listRunpodProfiles, readProfileSource as readRunpodProfile, writeProfiles as writeRunpodProfiles } from "./runpod/tools/profiles.mjs";

const GYAZO_HOST = "i.gyazo.com";
const SITE_DATA_PATH = path.join("src", "_data", "site.json");
const MEDIA_MANIFEST_PATH = path.join("src", "_data", "media.json");
// Test builds (COMFY_MEDIA_FIXTURES=1) add fixture media and the fixture page; production builds never read them.
const MEDIA_FIXTURES_ENABLED = process.env.COMFY_MEDIA_FIXTURES === "1";
const MEDIA_ORIGINALS_ROOT = originalsRootFromEnv();
const CHECK_CHANGED_MEDIA = process.env.COMFY_MEDIA_PREVIEW_CHANGED === "1";
const MEDIA_FIXTURE_MANIFEST_PATH = path.join("tests", "fixtures", "media", "media.json");
const MEDIA_FIXTURE_PAGE_PATH = path.join("tests", "fixtures", "media", "media-fixtures.md");
const WORKFLOW_PERFORMANCE_FIXTURE_PAGE_PATH = path.join("tests", "fixtures", "workflow-performance.md");
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
  downloadedLabel: "Downloaded",
  performanceLabel: "Performance",
  levelLabel: "level"
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

function getRenderLang(env = {}) {
  return env.lang || env.ctx?.lang || env.page?.lang || env.ctx?.page?.lang || DEFAULT_LANG;
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

function normalizeSamplerSpeed(input) {
  const match = String(input || "").trim().match(/^(\d+(?:\.\d+)?)\s+(s\/it|it\/s)$/);
  if (!match) return "";
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) return "";
  if (match[2] === "s/it") return `${match[1]} s/it`;

  const secondsPerIteration = 1 / value;
  const roundedSeconds = Number(secondsPerIteration.toPrecision(2));
  return `${roundedSeconds} s/it`;
}

function normalizeWorkflowPerformance(input) {
  if (!input || typeof input !== "object") return null;
  const level = Number(input.level);
  if (!Number.isInteger(level) || level < 1 || level > 3) return null;
  const rawRuns = Array.isArray(input.runs) ? input.runs : [input];
  const runs = rawRuns
    .map((run) => {
      if (!run || typeof run !== "object") return null;
      const gpu = String(run.gpu || "").trim();
      const ram = String(run.ram || "").trim();
      const time = String(run.time || "").trim();
      if (!gpu || !ram || !time) return null;
      const tagValues = Array.isArray(run.tags) ? run.tags : run.tags ? [run.tags] : [];
      const tags = tagValues.map((tag) => String(tag).trim()).filter(Boolean);
      const samplerValues = Array.isArray(run.samplers) ? run.samplers : [];
      const samplers = samplerValues
        .map((sampler) => {
          if (!sampler || typeof sampler !== "object") return null;
          const name = String(sampler.name || "").trim();
          const speed = normalizeSamplerSpeed(sampler.speed);
          if (!speed) return null;
          return { name, speed };
        })
        .filter(Boolean);
      const validSamplers = samplers.length > 1 && samplers.some((sampler) => !sampler.name)
        ? []
        : samplers;
      return { gpu, ram, time, tags, samplers: validSamplers };
    })
    .filter(Boolean);
  return runs.length ? { level, runs } : null;
}

function renderPerformanceMeter() {
  return '<span class="workflow-performance__meter" aria-hidden="true"></span>';
}

function renderPerformanceRuns(performance, { totalTimeLabel, samplerLabel }) {
  return performance.runs.map((run) => {
    const tags = run.tags.length
      ? `<span class="workflow-performance__tags">${run.tags.map((tag) => `<span class="workflow-performance__tag">${escapeHTML(tag)}</span>`).join("")}</span>`
      : "";
    const samplerMetrics = run.samplers.map((sampler) => `<div class="workflow-performance__metric workflow-performance__metric--sampler">
          <span class="workflow-performance__metric-label">${escapeHTML(sampler.name || samplerLabel)}</span>
          <span class="workflow-performance__sampler-speed">${escapeHTML(sampler.speed)}</span>
        </div>`).join("");
    return `<div class="workflow-performance__run">
      <span class="workflow-performance__gpu"><span class="workflow-performance__data-icon workflow-performance__data-icon--gpu" aria-hidden="true"></span>${escapeHTML(run.gpu)}</span>
      <div class="workflow-performance__metric workflow-performance__metric--total">
        <span class="workflow-performance__metric-label">${escapeHTML(totalTimeLabel)}</span>
        <span class="workflow-performance__time">${escapeHTML(run.time)}</span>
      </div>
      <span class="workflow-performance__details"><span class="workflow-performance__ram"><span class="workflow-performance__data-icon workflow-performance__data-icon--ram" aria-hidden="true"></span>${escapeHTML(run.ram)}</span>${tags}</span>
      ${samplerMetrics}
    </div>`;
  }).join("");
}

function renderPerformancePopup(performance, { id, label, totalTimeLabel, samplerLabel, measurementNote, file = "", hidden = false }) {
  return `<div class="workflow-performance__popup" id="${id}" role="tooltip" data-performance-level="${performance.level}"${file ? ` data-performance-file="${escapeHTML(file)}"` : ""}${hidden ? " hidden" : ""} data-performance-popup>
      <div class="workflow-performance__heading">${escapeHTML(label)}</div>
      <div class="workflow-performance__runs">${renderPerformanceRuns(performance, { totalTimeLabel, samplerLabel })}</div>
      <div class="workflow-performance__measurement-note">${escapeHTML(measurementNote)}</div>
    </div>`;
}

function renderWorkflowPerformance(performance, { fileName, id, lang = DEFAULT_LANG }) {
  if (!performance) return "";
  const popupId = `${id}-performance`;
  const performanceLabel = getWorkflowLabel("performanceLabel", lang);
  const levelLabel = getWorkflowLabel("levelLabel", lang);
  const totalTimeLabel = getWorkflowLabel("totalTimeLabel", lang);
  const samplerLabel = getWorkflowLabel("samplerLabel", lang);
  const measurementNote = getWorkflowLabel("performanceMeasurementNote", lang);
  return `<div class="workflow-performance" data-workflow-performance data-performance-label="${escapeHTML(performanceLabel)}" data-level-label="${escapeHTML(levelLabel)}">
    <button class="workflow-performance__trigger" type="button" aria-label="${escapeHTML(performanceLabel)} ${escapeHTML(levelLabel)} ${performance.level}: ${escapeHTML(fileName)}" aria-describedby="${popupId}" aria-expanded="false" data-level="${performance.level}" data-performance-trigger>
      ${renderPerformanceMeter(performance.level)}
    </button>
    ${renderPerformancePopup(performance, { id: popupId, label: performanceLabel, totalTimeLabel, samplerLabel, measurementNote })}
  </div>`;
}

function renderWorkflowPickerPerformance(items, defaultIndex, pickerId, lang = DEFAULT_LANG) {
  const entries = items
    .map((item, index) => ({ ...item, index }))
    .filter((entry) => entry.performance);
  if (!entries.length) return "";
  const selected = entries.find((entry) => entry.index === defaultIndex) || null;
  const fallback = selected || entries[0];
  const popupId = `${pickerId}-performance-${fallback.index}`;
  const performanceLabel = getWorkflowLabel("performanceLabel", lang);
  const levelLabel = getWorkflowLabel("levelLabel", lang);
  const totalTimeLabel = getWorkflowLabel("totalTimeLabel", lang);
  const samplerLabel = getWorkflowLabel("samplerLabel", lang);
  const measurementNote = getWorkflowLabel("performanceMeasurementNote", lang);
  const popups = entries.map((entry) => renderPerformancePopup(entry.performance, {
    id: `${pickerId}-performance-${entry.index}`,
    label: performanceLabel,
    totalTimeLabel,
    samplerLabel,
    measurementNote,
    file: entry.file,
    hidden: entry.index !== defaultIndex
  })).join("");
  return `<div class="workflow-performance"${selected ? "" : " hidden"} data-workflow-performance data-picker-performance data-performance-label="${escapeHTML(performanceLabel)}" data-level-label="${escapeHTML(levelLabel)}">
    <button class="workflow-performance__trigger" type="button" aria-label="${escapeHTML(performanceLabel)} ${escapeHTML(levelLabel)} ${fallback.performance.level}: ${escapeHTML(fallback.name)}" aria-describedby="${popupId}" aria-expanded="false" data-level="${fallback.performance.level}" data-performance-trigger>
      ${renderPerformanceMeter(fallback.performance.level)}
    </button>
    ${popups}
  </div>`;
}

function renderJsonLinkRow(linkInfo, env, performanceInput = null) {
  const diskPath = resolveJsonDiskPath(linkInfo.href, env);
  if (!diskPath) {
    return null;
  }
  if (!fsSync.existsSync(diskPath)) {
    return null;
  }
  // Root-absolute URL so Copy/Download do not depend on the page URL at click time.
  const jsonUrl = `/${path.relative(path.join(process.cwd(), "src"), diskPath).split(path.sep).map(encodeURIComponent).join("/")}`;
  const counterState = env.ctx && typeof env.ctx === "object" ? env.ctx : env;
  counterState.__jsonLinkCounter = Number.isInteger(counterState.__jsonLinkCounter)
    ? counterState.__jsonLinkCounter + 1
    : 1;
  const pageKey = (env.page?.url || "page").replace(/[^a-z0-9]+/gi, "-");
  const fileName = path.basename(linkInfo.href.split("?")[0]);
  const baseKey = path.basename(fileName, path.extname(fileName)).replace(/[^a-z0-9]+/gi, "-") || "wf";
  const copyTargetId = `workflow-json-inline-${pageKey}-${baseKey}-${counterState.__jsonLinkCounter}`;
  const lang = getRenderLang(env);
  const copyLabel = getWorkflowLabel("copyLabel", lang);
  const downloadLabel = getWorkflowLabel("downloadLabel", lang);
  const copiedLabel = getWorkflowLabel("copiedLabel", lang);
  const downloadedLabel = getWorkflowLabel("downloadedLabel", lang);
  const copyIcon = getIconMarkup("copy");
  const downloadIcon = getIconMarkup("download");
  const escapedFile = escapeHTML(fileName);
  const performance = normalizeWorkflowPerformance(performanceInput);
  const performanceMarkup = renderWorkflowPerformance(performance, { fileName, id: copyTargetId, lang });
  return `<div class="workflow-json workflow-json--inline">
  <div class="workflow-json__row">
    <span class="workflow-json__filename">${escapedFile}</span>
    <div class="workflow-json__actions">
      <button class="workflow-json__icon" type="button" aria-label="${escapeHTML(copyLabel)} ${escapedFile}" data-copy-json="${copyTargetId}" data-json-src="${escapeHTML(jsonUrl)}" data-label="${escapeHTML(copyLabel)}" data-success-label="${escapeHTML(copiedLabel)}">
        ${copyIcon}
      </button>
      <a class="workflow-json__icon" href="${escapeHTML(jsonUrl)}" download="${escapedFile}" data-no-swup aria-label="${escapeHTML(downloadLabel)} ${escapedFile}" data-download-json="${copyTargetId}-download" data-label="${escapeHTML(downloadLabel)}" data-success-label="${escapeHTML(downloadedLabel)}">
        ${downloadIcon}
      </a>
      ${performanceMarkup}
    </div>
  </div>
</div>`;
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
    // Third-party media (e.g. a GIF on GitHub) is shown in the article but never offered as the
    // social preview image: its size and content type are outside our control.
    media = { kind, src: source, fullSrc: source, width: undefined, height: undefined, srcset: "", poster: kind === "image" ? source : "", og: "", external: true };
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
  // `preload="none"` and no `autoplay`: video-lazy.js loads and plays a clip once it nears the
  // viewport, so opening a page does not download every video on it. The poster frame fills the box
  // in the meantime.
  const playback = initial === "player" ? 'controls playsinline preload="none"' : 'muted loop playsinline preload="none"';
  // The poster is attached by video-lazy.js together with the clip; as a plain `poster` attribute it
  // would be fetched for every video on the page as soon as the page renders.
  const poster = media.poster ? ` data-poster="${escapeHTML(media.poster)}"` : "";
  return `<figure class="article-video article-video--${initial} article-video--toggleable" data-media-toggle data-media-initial="${initial}" style="--article-video-height:${height}px; --article-video-width:${width}px; --article-video-aspect:${aspect};"><div class="article-video__frame"><video src="${escapeHTML(media.src)}" data-full-src="${escapeHTML(media.fullSrc)}"${poster} data-media-lazy ${playback}></video><button type="button" class="media-toggle" aria-label="Toggle video playback mode" data-loop-label="Loop" data-player-label="Player">${VIDEO_TOGGLE_ICON}</button></div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
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

export default function (eleventyConfig) {
  // Passthrough static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": `assets/js/${envData.assetVersion}` });
  eleventyConfig.addPassthroughCopy({ "src/workflows": "workflows" });
  // Drafts are unpublished (ops/requirements.md): skip them entirely instead of building hidden pages.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => (data.draft ? false : undefined));
  // Asset notes are for maintainers, not pages.
  eleventyConfig.ignores.add("src/assets/fonts/README.md");
  eleventyConfig.addPassthroughCopy({ "src/search": "search" });
  eleventyConfig.addPassthroughCopy({ "src/.well-known": ".well-known" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  eleventyConfig.addWatchTarget("ops");

  if (MEDIA_FIXTURES_ENABLED) {
    eleventyConfig.addWatchTarget(MEDIA_FIXTURE_MANIFEST_PATH);
    eleventyConfig.addTemplate("internal/media-fixtures.md", fsSync.readFileSync(MEDIA_FIXTURE_PAGE_PATH, "utf-8"));
    eleventyConfig.addTemplate(
      "internal/workflow-performance-fixtures.md",
      fsSync.readFileSync(WORKFLOW_PERFORMANCE_FIXTURE_PAGE_PATH, "utf-8")
    );
  }

  eleventyConfig.on("beforeBuild", () => {
    loadMediaManifest();
  });

  // RunPod profiles (/runpod/profiles/<id>.json) are built from the workflow JSON on every build.
  eleventyConfig.on("eleventy.after", ({ dir }) => {
    writeRunpodProfiles({ outDir: dir.output, siteURL: siteData.url });
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

  // Frontmatter dates arrive as Date (unquoted YAML) or "YYYY-MM-DD" strings (quoted).
  eleventyConfig.addFilter("isoDate", function (value) {
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10);
    const match = String(value ?? "").match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : "";
  });

  // Swaps the language segment of a localized URL ("/ja/x/y/" -> "/en/x/y/"); "" outside the language tree.
  const localizedPathFor = (url, langCode) => {
    const match = String(url || "").match(/^\/(ja|en|zh)(\/.*)$/);
    return match && langCode ? `/${langCode}${match[2]}` : "";
  };

  // hreflang alternates for a localized URL, limited to translations that were actually built
  // (JA is the source language, so EN/ZH may not exist yet). x-default is the default-language URL.
  // URLs of built pages that are not noindex, cached per collection object.
  const builtUrlSets = new WeakMap();
  const indexableUrls = (collection) => {
    if (!builtUrlSets.has(collection)) {
      const indexable = collection.filter((item) => !String(item.data?.robots || "").includes("noindex"));
      builtUrlSets.set(collection, new Set(indexable.map((item) => item.url)));
    }
    return builtUrlSets.get(collection);
  };
  eleventyConfig.addFilter("hreflangAlternates", function (url = "", languages = [], collection = [], defaultLang = "") {
    const built = indexableUrls(collection);
    const alternates = [];
    for (const { code } of languages) {
      const href = localizedPathFor(url, code);
      if (href && built.has(href)) alternates.push({ hreflang: code, href });
    }
    const defaultHref = localizedPathFor(url, defaultLang);
    if (alternates.length > 1 && built.has(defaultHref)) alternates.push({ hreflang: "x-default", href: defaultHref });
    return alternates.length > 1 ? alternates : [];
  });

  // Every built page URL (noindex included), for navigation that must reach pages search engines skip.
  // Paginated "coming soon" placeholders only surface their first page in collections, so their URLs
  // are added from the same data that generates them.
  const builtUrlLists = new WeakMap();
  const allBuiltUrls = (collection) => {
    if (!builtUrlLists.has(collection)) {
      const urls = new Set(collection.map((item) => item.url));
      missingPages().forEach((stub) => urls.add(`/${stub.lang}/${stub.section}/${stub.id}/`));
      builtUrlLists.set(collection, urls);
    }
    return builtUrlLists.get(collection);
  };

  // Language-menu (and logo) target for the current page: the same page in `langCode` when it was
  // built; otherwise that language's home, or its guide page while that home does not exist yet.
  eleventyConfig.addFilter("langSwitchTarget", function (url = "", langCode = "", collection = []) {
    const built = allBuiltUrls(collection);
    const target = localizedPathFor(url, langCode);
    if (target && built.has(target)) return target;
    if (built.has(`/${langCode}/`)) return `/${langCode}/`;
    return `/${langCode}/begin-with/how-to-use-this-site/`;
  });

  // The newest `limit` rows of a language's news page, reused on the language home.
  // Rows are copied verbatim, so each news row must stay a flat <a class="news-row">…</a> block.
  eleventyConfig.addFilter("newsRows", function (lang = "ja", limit = 5) {
    const newsPath = path.join(process.cwd(), "src", "content", lang, "news.md");
    if (!fsSync.existsSync(newsPath)) return "";
    const rows = fsSync.readFileSync(newsPath, "utf-8").match(/<a class="news-row"[\s\S]*?<\/a>/g) || [];
    return rows.slice(0, limit).join("\n");
  });

  // Look up a built page by its URL (for cards that point at articles).
  eleventyConfig.addFilter("pageByUrl", function (collection = [], url = "") {
    const entry = collection.find((item) => item.url === url);
    return entry ? { url: entry.url, title: entry.data.title, hero: entry.data.hero || {} } : null;
  });

  // schema.org graph for a page: WebSite + WebPage, plus Article and its Person author for articles.
  eleventyConfig.addFilter("pageStructuredData", function (input = {}) {
    const { siteUrl, canonicalUrl, lang, siteName, title, description, article, author } = input;
    const websiteId = `${siteUrl}/#website`;
    const webpageId = `${canonicalUrl}#webpage`;
    const graph = [
      { "@type": "WebSite", "@id": websiteId, url: `${siteUrl}/`, name: siteName, inLanguage: lang },
      { "@type": "WebPage", "@id": webpageId, url: canonicalUrl, name: title, ...(description ? { description } : {}), inLanguage: lang, isPartOf: { "@id": websiteId } }
    ];
    if (article && author?.name) {
      const authorId = `${siteUrl}/#author`;
      graph.push({
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: title,
        ...(description ? { description } : {}),
        inLanguage: lang,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        ...(article.image ? { image: [article.image] } : {}),
        author: { "@id": authorId },
        publisher: { "@id": authorId },
        mainEntityOfPage: { "@id": webpageId },
        isPartOf: { "@id": websiteId }
      });
      graph.push({
        "@type": "Person",
        "@id": authorId,
        name: author.name,
        ...(author.url ? { url: author.url } : {}),
        ...(author.sameAs?.length ? { sameAs: author.sameAs } : {})
      });
    }
    return { "@context": "https://schema.org", "@graph": graph };
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

  // Media trays with a small labelled header. `{% outputs %}` holds output examples under a workflow;
  // `{% outputs "samples" %}` holds input images readers can use with the article's workflows.
  // Usage (in Markdown): {% outputs %} ![](...){media=loop} ![](...){media=loop} {% endoutputs %}
  const iconSvg = (paths) =>
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const OUTPUTS_KINDS = {
    outputs: { label: "Outputs", icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.02693 18.329C4.18385 19.277 5.0075 20 6 20H18C19.1046 20 20 19.1046 20 18V14.1901M4.02693 18.329C4.00922 18.222 4 18.1121 4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V14.1901M4.02693 18.329L7.84762 14.5083C8.52765 13.9133 9.52219 13.8482 10.274 14.3494L10.7832 14.6888C11.5078 15.1719 12.4619 15.1305 13.142 14.5865L15.7901 12.4679C16.4651 11.9279 17.4053 11.8856 18.1228 12.3484C18.2023 12.3997 18.2731 12.4632 18.34 12.5302L20 14.1901M11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9Z"></path></svg>' },
    samples: {
      label: "Samples",
      icon: iconSvg('<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>')
    }
  };
  eleventyConfig.addPairedShortcode("outputs", function (content = "", requested = "outputs") {
    const kind = OUTPUTS_KINDS[requested] ? requested : "outputs";
    const tray = OUTPUTS_KINDS[kind];
    // No blank lines inside: the block must stay one HTML block for the Markdown around it.
    const body = markdownLib.render(content, { page: this.page }).trim().replace(/\n\s*\n/g, "\n");
    return `<div class="outputs outputs--${kind}"><div class="outputs__header"><span class="outputs__icon">${tray.icon}</span><span class="outputs__label">${tray.label}</span></div>\n${body}\n</div>`;
  });

  // `{% runpod %}`: a card that deploys this article's Runpod template (one Pod with every workflow,
  // its models and sample images). Reads the profile whose `article` is this page, so the GPU guidance
  // and the template stay in one place (runpod/profiles/<id>.yaml). Kept to one row: it sits near the
  // top of every article that has a profile. The referral, when there is one, is disclosed in a line under the card.
  // The logo is Runpod's cube icon as its brand kit shows it (white cube on the official purple; the
  // kit allows the icon for compact placements and forbids recolouring), so it is not a currentColor icon.
  const RUNPOD_LOGO =
    '<svg class="runpod-launch__logo" viewBox="0 0 256 256" aria-hidden="true"><rect width="256" height="256" rx="48" fill="#5d29f0"></rect>' +
    '<g transform="translate(58 54) scale(0.72)"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M170.04 163.76C180.216 157.899 186.485 147.067 186.485 135.344L186.485 70.656C186.485 58.9334 180.216 48.1013 170.04 42.24L113.887 9.89597C103.71 4.03467 91.1731 4.03468 80.997 9.89598L24.8432 42.24C14.6671 48.1013 8.39844 58.9334 8.39844 70.656L8.39844 135.344C8.39844 147.067 14.6672 157.899 24.8432 163.76L80.997 196.104C91.1731 201.965 103.711 201.965 113.887 196.104L170.04 163.76ZM170.04 135.344C170.04 141.205 166.906 146.621 161.818 149.552L132.428 166.48C129.838 167.972 128.543 168.718 127.48 168.607C126.553 168.51 125.711 168.025 125.163 167.272C124.535 166.41 124.535 164.918 124.535 161.934L124.535 128.078C124.535 122.217 127.669 116.801 132.757 113.87L148.493 104.806C150.654 103.562 151.734 102.939 152.52 102.068C153.214 101.298 153.739 100.39 154.058 99.404C154.42 98.2895 154.418 97.0449 154.413 94.5556L154.412 93.8078C154.405 90.0844 154.402 88.2227 153.616 87.1465C152.931 86.2077 151.879 85.6029 150.721 85.4821C149.393 85.3436 147.777 86.2745 144.545 88.1362L124.535 99.662C114.359 105.523 108.09 116.355 108.09 128.078V177.704C108.09 179.434 107.165 181.031 105.664 181.896C100.576 184.827 94.3074 184.827 89.2194 181.896L33.0656 149.552C27.9776 146.621 24.8432 141.205 24.8432 135.344L24.8432 102.001C24.8432 99.0167 24.8432 97.5248 25.4713 96.6622C26.0192 95.9099 26.8613 95.4249 27.7883 95.3277C28.8511 95.2162 30.1462 95.9621 32.7366 97.454L61.518 114.031C66.6059 116.961 69.7403 122.378 69.7403 128.239L69.7403 145.503C69.7403 147.992 69.7403 149.237 70.1037 150.35C70.4253 151.336 70.9512 152.243 71.6472 153.012C72.4339 153.881 73.5155 154.502 75.6786 155.743L76.3283 156.115C79.5638 157.971 81.1816 158.9 82.5087 158.759C83.6663 158.636 84.7175 158.029 85.4012 157.089C86.1851 156.012 86.1851 154.15 86.1851 150.426L86.1851 128.239C86.1851 116.516 79.9164 105.684 69.7403 99.8227L27.7149 75.6181C25.9379 74.5947 24.8432 72.7031 24.8432 70.656C24.8432 64.7947 27.9775 59.3786 33.0656 56.448L89.2194 24.104C94.3074 21.1733 100.576 21.1733 105.664 24.104L134.734 40.8481C137.325 42.3402 138.62 43.0862 139.055 44.0601C139.434 44.9096 139.434 45.8798 139.055 46.7293C138.62 47.7032 137.325 48.4492 134.734 49.9413L105.21 66.9473C100.121 69.8779 93.8528 69.8779 88.7647 66.9473L72.2226 57.4192C70.576 56.4708 69.7527 55.9965 68.8765 55.8061C68.1011 55.6376 67.2992 55.6309 66.5211 55.7864C65.6419 55.962 64.8107 56.4224 63.1483 57.343L61.0974 58.4789C57.7726 60.3202 56.1103 61.2409 55.5478 62.4623C55.0574 63.5273 55.0471 64.7507 55.5195 65.8238C56.0613 67.0545 57.7079 68.0029 61.0011 69.8997L80.5424 81.1553C90.7184 87.0166 103.256 87.0166 113.432 81.1553L156.327 56.448C158.026 55.4695 160.119 55.4695 161.818 56.448C166.906 59.3786 170.04 64.7947 170.04 70.656V135.344Z"></path></g></svg>';
  const RUNPOD_ARROW = iconSvg('<path d="M7 17L17 7"></path><path d="M8 7h9v9"></path>');
  const RUNPOD_HELP = iconSvg('<circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"></path><path d="M12 17h.01"></path>');
  const runpodSources = () =>
    Object.fromEntries(listRunpodProfiles().map((id) => readRunpodProfile(id)).map((source) => [source.article, source]));
  eleventyConfig.addShortcode("runpod", function () {
    const [, lang = DEFAULT_LANG, section = "", slug = ""] = (this.page.url || "").split("/");
    const source = runpodSources()[`${section}/${slug}`];
    if (!source?.template) throw new Error(`[runpod] no Runpod profile with a template for ${section}/${slug}`);
    const t = (key, vars = {}) =>
      escapeHTML(String(siteData.i18n?.runpod?.[key]?.[lang] ?? siteData.i18n?.runpod?.[key]?.en ?? "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ""));
    const url = new URL(siteData.runpod.deployUrl);
    url.searchParams.set("template", source.template);
    // A profile whose models forbid commercial use sets `referral: false`: no code, no disclosure line.
    const referral = source.referral !== false && siteData.runpod.referral;
    if (referral) url.searchParams.set("ref", referral);
    // Second line: each recommended GPU as its own rounded tag.
    const tag = (text) => `<span class="runpod-launch__tag">${escapeHTML(text)}</span>`;
    const recommended = source.gpu?.recommended ?? [];
    const specs = [
      recommended.length ? `<span class="runpod-launch__spec">${t("recLabel")} : ${recommended.map(tag).join("")}</span>` : ""
    ].filter(Boolean).join("");
    const help = t("help");
    return (
      `<div class="runpod-launch-wrap"><div class="runpod-launch">` +
      `<a class="runpod-launch__main" href="${escapeHTML(url.href)}" target="_blank" rel="noopener sponsored" data-no-link-icon>` +
      RUNPOD_LOGO +
      `<span class="runpod-launch__text"><b>${t("title")}</b>${specs ? `<span class="runpod-launch__specs">${specs}</span>` : ""}</span>${RUNPOD_ARROW}</a>` +
      `<a class="runpod-launch__help" href="/${lang}/notes/run-on-runpod/" aria-label="${help}">${RUNPOD_HELP}<span class="workflow-performance__popup runpod-launch__tip" role="tooltip">${help}</span></a>` +
      `</div>${referral ? `<p class="runpod-launch__ref">${t("referral")}</p>` : ""}</div>`
    );
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


  // Every item in a media row is drawn at the same height, so a row never has to be evened out after
  // its media arrives. The shared height is the smallest of the items' own heights (capped at
  // MEDIA_ROW_MAX_HEIGHT), which keeps every aspect ratio intact: nothing is stretched or cropped to
  // match a neighbour, the row just ends up as tall as its shortest member.
  const MEDIA_ROW_MAX_HEIGHT = 320;
  
  function rowHeightFor(images) {
    const heights = images.map((token) => {
      const media = resolveMedia(token.attrGet("src") || "", { mode: token.meta?.mediaMode, size: 1200 });
      if (media.kind === "video") return media.height > 0 ? media.height : MEDIA_ROW_MAX_HEIGHT;
      const { height } = getPreviewDimensions(media, 1200);
      return height > 0 ? height : MEDIA_ROW_MAX_HEIGHT;
    });
    return Math.min(MEDIA_ROW_MAX_HEIGHT, ...heights);
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
      tokens[i].attrSet("style", `--article-row-height:${rowHeightFor(children.filter((c) => c.type === "image"))}px`);
      tokens[i + 2].type = "media_row_close";
      tokens[i + 2].tag = "div";
    }
  });

  markdownLib.renderer.rules.media_row_open = (tokens, idx) =>
    `<div class="${tokens[idx].attrGet("class")}" style="${tokens[idx].attrGet("style")}">`;
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
  // News rows are authored with an internal section key (`<span class="news-row__tag">notes</span>`).
  // Show the reader-facing section name from the nav instead, next to the date. `faq` is the old name
  // of Notes; `none` and unknown keys show no section.
  const newsSectionLabel = (lang, key) => {
    const sectionKey = key === "faq" ? "notes" : key;
    const section = (navData[lang] || navData[DEFAULT_LANG])?.sections?.find((item) => item.key === sectionKey);
    return section ? String(section.label).replace(/^[^\p{L}\p{N}]+/u, "").trim() : "";
  };
  // Adjacent media steps (see the mediaRow shortcode) become step cards.
  eleventyConfig.addTransform("media-steps", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const section = (this.page.url || "").split("/")[2];
    return groupMediaSteps(content, { section });
  });

  // Emoji ignore the text colour; wrap them so dark mode can dim them like article images. Only
  // colour emoji: pictographs from U+1F000 up, or older symbols with the emoji selector (U+FE0F);
  // plain text symbols such as "↔" stay text.
  const EMOJI = /(?:[\u{1F000}-\u{1FFFF}]|\p{Extended_Pictographic}\uFE0F)\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*/gu;
  const renderText = markdownLib.renderer.rules.text;
  markdownLib.renderer.rules.text = (tokens, idx, options, env, self) =>
    renderText(tokens, idx, options, env, self).replace(EMOJI, (emoji) => `<span class="emoji">${emoji}</span>`);

  eleventyConfig.addTransform("news-section-labels", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html") || !content.includes("news-row__tag")) return content;
    const lang = (this.page.url || "").split("/")[1] || DEFAULT_LANG;
    return content.replace(/<span class="news-row__tag">([^<]*)<\/span>/g, (match, key) => {
      const label = newsSectionLabel(lang, key.trim());
      // Keep an empty cell when there is no section so the title stays in its column.
      const sectionKey = key.trim() === "faq" ? "notes" : key.trim();
      return label
        ? `<span class="news-row__section" data-section="${escapeHTML(sectionKey)}">${escapeHTML(label)}</span>`
        : `<span class="news-row__section" aria-hidden="true"></span>`;
    });
  });

  // GitHub-style callouts: a blockquote whose first line is `[!NOTE]`, `[!TIP]` or `[!WARNING]`
  // (IMPORTANT / CAUTION count as WARNING). A blockquote without a marker stays a plain quote.
  const CALLOUT = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\][ \t]*(?:\n|$)/i;
  markdownLib.core.ruler.after("inline", "callouts", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      if (tokens[i].type !== "blockquote_open" || tokens[i + 1].type !== "paragraph_open") continue;
      const inline = tokens[i + 2];
      const match = inline.type === "inline" && inline.content.match(CALLOUT);
      if (!match) continue;
      const kind = { NOTE: "note", TIP: "tip" }[match[1].toUpperCase()] || "warning";
      tokens[i].attrJoin("class", `callout callout--${kind}`);
      inline.content = inline.content.slice(match[0].length);
      // Drop the marker text and the line break after it from the parsed inline children.
      const children = inline.children || [];
      if (children[0]?.type === "text") children[0].content = children[0].content.replace(/^\[![A-Za-z]+\][ \t]*/, "");
      while (children.length && ((children[0].type === "text" && !children[0].content) || children[0].type === "softbreak" || children[0].type === "hardbreak")) children.shift();
      // A marker on its own line followed by a blank line leaves an empty paragraph behind.
      if (!children.length) tokens.splice(i + 1, 3);
    }
  });

  // Plain links to managed media (`[clip.mp4](/media/...)`) point at the published R2 file, like embeds do.
  markdownLib.core.ruler.after("inline", "resolve-media-links", (state) => {
    state.tokens.forEach((blockToken) => {
      (blockToken.children || []).forEach((token) => {
        if (token.type !== "link_open") return;
        const href = token.attrGet("href") || "";
        if (!href.startsWith("/media/")) return;
        const media = resolveMedia(href);
        const resolved = media.fullSrc || media.src;
        if (resolved) token.attrSet("href", resolved);
      });
    });
  });
  eleventyConfig.setLibrary("md", markdownLib);

  // Render a Markdown block inside a Nunjucks page (the language home mixes prose with generated parts).
  eleventyConfig.addPairedShortcode("markdown", function (content = "") {
    return markdownLib.render(content, { page: this.page });
  });

  // Paired shortcode: one media step (image or video with an explanation). Adjacent steps are
  // gathered into a step card by the media-steps transform.
  // Usage (in Markdown):
  // {% mediaRow img="https://... {media=image}", alt="説明" %}
  // 任意のMarkdown（箇条書きなど）
  // {% mediaFooter %}workflow ファイルなど、解説の頭に置くもの{% endmediaFooter %}
  // {% endmediaRow %}
  // `align` and `width` from the old side-by-side layout are accepted and ignored.
  eleventyConfig.addPairedShortcode("mediaFooter", function (content = "") {
    return `@@MEDIA_FOOTER_START@@${content}@@MEDIA_FOOTER_END@@`;
  });

  eleventyConfig.addPairedShortcode("mediaRow", function (content = "", opts = {}) {
    let { img = "", alt = "", gyazo = "", media = "", mode = "" } = opts;
    const safeAlt = String(alt).replace(/"/g, "&quot;");
    const footerRegex = /@@MEDIA_FOOTER_START@@([\s\S]*?)@@MEDIA_FOOTER_END@@/g;
    const footerContent = Array.from(String(content).matchAll(footerRegex), (match) => match[1]).join("\n");
    const bodyContent = String(content).replace(footerRegex, "");

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

    let mediaMarkup = "";
    if (img) {
      const resolved = resolveMedia(img, { mode: mediaMode, size: 1000 });
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
          // Step cards show the image in a column beside its text.
          attrs.push(`sizes="(min-width: 900px) 360px, 100vw"`);
        }
        if (resolved.width && resolved.height) {
          attrs.push(`width="${resolved.width}"`);
          attrs.push(`height="${resolved.height}"`);
        }
        mediaMarkup = `<img ${attrs.join(" ")}>`;
      }
    }

    return renderMediaStep({
      media: mediaMarkup,
      files: footerContent.trim() ? markdownLib.render(footerContent) : "",
      body: markdownLib.render(bodyContent)
    });
  });

  eleventyConfig.addShortcode("workflow", function (file, performance = {}) {
    const env = this || {};
    const href = typeof file === "string" ? file.trim() : "";
    if (!href) return "";
    return renderJsonLinkRow({ href, text: "" }, env, performance) || "";
  });

  eleventyConfig.addShortcode("workflowPicker", function (...rawArgs) {
    const env = this || {};
    const inputArgs = rawArgs.length === 1 && Array.isArray(rawArgs[0]) ? rawArgs[0] : rawArgs;
    const normalized = inputArgs
      .map((value) => {
        if (typeof value === "string") {
          return { file: value.trim(), performance: null };
        }
        if (value && typeof value === "object" && typeof value.file === "string") {
          return { file: value.file.trim(), performance: normalizeWorkflowPerformance(value) };
        }
        return null;
      })
      .filter(Boolean);

    if (!normalized.length) return "";

    const items = [];
    let defaultIndex = -1;

    normalized.forEach((entry) => {
      const isDefault = entry.file.startsWith("!");
      const file = isDefault ? entry.file.slice(1).trim() : entry.file;
      if (!file) return;
      const name = getWorkflowBasename(file);
      if (isDefault && defaultIndex === -1) {
        defaultIndex = items.length;
      }
      items.push({ file, name, performance: entry.performance });
    });

    if (!items.length) return "";
    if (defaultIndex < 0) defaultIndex = 0;

    env.__workflowPickerCounter = env.__workflowPickerCounter || 0;
    env.__workflowPickerCounter += 1;
    const pickerKey = hashString(items.map((item) => item.file).join("|"));
    const pickerId = `workflow-picker-${pickerKey}-${env.__workflowPickerCounter}`;
    const lang = getRenderLang(env);
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
    const performanceMarkup = renderWorkflowPickerPerformance(items, defaultIndex, pickerId, lang);

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
      ${performanceMarkup}
    </div>
  </div>
  <span class="workflow-json__message" role="status" aria-live="polite" data-workflow-picker-message></span>
</div>`;
  });

  eleventyConfig.setServerOptions({
    showAllHosts: true,
    port: 8080,
    watch: ["src/assets/**/*", "src/workflows/**/*"],
    // Dev assets live at the fixed /assets/js/dev/ path; without this the browser can keep an old module
    // next to a new one and every script on the page stops. Production paths change per deploy.
    headers: { "Cache-Control": "no-store" },
    // `/__media-originals/<logical name>` previews local originals on the dev server (see resolveManagedMedia).
    middleware: [createOriginalsMiddleware(() => MEDIA_ORIGINALS_ROOT)]
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
