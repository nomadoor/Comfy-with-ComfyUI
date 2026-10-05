// Encode a local original (PNG/JPEG, possibly with ComfyUI workflow metadata) into the full-size WebP
// published to R2. A WebP original is not re-encoded: its image data is published as is, with only
// the metadata chunks removed, so it gets neither heavier nor lossier. Two cases still go through the
// normal encode, because dropping their metadata would change how they look: an EXIF orientation
// other than 1 (the pixels need rotating) and a color profile other than sRGB (the colors need
// converting). Only this WebP is stored; thumbnails, article images, and OGP images are produced by
// Cloudflare Image Transformations presets.
//
// sharp is pinned to an exact version in package.json: object keys are content hashes, so the same
// original should encode to the same bytes. The pin does not cover the platform-specific native build;
// uploading from a different OS/CPU can change the bytes, which only means `media:sync` reports
// a replacement and stores a new object. Uploads are expected to run from one environment.

import sharp from "sharp";

export const WEBP_QUALITY = 90;
// WebP cannot encode images larger than 16383 px on either side.
const WEBP_MAX_DIMENSION = 16383;
// RIFF chunks that carry image data. Anything else (EXIF, XMP, ICCP, ANIM/ANMF, unknown chunks) would be
// metadata or animation and must not appear in a public file.
const ALLOWED_WEBP_CHUNKS = new Set(["VP8 ", "VP8L", "VP8X", "ALPH"]);

export class MediaImageError extends Error {}

/**
 * @param {Buffer} input Original PNG, JPEG, or WebP bytes.
 * @returns {Promise<{ data: Buffer, width: number, height: number, type: "image/webp" }>}
 */
export async function encodeFullWebp(input) {
  let meta;
  try {
    meta = await sharp(input).metadata();
  } catch (error) {
    throw new MediaImageError(`画像を読み込めません（${error.message}）`);
  }
  if (!["png", "jpeg", "webp"].includes(meta.format)) {
    throw new MediaImageError(`PNG / JPEG / WebP 以外の画像です（${meta.format}）`);
  }
  if ((meta.pages || 1) > 1) {
    throw new MediaImageError("アニメーション画像は対象外です");
  }
  if (meta.format === "webp" && (meta.orientation ?? 1) === 1 && (!meta.icc || /srgb/i.test(iccDescription(meta.icc)))) {
    const data = stripWebpMetadata(input);
    await verifyPublicWebp(data, meta.width, meta.height);
    return { data, width: meta.width, height: meta.height, type: "image/webp" };
  }

  const { data, info } = await sharp(input, { animated: false })
    .rotate() // apply EXIF orientation to pixels, since metadata is not kept
    .resize({
      width: WEBP_MAX_DIMENSION,
      height: WEBP_MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  await verifyPublicWebp(data, info.width, info.height);
  return { data, width: info.width, height: info.height, type: "image/webp" };
}

/** The description of an ICC profile ("sRGB", "Display P3", ...), from its `desc` tag (v2 or v4). */
export function iccDescription(icc) {
  if (!icc || icc.length < 132) return "";
  const count = icc.readUInt32BE(128);
  for (let i = 0; i < count && 132 + i * 12 + 12 <= icc.length; i++) {
    const at = 132 + i * 12;
    if (icc.toString("latin1", at, at + 4) !== "desc") continue;
    const tag = icc.subarray(icc.readUInt32BE(at + 4), icc.readUInt32BE(at + 4) + icc.readUInt32BE(at + 8));
    const type = tag.toString("latin1", 0, 4);
    if (type === "desc" && tag.length >= 12) return tag.toString("latin1", 12, 12 + tag.readUInt32BE(8)).replace(/\0+$/, "");
    if (type === "mluc" && tag.length >= 28) {
      const text = Buffer.from(tag.subarray(tag.readUInt32BE(24), tag.readUInt32BE(24) + tag.readUInt32BE(20)));
      return text.swap16().toString("utf16le"); // UTF-16BE
    }
  }
  return "";
}

// VP8X flag bits for the metadata chunks dropped below (ICC profile, EXIF, XMP).
const VP8X_METADATA_FLAGS = 0x20 | 0x08 | 0x04;

/**
 * Keep only the image-data chunks of a WebP (VP8/VP8L/VP8X/ALPH), byte for byte, and clear the VP8X
 * flags that announced the dropped ones. The pixels are not decoded or re-encoded.
 */
export function stripWebpMetadata(data) {
  listWebpChunks(data); // validates the RIFF structure
  const kept = [];
  let offset = 12;
  while (offset + 8 <= data.length) {
    const id = data.toString("latin1", offset, offset + 4);
    const size = data.readUInt32LE(offset + 4);
    const end = offset + 8 + size + (size % 2);
    if (ALLOWED_WEBP_CHUNKS.has(id)) {
      const chunk = Buffer.from(data.subarray(offset, Math.min(end, data.length)));
      if (id === "VP8X") chunk[8] &= ~VP8X_METADATA_FLAGS;
      kept.push(chunk);
    }
    offset = end;
  }
  const body = Buffer.concat(kept);
  const header = Buffer.alloc(12);
  header.write("RIFF", 0, "latin1");
  header.writeUInt32LE(4 + body.length, 4);
  header.write("WEBP", 8, "latin1");
  return Buffer.concat([header, body]);
}

/** List the RIFF chunk IDs of a WebP file. */
export function listWebpChunks(data) {
  if (data.length < 12 || data.toString("latin1", 0, 4) !== "RIFF" || data.toString("latin1", 8, 12) !== "WEBP") {
    throw new MediaImageError("WebP の RIFF ヘッダーが不正です");
  }
  const chunks = [];
  let offset = 12;
  while (offset + 8 <= data.length) {
    const id = data.toString("latin1", offset, offset + 4);
    const size = data.readUInt32LE(offset + 4);
    const end = offset + 8 + size + (size % 2);
    if (offset + 8 + size > data.length) throw new MediaImageError(`WebP のチャンク ${id} が途中で切れています`);
    chunks.push(id);
    offset = end;
  }
  return chunks;
}

/** Throw unless `data` is a WebP of the given size containing only image-data chunks. */
export async function verifyPublicWebp(data, width, height) {
  const meta = await sharp(data).metadata();
  if (meta.format !== "webp" || meta.width !== width || meta.height !== height) {
    throw new MediaImageError("WebP の出力検証に失敗しました（形式またはサイズが一致しません）");
  }
  const extra = listWebpChunks(data).filter((id) => !ALLOWED_WEBP_CHUNKS.has(id));
  if (extra.length) {
    throw new MediaImageError(`WebP の出力に画像データ以外のチャンクがあります（${extra.join(", ")}）`);
  }
}
