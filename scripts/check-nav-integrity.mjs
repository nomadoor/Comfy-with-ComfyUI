import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const DATA_DIR = path.resolve("src", "_data");
const CONTENT_DIR = path.resolve("src", "content");
const LANGS = ["ja", "en", "zh"];
const failures = [];

function loadYaml(file) {
  return parse(fs.readFileSync(file, "utf8"));
}

function collectNav(acc, lang, section, pages = []) {
  for (const page of pages) {
    if (!page?.id) continue;
    acc.push({ lang, section, id: page.id, noLink: Boolean(page.noLink) });
    collectNav(acc, lang, section, page.children || []);
  }
}

function readFrontmatter(file) {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return match ? parse(match[1]) || {} : {};
}

function pageExists(lang, section, id) {
  const dir = path.join(CONTENT_DIR, lang, section);
  return fs.existsSync(path.join(dir, `${id}.md`)) || fs.existsSync(path.join(dir, `${id}.njk`));
}

const navEntries = [];
for (const lang of LANGS) {
  const nav = loadYaml(path.join(DATA_DIR, `nav.${lang}.yml`));
  for (const section of nav.sections || []) {
    collectNav(navEntries, lang, section.key, section.pages || []);
  }
}

const navKeys = new Set();
for (const entry of navEntries) {
  const key = `${entry.lang}/${entry.section}/${entry.id}`;
  if (navKeys.has(key)) failures.push(`nav duplicate: ${key}`);
  navKeys.add(key);
  if (!entry.noLink && !pageExists(entry.lang, entry.section, entry.id)) {
    failures.push(`nav missing page: ${key}`);
  }
}

const slugKeys = new Set();
for (const lang of LANGS) {
  const langDir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(langDir)) continue;
  for (const section of fs.readdirSync(langDir)) {
    const sectionDir = path.join(langDir, section);
    if (!fs.statSync(sectionDir).isDirectory()) continue;
    for (const file of fs.readdirSync(sectionDir)) {
      if (!file.endsWith(".md") && !file.endsWith(".njk")) continue;
      const fullPath = path.join(sectionDir, file);
      const data = readFrontmatter(fullPath);
      if (!data.slug) continue;
      const key = `${lang}/${section}/${data.slug}`;
      if (slugKeys.has(key)) failures.push(`content duplicate slug: ${key}`);
      slugKeys.add(key);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Nav integrity checks passed.");
