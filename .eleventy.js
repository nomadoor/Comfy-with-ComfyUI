import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import fg from "fast-glob";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";

const GYAZO_HOST = "i.gyazo.com";
const CACHE_DIR = ".cache";
const GYAZO_CACHE_PATH = path.join(CACHE_DIR, "gyazo-images.json");
const GYAZO_URL_REGEX = /https:\/\/(?:[a-z]+\.)?gyazo\.com\/[^\s"'`)]+/gi;
const GYAZO_FETCH_TIMEOUT_MS = 5000;
const GYAZO_FETCH_DELAY_MS = 200;
const sleep = (ms = 0) => (ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve());
const UNORDERED_MARKS = new Set(['*', '-', '+']);
const ARTICLE_LIST_ICON_SVG = '<svg class="article-body__list-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="currentColor" stroke-width="var(--article-list-icon-stroke, 2.2)" stroke-linecap="round"/></svg>';
const SITE_DATA_PATH = path.join("src", "_data", "site.json");
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
const WORKFLOW_ROOT = path.join(process.cwd(), "src", "workflows");
const WORKFLOW_LABELS = {
  copyLabel: "Copy",
  downloadLabel: "Download",
  copiedLabel: "Copied",
  downloadedLabel: "Downloaded"
};

loadLanguages(["bash", "shell", "json", "yaml", "javascript", "typescript", "css", "markup", "powershell", "python"]);

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
    return { width: targetSize, height: targetSize };
  }
  const { width, height } = meta;
  const longest = Math.max(width, height);
  const scale = longest > targetSize ? targetSize / longest : 1;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale)
  };
}

function createImageVariants(url = "", size = 1000) {
  const fallback = { preview: url, full: url };
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
    const meta = gyazoMeta[normalized];
    const previewDims = getPreviewDimensions(meta, size);
    return {
      preview,
      full: normalized,
      width: previewDims.width,
      height: previewDims.height,
      originalWidth: meta?.width,
      originalHeight: meta?.height
    };
  } catch {
    return fallback;
  }
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

