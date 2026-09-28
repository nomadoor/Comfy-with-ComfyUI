import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import { parse } from "yaml";

// Verifies a production build (default: _site) contains no test fixtures and no unresolved
// `/media/` references. Run after a clean `npm run build` (Eleventy keeps stale files in the output
// directory), not after test builds.

const outputDir = process.argv[2] || "_site";
const failures = [];

if (!fs.existsSync(outputDir)) {
  console.error(`${outputDir} does not exist; run npm run build first`);
  process.exit(1);
}
if (fs.existsSync(path.join(outputDir, "internal", "media-fixtures"))) {
  failures.push(`${outputDir}/internal/media-fixtures/ must not exist in production builds`);
}

const files = await fg(["**/*.{html,xml,txt,json}"], { cwd: outputDir });
const unresolved = /(?:src|data-full-src|data-hero|content)="\/media\//;
for (const file of files) {
  const text = fs.readFileSync(path.join(outputDir, file), "utf8");
  if (text.includes("/media/fixtures/") || text.includes("media-fixtures")) failures.push(`${file}: references test fixtures`);
  if (unresolved.test(text)) failures.push(`${file}: contains an unresolved /media/ reference`);
}

const siteUrl = JSON.parse(fs.readFileSync("src/_data/site.json", "utf8")).url;
const isAbsoluteSiteUrl = (value) => value.startsWith(`${siteUrl}/`);

const builtHtmlFor = (url) => path.join(outputDir, url.slice(siteUrl.length), "index.html");
const isNoindex = (htmlFile) => /<meta name="robots" content="[^"]*noindex/.test(fs.readFileSync(htmlFile, "utf8"));

// Every sitemap URL must be absolute, and lastmod must come from frontmatter `updated`
// (falling back to `created`), never from the build date. Permalinks are built from `slug`
// (not `navId`, which may differ), so expected dates are keyed the same way.
const expectedLastmod = new Map();
for (const file of await fg(["src/content/{ja,en,zh}/**/*.{md,njk}"])) {
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = match ? parse(match[1]) || {} : {};
  if (!data.lang || !data.slug) continue;
  const pagePath = data.section ? `/${data.lang}/${data.section}/${data.slug}/` : `/${data.lang}/${data.slug}/`;
  const date = String(data.updated || data.created || "").match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (date) expectedLastmod.set(`${siteUrl}${pagePath}`, date);
}

const sitemapPath = path.join(outputDir, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  failures.push("sitemap.xml is missing");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  if (!urls.length) failures.push("sitemap.xml has no <url> entries");
  for (const entry of urls) {
    const loc = entry.match(/<loc>([^<]*)<\/loc>/)?.[1] || "";
    if (!isAbsoluteSiteUrl(loc)) failures.push(`sitemap.xml: <loc> is not an absolute site URL: ${loc}`);
    for (const [, href] of entry.matchAll(/href="([^"]*)"/g)) {
      if (!isAbsoluteSiteUrl(href)) failures.push(`sitemap.xml: alternate href is not absolute: ${href}`);
      else if (!fs.existsSync(builtHtmlFor(href))) failures.push(`sitemap.xml: ${loc} alternate points to a missing page: ${href}`);
    }
    const htmlFile = builtHtmlFor(loc);
    if (fs.existsSync(htmlFile) && isNoindex(htmlFile)) {
      failures.push(`sitemap.xml: ${loc} is noindex and must not be listed`);
    }
    const lastmod = entry.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1];
    const expected = expectedLastmod.get(loc);
    if (expected && lastmod !== expected) {
      failures.push(`sitemap.xml: ${loc} lastmod ${lastmod || "(missing)"} does not match frontmatter ${expected}`);
    }
  }
}

// Social preview images must be absolute URLs, workflow JSON must not be inlined, and hreflang alternates must resolve to built pages.
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const text = fs.readFileSync(path.join(outputDir, file), "utf8");
  for (const [, href] of text.matchAll(/<link rel="alternate" hreflang="[^"]*" href="([^"]*)"/g)) {
    if (!isAbsoluteSiteUrl(href)) continue;
    const target = builtHtmlFor(href);
    if (!fs.existsSync(target)) failures.push(`${file}: hreflang alternate points to a missing page: ${href}`);
    else if (isNoindex(target)) failures.push(`${file}: hreflang alternate points to a noindex page: ${href}`);
  }
  // Workflow JSON is fetched on copy; embedding it bloats pages and every router prefetch.
  if (/last_node_id|<pre[^>]*class="sr-only"/.test(text)) failures.push(`${file}: embeds workflow JSON; link it via data-json-src instead`);
  for (const [, prop, value] of text.matchAll(/<meta (?:property|name)="((?:og|twitter):image)" content="([^"]*)"/g)) {
    if (!/^https:\/\//.test(value)) failures.push(`${file}: ${prop} is not absolute: ${value}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Build output checks passed (${files.length} files in ${outputDir}).`);
