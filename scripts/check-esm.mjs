import fs from "node:fs";
import path from "node:path";

const JS_DIR = path.resolve("src", "assets", "js");
const failures = [];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (entry.name.endsWith(".js")) files.push(fullPath);
  }
  return files;
}

for (const file of walk(JS_DIR)) {
  const relative = path.relative(process.cwd(), file);
  const text = fs.readFileSync(file, "utf8");
  if (/\brequire\s*\(/.test(text)) {
    failures.push(`${relative}: CommonJS require() is not allowed in client JS`);
  }
  if (/\bmodule\.exports\b|\bexports\./.test(text)) {
    failures.push(`${relative}: CommonJS exports are not allowed in client JS`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("ESM checks passed.");
