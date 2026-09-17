// Upload referenced media that is new or changed since its last upload.
//
// For every `/media/<logical name>` referenced by the site, compare the local original in
// COMFY_MEDIA_ORIGINALS with `source` (a hash of the original file) in media.json. New or changed
// originals are converted (images → full-size WebP; mp4 → metadata-free mp4 plus a WebP poster frame),
// uploaded under content-hash keys, and recorded. Unchanged originals are skipped without re-encoding.

import crypto from "node:crypto";
import fs from "node:fs";
import { encodeFullWebp } from "./media-image.mjs";
import { originalPath, sourceHash } from "./media-local-preview.mjs";
import { extensionOf, keyFor, logicalNameFromRef, validateLogicalName } from "./media-names.mjs";
import { prepareVideo } from "./media-video.mjs";

const HASH_LENGTH = 16;

function contentHash(data) {
  return crypto.createHash("sha256").update(data).digest("hex").slice(0, HASH_LENGTH);
}

function knownKeys(manifest) {
  const keys = new Set();
  for (const entry of Object.values(manifest)) {
    if (entry?.key) keys.add(entry.key);
    if (entry?.poster && typeof entry.poster === "object" && entry.poster.key) keys.add(entry.poster.key);
  }
  return keys;
}

async function convert(name, file) {
  if (extensionOf(name) === "mp4") {
    const video = await prepareVideo(file);
    const poster = { key: keyFor(contentHash(video.poster.data), "image/webp"), ...video.poster };
    return {
      entry: { key: keyFor(contentHash(video.data), "video/mp4"), width: video.width, height: video.height, type: "video/mp4", bytes: video.data.length },
      objects: [
        { key: keyFor(contentHash(video.data), "video/mp4"), data: video.data, type: "video/mp4" },
        { key: poster.key, data: poster.data, type: "image/webp" }
      ],
      poster: { key: poster.key, width: poster.width, height: poster.height, bytes: poster.data.length }
    };
  }
  const image = await encodeFullWebp(fs.readFileSync(file));
  const key = keyFor(contentHash(image.data), "image/webp");
  return {
    entry: { key, width: image.width, height: image.height, type: "image/webp", bytes: image.data.length },
    objects: [{ key, data: image.data, type: "image/webp" }]
  };
}

/**
 * @param {object} options
 * @param {Record<string, object>} options.manifest Mutated in place.
 * @param {{ file: string, ref: string }[]} options.references
 * @param {string} options.root Absolute COMFY_MEDIA_ORIGINALS path ("" when unset).
 * @param {(key: string, data: Buffer, type: string) => Promise<void> | void} options.upload
 * @param {(manifest: object) => void} options.save Called after each recorded entry.
 * @param {boolean} [options.dryRun]
 * @param {boolean} [options.force] Re-convert and re-upload even when unchanged.
 * @returns {Promise<{ results: object[], errors: string[] }>}
 */
export async function syncMedia({ manifest, references, root, upload, save, dryRun = false, force = false }) {
  const results = [];
  const errors = [];
  const names = new Map();
  for (const { file, ref } of references) {
    const name = logicalNameFromRef(ref);
    if (name === null) continue;
    if (!names.has(name)) names.set(name, file);
  }

  const existingKeys = knownKeys(manifest);
  for (const [name, referencedFrom] of [...names].sort(([a], [b]) => a.localeCompare(b))) {
    const nameError = validateLogicalName(name);
    if (nameError) {
      errors.push(`${referencedFrom}: /media/${name}: ${nameError}`);
      continue;
    }
    const current = manifest[name];
    const file = originalPath(root, name);
    if (!file) {
      if (current) {
        results.push({ name, status: "kept", note: "原本が見つからないため登録済みのものを使用" });
      } else {
        errors.push(
          root
            ? `${referencedFrom}: /media/${name} の原本がありません（${root}/${name}）`
            : `${referencedFrom}: /media/${name} は未登録ですが、COMFY_MEDIA_ORIGINALS が設定されていません`
        );
      }
      continue;
    }

    const source = sourceHash(file);
    if (current?.source === source && !force) {
      results.push({ name, status: "unchanged" });
      continue;
    }

    let converted;
    try {
      converted = await convert(name, file);
    } catch (error) {
      errors.push(`${name}: ${error.message}`);
      continue;
    }

    const next = { ...converted.entry, source };
    if (converted.poster) {
      // Keep a manually chosen poster (logical name); otherwise use the generated frame.
      next.poster = typeof current?.poster === "string" ? current.poster : converted.poster;
    }
    const sameObjects = current?.key === next.key && (!converted.poster || typeof next.poster === "string" || current?.poster?.key === next.poster.key);
    const status = !current ? "added" : sameObjects ? "source-updated" : "replaced";
    const referencedKeys = new Set([next.key, typeof next.poster === "object" ? next.poster.key : undefined]);
    const toUpload = converted.objects.filter((object) => referencedKeys.has(object.key) && (force || !existingKeys.has(object.key)));

    results.push({
      name,
      status,
      key: next.key,
      bytes: next.bytes,
      originalBytes: fs.statSync(file).size,
      uploads: toUpload.map((object) => object.key),
      replacedKey: status === "replaced" ? current.key : undefined
    });
    if (dryRun) continue;

    try {
      for (const object of toUpload) {
        await upload(object.key, object.data, object.type);
        existingKeys.add(object.key);
      }
    } catch (error) {
      errors.push(`${name}: ${error.message}`);
      continue;
    }
    manifest[name] = next;
    save(manifest);
  }
  return { results, errors };
}
