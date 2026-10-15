import assert from "node:assert/strict";
import { describe, test } from "node:test";
import zlib from "node:zlib";
import sharp from "sharp";
import { encodeFullWebp, iccDescription, listWebpChunks, verifyPublicWebp } from "./media-image.mjs";

// Full-size WebP encoding used by `npm run media:sync`: the only file published to R2 per image.

const IMAGE_CHUNKS = ["VP8 ", "VP8L", "VP8X", "ALPH"];

function pngChunk(type, data) {
  const typeAndData = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

// A PNG like a ComfyUI export: pixels plus workflow/prompt text chunks right after IHDR.
async function comfyPng(width = 400, height = 160) {
  const png = await sharp({ create: { width, height, channels: 3, background: "#2a6ec8" } })
    .composite([{ input: { create: { width: 120, height: 60, channels: 3, background: "#f0c020" } }, left: 30, top: 40 }])
    .png()
    .toBuffer();
  const chunks = [
    pngChunk("tEXt", Buffer.from('workflow\0{"nodes":[{"type":"LoadImage","widgets_values":["C:/Users/me/secret.png"]}]}', "latin1")),
    pngChunk("tEXt", Buffer.from('prompt\0{"3":{"inputs":{"text":"private prompt"}}}', "latin1"))
  ];
  return Buffer.concat([png.subarray(0, 33), ...chunks, png.subarray(33)]);
}

describe("media image encoding", () => {
  test("ComfyUI PNG becomes a metadata-free WebP with the same size and pixels", async () => {
    const input = await comfyPng();
    assert.ok(input.toString("latin1").includes("workflow"));
    const result = await encodeFullWebp(input);
    assert.equal(result.type, "image/webp");
    assert.deepEqual([result.width, result.height], [400, 160]);

    const meta = await sharp(result.data).metadata();
    assert.equal(meta.format, "webp");
    assert.equal(meta.exif, undefined);
    assert.equal(meta.icc, undefined);
    const text = result.data.toString("latin1");
    for (const needle of ["workflow", "prompt", "secret", "private"]) assert.ok(!text.includes(needle), needle);

    // Lossy q90 keeps the image visually the same; only hard color edges shift slightly
    // (4:2:0 chroma subsampling), so compare the mean per-channel difference.
    const [a, b] = await Promise.all([
      sharp(input).removeAlpha().raw().toBuffer(),
      sharp(result.data).removeAlpha().raw().toBuffer()
    ]);
    assert.equal(b.length, a.length);
    let totalDiff = 0;
    for (let i = 0; i < a.length; i++) totalDiff += Math.abs(a[i] - b[i]);
    assert.ok(totalDiff / a.length < 2);
  });

  test("output verification inspects WebP chunks instead of scanning bytes", async () => {
    const clean = await encodeFullWebp(await comfyPng());
    assert.ok(listWebpChunks(clean.data).every((id) => IMAGE_CHUNKS.includes(id)));

    // A WebP that carries EXIF/ICC chunks is rejected.
    const withMetadata = await sharp(await comfyPng()).withMetadata({ exif: { IFD0: { Copyright: "x" } } }).webp().toBuffer();
    assert.ok(listWebpChunks(withMetadata).includes("EXIF"));
    await assert.rejects(verifyPublicWebp(withMetadata, 400, 160), /チャンク/);

    // Marker-like bytes inside image data do not cause a false positive: only chunk IDs matter.
    assert.equal(await verifyPublicWebp(clean.data, 400, 160), undefined);
  });

  test("encoding is deterministic, so content-hash keys are stable", async () => {
    const input = await comfyPng();
    const [first, second] = await Promise.all([encodeFullWebp(input), encodeFullWebp(input)]);
    assert.ok(first.data.equals(second.data));
  });

  test("JPEG EXIF orientation is applied to pixels", async () => {
    const rotated = await sharp({ create: { width: 300, height: 100, channels: 3, background: "#888" } })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer();
    const result = await encodeFullWebp(rotated);
    assert.deepEqual([result.width, result.height], [100, 300]);
    assert.equal((await sharp(result.data).metadata()).exif, undefined);
  });

  test("non PNG/JPEG/WebP input is rejected", async () => {
    const tiff = await sharp({ create: { width: 10, height: 10, channels: 3, background: "#000" } }).tiff().toBuffer();
    await assert.rejects(encodeFullWebp(tiff), /PNG \/ JPEG \/ WebP/);
    await assert.rejects(encodeFullWebp(Buffer.from("not an image")), /読み込めません/);
  });

  test("a WebP original is published without re-encoding, minus its metadata chunks", async () => {
    const source = await sharp(await comfyPng(), { animated: false })
      .withIccProfile("srgb")
      .withExif({ IFD0: { Copyright: "private" } })
      .webp({ quality: 80 })
      .toBuffer();
    const sourceChunks = listWebpChunks(source);
    assert.ok(sourceChunks.includes("ICCP") && sourceChunks.includes("EXIF"));

    const result = await encodeFullWebp(source);
    assert.deepEqual([result.width, result.height], [400, 160]);
    assert.ok(listWebpChunks(result.data).every((id) => IMAGE_CHUNKS.includes(id)));
    assert.ok(!result.data.toString("latin1").includes("private"));
    const meta = await sharp(result.data).metadata();
    assert.equal(meta.icc, undefined);
    assert.equal(meta.exif, undefined);

    // The compressed image data is the original's, byte for byte: no second lossy pass.
    const imageData = (webp) => {
      const at = webp.indexOf("VP8 ", 12, "latin1");
      return webp.subarray(at, at + 8 + webp.readUInt32LE(at + 4));
    };
    assert.ok(imageData(result.data).equals(imageData(source)));
    assert.ok(result.data.length < source.length);

    // A clean WebP comes out unchanged.
    const clean = await sharp(await comfyPng()).webp({ quality: 80 }).toBuffer();
    assert.ok((await encodeFullWebp(clean)).data.equals(clean));
  });

  test("a WebP whose metadata changes how it looks goes through the normal encode", async () => {
    // Display P3: the colors are converted to sRGB instead of losing their profile.
    const p3 = await sharp(await comfyPng()).withIccProfile("p3").webp({ quality: 80 }).toBuffer();
    assert.doesNotMatch(iccDescription((await sharp(p3).metadata()).icc), /srgb/i);
    const fromP3 = await encodeFullWebp(p3);
    assert.equal((await sharp(fromP3.data).metadata()).icc, undefined);
    assert.ok(!fromP3.data.equals(p3));

    // EXIF orientation 6 (rotate 90°): the pixels are rotated, so width and height swap.
    const turned = await sharp({ create: { width: 300, height: 100, channels: 3, background: "#2a6ec8" } })
      .withMetadata({ orientation: 6 })
      .webp()
      .toBuffer();
    assert.equal((await sharp(turned).metadata()).orientation, 6);
    const upright = await encodeFullWebp(turned);
    assert.deepEqual([upright.width, upright.height], [100, 300]);
  });

  test("an animated WebP is rejected", async () => {
    // Two frames in an ANIM/ANMF container, assembled from single-frame WebPs (sharp cannot write
    // animation from scratch here).
    const frame = async (background) => {
      const webp = await sharp({ create: { width: 10, height: 10, channels: 3, background } }).webp().toBuffer();
      return webp.subarray(12); // the VP8 chunk
    };
    const chunk = (id, data) => {
      const header = Buffer.alloc(8);
      header.write(id, 0, "latin1");
      header.writeUInt32LE(data.length, 4);
      return Buffer.concat([header, data, Buffer.alloc(data.length % 2)]);
    };
    const u24 = (n) => Buffer.from([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff]);
    const vp8x = Buffer.concat([Buffer.from([0x02, 0, 0, 0]), u24(9), u24(9)]);
    const anim = Buffer.from([0, 0, 0, 0, 0, 0]);
    const anmf = (vp8) => chunk("ANMF", Buffer.concat([u24(0), u24(0), u24(9), u24(9), u24(100), Buffer.from([0]), vp8]));
    const body = Buffer.concat([chunk("VP8X", vp8x), chunk("ANIM", anim), anmf(await frame("#000")), anmf(await frame("#fff"))]);
    const header = Buffer.alloc(12);
    header.write("RIFF", 0, "latin1");
    header.writeUInt32LE(4 + body.length, 4);
    header.write("WEBP", 8, "latin1");
    const animated = Buffer.concat([header, body]);
    assert.equal((await sharp(animated, { animated: true }).metadata()).pages, 2);

    await assert.rejects(encodeFullWebp(animated), /アニメーション/);
  });
});
