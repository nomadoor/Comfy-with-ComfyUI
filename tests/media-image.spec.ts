import zlib from "node:zlib";
import { pathToFileURL } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { test, expect } from "./support/test";

// Full-size WebP encoding used by `npm run media:put`: the only file published to R2 per image.

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

  test("non PNG/JPEG input is rejected", async () => {
    const { encodeFullWebp } = await loadEncoder();
    const webp = await sharp({ create: { width: 10, height: 10, channels: 3, background: "#000" } }).webp().toBuffer();
    await expect(encodeFullWebp(webp)).rejects.toThrow(/PNG \/ JPEG/);
    await expect(encodeFullWebp(Buffer.from("not an image"))).rejects.toThrow(/読み込めません/);
  });
});
