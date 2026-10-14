// Eleventy configuration. The pieces live in eleventy/: build lifecycle, filters, the Markdown
// library and its rules, shortcodes, workflow rows, media, and output transforms.
import { createOriginalsMiddleware } from "./scripts/lib/media-local-preview.mjs";
import envData from "./src/_data/env.js";
import { registerBuild } from "./eleventy/build.mjs";
import { registerFilters } from "./eleventy/filters.mjs";
import { createMarkdown } from "./eleventy/markdown.mjs";
import { MEDIA_ORIGINALS_ROOT } from "./eleventy/media.mjs";
import { registerShortcodes } from "./eleventy/shortcodes.mjs";
import { registerTransforms } from "./eleventy/transforms.mjs";
import { registerWorkflowShortcodes } from "./eleventy/workflow-json.mjs";

export default function (eleventyConfig) {
  // Passthrough static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": `assets/js/${envData.assetVersion}` });
  eleventyConfig.addPassthroughCopy({ "src/workflows": "workflows" });
  // Asset notes are for maintainers, not pages.
  eleventyConfig.ignores.add("src/assets/fonts/README.md");
  eleventyConfig.addPassthroughCopy({ "src/.well-known": ".well-known" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  eleventyConfig.addWatchTarget("ops");

  registerBuild(eleventyConfig);
  registerFilters(eleventyConfig);

  const markdownLib = createMarkdown();
  eleventyConfig.setLibrary("md", markdownLib);
  registerShortcodes(eleventyConfig, markdownLib);
  registerWorkflowShortcodes(eleventyConfig);
  registerTransforms(eleventyConfig);

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
