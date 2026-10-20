import test from "node:test";
import assert from "node:assert/strict";
import { inputFileName, inputMediaName } from "./profiles.mjs";

test("inputFileName reads list widgets and VideoHelperSuite's object widgets, and skips bypassed nodes", () => {
  assert.equal(inputFileName({ type: "LoadImage", widgets_values: ["a.webp", "image"] }), "a.webp");
  assert.equal(inputFileName({ type: "LoadImage", widgets_values: ["a.webp [input]", "image"] }), "a.webp");
  assert.equal(inputFileName({ type: "VHS_LoadVideo", widgets_values: { video: "clip.mp4", force_rate: 16 } }), "clip.mp4");
  assert.equal(inputFileName({ type: "VHS_LoadVideo", mode: 4, widgets_values: { video: "clip.mp4" } }), null);
  assert.equal(inputFileName({ type: "KSampler", widgets_values: [1, "fixed"] }), null);
});

test("inputMediaName looks for an image original behind .webp and a video original behind .mp4", () => {
  const manifest = { "a/b/photo.jpg": { type: "image/webp" }, "a/b/clip.mp4": { type: "video/mp4" } };
  assert.equal(inputMediaName("a/b", "photo.webp", manifest, ""), "a/b/photo.jpg");
  assert.equal(inputMediaName("a/b", "clip.mp4", manifest, ""), "a/b/clip.mp4");
  // Not registered yet: the default original for each kind.
  assert.equal(inputMediaName("a/b", "new.webp", {}, ""), "a/b/new.png");
  assert.equal(inputMediaName("a/b", "new.mp4", {}, ""), "a/b/new.mp4");
});
