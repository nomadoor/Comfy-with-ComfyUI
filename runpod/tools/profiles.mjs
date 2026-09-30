// Build RunPod profiles: runpod/profiles/<id>.yaml + the workflow JSON it names -> the published
// /runpod/profiles/<id>.json that the Pod bootstrap and the article both read.
//
// Everything here is offline. Model sizes, hashes and gated status come from the committed
// lock file (runpod/profiles/<id>.lock.json), which `npm run runpod:refresh` updates, and the
// core node list from runpod/core-nodes.json. See ops/adr/2026-09-30-runpod-poc.md.
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import YAML from "yaml";

export const SCHEMA_VERSION = 1;
export const RUNPOD_DIR = path.resolve("runpod");
export const PROFILE_DIR = path.join(RUNPOD_DIR, "profiles");
export const CORE_NODES_PATH = path.join(RUNPOD_DIR, "core-nodes.json");

const WORKFLOW_ROOT = path.resolve("src", "workflows");
const ALLOWED_HOSTS = new Set(["huggingface.co", "civitai.com"]);
const MODEL_EXT = /\.(safetensors|gguf|ckpt|pt|pth|bin|sft)$/i;
// Frontend-only nodes: they never reach the backend, so they need nothing installed.
const FRONTEND_NODES = new Set(["Note", "MarkdownNote", "Reroute", "PrimitiveNode"]);

export const lockPath = (id) => path.join(PROFILE_DIR, `${id}.lock.json`);
const readJSON = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback);

export const listProfileIds = () =>
  fs.existsSync(PROFILE_DIR)
    ? fs.readdirSync(PROFILE_DIR).filter((f) => f.endsWith(".yaml")).map((f) => f.slice(0, -5)).sort()
    : [];

export const readProfileSource = (id) => YAML.parse(fs.readFileSync(path.join(PROFILE_DIR, `${id}.yaml`), "utf8"));

