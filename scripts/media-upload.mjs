#!/usr/bin/env node
// Upload article images to the R2 media bucket under a logical name.
//
//   COMFY_MEDIA_ORIGINALS=/mnt/d/comfy-with-comfyui-media
//   npm run media:put -- flux-2-klein/001.png [...] [--alt "説明"] [--replace] [--force] [--dry-run] [--no-clipboard]
//
// The argument is a path relative to COMFY_MEDIA_ORIGINALS (or an absolute path inside it); that
// relative path is the logical name used in Markdown as `/media/<logical name>`.
// For each file: remove non-visual metadata without re-encoding, name the object by content hash
// (images/<hash>.<ext>), upload it with immutable caching, record logical name → key in
// src/_data/media.json, and copy the Markdown snippet to the clipboard.
//
// Same logical name, same content: skipped (--force re-uploads, e.g. to restore a missing object).
// Same logical name, different content: error, unless --replace is given. References to the name
// are listed either way; the old object stays in R2.
//
// Authenticate once with `npx wrangler login`. mp4 is not handled yet: strip its metadata, upload
// it, and register it in media.json manually (see ops/adr/2026-09-17-media-layer-r2-gyazo.md).

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import fg from "fast-glob";
import { SUPPORTED_EXTENSIONS, stripImageMetadata } from "./lib/media-metadata.mjs";
import { keyFor, mediaRef, publicUrl, validateLogicalName } from "./lib/media-names.mjs";

const SITE_DATA_PATH = path.resolve("src", "_data", "site.json");
const MANIFEST_PATH = path.resolve("src", "_data", "media.json");
const ORIGINALS_ENV = "COMFY_MEDIA_ORIGINALS";
const CACHE_CONTROL = "public, max-age=31536000, immutable";
const HASH_LENGTH = 16;
const USAGE =
  'Usage: npm run media:put -- <logical name, e.g. flux-2-klein/001.png> [...] [--alt "説明"] [--replace] [--force] [--dry-run] [--no-clipboard]';
const REFERENCE_SOURCES = [
  "src/*.{md,njk}",
  "src/content/**/*.{md,njk}",
  "src/includes/**/*.njk",
  "src/layouts/**/*.njk",
  "src/_data/**/*.{json,yml,yaml}"
];

function parseArgs(argv) {
  const opts = { inputs: [], alt: "", dryRun: false, clipboard: true, force: false, replace: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--force") opts.force = true;
    else if (arg === "--replace") opts.replace = true;
    else if (arg === "--no-clipboard") opts.clipboard = false;
    else if (arg === "--alt") opts.alt = argv[++i] ?? "";
    else if (arg.startsWith("--")) throw new Error(`unknown option: ${arg}\n${USAGE}`);
    else opts.inputs.push(arg);
  }
  if (!opts.inputs.length) throw new Error(USAGE);
  return opts;
}

function originalsRoot() {
  const root = process.env[ORIGINALS_ENV];
  if (!root) throw new Error(`${ORIGINALS_ENV} が設定されていません（原本置き場のルート。例: /mnt/d/comfy-with-comfyui-media）`);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`${ORIGINALS_ENV}=${root} はディレクトリではありません`);
  return fs.realpathSync(root);
}

// Map an argument to { name, file }. The logical name must match the on-disk path exactly,
// including case, because Windows drives mounted in WSL are case-insensitive.
function resolveInput(root, input) {
  let relative = input;
  if (path.isAbsolute(input)) {
    relative = path.relative(root, path.resolve(input));
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error(`${input}: ${ORIGINALS_ENV}（${root}）の外にあるファイルです`);
    }
  }
  const name = relative.split(path.sep).join("/");
  const nameError = validateLogicalName(name);
  if (nameError) throw new Error(`${input}: ${nameError}`);

  let current = root;
  for (const segment of name.split("/")) {
    const entries = fs.existsSync(current) ? fs.readdirSync(current) : [];
    if (!entries.includes(segment)) {
      const caseVariant = entries.find((entry) => entry.toLowerCase() === segment);
      throw new Error(
        caseVariant
          ? `${input}: ディスク上の名前は "${caseVariant}" です。原本を小文字の名前に変更してください`
          : `${input}: ${path.join(current, segment)} が見つかりません`
      );
    }
    current = path.join(current, segment);
  }
  if (!SUPPORTED_EXTENSIONS.includes(path.extname(name))) {
    throw new Error(`${input}: 未対応の形式です（対応: ${SUPPORTED_EXTENSIONS.join(", ")}。mp4 は media.json に手動登録）`);
  }
  return { name, file: current };
}

