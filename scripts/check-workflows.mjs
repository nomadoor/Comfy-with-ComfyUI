import fs from "node:fs";
import path from "node:path";
import { listFiles } from "./lib/files.mjs";

const WORKFLOW_DIR = path.resolve("src", "workflows");

const failures = [];
const files = listFiles(WORKFLOW_DIR);

for (const file of files) {
  const relative = path.relative(process.cwd(), file);
  if (relative.includes("Zone.Identifier")) {
    failures.push(`${relative}: remove Windows Zone.Identifier sidecar file`);
    continue;
  }
  if (path.extname(file) !== ".json") continue;
  // Lowercase snake_case only: the files travel between Windows and WSL and are referenced in URLs.
  if (!/^[a-z0-9_]+\.json$/.test(path.basename(file))) {
    failures.push(`${relative}: workflow file names must be lowercase snake_case ([a-z0-9_].json)`);
    continue;
  }
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    failures.push(`${relative}: invalid JSON (${error.message})`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Workflow checks passed (${files.filter((file) => path.extname(file) === ".json").length} JSON files).`);
