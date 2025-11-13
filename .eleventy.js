import path from "node:path";

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
