// Find media references (Markdown images, mediaRow, and bare `/media/...` paths) in site sources.
// Shared by check:media and media:sync.

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import fg from "fast-glob";

export const PRODUCTION_MANIFEST = "src/_data/media.json";
export const FIXTURE_MANIFEST = "tests/fixtures/media/media.json";
export const FIXTURE_PAGE = "tests/fixtures/media/media-fixtures.md";

const PRODUCTION_SOURCES = [
  "src/*.{md,njk}",
  "src/content/**/*.{md,njk}",
  "src/includes/**/*.njk",
  "src/layouts/**/*.njk",
  "src/_data/**/*.{json,yml,yaml}"
];

export const URL_CHARS = "[^\\s\"'`)<>{}]+";
const MARKDOWN_IMAGE = new RegExp(`!\\[[^\\]]*\\]\\(\\s*(${URL_CHARS})(?:\\s+"[^"]*")?\\s*\\)(?:\\{(?:media|gyazo)=([^}\\s]*)\\})?`, "g");
const MEDIA_ROW = /\{%-?\s*mediaRow\b([\s\S]*?)-?%\}/g;
// Not preceded by URL characters (external .../media/ paths) or a backtick (inline code in prose).
const MEDIA_REF = new RegExp(`(?<![\\w.:/\\x60-])/media/${URL_CHARS}`, "g");

export async function productionSourceFiles() {
  return fg(PRODUCTION_SOURCES, { ignore: [PRODUCTION_MANIFEST, "src/_data/pageViews.json"] });
}

/**
 * @param {string} text
 * @returns {{ ref: string, mode?: string }[]} `mode` is the display mode for Markdown images and
 *   mediaRow (default "image"), and undefined for other references (front matter, data files).
 */
export function extractMediaReferences(text) {
  const references = [];
  const withMode = new Set();

  for (const [, ref, mode] of text.matchAll(MARKDOWN_IMAGE)) {
    references.push({ ref, mode: mode === undefined ? "image" : mode.toLowerCase() });
    withMode.add(ref);
  }
  for (const [, args] of text.matchAll(MEDIA_ROW)) {
    const img = args.match(/\bimg\s*=\s*"([^"]*)"/)?.[1];
    if (!img) continue;
    const ref = img.replace(/\s*\{(?:media|gyazo)=[^}]*\}\s*/i, "").trim();
    const braceMode = img.match(/\{(?:media|gyazo)=([^}]*)\}/i)?.[1];
    const paramMode = args.match(/\b(?:mode|media|gyazo)\s*=\s*"([^"]*)"/)?.[1];
    references.push({ ref, mode: (paramMode || braceMode || "image").toLowerCase() });
    withMode.add(ref);
  }
  for (const ref of new Set(text.match(MEDIA_REF) || [])) {
    if (!withMode.has(ref)) references.push({ ref, mode: undefined });
  }
  return references;
}

/** Read files and return their media references with the file path attached. */
export function referencesInFiles(files) {
  return files.flatMap((file) => extractMediaReferences(fs.readFileSync(file, "utf8")).map((reference) => ({ file, ...reference })));
}

// Same set as PRODUCTION_SOURCES, as path tests for files listed from the git index.
const PRODUCTION_SOURCE_PATHS = [
  /^src\/[^/]+\.(?:md|njk)$/,
  /^src\/content\/.+\.(?:md|njk)$/,
  /^src\/includes\/.+\.njk$/,
  /^src\/layouts\/.+\.njk$/,
  /^src\/_data\/.+\.(?:json|ya?ml)$/
];

/**
 * Media references in the git index (the snapshot being committed), ignoring unstaged edits and
 * untracked files.
 */
export function stagedReferences() {
  const git = (args) => {
    const result = spawnSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
    return result.stdout;
  };
  const files = git(["ls-files", "--cached", "-z"])
    .split("\0")
    .filter((file) => file && file !== PRODUCTION_MANIFEST && file !== "src/_data/pageViews.json")
    .filter((file) => PRODUCTION_SOURCE_PATHS.some((pattern) => pattern.test(file)));
  return files.flatMap((file) => extractMediaReferences(git(["show", `:${file}`])).map((reference) => ({ file, ...reference })));
}