function getWorkflowLabel(key) {
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
  const copyTargetId = `workflow-json-inline-${env.__jsonLinkCounter}`;
  const fileName = path.basename(linkInfo.href.split("?")[0]);
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
      <a class="workflow-json__icon" href="${linkInfo.href}" download aria-label="${escapeHTML(downloadLabel)} ${escapedFile}" data-download-json="${copyTargetId}-download" data-label="${escapeHTML(downloadLabel)}" data-success-label="${escapeHTML(downloadedLabel)}">
        ${downloadIcon}
      </a>
    </div>
  </div>
  <pre id="${copyTargetId}" class="sr-only" hidden aria-hidden="true">${escapeHTML(raw)}</pre>
</div>`;
}

function getGyazoDimensionsFromId(id) {
  if (!id) return null;
  const normalized = normalizeGyazoUrl(`https://${GYAZO_HOST}/${id}.jpg`);
  const meta = normalized ? gyazoMeta[normalized] : null;
  if (meta && meta.width && meta.height) {
    return { width: meta.width, height: meta.height };
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

function escapeHTML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  if (updated) {
    await saveGyazoCache();
  }
}

export default function (eleventyConfig) {
  // Passthrough static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/workflows": "workflows" });
  eleventyConfig.addPassthroughCopy({ "src/search": "search" });

  eleventyConfig.addWatchTarget("ops");

  eleventyConfig.on("beforeBuild", async () => {
    await refreshGyazoMetadata();
  });

  eleventyConfig.addFilter("relatedWorkflows", function (collection = [], currentUrl, currentTags = [], currentLang) {
    if (!Array.isArray(collection) || !currentTags || !currentTags.length) {
      return [];
    }
    return collection
      .filter((entry) => {
        if (!entry || !entry.data) return false;
        if (entry.url === currentUrl) return false;
        if (entry.data.section !== "basic-workflows") return false;
        if (currentLang && entry.data.lang && entry.data.lang !== currentLang) return false;
        return true;
      })
      .filter((entry) => {
        const entryTags = entry.data.tags || [];
        return currentTags.some((tag) => entryTags.includes(tag));
      })
      .map((entry) => ({
        url: entry.url,
        title: entry.data.title,
        summary: entry.data.summary || ""
      }));
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

  eleventyConfig.addFilter("imageVariant", function (url, size = 1000) {
    return createImageVariants(url, size);
  });

  eleventyConfig.addShortcode("gyazoVideoLoop", function (url, caption = "", options = {}) {
    const id = extractGyazoId(url);
    const dims = getGyazoDimensionsFromId(id);
    const baseWidth = dims?.width || options.width || 720;
    const baseHeight = dims?.height || options.height || 360;
    const maxHeight = Math.min(options.height || baseHeight, 360);
    const scale = baseHeight > maxHeight ? maxHeight / baseHeight : 1;
    const width = Math.round(baseWidth * scale);
    const height = Math.round(baseHeight * scale);
    const aspect = dims ? `${dims.width} / ${dims.height}` : options.aspect || "16 / 9";
    const source = typeof url === "string" && url.endsWith(".mp4")
      ? url
      : id
        ? `https://i.gyazo.com/${id}.mp4`
        : url;
    const escapedCaption = escapeHTML(caption);
    return `<figure class="article-video article-video--loop article-video--gyazo" data-gyazo-toggle data-gyazo-initial="loop" style="--article-video-height:${height}px; --article-video-width:${width}px; --article-video-aspect:${aspect};"><div class="article-video__frame"><video src="${source}" muted loop autoplay playsinline></video><button type="button" class="gyazo-toggle" aria-label="Toggle Gyazo playback mode" data-loop-label="Loop" data-player-label="Player"><span class="gyazo-toggle__pill"><span class="gyazo-toggle__knob"></span><span class="gyazo-toggle__text"></span></span></button></div>${caption ? `<figcaption>${escapedCaption}</figcaption>` : ""}</figure>`;
  });

  eleventyConfig.addShortcode("gyazoVideoPlayer", function (url, caption = "", options = {}) {
    const id = extractGyazoId(url);
    const dims = getGyazoDimensionsFromId(id);
    const baseWidth = dims?.width || options.width || 720;
    const baseHeight = dims?.height || options.height || 360;
    const maxHeight = Math.min(options.height || baseHeight, 360);
    const scale = baseHeight > maxHeight ? maxHeight / baseHeight : 1;
    const width = Math.round(baseWidth * scale);
    const height = Math.round(baseHeight * scale);
    const aspect = dims ? `${dims.width} / ${dims.height}` : options.aspect || "16 / 9";
    const source = typeof url === "string" && url.endsWith(".mp4")
      ? url
      : id
        ? `https://i.gyazo.com/${id}.mp4`
        : url;
    const escapedCaption = escapeHTML(caption);
    return `<figure class="article-video article-video--player article-video--gyazo" data-gyazo-toggle data-gyazo-initial="player" style="--article-video-height:${height}px; --article-video-width:${width}px; --article-video-aspect:${aspect};"><div class="article-video__frame"><video src="${source}" controls playsinline preload="metadata"></video><button type="button" class="gyazo-toggle" aria-label="Toggle Gyazo playback mode" data-loop-label="Loop" data-player-label="Player"><span class="gyazo-toggle__pill"><span class="gyazo-toggle__knob"></span><span class="gyazo-toggle__text"></span></span></button></div>${caption ? `<figcaption>${escapedCaption}</figcaption>` : ""}</figure>`;
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

  // --- Gyazo Markdown helper -------------------------------------------------
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

  function renderGyazoMedia(token) {
    const url = token.attrGet("src") || "";
    const mode = (token.attrGet("gyazo") || "image").toLowerCase();
    const alt = escapeHTML(token.content || token.attrGet("alt") || "");

    const id = extractGyazoId(url);
    const dims = getGyazoDimensionsFromId(id);
    const baseWidth = dims?.width || 720;
    const baseHeight = dims?.height || 360;
    const aspect = dims ? `${dims.width} / ${dims.height}` : "16 / 9";
    const height = Math.min(baseHeight, 360);
    const scale = baseHeight ? height / baseHeight : 1;
    const width = Math.round(baseWidth * scale);
    const source = typeof url === "string" && url.endsWith(".mp4")
      ? url
      : id
        ? `https://i.gyazo.com/${id}.mp4`
        : url;

    const commonFig = `<figure class="article-media" style="--article-media-width:${width}px; --article-media-height:${height}px; --article-media-aspect:${aspect};"><div class="article-media__frame">`;
    const closing = `${alt ? `<figcaption>${alt}</figcaption>` : ""}</figure>`;

    if (mode === "loop") {
      return `${commonFig}<video src="${source}" muted loop autoplay playsinline></video></div>${closing}`;
    }
    if (mode === "player") {
      return `${commonFig}<video src="${source}" controls playsinline preload="metadata"></video></div>${closing}`;
    }
    return `${commonFig}<img src="${url}" alt="${alt}" loading="lazy" decoding="async" /></div>${closing}`;
  }

  // Detect `{gyazo=...}` right after an image and mark the token.
  markdownLib.core.ruler.after("inline", "gyazo_attrs", function (state) {
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
            if (attrs && attrs.gyazo) {
              img.attrSet("gyazo", attrs.gyazo);
              img.meta = img.meta || {};
              img.meta.isGyazo = true;
              // remove the brace text token
              children.splice(j + 1, 1);
            }
          }
        }
      }
    }
  });

  // Rewrap paragraphs that contain only gyazo media into a media row.
  markdownLib.core.ruler.after("gyazo_attrs", "gyazo_row", function (state) {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      if (tokens[i].type !== "paragraph_open") continue;
      const inline = tokens[i + 1];
      const close = tokens[i + 2];
      if (!inline || inline.type !== "inline" || close.type !== "paragraph_close") continue;
      const children = inline.children || [];
      if (!children.length) continue;
      const onlyGyazo = children.every((c) => (c.type === "image" && c.meta?.isGyazo) || (c.type === "text" && !c.content.trim()));
      if (!onlyGyazo) continue;
      tokens[i].type = "gyazo_row_open";
      tokens[i].tag = "div";
      tokens[i].attrSet("class", "article-media-row");
      tokens[i + 2].type = "gyazo_row_close";
      tokens[i + 2].tag = "div";
    }
  });

  markdownLib.renderer.rules.gyazo_row_open = (tokens, idx) => `<div class="${tokens[idx].attrGet("class")}">`;
  markdownLib.renderer.rules.gyazo_row_close = () => `</div>`;

  const defaultImageRenderer = markdownLib.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLib.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    if (token.meta?.isGyazo || token.attrGet("gyazo")) {
      return renderGyazoMedia(token);
    }
    return defaultImageRenderer(tokens, idx, options, env, self);
  };

  const defaultImageRenderer = markdownLib.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLib.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const src = token.attrGet("src");
    if (src) {
      const variants = createImageVariants(src, 1000);
      token.attrSet("src", variants.preview);
      if (!token.attrGet("loading")) {
        token.attrSet("loading", "lazy");
      }
      if (!token.attrGet("decoding")) {
        token.attrSet("decoding", "async");
      }
      if (variants.full && variants.full !== variants.preview) {
        token.attrSet("data-full-src", variants.full);
        token.attrSet("srcset", `${variants.preview} 1000w, ${variants.full} 2000w`);
        if (!token.attrGet("sizes")) {
          token.attrSet("sizes", "(min-width: 768px) 720px, 100vw");
        }
      }
      const width = variants.originalWidth || variants.width;
      const height = variants.originalHeight || variants.height;
      if (width && height) {
        token.attrSet("width", String(width));
        token.attrSet("height", String(height));
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
      const limitedHeight = Math.min(heightAttr, 300);
      styleChunks.push(`--article-media-aspect:${widthAttr} / ${heightAttr}`);
      styleChunks.push(`--article-media-height:${limitedHeight}px`);
      const constrainedWidth = Math.min(widthAttr, Math.round(ratioValue * limitedHeight));
      styleChunks.push(`--article-media-width:${constrainedWidth}px`);
    } else {
      styleChunks.push(`--article-media-height:300px`);
    }

    const styleAttr = styleChunks.length ? ` style="${styleChunks.join("; ")}"` : "";
    return `<figure class="article-media"${styleAttr}><div class="article-media__frame">${renderedImage}</div></figure>`;
  };


  const defaultListItemOpen = markdownLib.renderer.rules.list_item_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLib.renderer.rules.list_item_open = function (tokens, idx, options, env, self) {
    const rendered = defaultListItemOpen(tokens, idx, options, env, self);
    const token = tokens[idx];
    const markup = token.markup ? token.markup.trim() : "";
    if (!UNORDERED_MARKS.has(markup)) {
      return rendered;
    }
    return rendered + '<span class="article-body__list-icon" aria-hidden="true">' + ARTICLE_LIST_ICON_SVG + '</span>';
  };

  enhanceStandaloneImages(markdownLib);
  enhanceJsonLinks(markdownLib);
  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.setServerOptions({
    showAllHosts: true,
    port: 8080,
    watch: ["src/assets/**/*", "src/workflows/**/*"],
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



