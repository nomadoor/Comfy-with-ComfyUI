import fs from "node:fs";
import path from "node:path";

const ROOTS = ["AGENTS.md", "ops", "scripts", "src", ".claude/skills"];
const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".njk",
  ".svg",
  ".ts",
  ".txt",
  ".yml"
]);

function walk(target, files = []) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) {
      if (entry === "node_modules" || entry === "_site" || entry === ".git") continue;
      walk(path.join(target, entry), files);
    }
  } else if (TEXT_EXTENSIONS.has(path.extname(target)) || path.basename(target) === "AGENTS.md") {
    files.push(target);
  }
  return files;
}

const failures = [];
for (const file of ROOTS.flatMap((root) => walk(root))) {
  const buffer = fs.readFileSync(file);
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    failures.push(`${file}: UTF-8 BOM is not allowed`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("UTF-8 checks passed.");
