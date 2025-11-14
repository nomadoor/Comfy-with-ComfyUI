import MarkdownIt from "markdown-it";

const GYAZO_HOST = "i.gyazo.com";

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
    if (parsed.pathname.includes("/max_size/")) {
      return fallback;
    }
    const match = parsed.pathname.match(/^\/([a-z0-9]+)(\.[a-z0-9]+)$/i);
    if (!match) {
      return fallback;
    }
    const [, id, ext] = match;
    const preview = `${parsed.origin}/${id}/max_size/${size}${ext}`;
    return { preview, full: url };
  } catch {
    return fallback;
  }
}

export default function(eleventyConfig) {
  // Passthrough static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/workflows": "workflows" });
  eleventyConfig.addPassthroughCopy({ "src/search": "search" });

  eleventyConfig.addWatchTarget("ops");

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
