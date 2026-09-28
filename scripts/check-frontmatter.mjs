import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const CONTENT_DIR = path.resolve("src", "content");
const LANGS = new Set(["ja", "en", "zh"]);
const SECTIONS = new Set(["begin-with", "ai-capabilities", "basic-workflows", "data-utilities", "notes"]);
const STANDALONE = new Set(["about", "news", "contact", "home"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const failures = [];

// Display width: CJK full-width characters count as 2, roughly matching how search results truncate.
const displayWidth = (value) =>
  [...value].reduce((width, char) => width + (/[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(char) ? 2 : 1), 0);
const SEO_LIMITS = {
  ja: { title: 64, description: 260 },
  zh: { title: 64, description: 260 },
  en: { title: 64, description: 170 }
};

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (entry.name.endsWith(".md") || entry.name.endsWith(".njk")) files.push(fullPath);
  }
  return files;
}

function readFrontmatter(file) {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return match ? parse(match[1]) || {} : {};
}

for (const file of walk(CONTENT_DIR)) {
  const relative = path.relative(process.cwd(), file);
  const parts = path.relative(CONTENT_DIR, file).split(path.sep);
  const [lang, sectionOrFile] = parts;
  const data = readFrontmatter(file);
  if (!LANGS.has(lang) && data.pagination) continue;
  if (!LANGS.has(lang)) {
    failures.push(`${relative}: content path must start with ja, en, or zh`);
    continue;
  }

  const basename = path.basename(file, path.extname(file));
  const isStandalone = parts.length === 2 && STANDALONE.has(basename);
  const sectionFromPath = isStandalone ? null : sectionOrFile;

  if (!data.title && basename !== "find") failures.push(`${relative}: missing title`);
  if (!data.slug) failures.push(`${relative}: missing slug`);
  if (data.slug && data.slug !== basename) failures.push(`${relative}: slug must match filename`);
  if (!data.navId && !isStandalone) failures.push(`${relative}: missing navId`);

  if (sectionFromPath) {
    if (!SECTIONS.has(sectionFromPath)) failures.push(`${relative}: unknown section ${sectionFromPath}`);
    if (data.section && data.section !== sectionFromPath) failures.push(`${relative}: section must match path`);
  }

  if (!data.draft) {
    if (data.created && !DATE_RE.test(String(data.created))) failures.push(`${relative}: created must be YYYY-MM-DD`);
    if (data.updated && !DATE_RE.test(String(data.updated))) failures.push(`${relative}: updated must be YYYY-MM-DD`);
  }

  for (const key of ["seoTitle", "seoDescription"]) {
    if (key in data && (typeof data[key] !== "string" || !data[key].trim())) {
      failures.push(`${relative}: ${key} must be a non-empty string when present`);
    }
  }

  // Every indexable page needs search-result copy. Noindex and draft pages are exempt.
  const indexable = !data.draft && !String(data.robots || "").includes("noindex");
  if (indexable) {
    for (const key of ["summary", "seoTitle", "seoDescription"]) {
      if (typeof data[key] !== "string" || !data[key].trim()) failures.push(`${relative}: indexable page needs ${key}`);
    }
    const limits = SEO_LIMITS[lang] || SEO_LIMITS.en;
    if (typeof data.seoTitle === "string" && displayWidth(data.seoTitle) > limits.title) {
      // The " | site name" suffix is appended after this and may be cut off in results; that is accepted.
      failures.push(`${relative}: seoTitle is wider than ${limits.title} (${displayWidth(data.seoTitle)}); the searched words themselves would be cut off`);
    }
    if (typeof data.seoDescription === "string" && displayWidth(data.seoDescription) > limits.description) {
      failures.push(`${relative}: seoDescription is wider than ${limits.description} (${displayWidth(data.seoDescription)}); search results will cut it off`);
    }
  }

  // Home picks must point at existing articles; a typo would otherwise render a card without a title.
  for (const group of data.picks?.groups || []) {
    if (!group?.label) failures.push(`${relative}: every picks group needs a label`);
  }
  for (const item of (data.picks?.groups || []).flatMap((group) => group?.items || [])) {
    const match = String(item?.page || "").match(/^\/(ja|en|zh)\/([a-z0-9-]+)\/([a-z0-9.-]+)\/$/);
    const target = match && ["md", "njk"].map((ext) => path.join(CONTENT_DIR, match[1], match[2], `${match[3]}.${ext}`)).find((file) => fs.existsSync(file));
    if (!target) failures.push(`${relative}: picks item page ${item?.page} does not resolve to an article`);
    if (!item?.text) failures.push(`${relative}: picks item ${item?.page} needs text`);
  }

  if (Array.isArray(data.tags) && data.tags.length > 5) failures.push(`${relative}: tags must be 5 or fewer`);
  if (sectionFromPath === "ai-capabilities" && Array.isArray(data.tags) && data.tags.length > 0) {
    failures.push(`${relative}: ai-capabilities pages should not use tags by default`);
  }
  if (sectionFromPath === "notes" && data.tags) failures.push(`${relative}: notes must use noteTags instead of tags`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Frontmatter checks passed.");
