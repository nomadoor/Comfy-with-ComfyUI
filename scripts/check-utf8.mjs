import fs from "node:fs";
import { listFiles } from "./lib/files.mjs";

const ROOTS = ["AGENTS.md", "README.md", ".eleventy.js", "eleventy", "ops", "docs", "scripts", "src", "tests", "runpod", "workers", "functions", ".github", ".claude/skills"];
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


const failures = [];
for (const file of ROOTS.flatMap((root) => listFiles(root, { extensions: [...TEXT_EXTENSIONS] }))) {
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