async function findReferences(name) {
  const escaped = mediaRef(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${escaped}(?![a-z0-9._/-])`);
  const files = await fg(REFERENCE_SOURCES, { ignore: ["src/_data/media.json", "src/_data/pageViews.json"] });
  return files.filter((file) => pattern.test(fs.readFileSync(file, "utf8"))).sort();
}

function copyToClipboard(text) {
  // clip.exe garbles non-ASCII text, so use PowerShell with explicit UTF-8 input on Windows/WSL.
  const powershellArgs = ["-NoProfile", "-Command", "[Console]::InputEncoding=[Text.Encoding]::UTF8; Set-Clipboard -Value ([Console]::In.ReadToEnd())"];
  const candidates = process.env.WSL_DISTRO_NAME || process.platform === "win32"
    ? [
        ["powershell.exe", powershellArgs],
        ["/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe", powershellArgs]
      ]
    : process.platform === "darwin"
      ? [["pbcopy", []]]
      : [["wl-copy", []], ["xclip", ["-selection", "clipboard"]]];
  return candidates.some(([command, args]) => spawnSync(command, args, { input: text }).status === 0);
}

function uploadObject(bucket, key, file, contentType) {
  const result = spawnSync(
    "npx",
    [
      "wrangler", "r2", "object", "put", `${bucket}/${key}`,
      "--file", file,
      "--content-type", contentType,
      "--cache-control", CACHE_CONTROL,
      "--remote"
    ],
    { stdio: "inherit" }
  );
  if (result.status !== 0) throw new Error(`wrangler upload failed for ${key}`);
}

function writeManifest(manifest) {
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { media: config = {} } = JSON.parse(fs.readFileSync(SITE_DATA_PATH, "utf8"));
  if (!config.host || !config.bucket) throw new Error("src/_data/site.json に media.host / media.bucket がありません");
  const root = originalsRoot();
  const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) : {};
  const snippets = [];

  for (const input of opts.inputs) {
    const { name, file } = resolveInput(root, input);
    let stripped;
    try {
      stripped = stripImageMetadata(fs.readFileSync(file), path.extname(name));
    } catch (error) {
      throw new Error(`${input}: ${error.message}`);
    }
    const { data, width, height, type, ext, removed } = stripped;
    const hash = crypto.createHash("sha256").update(data).digest("hex").slice(0, HASH_LENGTH);
    const key = keyFor(hash, ext, type);
    const current = manifest[name];
    const summary = `${key} ${width}x${height} ${data.length} bytes; removed: ${removed.length ? removed.join(", ") : "none"}`;
    const snippet = `![${opts.alt}](${mediaRef(name)}){media=image}`;

    if (current && current.key === key && !opts.force) {
      console.log(`= ${name} (${key}) は登録済みで内容も同じです（再アップロードは --force）`);
      snippets.push(snippet);
      continue;
    }

    if (current && current.key !== key) {
      const references = await findReferences(name);
      const referenceList = references.length ? references.map((ref) => `    ${ref}`).join("\n") : "    (参照なし)";
      if (!opts.replace) {
        throw new Error(
          `${name} は別の内容で登録済みです（${current.key} → ${key}）。差し替える場合は --replace を付けてください。\n  参照箇所:\n${referenceList}`
        );
      }
      console.log(`! ${name} を差し替えます（${current.key} → ${key}）。旧オブジェクトは R2 に残ります。\n  参照箇所:\n${referenceList}`);
    }

    if (opts.dryRun) {
      console.log(`~ ${name} -> ${publicUrl(config.host, key)} ${summary} [dry-run]`);
      snippets.push(snippet);
      continue;
    }

    const tmpFile = path.join(os.tmpdir(), `media-upload-${hash}.${ext}`);
    fs.writeFileSync(tmpFile, data);
    try {
      uploadObject(config.bucket, key, tmpFile, type);
    } finally {
      fs.rmSync(tmpFile, { force: true });
    }
    manifest[name] = { ...current, key, width, height, type, bytes: data.length };
    // Write after each upload so an uploaded object is never left unrecorded.
    writeManifest(manifest);
    console.log(`+ ${name} -> ${publicUrl(config.host, key)} ${summary}`);
    snippets.push(snippet);
  }

  const output = snippets.join("\n\n");
  console.log(`\n${output}`);
  if (opts.clipboard && !opts.dryRun) {
    console.log(copyToClipboard(output) ? "\n(copied to clipboard)" : "\n(clipboard unavailable; copy the lines above)");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
