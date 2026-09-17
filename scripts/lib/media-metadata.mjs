// Remove non-visual metadata from PNG/JPEG files without re-encoding.
//
// Kept: pixel data and everything that affects how the image looks (ICC profile, sRGB/gamma/
// chromaticity, CICP/HDR colour info, transparency, palette, animation chunks, JFIF, Adobe
// colour transform).
// Removed: ComfyUI workflow/prompt text chunks, EXIF (incl. GPS), XMP, comments, timestamps,
// Photoshop/IPTC blocks, and any other private or textual metadata.
//
// Files whose appearance depends on metadata that would be removed (EXIF Orientation other than
// 1, Ultra HDR / multi-picture JPEG) are rejected instead of being modified.

import zlib from "node:zlib";

export class MediaMetadataError extends Error {}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_KEEP_CHUNKS = new Set([
  "IHDR", "PLTE", "IDAT", "IEND",
  "tRNS", "bKGD", "sBIT", "pHYs",
  "gAMA", "cHRM", "sRGB", "iCCP", "cICP", "mDCV", "cLLI",
  "acTL", "fcTL", "fdAT"
]);

function readExifOrientation(tiff) {
  if (tiff.length < 8) return 1;
  const order = tiff.toString("latin1", 0, 2);
  const little = order === "II";
  if (!little && order !== "MM") return 1;
  const u16 = (offset) => (little ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset));
  const u32 = (offset) => (little ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset));
  if (u16(2) !== 42) return 1;
  const ifd = u32(4);
  if (ifd + 2 > tiff.length) return 1;
  const count = u16(ifd);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > tiff.length) break;
    if (u16(entry) === 0x0112) return u16(entry + 8);
  }
  return 1;
}

// ---------------------------------------------------------------- PNG

function parsePng(buffer) {
  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new MediaMetadataError("PNG シグネチャが不正です");
  }
  const chunks = [];
  let offset = 8;
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("latin1", offset + 4, offset + 8);
    const end = offset + 12 + length;
    if (end > buffer.length) throw new MediaMetadataError(`PNG チャンク ${type} が途中で切れています`);
    const crc = buffer.readUInt32BE(end - 4);
    if (zlib.crc32(buffer.subarray(offset + 4, end - 4)) !== crc) {
      throw new MediaMetadataError(`PNG チャンク ${type} の CRC が一致しません`);
    }
    chunks.push({ type, start: offset, end, data: buffer.subarray(offset + 8, end - 4) });
    offset = end;
    if (type === "IEND") break;
  }
  const ihdr = chunks[0];
  if (!ihdr || ihdr.type !== "IHDR" || chunks.at(-1)?.type !== "IEND") {
    throw new MediaMetadataError("PNG の構造が不正です（IHDR/IEND がありません）");
  }
  return {
    chunks,
    width: ihdr.data.readUInt32BE(0),
    height: ihdr.data.readUInt32BE(4),
    trailingBytes: buffer.length - offset
  };
}

function pngImageData(parsed) {
  return Buffer.concat(parsed.chunks.filter((chunk) => chunk.type === "IDAT").map((chunk) => chunk.data));
}

function stripPng(buffer) {
  const parsed = parsePng(buffer);
  const exif = parsed.chunks.find((chunk) => chunk.type === "eXIf");
  if (exif) {
    const orientation = readExifOrientation(exif.data);
    if (orientation !== 1) {
      throw new MediaMetadataError(`EXIF Orientation=${orientation} のため、削除すると向きが変わります。回転を画素に反映してから再実行してください`);
    }
  }

  const removed = [];
  const kept = [PNG_SIGNATURE];
  for (const chunk of parsed.chunks) {
    if (PNG_KEEP_CHUNKS.has(chunk.type)) kept.push(buffer.subarray(chunk.start, chunk.end));
    else removed.push(chunk.type);
  }
  if (parsed.trailingBytes > 0) removed.push(`IEND 以降のデータ ${parsed.trailingBytes} bytes`);
  const data = Buffer.concat(kept);

  // Verify: structure, CRCs, dimensions, and IDAT stream are intact; nothing removable remains.
  const check = parsePng(data);
  const leftover = check.chunks.filter((chunk) => !PNG_KEEP_CHUNKS.has(chunk.type));
  if (
    leftover.length ||
    check.trailingBytes !== 0 ||
    check.width !== parsed.width ||
    check.height !== parsed.height ||
    !pngImageData(check).equals(pngImageData(parsed))
  ) {
    throw new MediaMetadataError("PNG の metadata 除去後の検証に失敗しました");
  }
  return { data, width: parsed.width, height: parsed.height, type: "image/png", ext: "png", removed };
}

