import fs from "node:fs";
import path from "node:path";
import nav from "./nav.js";

const CONTENT_DIR = path.resolve("src", "content");

function flatten() {
  const entries = [];
  for (const [lang, data] of Object.entries(nav)) {
    (data.sections || []).forEach((section) => {
      collect(entries, lang, section.key, section.pages || []);
    });
  }
  return entries;
}

function collect(acc, lang, sectionKey, pages) {
  pages.forEach((page) => {
    if (!page || !page.id) return;
    acc.push({ lang, section: sectionKey, id: page.id, title: page.title });
    if (page.children) {
      collect(acc, lang, sectionKey, page.children);
    }
  });
}

function exists({ lang, section, id }) {
  const filePath = path.join(CONTENT_DIR, lang, section, `${id}.md`);
  return fs.existsSync(filePath);
}

export default function () {
  // Recompute on every Eleventy run so newly created pages stop being treated as "missing"
  return flatten().filter((entry) => !exists(entry));
}
