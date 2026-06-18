import fs from "node:fs";
import path from "node:path";

const ICON_DIR = path.resolve("src", "assets", "icons");
const failures = [];
const warnings = [];

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
      warnings.push(`${relative}: fixed fill/stroke should inherit currentColor`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

if (warnings.length) {
  const message = warnings.join("\n");
  if (process.env.STRICT_ICONS === "1") {
    console.error(message);
    process.exit(1);
  }
  console.warn(`Icon currentColor checks found ${warnings.length} advisory issue(s). Set STRICT_ICONS=1 to fail and print details.`);
}

console.log("Icon checks passed.");
