import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { pathToFileURL } from "node:url";
import { test, expect } from "@playwright/test";

// Metadata removal used by `npm run media:put`. Browser decoding confirms the stripped files are
// still valid and render the same pixels as the originals.

const FIXTURE_PNG = fs.readFileSync(path.resolve("tests", "fixtures", "media", "r2_image.png"));

async function loadStripper() {
  return import(pathToFileURL(path.resolve("scripts", "lib", "media-metadata.mjs")).href);
}

function pngChunk(type: string, data: Buffer) {
  const typeAndData = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function tiffWithOrientation(orientation: number) {
  const tiff = Buffer.alloc(26);
  tiff.write("MM", 0, "latin1");
  tiff.writeUInt16BE(42, 2);
  tiff.writeUInt32BE(8, 4);
  tiff.writeUInt16BE(1, 8);
  tiff.writeUInt16BE(0x0112, 10);
  tiff.writeUInt16BE(3, 12);
  tiff.writeUInt32BE(1, 14);
  tiff.writeUInt16BE(orientation, 18);
  return tiff;
}

// Insert chunks right after IHDR (8-byte signature + 25-byte IHDR chunk).
function pngWith(chunks: Buffer[]) {
  return Buffer.concat([FIXTURE_PNG.subarray(0, 33), ...chunks, FIXTURE_PNG.subarray(33)]);
}

function jpegSegment(marker: number, payload: Buffer) {
  const header = Buffer.from([0xff, marker, 0, 0]);
  header.writeUInt16BE(payload.length + 2, 2);
  return Buffer.concat([header, payload]);
}

const COMFY_TEXT = [
  pngChunk("tEXt", Buffer.from('prompt\0{"3":{"inputs":{"ckpt_name":"C:/Users/me/secret.safetensors"}}}', "latin1")),
  pngChunk("iTXt", Buffer.from('workflow\0\0\0\0\0{"nodes":[]}', "latin1")),
  pngChunk("tIME", Buffer.from([0x07, 0xea, 9, 17, 12, 0, 0]))
];

async function decode(page, data: Buffer, mime: string) {
  return page.evaluate(
    async ({ src }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let hash = 0;
      for (let i = 0; i < pixels.length; i++) hash = (hash * 31 + pixels[i]) | 0;
      return { width: img.naturalWidth, height: img.naturalHeight, hash };
    },
    { src: `data:${mime};base64,${data.toString("base64")}` }
  );
}

test.describe("media metadata removal", () => {
  test("PNG: ComfyUI text chunks are removed, colour chunks and pixels are kept", async ({ page }) => {
    const { stripImageMetadata } = await loadStripper();
    const input = pngWith([pngChunk("gAMA", Buffer.from([0, 0, 0xb1, 0x8f])), ...COMFY_TEXT, pngChunk("eXIf", tiffWithOrientation(1))]);
    const result = stripImageMetadata(input, ".png");

    expect(result.removed).toEqual(["tEXt", "iTXt", "tIME", "eXIf"]);
    const text = result.data.toString("latin1");
    for (const needle of ["prompt", "workflow", "secret", "tIME", "eXIf"]) expect(text).not.toContain(needle);
    expect(text).toContain("gAMA");
    expect([result.width, result.height]).toEqual([320, 180]);
    expect(await decode(page, result.data, "image/png")).toEqual(await decode(page, input, "image/png"));
  });

  test("PNG: non-default EXIF orientation is rejected", async () => {
    const { stripImageMetadata } = await loadStripper();
    const input = pngWith([pngChunk("eXIf", tiffWithOrientation(6))]);
    expect(() => stripImageMetadata(input, ".png")).toThrow(/Orientation=6/);
  });

  test("JPEG: EXIF, XMP and comments are removed, ICC profile and pixels are kept", async ({ page }) => {
    const { stripImageMetadata } = await loadStripper();
    const base64 = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 40;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#2a6ec8";
      ctx.fillRect(0, 0, 64, 40);
      ctx.fillStyle = "#f0c020";
      ctx.fillRect(10, 10, 30, 12);
      return canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
    });
    const jpeg = Buffer.from(base64, "base64");
    const input = Buffer.concat([
      jpeg.subarray(0, 2),
      jpegSegment(0xe1, Buffer.concat([Buffer.from("Exif\0\0", "latin1"), tiffWithOrientation(1), Buffer.from("GPS-SECRET", "latin1")])),
      jpegSegment(0xe1, Buffer.from('http://ns.adobe.com/xap/1.0/\0<x:xmpmeta>workflow</x:xmpmeta>', "latin1")),
      jpegSegment(0xe2, Buffer.from("ICC_PROFILE\0\x01\x01fake-profile", "latin1")),
      jpegSegment(0xfe, Buffer.from("prompt comment", "latin1")),
      jpeg.subarray(2)
    ]);
    const result = stripImageMetadata(input, ".jpg");

    expect(result.removed).toEqual(["EXIF", "XMP", "COM"]);
    const text = result.data.toString("latin1");
    for (const needle of ["GPS-SECRET", "workflow", "prompt", "Exif"]) expect(text).not.toContain(needle);
    expect(text).toContain("ICC_PROFILE");
    expect([result.width, result.height]).toEqual([64, 40]);
    const plain = await decode(page, jpeg, "image/jpeg");
    expect(await decode(page, result.data, "image/jpeg")).toEqual(plain);
  });

  test("JPEG: orientation, Ultra HDR, and trailing data are rejected", async ({ page }) => {
    const { stripImageMetadata } = await loadStripper();
    const base64 = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 8;
      canvas.height = 8;
      return canvas.toDataURL("image/jpeg").split(",")[1];
    });
    const jpeg = Buffer.from(base64, "base64");
    const withSegment = (segment: Buffer) => Buffer.concat([jpeg.subarray(0, 2), segment, jpeg.subarray(2)]);

    expect(() =>
      stripImageMetadata(withSegment(jpegSegment(0xe1, Buffer.concat([Buffer.from("Exif\0\0", "latin1"), tiffWithOrientation(3)]))), ".jpg")
    ).toThrow(/Orientation=3/);
    expect(() => stripImageMetadata(withSegment(jpegSegment(0xe2, Buffer.from("MPF\0IIxx", "latin1"))), ".jpg")).toThrow(/MPF/);
    expect(() =>
      stripImageMetadata(withSegment(jpegSegment(0xe1, Buffer.from('http://ns.adobe.com/xap/1.0/\0<rdf hdrgm:Version="1.0"/>', "latin1"))), ".jpg")
    ).toThrow(/Ultra HDR/);
    expect(() => stripImageMetadata(Buffer.concat([jpeg, Buffer.from("gainmap")]), ".jpg")).toThrow(/EOI/);
  });

  test("unsupported formats are rejected", async () => {
    const { stripImageMetadata } = await loadStripper();
    expect(() => stripImageMetadata(Buffer.from("x"), ".webp")).toThrow(/未対応/);
  });
});
