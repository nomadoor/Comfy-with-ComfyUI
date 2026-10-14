import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { listFiles, parseFrontmatter, splitFrontmatter } from "./files.mjs";

test("parseFrontmatter reads LF and CRLF, and returns {} without frontmatter", () => {
  for (const eol of ["\n", "\r\n"]) {
    assert.deepEqual(parseFrontmatter(["---", "slug: a", "created: 2026-01-02", "---", "body"].join(eol)), {
      slug: "a",
      created: "2026-01-02"
    });
  }
  assert.deepEqual(parseFrontmatter("no frontmatter"), {});
  assert.deepEqual(parseFrontmatter("---\n---\nempty"), {});
});

test("splitFrontmatter returns the body after the frontmatter, LF or CRLF", () => {
  for (const eol of ["\n", "\r\n"]) {
    const { data, body } = splitFrontmatter(["---", "title: Panorama", "---", "", "Body"].join(eol));
    assert.deepEqual(data, { title: "Panorama" });
    assert.equal(body.trim(), "Body");
  }
  assert.deepEqual(splitFrontmatter("plain"), { data: {}, body: "plain" });
});

test("listFiles filters by extension, skips build and dependency folders, and accepts a file", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "files-test-"));
  try {
    fs.mkdirSync(path.join(root, "a", "node_modules"), { recursive: true });
    fs.writeFileSync(path.join(root, "a", "page.md"), "");
    fs.writeFileSync(path.join(root, "a", "page.njk"), "");
    fs.writeFileSync(path.join(root, "a", "image.png"), "");
    fs.writeFileSync(path.join(root, "a", "node_modules", "dep.md"), "");
    const names = (files) => files.map((file) => path.relative(root, file)).sort();
    assert.deepEqual(names(listFiles(root, { extensions: [".md", ".njk"] })), [path.join("a", "page.md"), path.join("a", "page.njk")]);
    assert.equal(listFiles(root).length, 3);
    assert.deepEqual(names(listFiles(path.join(root, "a", "page.md"))), [path.join("a", "page.md")]);
    assert.deepEqual(listFiles(path.join(root, "missing")), []);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
