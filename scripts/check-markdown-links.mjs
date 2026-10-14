import fs from "node:fs";
import path from "node:path";
import { listFiles } from "./lib/files.mjs";

const CONTENT_DIR = path.resolve("src", "content");
const PUBLIC_ROOTS = ["assets", "workflows", "search", ".well-known"];
const failures = [];

function stripFragmentAndQuery(url) {
  return url.split("#")[0].split("?")[0];
}

function existsPublicPath(urlPath) {
  const normalized = stripFragmentAndQuery(urlPath);
  if (!normalized || normalized === "/") return true;
  if (/\/\//.test(normalized)) return false;
  const parts = normalized.replace(/^\/+/, "").split("/").filter(Boolean);
  if (PUBLIC_ROOTS.includes(parts[0])) {
    return fs.existsSync(path.join("src", ...parts));
  }
  if (parts.length === 1 && ["ja", "en", "zh"].includes(parts[0])) {
    return fs.existsSync(path.join("src", "content", parts[0], "home.njk"));
  }
  if (parts.length === 2 && ["ja", "en", "zh"].includes(parts[0])) {
    return fs.existsSync(path.join("src", "content", parts[0], `${parts[1]}.md`)) ||
      fs.existsSync(path.join("src", "content", parts[0], `${parts[1]}.njk`));
  }
  if (parts.length >= 3 && ["ja", "en", "zh"].includes(parts[0])) {
    const [lang, section, slug] = parts;
    return fs.existsSync(path.join("src", "content", lang, section, `${slug}.md`)) ||
      fs.existsSync(path.join("src", "content", lang, section, `${slug}.njk`));
  }
  return true;
}

function extractMarkdownLinks(text) {
  const links = [];
  const markdownLink = /!?\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const href = /\bhref=["']([^"']+)["']/g;
  for (const regex of [markdownLink, href]) {
    let match;
    while ((match = regex.exec(text))) links.push(match[1]);
  }
  return links;
}

for (const file of listFiles(CONTENT_DIR, { extensions: [".md", ".njk"] })) {
  const relative = path.relative(process.cwd(), file);
  const text = fs.readFileSync(file, "utf8");
  for (const rawUrl of extractMarkdownLinks(text)) {
    if (!rawUrl.startsWith("/") || rawUrl.startsWith("//")) continue;
    // `/media/` is a reserved virtual namespace for R2 media, validated by check-media.mjs.
    if (rawUrl.startsWith("/media/")) continue;
    if (!existsPublicPath(rawUrl)) failures.push(`${relative}: missing internal link ${rawUrl}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
} else {
  console.log("Markdown link checks passed.");
}
