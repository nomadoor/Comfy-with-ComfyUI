import zlib from "node:zlib";
import { pathToFileURL } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { test, expect } from "./support/test";

// Full-size WebP encoding used by `npm run media:sync`: the only file published to R2 per image.

async function loadEncoder() {
  return import(pathToFileURL(path.resolve("scripts", "lib", "media-image.mjs")).href);
}

function pngChunk(type: string, data: Buffer) {
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

test.describe("media image encoding", () => {
  test("ComfyUI PNG becomes a metadata-free WebP with the same size and pixels", async () => {
    const { encodeFullWebp } = await loadEncoder();
    const input = await comfyPng();
    expect(input.toString("latin1")).toContain("workflow");

    const result = await encodeFullWebp(input);
    expect(result.type).toBe("image/webp");
    expect([result.width, result.height]).toEqual([400, 160]);

    const meta = await sharp(result.data).metadata();
    expect(meta.format).toBe("webp");
    expect(meta.exif).toBeUndefined();
    expect(meta.icc).toBeUndefined();
    const text = result.data.toString("latin1");
    for (const needle of ["workflow", "prompt", "secret", "private"]) expect(text).not.toContain(needle);

    // Lossy q90 keeps the image visually the same; only hard color edges shift slightly
    // (4:2:0 chroma subsampling), so compare the mean per-channel difference.
    const [a, b] = await Promise.all([
      sharp(input).removeAlpha().raw().toBuffer(),
      sharp(result.data).removeAlpha().raw().toBuffer()
    ]);
    expect(b.length).toBe(a.length);
    let totalDiff = 0;
    for (let i = 0; i < a.length; i++) totalDiff += Math.abs(a[i] - b[i]);
    expect(totalDiff / a.length).toBeLessThan(2);
  });

  test("output verification inspects WebP chunks instead of scanning bytes", async () => {
    const { encodeFullWebp, listWebpChunks, verifyPublicWebp } = await loadEncoder();
    const clean = await encodeFullWebp(await comfyPng());
    expect(listWebpChunks(clean.data).every((id: string) => ["VP8 ", "VP8L", "VP8X", "ALPH"].includes(id))).toBe(true);

    // A WebP that carries EXIF/ICC chunks is rejected.
    const withMetadata = await sharp(await comfyPng()).withMetadata({ exif: { IFD0: { Copyright: "x" } } }).webp().toBuffer();
    expect(listWebpChunks(withMetadata)).toContain("EXIF");
    await expect(verifyPublicWebp(withMetadata, 400, 160)).rejects.toThrow(/チャンク/);

    // Marker-like bytes inside image data do not cause a false positive: only chunk IDs matter.
    expect(await verifyPublicWebp(clean.data, 400, 160)).toBeUndefined();
  });

  test("encoding is deterministic, so content-hash keys are stable", async () => {
    const { encodeFullWebp } = await loadEncoder();
    const input = await comfyPng();
    const [first, second] = await Promise.all([encodeFullWebp(input), encodeFullWebp(input)]);
    expect(first.data.equals(second.data)).toBe(true);
  });

  test("JPEG EXIF orientation is applied to pixels", async () => {
    const { encodeFullWebp } = await loadEncoder();
    const rotated = await sharp({ create: { width: 300, height: 100, channels: 3, background: "#888" } })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer();
    const result = await encodeFullWebp(rotated);
    expect([result.width, result.height]).toEqual([100, 300]);
    expect((await sharp(result.data).metadata()).exif).toBeUndefined();
  });

  test("non PNG/JPEG/WebP input is rejected", async () => {
    const { encodeFullWebp } = await loadEncoder();
    const tiff = await sharp({ create: { width: 10, height: 10, channels: 3, background: "#000" } }).tiff().toBuffer();
    await expect(encodeFullWebp(tiff)).rejects.toThrow(/PNG \/ JPEG \/ WebP/);
    await expect(encodeFullWebp(Buffer.from("not an image"))).rejects.toThrow(/読み込めません/);
  });

  test("a WebP original is published without re-encoding, minus its metadata chunks", async () => {
    const { encodeFullWebp, listWebpChunks } = await loadEncoder();
    const source = await sharp(await comfyPng(), { animated: false })
      .withIccProfile("srgb")
      .withExif({ IFD0: { Copyright: "private" } })
      .webp({ quality: 80 })
      .toBuffer();
    expect(listWebpChunks(source)).toEqual(expect.arrayContaining(["ICCP", "EXIF"]));

    const result = await encodeFullWebp(source);
    expect([result.width, result.height]).toEqual([400, 160]);
    expect(listWebpChunks(result.data).every((id: string) => ["VP8 ", "VP8L", "VP8X", "ALPH"].includes(id))).toBe(true);
    expect(result.data.toString("latin1")).not.toContain("private");
    const meta = await sharp(result.data).metadata();
    expect(meta.icc).toBeUndefined();
    expect(meta.exif).toBeUndefined();

    // The compressed image data is the original's, byte for byte: no second lossy pass.
    const imageData = (webp: Buffer) => {
      const at = webp.indexOf("VP8 ", 12, "latin1");
      return webp.subarray(at, at + 8 + webp.readUInt32LE(at + 4));
    };
    expect(imageData(result.data).equals(imageData(source))).toBe(true);
    expect(result.data.length).toBeLessThan(source.length);

    // A clean WebP comes out unchanged.
    const clean = await sharp(await comfyPng()).webp({ quality: 80 }).toBuffer();
    expect((await encodeFullWebp(clean)).data.equals(clean)).toBe(true);
  });

  test("a WebP whose metadata changes how it looks goes through the normal encode", async () => {
    const { encodeFullWebp, iccDescription } = await loadEncoder();

    // Display P3: the colors are converted to sRGB instead of losing their profile.
    const p3 = await sharp(await comfyPng()).withIccProfile("p3").webp({ quality: 80 }).toBuffer();
    expect(iccDescription((await sharp(p3).metadata()).icc)).not.toMatch(/srgb/i);
    const fromP3 = await encodeFullWebp(p3);
    expect((await sharp(fromP3.data).metadata()).icc).toBeUndefined();
    expect(fromP3.data.equals(p3)).toBe(false);

    // EXIF orientation 6 (rotate 90°): the pixels are rotated, so width and height swap.
    const turned = await sharp({ create: { width: 300, height: 100, channels: 3, background: "#2a6ec8" } })
      .withMetadata({ orientation: 6 })
      .webp()
      .toBuffer();
    expect((await sharp(turned).metadata()).orientation).toBe(6);
    const upright = await encodeFullWebp(turned);
    expect([upright.width, upright.height]).toEqual([100, 300]);
  });

  test("an animated WebP is rejected", async () => {
    const { encodeFullWebp } = await loadEncoder();
    // Two frames in an ANIM/ANMF container, assembled from single-frame WebPs (sharp cannot write
    // animation from scratch here).
    const frame = async (background: string) => {
      const webp = await sharp({ create: { width: 10, height: 10, channels: 3, background } }).webp().toBuffer();
      return webp.subarray(12); // the VP8 chunk
    };
    const chunk = (id: string, data: Buffer) => {
      const header = Buffer.alloc(8);
      header.write(id, 0, "latin1");
      header.writeUInt32LE(data.length, 4);
      return Buffer.concat([header, data, Buffer.alloc(data.length % 2)]);
    };
    const u24 = (n: number) => Buffer.from([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff]);
    const vp8x = Buffer.concat([Buffer.from([0x02, 0, 0, 0]), u24(9), u24(9)]);
    const anim = Buffer.from([0, 0, 0, 0, 0, 0]);
    const anmf = (vp8: Buffer) => chunk("ANMF", Buffer.concat([u24(0), u24(0), u24(9), u24(9), u24(100), Buffer.from([0]), vp8]));
    const body = Buffer.concat([chunk("VP8X", vp8x), chunk("ANIM", anim), anmf(await frame("#000")), anmf(await frame("#fff"))]);
    const header = Buffer.alloc(12);
    header.write("RIFF", 0, "latin1");
    header.writeUInt32LE(4 + body.length, 4);
    header.write("WEBP", 8, "latin1");
    const animated = Buffer.concat([header, body]);
    expect((await sharp(animated, { animated: true }).metadata()).pages).toBe(2);

    await expect(encodeFullWebp(animated)).rejects.toThrow(/アニメーション/);
  });
});