// ---------------------------------------------------------------- JPEG

const JPEG_STANDALONE = new Set([0x01, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9]);

function segmentLabel(marker, payload) {
  if (marker === 0xfe) return "COM";
  const id = payload.toString("latin1", 0, 32);
  if (marker === 0xe1 && id.startsWith("Exif\0")) return "EXIF";
  if (marker === 0xe1 && id.startsWith("http://ns.adobe.com/xap/1.0/")) return "XMP";
  if (marker === 0xe1 && id.startsWith("http://ns.adobe.com/xmp/extension/")) return "XMP (extended)";
  if (marker === 0xed) return "APP13 (Photoshop/IPTC)";
  return `APP${marker - 0xe0}`;
}

function isKeptJpegApp(marker, payload) {
  const id = payload.toString("latin1", 0, 12);
  if (marker === 0xe0) return id.startsWith("JFIF\0");
  if (marker === 0xe2) return id.startsWith("ICC_PROFILE\0");
  if (marker === 0xee) return id.startsWith("Adobe");
  return false;
}

// Split a JPEG into pieces: marker segments, standalone markers, and entropy-coded scan data.
function parseJpeg(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new MediaMetadataError("JPEG シグネチャが不正です");
  }
  const pieces = [{ kind: "marker", marker: 0xd8, start: 0, end: 2 }];
  let offset = 2;
  let width = 0;
  let height = 0;
  let inScan = false;
  let sawEoi = false;

  while (offset < buffer.length) {
    if (inScan) {
      let cursor = offset;
      while (cursor + 1 < buffer.length) {
        if (buffer[cursor] === 0xff) {
          const next = buffer[cursor + 1];
          if (next !== 0x00 && !(next >= 0xd0 && next <= 0xd7)) break;
        }
        cursor += 1;
      }
      if (cursor + 1 >= buffer.length) throw new MediaMetadataError("JPEG が EOI の前に終わっています");
      if (cursor > offset) pieces.push({ kind: "scan", start: offset, end: cursor });
      offset = cursor;
      inScan = false;
      continue;
    }

    if (buffer[offset] !== 0xff) throw new MediaMetadataError(`JPEG マーカーが不正です（offset ${offset}）`);
    let markerOffset = offset;
    while (buffer[markerOffset + 1] === 0xff) markerOffset += 1; // fill bytes
    const marker = buffer[markerOffset + 1];
    if (marker === undefined) throw new MediaMetadataError("JPEG が途中で切れています");

    if (JPEG_STANDALONE.has(marker)) {
      pieces.push({ kind: "marker", marker, start: offset, end: markerOffset + 2 });
      offset = markerOffset + 2;
      if (marker === 0xd9) {
        sawEoi = true;
        break;
      }
      continue;
    }

    if (markerOffset + 4 > buffer.length) throw new MediaMetadataError("JPEG が途中で切れています");
    const length = buffer.readUInt16BE(markerOffset + 2);
    const end = markerOffset + 2 + length;
    if (length < 2 || end > buffer.length) throw new MediaMetadataError("JPEG セグメントが途中で切れています");
    const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isSof) {
      height = buffer.readUInt16BE(markerOffset + 5);
      width = buffer.readUInt16BE(markerOffset + 7);
    }
    pieces.push({ kind: "segment", marker, start: offset, end, payload: buffer.subarray(markerOffset + 4, end) });
    offset = end;
    if (marker === 0xda) inScan = true;
  }

  if (!sawEoi) throw new MediaMetadataError("JPEG に EOI がありません");
  if (!width || !height) throw new MediaMetadataError("JPEG のサイズを読み取れません");
  return { pieces, width, height, trailingBytes: buffer.length - offset };
}

