import assert from "node:assert/strict";
import { test } from "node:test";
import { stripCode } from "./markdown-code.mjs";

test("stripCode drops fenced blocks, including indented and tilde fences", () => {
  const text = [
    "[real](/ja/a/)",
    "```md",
    "[example](/ja/missing/)",
    "```",
    "- item",
    "  ~~~",
    "  [example](/ja/missing-too/)",
    "  ~~~",
    "[after](/ja/b/)"
  ].join("\n");
  const out = stripCode(text);
  assert.match(out, /\/ja\/a\//);
  assert.match(out, /\/ja\/b\//);
  assert.doesNotMatch(out, /missing/);
  assert.equal(out.split("\n").length, 9);
});

test("stripCode recognizes a fence opened on a list item line", () => {
  const out = stripCode(["- ```", "  [x](/ja/in-code/)", "  ```", "[](/workflows/after.json)", "1. ~~~", "   [y](/ja/in-code-2/)", "   ~~~", "[z](/ja/z/)"].join("\n"));
  assert.doesNotMatch(out, /in-code/);
  assert.match(out, /after\.json/);
  assert.match(out, /\/ja\/z\//);
});

test("stripCode keeps a longer closing fence open until it matches, and blanks inline code", () => {
  const out = stripCode(["````", "```", "[x](/ja/in-code/)", "````", "see `[y](/ja/inline/)` and [z](/ja/z/)"].join("\n"));
  assert.doesNotMatch(out, /in-code|inline/);
  assert.match(out, /\/ja\/z\//);
});
