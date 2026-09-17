import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import {
  FIXTURE_NAME_PREFIX,
  STORED_TYPE_BY_EXTENSION,
  extensionOf,
  logicalNameFromRef,
  validateKey,
  validateLogicalName
} from "./lib/media-names.mjs";

// Validates media manifests and media references.
// - Production: src/_data/media.json against site sources. R2 media must be referenced as
//   `/media/<logical name>`; physical R2 URLs are errors. Unused logical names are advisory.
// - Fixtures: tests/fixtures/media/media.json against the fixture page (test builds only).
// Gyazo and other external URLs are valid sources; only their display mode syntax is checked.

const MODES = new Set(["image", "loop", "player"]);
const { media: config = {} } = JSON.parse(fs.readFileSync(path.resolve("src", "_data", "site.json"), "utf8"));
const host = config.host || "";
const failures = [];
const advisories = [];

if (!host) failures.push("src/_data/site.json: media.host is required");
if (!config.bucket) failures.push("src/_data/site.json: media.bucket is required");
// Transformation presets must match the WAF allowlist (see npm run media:waf-expression).
const TRANSFORM_PRESETS = ["thumbnail", "article", "og"];
for (const preset of TRANSFORM_PRESETS) {
  const value = config.transforms?.[preset];
  if (typeof value !== "string" || !/^[a-z-]+=[a-z0-9-]+(?:,[a-z-]+=[a-z0-9-]+)*$/.test(value)) {
    failures.push(`src/_data/site.json: media.transforms.${preset} must be a comma-separated option string`);
  } else if (!value.split(",").includes("onerror=redirect")) {
    failures.push(`src/_data/site.json: media.transforms.${preset} must include onerror=redirect`);
  }
}

const isPositiveInt = (value) => Number.isInteger(value) && value > 0;

function readManifest(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
}

function checkManifest(file, manifest, { fixtures }) {
  for (const [name, entry] of Object.entries(manifest)) {
    const label = `${file}: ${name}`;
    const nameError = validateLogicalName(name);
    if (nameError) failures.push(`${label}: ${nameError}`);
    if (fixtures && !name.startsWith(FIXTURE_NAME_PREFIX)) failures.push(`${label}: fixture names must start with ${FIXTURE_NAME_PREFIX}`);
    if (!fixtures && name.startsWith(FIXTURE_NAME_PREFIX)) failures.push(`${label}: ${FIXTURE_NAME_PREFIX} names belong in tests/fixtures/media/media.json`);

    const expectedType = STORED_TYPE_BY_EXTENSION[extensionOf(name)];
    if (expectedType && entry?.type !== expectedType) failures.push(`${label}: type must be ${expectedType} (got ${entry?.type})`);
    const keyError = validateKey(entry?.key, entry?.type);
    if (keyError) failures.push(`${label}: ${keyError}`);
    if (!isPositiveInt(entry?.width) || !isPositiveInt(entry?.height)) failures.push(`${label}: width/height must be positive integers`);
    if (!isPositiveInt(entry?.bytes)) failures.push(`${label}: bytes must be a positive integer`);

    if (entry?.poster !== undefined) {
      if (!String(entry.type || "").startsWith("video/")) failures.push(`${label}: poster is only allowed for videos`);
      else if (!String(manifest[entry.poster]?.type || "").startsWith("image/")) {
        failures.push(`${label}: poster must be the logical name of a registered image`);
      }
    }
  }
}

const URL_CHARS = "[^\\s\"'`)<>{}]+";
const MARKDOWN_IMAGE = new RegExp(`!\\[[^\\]]*\\]\\(\\s*(${URL_CHARS})(?:\\s+"[^"]*")?\\s*\\)(?:\\{(?:media|gyazo)=([^}\\s]*)\\})?`, "g");
const MEDIA_ROW = /\{%-?\s*mediaRow\b([\s\S]*?)-?%\}/g;
// Not preceded by URL characters (external .../media/ paths) or a backtick (inline code in prose).
const MEDIA_REF = new RegExp(`(?<![\\w.:/\\x60-])/media/${URL_CHARS}`, "g");

