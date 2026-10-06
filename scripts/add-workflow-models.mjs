#!/usr/bin/env node
// Fill `properties.models` on workflow loader nodes from an article's model download list.
//
// Usage: node scripts/add-workflow-models.mjs <article.md> <workflow.json|dir>... [--write]
//
// The article list is the usual form (`*` bullets and blank lines between items also work):
//   - diffusion_models
//     - [file.safetensors](https://huggingface.co/.../blob/main/...) (7.26 GB)
// Every node (subgraphs included) whose widget value names a model file is matched by file name.
// Only `properties.models` is added; nothing else in the workflow changes. Names the article
// does not list are reported, never guessed. Without --write it only prints the plan.
import fs from "node:fs";
import path from "node:path";

const MODEL_EXT = /\.(safetensors|gguf|ckpt|pt|pth|bin|sft)$/i;

// Folder each core loader reads from; a mismatch with the article's folder is reported.
const LOADER_DIRS = {
  UNETLoader: "diffusion_models",
  CLIPLoader: "text_encoders",
  DualCLIPLoader: "text_encoders",
  TripleCLIPLoader: "text_encoders",
  VAELoader: "vae",
  CheckpointLoaderSimple: "checkpoints",
  LoraLoader: "loras",
  LoraLoaderModelOnly: "loras",
  ControlNetLoader: "controlnet",
  CLIPVisionLoader: "clip_vision",
  UpscaleModelLoader: "upscale_models",
  StyleModelLoader: "style_models",
};

const args = process.argv.slice(2);
const write = args.includes("--write");
const [articlePath, ...targets] = args.filter((a) => a !== "--write");
if (!articlePath || targets.length === 0) {
  console.error("Usage: node scripts/add-workflow-models.mjs <article.md> <workflow.json|dir>... [--write]");
  process.exit(2);
}

// Hugging Face page links (`/blob/`) become direct download links (`/resolve/`).
const downloadURL = (url) => url.replace(/^(https:\/\/huggingface\.co\/.+?)\/blob\//, "$1/resolve/");

const readArticleModels = (file) => {
  const models = new Map();
  let directory = null;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue; // a loose list (blank lines between items) is still one list
    const folder = line.match(/^[-*] `?([\w./-]+?)`?\s*$/);
    if (folder) {
      directory = folder[1].replace(/\/$/, "");
      continue;
    }
    const item = line.match(/^\s+[-*] \[`?([^\]`]+?)`?\]\((https?:\/\/[^)\s]+)\)/);
    if (item && directory && MODEL_EXT.test(item[1])) {
      models.set(item[1], { name: item[1], url: downloadURL(item[2]), directory });
    } else if (!/^\s/.test(line)) {
      directory = null;
    }
  }
  return models;
};

const listWorkflows = (target) =>
  fs.statSync(target).isDirectory()
    ? fs.readdirSync(target).filter((f) => f.endsWith(".json")).sort().map((f) => path.join(target, f))
    : [target];

const eachNode = function* (workflow) {
  for (const node of workflow.nodes ?? []) yield node;
  for (const subgraph of workflow.definitions?.subgraphs ?? []) {
    for (const node of subgraph.nodes ?? []) yield node;
  }
};

const articleModels = readArticleModels(articlePath);
if (articleModels.size === 0) {
  console.error(`No model list found in ${articlePath}`);
  process.exit(1);
}

let added = 0;
const unmatched = [];
const mismatched = [];

for (const file of targets.flatMap(listWorkflows)) {
  const raw = fs.readFileSync(file, "utf8");
  const workflow = JSON.parse(raw);
  let changed = false;

  for (const node of eachNode(workflow)) {
    const values = Array.isArray(node.widgets_values) ? node.widgets_values : [];
    for (const value of values) {
      if (typeof value !== "string" || !MODEL_EXT.test(value)) continue;
      const model = articleModels.get(path.basename(value));
      if (!model) {
        unmatched.push(`${file}: node ${node.id} ${node.type} -> ${value}`);
        continue;
      }
      const expected = LOADER_DIRS[node.type];
      if (expected && expected !== model.directory) {
        mismatched.push(`${file}: node ${node.id} ${node.type} expects ${expected}, article says ${model.directory}`);
        continue;
      }
      node.properties ??= {};
      const list = (node.properties.models ??= []);
      if (list.some((m) => m.name === model.name)) continue;
      list.push({ ...model });
      changed = true;
      added += 1;
      console.log(`${write ? "added" : "would add"}: ${path.basename(file)} node ${node.id} ${node.type} -> ${model.directory}/${model.name}`);
    }
  }

  if (changed && write) {
    const eol = raw.endsWith("\r\n") ? "\r\n" : raw.endsWith("\n") ? "\n" : "";
    fs.writeFileSync(file, JSON.stringify(workflow, null, 2) + eol);
  }
}

console.log(`\n${added} model entr${added === 1 ? "y" : "ies"} ${write ? "added" : "to add"}.`);
if (unmatched.length) console.log(`\nNot in the article list (left empty):\n  ${unmatched.join("\n  ")}`);
if (mismatched.length) console.log(`\nFolder mismatch (left empty):\n  ${mismatched.join("\n  ")}`);
process.exit(unmatched.length || mismatched.length ? 1 : 0);
