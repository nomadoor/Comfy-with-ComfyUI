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
const GYAZO_REGEX = /https:\/\/i\.gyazo\.com\/([a-f0-9]+)(?:\/max_size\/\d+)?\.(jpg|png|gif)/gi;

loadLanguages(["bash", "shell", "json", "yaml", "javascript", "typescript", "css", "markup"]);

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
    if (parsed.hostname !== GYAZO_HOST) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (!parts.length) return null;
    const last = parts[parts.length - 1];
    const extMatch = last.match(/\.(jpg|png|gif)$/i);
    if (!extMatch) return null;
    const ext = extMatch[0].toLowerCase();
    let id = parts[0];
    if (id.toLowerCase().endsWith(ext)) {
      id = id.slice(0, -ext.length);
    }
    return `${parsed.origin}/${id}${ext}`;
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
    const response = await fetch(endpoint);
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
  const urls = new Set();
  for (const file of files) {
    try {
      const text = await fs.readFile(file, "utf-8");
      let match;
      while ((match = GYAZO_REGEX.exec(text)) !== null) {
        const id = match[1];
        const ext = match[2];
        const normalized = `https://${GYAZO_HOST}/${id}.${ext}`;
        urls.add(normalized);
      }
    } catch {
      // ignore unreadable files
    }
  }
  let updated = false;
  for (const url of urls) {
    if (!gyazoMeta[url] || !gyazoMeta[url].width || !gyazoMeta[url].height) {
      const meta = await fetchGyazoMeta(url);
      if (meta) {
        gyazoMeta[url] = meta;
        updated = true;
      }
    }
  }
  if (updated) {
    await saveGyazoCache();
  }
}

export default function(eleventyConfig) {
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
    return `<figure class="article-video article-video--loop" style="--article-video-height:${height}px; --article-video-width:${width}px; --article-video-aspect:${aspect};"><div class="article-video__frame"><video src="${source}" muted loop autoplay playsinline></video></div>${caption ? `<figcaption>${escapedCaption}</figcaption>` : ""}</figure>`;
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
    return `<figure class="article-video article-video--player" style="--article-video-height:${height}px; --article-video-width:${width}px; --article-video-aspect:${aspect};"><div class="article-video__frame"><video src="${source}" controls playsinline preload="metadata"></video></div>${caption ? `<figcaption>${escapedCaption}</figcaption>` : ""}</figure>`;
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

  enhanceStandaloneImages(markdownLib);
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

