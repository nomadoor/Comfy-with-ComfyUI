import fs from "node:fs";
import path from "node:path";

const ICON_DIR = path.resolve("src", "assets", "icons");
const failures = [];

if (fs.existsSync(ICON_DIR)) {
  for (const entry of fs.readdirSync(ICON_DIR)) {
    if (!entry.endsWith(".svg")) continue;
    const file = path.join(ICON_DIR, entry);
    const relative = path.relative(process.cwd(), file);
    const text = fs.readFileSync(file, "utf8");
    if (!/\bviewBox=/.test(text)) {
      failures.push(`${relative}: missing viewBox`);
    }
    const hasCurrentColor = /currentColor/.test(text);
    const hasFixedPaint = /\b(fill|stroke)=["'](?!none|currentColor)[^"']+["']/.test(text);
    if (!hasCurrentColor && hasFixedPaint) {
      failures.push(`${relative}: fixed fill/stroke should inherit currentColor`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Icon checks passed.");