function isRemovableJpegPiece(piece) {
  if (piece.kind !== "segment") return false;
  if (piece.marker === 0xfe) return true;
  const isApp = piece.marker >= 0xe0 && piece.marker <= 0xef;
  return isApp && !isKeptJpegApp(piece.marker, piece.payload);
}

function jpegImageData(buffer, parsed) {
  return Buffer.concat(
    parsed.pieces
      .filter((piece) => !(piece.kind === "segment" && piece.marker >= 0xe0 && piece.marker <= 0xef) && piece.marker !== 0xfe)
      .map((piece) => buffer.subarray(piece.start, piece.end))
  );
}

function stripJpeg(buffer) {
  const parsed = parseJpeg(buffer);

  for (const piece of parsed.pieces) {
    if (piece.kind !== "segment") continue;
    const id = piece.payload.toString("latin1", 0, 40);
    if (piece.marker === 0xe2 && id.startsWith("MPF\0")) {
      throw new MediaMetadataError("MPF（Ultra HDR / マルチピクチャ JPEG）を検出しました。削除すると表示が変わるため処理しません");
    }
    if (piece.marker === 0xe1 && id.startsWith("http://ns.adobe.com/xap/1.0/")) {
      const xmp = piece.payload.toString("latin1");
      if (/hdrgm:|GContainer|Container:Directory/.test(xmp)) {
        throw new MediaMetadataError("Ultra HDR（ゲインマップ）を検出しました。削除すると表示が変わるため処理しません");
      }
    }
    if (piece.marker === 0xe1 && id.startsWith("Exif\0")) {
      const orientation = readExifOrientation(piece.payload.subarray(6));
      if (orientation !== 1) {
        throw new MediaMetadataError(`EXIF Orientation=${orientation} のため、削除すると向きが変わります。回転を画素に反映してから再実行してください`);
      }
    }
  }
  if (parsed.trailingBytes > 0) {
    throw new MediaMetadataError(`EOI 以降に ${parsed.trailingBytes} bytes のデータがあります（ゲインマップ等の可能性）。処理しません`);
  }

  const removed = [];
  const kept = [];
  for (const piece of parsed.pieces) {
    if (isRemovableJpegPiece(piece)) removed.push(segmentLabel(piece.marker, piece.payload));
    else kept.push(buffer.subarray(piece.start, piece.end));
  }
  const data = Buffer.concat(kept);

  // Verify: re-parse succeeds, nothing removable remains, dimensions and image segments/scan data
  // are byte-identical.
  const check = parseJpeg(data);
  if (
    check.pieces.some(isRemovableJpegPiece) ||
    check.trailingBytes !== 0 ||
    check.width !== parsed.width ||
    check.height !== parsed.height ||
    !jpegImageData(data, check).equals(jpegImageData(buffer, parsed))
  ) {
    throw new MediaMetadataError("JPEG の metadata 除去後の検証に失敗しました");
  }
  return { data, width: parsed.width, height: parsed.height, type: "image/jpeg", ext: "jpg", removed };
}

export const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg"];

/**
 * @param {Buffer} buffer
 * @param {string} extension File extension including the dot.
 * @returns {{ data: Buffer, width: number, height: number, type: string, ext: string, removed: string[] }}
 */
export function stripImageMetadata(buffer, extension) {
  const ext = extension.toLowerCase();
  if (ext === ".png") return stripPng(buffer);
  if (ext === ".jpg" || ext === ".jpeg") return stripJpeg(buffer);
  throw new MediaMetadataError(`${extension} は未対応です（対応: ${SUPPORTED_EXTENSIONS.join(", ")}）`);
}
