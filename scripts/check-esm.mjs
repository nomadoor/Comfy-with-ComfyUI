import fs from "node:fs";
import path from "node:path";
import { listFiles } from "./lib/files.mjs";

const JS_DIR = path.resolve("src", "assets", "js");
const failures = [];

for (const file of listFiles(JS_DIR, { extensions: [".js"] })) {
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