function checkReferences(files, manifest, manifestFile) {
  const used = new Set();
  const physicalUrl = host ? new RegExp(`https?://${host.replace(/\./g, "\\.")}/${URL_CHARS}`, "g") : null;

  const checkReference = (file, ref, mode) => {
    if (mode !== undefined && !MODES.has(mode)) {
      failures.push(`${file}: ${ref} uses unknown display mode "${mode}" (image, loop, player)`);
    }
    const name = logicalNameFromRef(ref);
    if (name === null) return;
    const nameError = validateLogicalName(name);
    if (nameError) {
      failures.push(`${file}: ${ref}: ${nameError}`);
      return;
    }
    const entry = manifest[name];
    if (!entry) {
      failures.push(`${file}: ${ref} is not registered in ${manifestFile}`);
      return;
    }
    used.add(name);
    if (mode === undefined || !MODES.has(mode)) return;
    const isVideo = String(entry.type).startsWith("video/");
    if (mode === "image" && isVideo) failures.push(`${file}: ${ref} is ${entry.type} but is displayed with {media=image}`);
    if (mode !== "image" && !isVideo) failures.push(`${file}: ${ref} is ${entry.type} but is displayed with {media=${mode}}`);
  };

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const withMode = new Set();

    for (const [, ref, mode] of text.matchAll(MARKDOWN_IMAGE)) {
      checkReference(file, ref, mode === undefined ? "image" : mode.toLowerCase());
      withMode.add(ref);
    }
    for (const [, args] of text.matchAll(MEDIA_ROW)) {
      const img = args.match(/\bimg\s*=\s*"([^"]*)"/)?.[1];
      if (!img) continue;
      const ref = img.replace(/\s*\{(?:media|gyazo)=[^}]*\}\s*/i, "").trim();
      const braceMode = img.match(/\{(?:media|gyazo)=([^}]*)\}/i)?.[1];
      const paramMode = args.match(/\b(?:mode|media|gyazo)\s*=\s*"([^"]*)"/)?.[1];
      checkReference(file, ref, (paramMode || braceMode || "image").toLowerCase());
      withMode.add(ref);
    }
    // Other references (front matter hero, data files): must be registered.
    for (const ref of new Set(text.match(MEDIA_REF) || [])) {
      if (!withMode.has(ref)) checkReference(file, ref, undefined);
    }
    if (physicalUrl) {
      for (const url of new Set(text.match(physicalUrl) || [])) {
        failures.push(`${file}: ${url} is a physical R2 URL; reference it as /media/<logical name>`);
      }
    }
  }

  // A poster counts as used when its video is used.
  for (const [name, entry] of Object.entries(manifest)) {
    if (entry?.poster && used.has(name)) used.add(entry.poster);
  }
  return used;
}

// --- Production
const PRODUCTION_MANIFEST = "src/_data/media.json";
const productionManifest = readManifest(PRODUCTION_MANIFEST);
checkManifest(PRODUCTION_MANIFEST, productionManifest, { fixtures: false });
const productionFiles = await fg(
  [
    "src/*.{md,njk}",
    "src/content/**/*.{md,njk}",
    "src/includes/**/*.njk",
    "src/layouts/**/*.njk",
    "src/_data/**/*.{json,yml,yaml}"
  ],
  { ignore: [PRODUCTION_MANIFEST, "src/_data/pageViews.json"] }
);
const usedInProduction = checkReferences(productionFiles, productionManifest, PRODUCTION_MANIFEST);
for (const name of Object.keys(productionManifest)) {
  if (!usedInProduction.has(name)) advisories.push(`${PRODUCTION_MANIFEST}: ${name} is not referenced by any page or setting`);
}

// --- Fixtures (test builds only)
const FIXTURE_MANIFEST = "tests/fixtures/media/media.json";
const fixtureManifest = readManifest(FIXTURE_MANIFEST);
checkManifest(FIXTURE_MANIFEST, fixtureManifest, { fixtures: true });
checkReferences(["tests/fixtures/media/media-fixtures.md"], fixtureManifest, FIXTURE_MANIFEST);

if (advisories.length) {
  console.warn(`Media advisories (${advisories.length}):\n${advisories.map((line) => `  ${line}`).join("\n")}`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Media checks passed (${Object.keys(productionManifest).length} production entries, ` +
    `${Object.keys(fixtureManifest).length} fixture entries, ${productionFiles.length} files scanned).`
);
