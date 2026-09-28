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
const unresolved = /(?:src|href|data-full-src|data-hero|content)="\/media\//;
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
const expectedArticles = new Map();
const expectedSeo = new Map();
const dateOnly = (value) => String(value || "").match(/^\d{4}-\d{2}-\d{2}/)?.[0];
for (const file of await fg(["src/content/{ja,en,zh}/**/*.{md,njk}"])) {
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = match ? parse(match[1]) || {} : {};
  if (!data.lang || !data.slug) continue;
  const pagePath = data.section ? `/${data.lang}/${data.section}/${data.slug}/` : `/${data.lang}/${data.slug}/`;
  const date = dateOnly(data.updated || data.created);
  if (date) expectedLastmod.set(`${siteUrl}${pagePath}`, date);
  if (data.seoTitle || data.seoDescription) {
    expectedSeo.set(`${siteUrl}${pagePath}`, { seoTitle: data.seoTitle, seoDescription: data.seoDescription });
  }
  // Articles: pages in a section with a publish date, excluding utility pages (search, find) and noindex stubs.
  if (data.section && data.created && !data.searchExclude && !String(data.robots || "").includes("noindex")) {
    expectedArticles.set(`${siteUrl}${pagePath}`, {
      headline: String(data.title),
      datePublished: dateOnly(data.created),
      dateModified: dateOnly(data.updated || data.created)
    });
  }
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
    if (!fs.existsSync(htmlFile)) failures.push(`sitemap.xml: ${loc} was not built`);
    else if (isNoindex(htmlFile)) {
      failures.push(`sitemap.xml: ${loc} is noindex and must not be listed`);
    }
    const lastmod = entry.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1];
    const expected = expectedLastmod.get(loc);
    if (expected && lastmod !== expected) {
      failures.push(`sitemap.xml: ${loc} lastmod ${lastmod || "(missing)"} does not match frontmatter ${expected}`);
    }
  }
}

// Article pages must carry Article structured data with dates from frontmatter and a Person author.
if (!expectedArticles.size) failures.push("no article pages found to verify structured data");
for (const [url, expected] of expectedArticles) {
  const htmlFile = builtHtmlFor(url);
  if (!fs.existsSync(htmlFile)) {
    failures.push(`${url}: expected article page was not built`);
    continue;
  }
  const text = fs.readFileSync(htmlFile, "utf8");
  if (!text.includes(`<meta property="article:published_time" content="${expected.datePublished}"`)) {
    failures.push(`${url}: article:published_time must be ${expected.datePublished}`);
  }
  if (!text.includes(`<meta property="article:modified_time" content="${expected.dateModified}"`)) {
    failures.push(`${url}: article:modified_time must be ${expected.dateModified}`);
  }
  const ld = text.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  let graph = [];
  try {
    graph = JSON.parse(ld || "{}")["@graph"] || [];
  } catch {
    failures.push(`${url}: structured data is not valid JSON`);
    continue;
  }
  const article = graph.find((node) => node["@type"] === "Article");
  if (!article) {
    failures.push(`${url}: missing Article structured data`);
    continue;
  }
  for (const key of ["headline", "datePublished", "dateModified"]) {
    if (article[key] !== expected[key]) failures.push(`${url}: Article ${key} ${article[key]} does not match ${expected[key]}`);
  }
  if (article.mainEntityOfPage?.["@id"] !== `${url}#webpage`) failures.push(`${url}: Article mainEntityOfPage must reference the WebPage`);
  if ((article.image || []).some((image) => !/^https:\/\//.test(image))) failures.push(`${url}: Article image must be absolute`);
  const author = graph.find((node) => node["@id"] === article.author?.["@id"]);
  if (author?.["@type"] !== "Person" || !author.name || !/^https:\/\//.test(author.url || "")) {
    failures.push(`${url}: Article author must reference a Person with name and an https profile URL`);
  }
}

// Optional seoTitle / seoDescription override the search-result title and description.
const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\\/g, "&#92;"); // mirrors Nunjucks escape
for (const [url, seo] of expectedSeo) {
  const htmlFile = builtHtmlFor(url);
  if (!fs.existsSync(htmlFile)) {
    failures.push(`${url}: page with seoTitle/seoDescription was not built`);
    continue;
  }
  const text = fs.readFileSync(htmlFile, "utf8");
  if (seo.seoTitle && !text.includes(`<title>${escapeAttr(seo.seoTitle)} | `)) failures.push(`${url}: <title> must use seoTitle`);
  if (seo.seoDescription && !text.includes(`<meta name="description" content="${escapeAttr(seo.seoDescription)}"`)) {
    failures.push(`${url}: meta description must use seoDescription`);
  }
}

// Non-article pages (about, news, contact, search pages, placeholders, 404) must not claim to be articles.
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const url = `${siteUrl}/${file.replace(/index\.html$/, "")}`;
  if (expectedArticles.has(url)) continue;
  if (fs.readFileSync(path.join(outputDir, file), "utf8").includes('"@type":"Article"')) {
    failures.push(`${file}: non-article page must not emit Article structured data`);
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
  // Template syntax must never leak into the rendered head (e.g. an uncomputed frontmatter value).
  const head = text.split("</head>")[0];
  if (/\{%|\{\{|&amp;amp;/.test(head)) failures.push(`${file}: head contains raw template syntax or double-escaped text`);
  // Workflow JSON is fetched on copy; embedding it bloats pages and every router prefetch.
  if (/last_node_id|<pre[^>]*class="sr-only"/.test(text)) failures.push(`${file}: embeds workflow JSON; link it via data-json-src instead`);
  for (const [, prop, value] of text.matchAll(/<meta (?:property|name)="((?:og|twitter):image)" content="([^"]*)"/g)) {
    if (!/^https:\/\//.test(value)) failures.push(`${file}: ${prop} is not absolute: ${value}`);
    else if (!/^https:\/\/(comfyui\.nomadoor\.net|media\.comfyui\.nomadoor\.net|[a-z0-9.-]*gyazo\.com)\//.test(value)) {
      failures.push(`${file}: ${prop} must come from the site, R2, or Gyazo: ${value}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Build output checks passed (${files.length} files in ${outputDir}).`);
