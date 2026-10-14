// Shared helpers for the check scripts: walking a folder and reading a page's frontmatter.
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const SKIPPED_DIRS = new Set(["node_modules", "_site", ".git", ".cache"]);

// Every file under `target` (or `target` itself when it is a file), in directory order.
// `extensions` keeps only files with those extensions; omit it to keep every file.
export function listFiles(target, { extensions } = {}) {
  const wanted = extensions ? new Set(extensions) : null;
  const files = [];
  const visit = (current) => {
    if (!fs.existsSync(current)) return;
    if (!fs.statSync(current).isDirectory()) {
      if (!wanted || wanted.has(path.extname(current))) files.push(current);
      return;
    }
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIPPED_DIRS.has(entry.name)) continue;
      visit(path.join(current, entry.name));
    }
  };
  visit(target);
  return files;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

// The YAML frontmatter of a page as an object ({} when there is none). Accepts LF and CRLF.
export function parseFrontmatter(text) {
  const match = String(text).match(FRONTMATTER);
  return match ? parse(match[1]) || {} : {};
}

export const readFrontmatter = (file) => parseFrontmatter(fs.readFileSync(file, "utf8"));
