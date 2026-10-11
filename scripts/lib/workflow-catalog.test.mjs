import assert from "node:assert/strict";
import { test } from "node:test";
import { noteModels, parsePerformance, scanArticle, workflowFacts } from "./workflow-catalog.mjs";

test("scanArticle finds shortcode, picker and plain links under their nearest heading", () => {
  const body = [
    "## text2image",
    '{% workflow "/workflows/a/t2i.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="121s", tags=["4MP"], samplers=[{ speed: "3.45 s/it" }] %}',
    "### `Turbo` *edit* of `add_noise`",
    "[](/workflows/a/turbo.json)",
    "{% workflowPicker",
    '  "!/workflows/a/v2.json",',
    '  "/workflows/a/v1.json"',
    "%}",
  ].join("\n");
  const found = scanArticle(body);
  assert.deepEqual([...found.keys()], ["/workflows/a/t2i.json", "/workflows/a/turbo.json", "/workflows/a/v2.json", "/workflows/a/v1.json"]);
  assert.equal(found.get("/workflows/a/t2i.json").heading, "text2image");
  assert.equal(found.get("/workflows/a/turbo.json").heading, "Turbo edit of add_noise");
  assert.equal(found.get("/workflows/a/t2i.json").performance.time, "121s");
  assert.equal(found.get("/workflows/a/turbo.json").performance, null);
});

test("scanArticle ignores fenced code and other sites' /workflows/ paths", () => {
  const body = [
    "## Real",
    "```text",
    "## models",
    "[](/workflows/a/example.json)",
    "```",
    "See https://github.com/someone/repo/blob/main/workflows/x.json",
    "[](/workflows/a/real.json)",
  ].join("\n");
  const found = scanArticle(body);
  assert.deepEqual([...found.keys()], ["/workflows/a/real.json"]);
  assert.equal(found.get("/workflows/a/real.json").heading, "Real");
});

test("scanArticle handles fences opened inside list items and relative workflow links", () => {
  const body = [
    "## Tree",
    "- ```text",
    "  ## not a heading",
    "  ````",
    "",
    "## After",
    "[](/workflows/a/after.json)",
    "[](../../../workflows/a/relative.json)",
  ].join("\n");
  const found = scanArticle(body);
  assert.deepEqual([...found.keys()], ["/workflows/a/after.json", "/workflows/a/relative.json"]);
  assert.equal(found.get("/workflows/a/after.json").heading, "After");
});

test("parsePerformance reads every field the shortcode takes", () => {
  assert.deepEqual(
    parsePerformance(', level=1, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="68s", tags=["4MP", "8 steps"], samplers=[{ speed: "2.88 s/it" }, { name: "2nd", speed: "1.2 s/it" }] '),
    { level: 1, gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "68s", tags: ["4MP", "8 steps"], sampler_speeds: ["2.88 s/it", "1.2 s/it"] }
  );
  assert.equal(parsePerformance(""), null);
});

const note = (text, type = "MarkdownNote") => ({ type, widgets_values: [text] });

test("noteModels reads foldered and flat model lists, stops at the next section, and drops repeats", () => {
  const foldered = [
    "## models",
    "- diffusion_models",
    "  - [m.safetensors](https://huggingface.co/x/blob/main/m.safetensors) (7.26 GB)",
    "- vae",
    "  - [v.safetensors](https://huggingface.co/x/blob/main/v.safetensors)",
    "",
    "## guide",
    "- [日本語](https://comfyui.nomadoor.net/ja/)",
  ].join("\n");
  const flat = "## models\n- [old.safetensors](https://huggingface.co/y/blob/main/old.safetensors)";
  assert.deepEqual(noteModels({ nodes: [note(foldered), note(foldered), note(flat, "Note")] }), [
    { name: "m.safetensors", directory: "diffusion_models", url: "https://huggingface.co/x/blob/main/m.safetensors", size: "7.26 GB" },
    { name: "v.safetensors", directory: "vae", url: "https://huggingface.co/x/blob/main/v.safetensors", size: null },
    { name: "old.safetensors", directory: null, url: "https://huggingface.co/y/blob/main/old.safetensors", size: null },
  ]);
});

test("workflowFacts prefers loader metadata, then the note, then bare file names", () => {
  const loader = {
    type: "UNETLoader",
    widgets_values: ["sub\\m.safetensors", "default"],
    properties: { cnr_id: "comfy-core", models: [{ name: "m.safetensors", directory: "diffusion_models", url: "https://huggingface.co/x/resolve/main/m.safetensors" }] },
  };
  const facts = workflowFacts({ nodes: [loader, note("## models\n- [n.safetensors](https://huggingface.co/n)")] });
  assert.equal(facts.models_source, "loaders");
  assert.deepEqual(facts.models.map((m) => m.name), ["m.safetensors"]);

  const fromNote = workflowFacts({ nodes: [{ type: "VAELoader", widgets_values: ["v.safetensors"] }, note("## models\n- [n.safetensors](https://huggingface.co/n)")] });
  assert.equal(fromNote.models_source, "note");
  assert.deepEqual(fromNote.models.map((m) => [m.name, m.url]), [["n.safetensors", "https://huggingface.co/n"], ["v.safetensors", null]]);

  const namesOnly = workflowFacts({ nodes: [{ type: "CheckpointLoaderSimple", widgets_values: ["SV3D\\sv3d_p.safetensors"] }] });
  assert.equal(namesOnly.models_source, "names_only");
  assert.deepEqual(namesOnly.models, [{ name: "sv3d_p.safetensors", directory: null, url: null }]);

  assert.equal(workflowFacts({ nodes: [{ type: "LoadImage", widgets_values: ["in.png", "image"] }] }).models_source, "none");
});

test("workflowFacts lists custom nodes, reads object widgets, and skips bypassed nodes", () => {
  const facts = workflowFacts({
    nodes: [
      { type: "VHS_LoadVideo", widgets_values: { video: "in.mp4" }, properties: { cnr_id: "comfyui-videohelpersuite" } },
      { type: "MinimaxH3LatentUpscaler3D", widgets_values: ["u.safetensors"], properties: { aux_id: "someone/upscaler" } },
      { type: "LoraLoaderModelOnly", mode: 4, widgets_values: ["skipped.safetensors", 1], properties: { cnr_id: "skipped-pack" } },
    ],
    definitions: { subgraphs: [{ nodes: [{ type: "Inner", properties: { cnr_id: "inner-pack" } }] }] },
  });
  assert.deepEqual(facts.custom_nodes, [
    { id: "comfyui-videohelpersuite", source: "registry" },
    { id: "inner-pack", source: "registry" },
    { id: "someone/upscaler", source: "github" },
  ]);
  assert.deepEqual(facts.models.map((m) => m.name), ["u.safetensors"]);
});
