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

/**
 * Canonical path of a logical name inside the originals root, or "" when it is invalid, missing, or
 * resolves outside the root (for example through a symbolic link).
 */
export function originalPath(root, name) {
  if (!root || validateLogicalName(name)) return "";
  let canonicalRoot;
  let canonicalFile;
  try {
    canonicalRoot = fs.realpathSync(root);
    canonicalFile = fs.realpathSync(path.join(canonicalRoot, ...name.split("/")));
  } catch {
    return "";
  }
  if (!canonicalFile.startsWith(canonicalRoot + path.sep) || !fs.statSync(canonicalFile).isFile()) return "";
  return canonicalFile;
}

/** First 16 hex chars of sha256 over the original file, cached by path, size, and mtime. */
export function sourceHash(file) {
  const stat = fs.statSync(file);
  const cacheKey = `${file}:${stat.size}:${stat.mtimeMs}`;
  if (!hashCache.has(cacheKey)) {
    // Read in chunks so large videos are never buffered whole.
    const hash = crypto.createHash("sha256");
    const chunk = Buffer.alloc(1024 * 1024);
    const fd = fs.openSync(file, "r");
    try {
      let bytesRead;
      while ((bytesRead = fs.readSync(fd, chunk, 0, chunk.length, null)) > 0) hash.update(chunk.subarray(0, bytesRead));
    } finally {
      fs.closeSync(fd);
    }
    hashCache.set(cacheKey, hash.digest("hex").slice(0, 16));
  }
  return hashCache.get(cacheKey);
}

const dimensionCache = new Map();

// Read PNG/JPEG dimensions synchronously (renderers are synchronous).
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

// Read the displayed size of the first video track of an mp4 synchronously: walk the top-level boxes
// (skipping media data), then moov → trak → tkhd (size and rotation matrix) and mdia/hdlr ("vide").
// Works whether moov is before or after mdat. Returns {} when it cannot be read.
export function mp4Dimensions(file) {
  const fd = fs.openSync(file, "r");
  try {
    const size = fs.fstatSync(fd).size;
    const readAt = (position, length) => {
      const buffer = Buffer.alloc(length);
      const bytesRead = fs.readSync(fd, buffer, 0, length, position);
      return buffer.subarray(0, bytesRead);
    };
    const children = (buffer, start, end) => {
      const boxes = [];
      let offset = start;
      while (offset + 8 <= end) {
        let boxSize = buffer.readUInt32BE(offset);
        const type = buffer.toString("latin1", offset + 4, offset + 8);
        let header = 8;
        if (boxSize === 1) {
          boxSize = Number(buffer.readBigUInt64BE(offset + 8));
          header = 16;
        } else if (boxSize === 0) {
          boxSize = end - offset;
        }
        if (boxSize < header || offset + boxSize > end) break;
        boxes.push({ type, start: offset + header, end: offset + boxSize });
        offset += boxSize;
      }
      return boxes;
    };

    let moov = null;
    for (let offset = 0; offset + 8 <= size; ) {
      const head = readAt(offset, 16);
      if (head.length < 8) break;
      let boxSize = head.readUInt32BE(0);
      const type = head.toString("latin1", 4, 8);
      let header = 8;
      if (boxSize === 1 && head.length >= 16) {
        boxSize = Number(head.readBigUInt64BE(8));
        header = 16;
      } else if (boxSize === 0) {
        boxSize = size - offset;
      }
      if (boxSize < header) break;
      if (type === "moov") {
        if (boxSize > 64 * 1024 * 1024) break;
        moov = readAt(offset, boxSize);
        moov = { buffer: moov, start: header, end: moov.length };
        break;
      }
      offset += boxSize;
    }
    if (!moov) return {};

    for (const trak of children(moov.buffer, moov.start, moov.end).filter((box) => box.type === "trak")) {
      const trakBoxes = children(moov.buffer, trak.start, trak.end);
      const mdia = trakBoxes.find((box) => box.type === "mdia");
      const hdlr = mdia && children(moov.buffer, mdia.start, mdia.end).find((box) => box.type === "hdlr");
      if (!hdlr || moov.buffer.toString("latin1", hdlr.start + 8, hdlr.start + 12) !== "vide") continue;
      const tkhd = trakBoxes.find((box) => box.type === "tkhd");
      if (!tkhd) continue;
      const version = moov.buffer[tkhd.start];
      const matrix = tkhd.start + 4 + (version === 1 ? 32 : 20) + 16;
      const width = Math.round(moov.buffer.readUInt32BE(matrix + 36) / 65536);
      const height = Math.round(moov.buffer.readUInt32BE(matrix + 40) / 65536);
      if (!width || !height) continue;
      // Matrix [a b u; c d v; x y w]: a = d = 0 means a 90/270 degree rotation.
      const a = moov.buffer.readInt32BE(matrix);
      const d = moov.buffer.readInt32BE(matrix + 16);
      return a === 0 && d === 0 ? { width: height, height: width } : { width, height };
    }
    return {};
  } catch {
    return {};
  } finally {
    fs.closeSync(fd);
  }
}

function mediaDimensions(file, name) {
  const stat = fs.statSync(file);
  const cacheKey = `${file}:${stat.size}:${stat.mtimeMs}`;
  if (!dimensionCache.has(cacheKey)) {
    dimensionCache.set(cacheKey, extensionOf(name) === "mp4" ? mp4Dimensions(file) : imageDimensions(file));
  }
  return dimensionCache.get(cacheKey);
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
  const dims = mediaDimensions(file, name);
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
