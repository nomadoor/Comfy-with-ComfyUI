#!/usr/bin/env node
// Upload article images to the R2 media bucket.
//
//   npm run media:put -- <image.png|jpg> [...] [--alt "説明"] [--force] [--dry-run] [--no-clipboard]
//
// For each file: remove non-visual metadata without re-encoding, name it by content hash,
// upload it with immutable caching, record it in src/_data/media.json, and copy the Markdown
// snippet to the clipboard. Authenticate once with `npx wrangler login`.
//
// --force uploads even when the URL is already in media.json (e.g. registered fixtures that are not
// in the bucket yet). The key is still the content hash, so the bytes are identical; an object that
// is already protected by Bucket Lock will be rejected by R2.
//
// mp4 is not handled yet: upload and register it in media.json manually (see
// ops/adr/2026-09-17-media-layer-r2-gyazo.md). A video handler can be added next to
// stripImageMetadata() later without changing the manifest format.

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { SUPPORTED_EXTENSIONS, stripImageMetadata } from "./lib/media-metadata.mjs";

const SITE_DATA_PATH = path.resolve("src", "_data", "site.json");
const MANIFEST_PATH = path.resolve("src", "_data", "media.json");
const CACHE_CONTROL = "public, max-age=31536000, immutable";
const HASH_LENGTH = 16;
const USAGE = 'Usage: npm run media:put -- <image.png|jpg> [...] [--alt "説明"] [--force] [--dry-run] [--no-clipboard]';

function parseArgs(argv) {
  const opts = { files: [], alt: "", dryRun: false, clipboard: true, force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--force") opts.force = true;
    else if (arg === "--no-clipboard") opts.clipboard = false;
    else if (arg === "--alt") opts.alt = argv[++i] ?? "";
    else if (arg.startsWith("--")) throw new Error(`unknown option: ${arg}\n${USAGE}`);
    else opts.files.push(arg);
  }
  if (!opts.files.length) throw new Error(USAGE);
  return opts;
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

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { media: config = {} } = JSON.parse(fs.readFileSync(SITE_DATA_PATH, "utf8"));
  if (!config.host || !config.bucket) throw new Error("src/_data/site.json に media.host / media.bucket がありません");

  const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) : {};
  const snippets = [];

  for (const file of opts.files) {
    if (!SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
      throw new Error(`${file}: 未対応の形式です（対応: ${SUPPORTED_EXTENSIONS.join(", ")}。mp4 は media.json に手動登録）`);
    }
    let stripped;
    try {
      stripped = stripImageMetadata(fs.readFileSync(file), path.extname(file));
    } catch (error) {
      throw new Error(`${file}: ${error.message}`);
    }
    const { data, width, height, type, ext, removed } = stripped;
    const hash = crypto.createHash("sha256").update(data).digest("hex").slice(0, HASH_LENGTH);
    const key = `u/${hash}.${ext}`;
    const url = `https://${config.host}/${key}`;
    const summary = `${width}x${height} ${data.length} bytes; removed: ${removed.length ? removed.join(", ") : "none"}`;

    if (manifest[url] && !opts.force) {
      // Keys are never overwritten (Bucket Lock would reject it anyway). Use --force to upload anyway.
      console.log(`= ${file} -> ${url} (already in media.json; use --force to upload)`);
    } else if (opts.dryRun) {
      console.log(`~ ${file} -> ${url} ${summary} [dry-run${opts.force ? ", force" : ""}]`);
    } else {
      const tmpFile = path.join(os.tmpdir(), `media-upload-${hash}.${ext}`);
      fs.writeFileSync(tmpFile, data);
      try {
        uploadObject(config.bucket, key, tmpFile, type);
      } finally {
        fs.rmSync(tmpFile, { force: true });
      }
      manifest[url] = { ...manifest[url], width, height, type, bytes: data.length };
      // Write after each upload so an uploaded object is never left unrecorded.
      fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
      console.log(`+ ${file} -> ${url} ${summary}${opts.force ? " [force]" : ""}`);
    }
    snippets.push(`![${opts.alt}](${url}){media=image}`);
  }

  const output = snippets.join("\n\n");
  console.log(`\n${output}`);
  if (opts.clipboard && !opts.dryRun) {
    console.log(copyToClipboard(output) ? "\n(copied to clipboard)" : "\n(clipboard unavailable; copy the lines above)");
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
