#!/usr/bin/env node
// Upload media referenced by the site that is new or changed in COMFY_MEDIA_ORIGINALS.
//
//   npm run media:sync [-- --dry-run] [-- --force]
//
// Runs automatically from the git pre-commit hook (.githooks/pre-commit). Authenticate once with
// `npx wrangler login`. Videos need ffmpeg (`sudo apt install ffmpeg`).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ORIGINALS_ENV, originalsRootFromEnv } from "./lib/media-local-preview.mjs";
import { PRODUCTION_MANIFEST, productionSourceFiles, referencesInFiles } from "./lib/media-refs.mjs";
import { syncMedia } from "./lib/media-sync.mjs";

const CACHE_CONTROL = "public, max-age=31536000, immutable";
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");

function formatBytes(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)}MB` : `${Math.round(bytes / 1024)}KB`;
}

function uploadWithWrangler(bucket) {
  return (key, data, type) => {
    const tmpFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "media-sync-")), path.basename(key));
    fs.writeFileSync(tmpFile, data);
    try {
      const result = spawnSync(
        "npx",
        ["wrangler", "r2", "object", "put", `${bucket}/${key}`, "--file", tmpFile, "--content-type", type, "--cache-control", CACHE_CONTROL, "--remote"],
        { encoding: "utf8" }
      );
      if (result.status !== 0) {
        throw new Error(`R2 へのアップロードに失敗しました（${key}）: ${String(result.stderr || result.stdout).trim().split("\n").slice(-3).join(" / ")}`);
      }
    } finally {
      fs.rmSync(path.dirname(tmpFile), { recursive: true, force: true });
    }
  };
}

function saveManifest(manifest) {
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(PRODUCTION_MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);
}

const { media: config = {} } = JSON.parse(fs.readFileSync("src/_data/site.json", "utf8"));
if (!config.bucket) {
  console.error("src/_data/site.json に media.bucket がありません");
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(PRODUCTION_MANIFEST, "utf8"));
const references = referencesInFiles(await productionSourceFiles());
const root = originalsRootFromEnv();
if (!root) console.warn(`[media:sync] ${ORIGINALS_ENV} が未設定か存在しません。登録済みのメディアだけ確認します。`);

const { results, errors } = await syncMedia({
  manifest,
  references,
  root,
  dryRun,
  force,
  upload: uploadWithWrangler(config.bucket),
  save: saveManifest
});

const LABELS = { added: "+ 追加", replaced: "! 差し替え", "source-updated": "= 原本のみ変更（公開ファイルは同じ）", kept: "- 原本なし", unchanged: "" };
for (const result of results.filter((item) => item.status !== "unchanged")) {
  const detail = result.key
    ? ` → ${result.key} (${formatBytes(result.bytes)}, 原本 ${formatBytes(result.originalBytes)})${result.uploads.length ? ` upload: ${result.uploads.join(", ")}` : ""}${result.replacedKey ? ` [旧: ${result.replacedKey}]` : ""}`
    : result.note ? ` (${result.note})` : "";
  console.log(`${LABELS[result.status]} ${result.name}${detail}${dryRun ? " [dry-run]" : ""}`);
}
const changed = results.filter((item) => ["added", "replaced", "source-updated"].includes(item.status)).length;
console.log(`[media:sync] ${results.length} 件の参照を確認、${changed} 件を${dryRun ? "更新予定" : "更新"}${errors.length ? `、エラー ${errors.length} 件` : ""}`);
if (errors.length) {
  console.error(errors.map((error) => `  ✘ ${error}`).join("\n"));
  process.exit(1);
}
