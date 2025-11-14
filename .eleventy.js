import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import fg from "fast-glob";

const GYAZO_HOST = "i.gyazo.com";
const CACHE_DIR = ".cache";
const GYAZO_CACHE_PATH = path.join(CACHE_DIR, "gyazo-images.json");
const GYAZO_REGEX = /https:\/\/i\.gyazo\.com\/([a-f0-9]+)(?:\/max_size\/\d+)?\.(jpg|png|gif)/gi;

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

  const markdownLib = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false
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
    return defaultImageRenderer(tokens, idx, options, env, self);
  };

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
