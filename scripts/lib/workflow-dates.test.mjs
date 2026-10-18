import test from "node:test";
import assert from "node:assert/strict";
import { apply, buildChanged, parseNameStatus } from "./workflow-dates.mjs";

const workflow = (properties, extra = {}) =>
  JSON.stringify({ nodes: [{ id: 1, type: "UNETLoader", widgets_values: ["a.safetensors"], properties }], ...extra });

test("buildChanged ignores node metadata, in subgraphs too, but not the build", () => {
  const bare = workflow({ "Node name for S&R": "UNETLoader" });
  const filled = workflow({ "Node name for S&R": "UNETLoader", cnr_id: "comfy-core", ver: "0.3.1", models: [{ name: "a.safetensors" }] });
  assert.equal(buildChanged(bare, filled), false);
  assert.equal(buildChanged(bare, bare.replace("a.safetensors", "b.safetensors")), true);
  assert.equal(buildChanged(null, bare), true);
  const node = (extra) => JSON.stringify({ nodes: [{ id: 1, type: "VAELoader", ...extra }] });
  assert.equal(buildChanged(node({}), node({ properties: { cnr_id: "comfy-core" } })), false);
  assert.equal(buildChanged("null", "null"), false);

  const sub = (properties) => JSON.stringify({ nodes: [], definitions: { subgraphs: [{ id: "s", nodes: [{ id: 2, properties }] }] } });
  assert.equal(buildChanged(sub({}), sub({ aux_id: "owner/repo" })), false);
  assert.equal(buildChanged(sub({}), sub({ title: "x" })), true);
});

test("apply dates new and rebuilt workflows, keeps the date over metadata-only edits and pure renames", () => {
  const files = {
    "old:src/workflows/a/x.json": workflow({}),
    "new:src/workflows/b/x.json": workflow({}),
    "old:src/workflows/a/y.json": workflow({}),
    "new:src/workflows/a/y.json": workflow({ cnr_id: "comfy-core" }),
    "old:src/workflows/a/z.json": workflow({}),
    "new:src/workflows/a/z.json": workflow({}, { links: [[1]] }),
    "new:src/workflows/a/n.json": workflow({}),
  };
  const dates = { "a/x.json": "2025-01-01", "a/y.json": "2025-01-02", "a/z.json": "2025-01-03", "a/gone.json": "2025-01-04" };
  const fields = [
    "R100", "src/workflows/a/x.json", "src/workflows/b/x.json",
    "M", "src/workflows/a/y.json",
    "M", "src/workflows/a/z.json",
    "A", "src/workflows/a/n.json",
    "D", "src/workflows/a/gone.json",
    "M", "src/content/ja/page.md",
    "",
  ];
  apply(dates, parseNameStatus(fields), "2026-10-18", (p) => files[`old:${p}`] ?? null, (p) => files[`new:${p}`]);
  assert.deepEqual(dates, { "b/x.json": "2025-01-01", "a/y.json": "2025-01-02", "a/z.json": "2026-10-18", "a/n.json": "2026-10-18" });
});
