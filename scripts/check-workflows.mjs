import fs from "node:fs";
import path from "node:path";

const WORKFLOW_DIR = path.resolve("src", "workflows");

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const failures = [];
const files = walk(WORKFLOW_DIR);

for (const file of files) {
  const relative = path.relative(process.cwd(), file);
  if (relative.includes("Zone.Identifier")) {
    failures.push(`${relative}: remove Windows Zone.Identifier sidecar file`);
    continue;
  }
  if (path.extname(file) !== ".json") continue;
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
