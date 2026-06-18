import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.resolve("src", "content");
const PUBLIC_ROOTS = ["assets", "workflows", "search", ".well-known"];
const failures = [];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (entry.name.endsWith(".md") || entry.name.endsWith(".njk")) files.push(fullPath);
  }
  return files;
}

function stripFragmentAndQuery(url) {
  return url.split("#")[0].split("?")[0];
}

function existsPublicPath(urlPath) {
  const normalized = stripFragmentAndQuery(urlPath);
  if (!normalized || normalized === "/") return true;
  const parts = normalized.replace(/^\/+/, "").split("/");
  if (PUBLIC_ROOTS.includes(parts[0])) {
    return fs.existsSync(path.join("src", ...parts));
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

for (const file of walk(CONTENT_DIR)) {
  const relative = path.relative(process.cwd(), file);
  const text = fs.readFileSync(file, "utf8");
  for (const rawUrl of extractMarkdownLinks(text)) {
    if (!rawUrl.startsWith("/") || rawUrl.startsWith("//")) continue;
    if (!existsPublicPath(rawUrl)) failures.push(`${relative}: missing internal link ${rawUrl}`);
  }
}

if (failures.length) {
  const message = failures.join("\n");
  if (process.env.STRICT_LINKS === "1") {
    console.error(message);
    process.exit(1);
  }
  console.warn(`Markdown link checks found ${failures.length} advisory issue(s). Set STRICT_LINKS=1 to fail and print details.`);
} else {
  console.log("Markdown link checks passed.");
}
