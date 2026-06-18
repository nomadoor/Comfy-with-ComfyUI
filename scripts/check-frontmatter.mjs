import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const CONTENT_DIR = path.resolve("src", "content");
const LANGS = new Set(["ja", "en", "zh"]);
const SECTIONS = new Set(["begin-with", "ai-capabilities", "basic-workflows", "data-utilities", "notes"]);
const STANDALONE = new Set(["about", "news", "contact"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const failures = [];

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
