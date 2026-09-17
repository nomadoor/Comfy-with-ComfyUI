import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";

// Verifies a production build (default: _site) contains no test fixtures and no unresolved
// `/media/` references. Run after a clean `npm run build` (Eleventy keeps stale files in the output
// directory), not after test builds.

const outputDir = process.argv[2] || "_site";
const failures = [];

if (!fs.existsSync(outputDir)) {
  console.error(`${outputDir} does not exist; run npm run build first`);
  process.exit(1);
}
if (fs.existsSync(path.join(outputDir, "internal", "media-fixtures"))) {
  failures.push(`${outputDir}/internal/media-fixtures/ must not exist in production builds`);
}

const files = await fg(["**/*.{html,xml,txt,json}"], { cwd: outputDir });
const unresolved = /(?:src|data-full-src|data-hero|content)="\/media\//;
for (const file of files) {
  const text = fs.readFileSync(path.join(outputDir, file), "utf8");
  if (text.includes("/media/fixtures/") || text.includes("media-fixtures")) failures.push(`${file}: references test fixtures`);
  if (unresolved.test(text)) failures.push(`${file}: contains an unresolved /media/ reference`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Build output checks passed (${files.length} files in ${outputDir}).`);