// https://huggingface.co/<repo_id>/resolve/<revision>/<path_in_repo>
export const parseHuggingFaceURL = (url) => {
  const match = new URL(url).pathname.match(/^\/([^/]+\/[^/]+)\/(?:resolve|blob)\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return { repo_id: match[1], revision: decodeURIComponent(match[2]), path_in_repo: decodeURIComponent(match[3]) };
};

const eachNode = function* (workflow) {
  for (const node of workflow.nodes ?? []) yield node;
  for (const subgraph of workflow.definitions?.subgraphs ?? []) {
    for (const node of subgraph.nodes ?? []) yield node;
  }
};

const siteCommit = () => {
  if (process.env.CF_PAGES_COMMIT_SHA) return process.env.CF_PAGES_COMMIT_SHA;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
};

// Returns { profile, errors, warnings }. `profile` is null when there are errors.
export const buildProfile = (id, { siteURL, coreNodes = readJSON(CORE_NODES_PATH, { nodes: [] }).nodes } = {}) => {
  const errors = [];
  const warnings = [];
  const where = (file) => path.relative(process.cwd(), file);
  const source = readProfileSource(id);
  const lock = readJSON(lockPath(id), { models: {} });
  const core = new Set(coreNodes);
  const overrideNodes = source.overrides?.custom_nodes ?? [];
  const overrideTypes = new Map(overrideNodes.flatMap((n) => (n.nodes ?? []).map((type) => [type, n.id])));

  if (source.id !== id) errors.push(`${id}.yaml: id is "${source.id}", expected "${id}"`);
  if (!["latest", "verified"].includes(source.comfyui?.default)) {
    errors.push(`${id}.yaml: comfyui.default must be latest or verified`);
  }
  if (source.comfyui?.default === "verified" && !source.comfyui?.verified_commit) {
    errors.push(`${id}.yaml: comfyui.default is verified but verified_commit is empty`);
  }

  const files = fg.sync(source.workflows ?? [], { cwd: process.cwd(), absolute: true }).sort();
  if (files.length === 0) errors.push(`${id}.yaml: workflows match no files`);

  const models = new Map();
  const customNodes = new Map();
  const workflows = [];

  const addModel = (model, origin) => {
    const key = `${model.directory}/${model.name}`;
    const known = models.get(key);
    if (known) {
      if (known.url !== model.url) errors.push(`${origin}: ${key} has url ${model.url}, elsewhere ${known.url}`);
      return;
    }
    let host;
    try {
      host = new URL(model.url).hostname;
    } catch {
      errors.push(`${origin}: ${key} has an invalid url`);
      return;
    }
    if (!ALLOWED_HOSTS.has(host)) {
      errors.push(`${origin}: ${key} is hosted on ${host} (allowed: ${[...ALLOWED_HOSTS].join(", ")})`);
      return;
    }
    const entry = { name: model.name, directory: model.directory, source: host === "huggingface.co" ? "hf" : "civitai" };
    if (entry.source === "hf") {
      const parts = parseHuggingFaceURL(model.url);
      if (!parts) {
        errors.push(`${origin}: ${key} is not a Hugging Face file url`);
        return;
      }
      Object.assign(entry, parts);
    }
    entry.url = model.url;
    if (!model.name.toLowerCase().endsWith(".safetensors")) {
      warnings.push(`${origin}: ${key} is not .safetensors`);
      entry.unsafe_format = true;
    }
    models.set(key, entry);
  };

  const addCustomNode = (node, origin) => {
    const known = customNodes.get(node.id);
    if (known && known.version !== node.version) {
      errors.push(`${origin}: custom node ${node.id} is ${node.version}, elsewhere ${known.version}`);
      return;
    }
    if (!known) customNodes.set(node.id, node);
  };

  for (const file of files) {
    const origin = where(file);
    if (path.relative(WORKFLOW_ROOT, file).startsWith("..")) {
      errors.push(`${origin}: workflows must live under src/workflows so the site publishes them`);
      continue;
    }
    const raw = fs.readFileSync(file);
    const workflow = JSON.parse(raw.toString("utf8"));
    const subgraphIds = new Set((workflow.definitions?.subgraphs ?? []).map((s) => s.id));

    for (const node of eachNode(workflow)) {
      const props = node.properties ?? {};
      const listed = new Set();
      for (const model of props.models ?? []) {
        listed.add(model.name);
        addModel(model, `${origin} node ${node.id}`);
      }
      // A loader that names a model file without saying where to get it would be missed.
      for (const value of Array.isArray(node.widgets_values) ? node.widgets_values : []) {
        if (typeof value === "string" && MODEL_EXT.test(value) && !listed.has(path.basename(value))) {
          warnings.push(`${origin} node ${node.id} ${node.type}: ${value} has no properties.models entry`);
        }
      }

      if (props.cnr_id && props.cnr_id !== "comfy-core") {
        addCustomNode({ id: props.cnr_id, version: String(props.ver ?? ""), source: "registry" }, `${origin} node ${node.id}`);
      } else if (!props.cnr_id && props.aux_id) {
        addCustomNode(
          { id: props.aux_id, version: String(props.ver ?? ""), source: "git", git: `https://github.com/${props.aux_id}` },
          `${origin} node ${node.id}`
        );
      } else if (
        !props.cnr_id &&
        !core.has(node.type) &&
        !FRONTEND_NODES.has(node.type) &&
        !subgraphIds.has(node.type) &&
        !overrideTypes.has(node.type)
      ) {
        errors.push(`${origin} node ${node.id}: ${node.type} is not a core node and has no cnr_id (add it to overrides.custom_nodes)`);
      }
    }

    workflows.push({
      name: path.basename(file),
      url: new URL(`/workflows/${path.relative(WORKFLOW_ROOT, file).split(path.sep).join("/")}`, siteURL).href,
      sha256: crypto.createHash("sha256").update(raw).digest("hex"),
    });
  }

  for (const node of overrideNodes) {
    if (node.git) {
      addCustomNode({ id: node.id, version: String(node.commit ?? ""), source: "git", git: node.git }, `${id}.yaml`);
    } else {
      addCustomNode({ id: node.id, version: String(node.version ?? ""), source: "registry" }, `${id}.yaml`);
    }
  }
  for (const model of source.overrides?.models ?? []) addModel(model, `${id}.yaml`);

  let totalBytes = 0;
  for (const [key, model] of models) {
    const locked = lock.models?.[model.url];
    if (!locked) {
      warnings.push(`${key}: not in ${id}.lock.json, size unknown (run npm run runpod:refresh)`);
      Object.assign(model, { size_bytes: null, sha256: null, requires_hf_token: false });
      continue;
    }
    if (locked.size_bytes == null) warnings.push(`${key}: size unknown`);
    Object.assign(model, {
      size_bytes: locked.size_bytes ?? null,
      sha256: locked.sha256 ?? null,
      requires_hf_token: Boolean(locked.requires_hf_token),
    });
    totalBytes += locked.size_bytes ?? 0;
  }

  if (errors.length) return { profile: null, errors, warnings };

  const sortedModels = [...models.values()].sort((a, b) => `${a.directory}/${a.name}`.localeCompare(`${b.directory}/${b.name}`));
  const profile = {
    schema_version: SCHEMA_VERSION,
    id,
    title: source.title,
    article: source.article,
    generated_at: new Date().toISOString(),
    site_commit: siteCommit(),
    comfyui: { default: source.comfyui.default, verified_commit: source.comfyui.verified_commit ?? null },
    gpu: {
      min_vram_gb: source.gpu?.min_vram_gb ?? null,
      recommended_vram_gb: source.gpu?.recommended_vram_gb ?? null,
      notes: source.gpu?.notes ?? "",
    },
    storage: {
      models_total_bytes: totalBytes,
      recommended_disk_gb: Math.ceil((totalBytes / 1e9) * 1.2) + 20,
    },
    requires_hf_token: sortedModels.some((m) => m.requires_hf_token),
    unsafe_format: sortedModels.some((m) => m.unsafe_format),
    workflows,
    custom_nodes: [...customNodes.values()].sort((a, b) => a.id.localeCompare(b.id)),
    models: sortedModels,
  };
  return { profile, errors, warnings };
};

// Used by the Eleventy build: writes every profile to <outDir>/runpod/profiles/, throws on errors.
export const writeProfiles = ({ outDir, siteURL, log = console }) => {
  const failures = [];
  for (const id of listProfileIds()) {
    const { profile, errors, warnings } = buildProfile(id, { siteURL });
    for (const warning of warnings) log.warn(`[runpod] warning: ${warning}`);
    if (!profile) {
      failures.push(...errors);
      continue;
    }
    const target = path.join(outDir, "runpod", "profiles", `${id}.json`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(profile, null, 2)}\n`);
  }
  if (failures.length) throw new Error(`RunPod profile errors:\n  ${failures.join("\n  ")}`);
};
