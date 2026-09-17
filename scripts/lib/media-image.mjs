// Encode a local original (PNG/JPEG, possibly with ComfyUI workflow metadata) into the full-size WebP
// published to R2. Only this WebP is stored; thumbnails, article images, and OGP images are produced by
// Cloudflare Image Transformations presets.
//
// sharp is pinned to an exact version in package.json: object keys are content hashes, so the same
// original must always encode to the same bytes.

import sharp from "sharp";

export const WEBP_QUALITY = 90;
// WebP cannot encode images larger than 16383 px on either side.
const WEBP_MAX_DIMENSION = 16383;
// Metadata keys that must never survive into a public file.
const FORBIDDEN_MARKERS = ["workflow", "prompt", "parameters", "Exif", "http://ns.adobe.com/xap/1.0/"];

export class MediaImageError extends Error {}

/**
 * @param {Buffer} input Original PNG or JPEG bytes.
 * @returns {Promise<{ data: Buffer, width: number, height: number, type: "image/webp" }>}
 */
export async function encodeFullWebp(input) {
  let meta;
  try {
    meta = await sharp(input).metadata();
  } catch (error) {
    throw new MediaImageError(`画像を読み込めません（${error.message}）`);
  }
  if (!["png", "jpeg"].includes(meta.format)) {
    throw new MediaImageError(`PNG / JPEG 以外の画像です（${meta.format}）`);
  }
  if ((meta.pages || 1) > 1) {
    throw new MediaImageError("アニメーション画像は対象外です");
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

async function verifyPublicWebp(data, width, height) {
  const meta = await sharp(data).metadata();
  if (meta.format !== "webp" || meta.width !== width || meta.height !== height) {
    throw new MediaImageError("WebP の出力検証に失敗しました（形式またはサイズが一致しません）");
  }
  if (meta.exif || meta.xmp || meta.icc || meta.iptc) {
    throw new MediaImageError("WebP の出力に metadata が残っています");
  }
  const text = data.toString("latin1");
  const marker = FORBIDDEN_MARKERS.find((value) => text.includes(value));
  if (marker) {
    throw new MediaImageError(`WebP の出力に "${marker}" が含まれています`);
  }
}
