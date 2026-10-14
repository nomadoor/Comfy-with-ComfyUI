// Build lifecycle: which pages exist, their dates, test fixtures, and files written after the build.
import fsSync from "node:fs";
import path from "node:path";
import { writeProfiles as writeRunpodProfiles } from "../runpod/tools/profiles.mjs";
import { writeWorkflowCatalog } from "../scripts/lib/workflow-catalog.mjs";
import { loadMediaManifest, MEDIA_FIXTURE_MANIFEST_PATH, MEDIA_FIXTURE_PAGE_PATH, MEDIA_FIXTURES_ENABLED } from "./media.mjs";
import { siteData } from "./site.mjs";

const WORKFLOW_PERFORMANCE_FIXTURE_PAGE_PATH = path.join("tests", "fixtures", "workflow-performance.md");

const FALLBACK_PAGE_DATE = new Date("2025-01-01T00:00:00Z");
const CREATED_LINE = /^created:\s*["']?(\d{4}-\d{2}-\d{2})/m;

function createdDateFor(inputPath = "") {
  let text = "";
  try {
    text = fsSync.readFileSync(inputPath, "utf8");
  } catch {
    return FALLBACK_PAGE_DATE;
  }
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || "";
  const created = frontmatter.match(CREATED_LINE)?.[1];
  return created ? new Date(`${created}T00:00:00Z`) : FALLBACK_PAGE_DATE;
}

export function registerBuild(eleventyConfig) {
  // Drafts are unpublished (ops/requirements.md): skip them entirely instead of building hidden pages.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => (data.draft ? false : undefined));
  // A page's date (it orders collections.all, and so the sitemap, search index and related
  // cards) defaults to the file's creation time, which differs between checkouts. Use the
  // frontmatter `created` instead; pages without one share a fixed date and Eleventy then
  // orders them by input path.
  eleventyConfig.addDateParsing(function (dateValue) {
    if (dateValue !== undefined) return undefined;
    return createdDateFor(this.page?.inputPath);
  });

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
  // `directories.output` follows `--output` (the Playwright server builds into .cache/playwright-site);
  // `dir.output` is the config's default and would write next to someone else's build.
  eleventyConfig.on("eleventy.after", ({ directories, dir }) => {
    writeRunpodProfiles({ outDir: directories?.output ?? dir.output, siteURL: siteData.url });
  });

  // The workflow catalog (/workflows/index.json, see scripts/lib/workflow-catalog.mjs) lists every
  // workflow the published articles link, for agents looking for a workflow rather than an article.
  eleventyConfig.on("eleventy.after", ({ directories, dir, results }) => {
    writeWorkflowCatalog({ outDir: directories?.output ?? dir.output, siteURL: siteData.url, pages: results ?? [] });
  });
}
