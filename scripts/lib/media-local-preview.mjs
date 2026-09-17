// Dev-server preview of local originals.
//
// While writing an article, `/media/<logical name>` may point to an original that is not uploaded yet
// (or that changed since its last upload). In `eleventy --serve`, such references render from
// COMFY_MEDIA_ORIGINALS through `/__media-originals/<logical name>`, so the page can be checked on
// localhost before `media:sync` uploads anything. Production builds never use this.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { extensionOf, validateLogicalName } from "./media-names.mjs";

export const LOCAL_PREVIEW_PREFIX = "/__media-originals/";
export const ORIGINALS_ENV = "COMFY_MEDIA_ORIGINALS";

const CONTENT_TYPES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", mp4: "video/mp4" };
const hashCache = new Map();

export function originalsRootFromEnv(env = process.env) {
  const root = env[ORIGINALS_ENV];
  return root && fs.existsSync(root) ? fs.realpathSync(root) : "";
}

/** Absolute path of a logical name inside the originals root, or "" when it is invalid or missing. */
export function originalPath(root, name) {
  if (!root || validateLogicalName(name)) return "";
  const file = path.join(root, ...name.split("/"));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return "";
  return file;
}

/** First 16 hex chars of sha256 over the original file, cached by path, size, and mtime. */
export function sourceHash(file) {
  const stat = fs.statSync(file);
  const cacheKey = `${file}:${stat.size}:${stat.mtimeMs}`;
  if (!hashCache.has(cacheKey)) {
    hashCache.set(cacheKey, crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 16));
  }
  return hashCache.get(cacheKey);
}

// Read PNG/JPEG dimensions synchronously (renderers are synchronous). Videos return undefined.
function imageDimensions(file) {
  const fd = fs.openSync(file, "r");
  try {
    const head = Buffer.alloc(64 * 1024);
    const length = fs.readSync(fd, head, 0, head.length, 0);
    const buffer = head.subarray(0, length);
    if (buffer.toString("latin1", 1, 4) === "PNG" && buffer.toString("latin1", 12, 16) === "IHDR") {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < buffer.length && buffer[offset] === 0xff) {
        const marker = buffer[offset + 1];
        const size = buffer.readUInt16BE(offset + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
        }
        offset += 2 + size;
      }
    }
  } finally {
    fs.closeSync(fd);
  }
  return {};
}

/**
 * Decide whether a logical name should render from the local original.
 * @returns {null | { url: string, width?: number, height?: number, reason: "unregistered" | "changed" }}
 */
export function localPreview(root, name, entry) {
  const file = originalPath(root, name);
  if (!file) return null;
  let reason = null;
  if (!entry) reason = "unregistered";
  else if (entry.source && entry.source !== sourceHash(file)) reason = "changed";
  if (!reason) return null;
  const dims = extensionOf(name) === "mp4" ? {} : imageDimensions(file);
  return { url: `${LOCAL_PREVIEW_PREFIX}${name}`, ...dims, reason };
}

/** Eleventy dev server middleware serving `/__media-originals/<logical name>` (with Range support). */
export function createOriginalsMiddleware(getRoot = () => originalsRootFromEnv()) {
  return function mediaOriginalsMiddleware(req, res, next) {
    const url = req.url || "";
    if (!url.startsWith(LOCAL_PREVIEW_PREFIX)) return next();
    let name;
    try {
      name = decodeURIComponent(url.slice(LOCAL_PREVIEW_PREFIX.length).split(/[?#]/)[0]);
    } catch {
      name = "";
    }
    const file = originalPath(getRoot(), name);
    if (!file) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    const size = fs.statSync(file).size;
    res.setHeader("Content-Type", CONTENT_TYPES[extensionOf(name)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Accept-Ranges", "bytes");
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (range && (range[1] || range[2])) {
      const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start >= size || start > end) {
        res.statusCode = 416;
        res.setHeader("Content-Range", `bytes */${size}`);
        res.end();
        return;
      }
      res.statusCode = 206;
      res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
      res.setHeader("Content-Length", String(end - start + 1));
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Length", String(size));
    fs.createReadStream(file).pipe(res);
  };
}
