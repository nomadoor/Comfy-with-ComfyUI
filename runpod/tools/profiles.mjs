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
// Nodes that read a file from ComfyUI's input/ folder; widgets_values[0] is the file name.
const INPUT_NODES = new Set(["LoadImage", "LoadImageMask", "LoadVideo", "LoadAudio"]);
// Frontend-only nodes: they never reach the backend, so they need nothing installed.
const FRONTEND_NODES = new Set(["Note", "MarkdownNote", "Reroute", "PrimitiveNode"]);

export const lockPath = (id) => path.join(PROFILE_DIR, `${id}.lock.json`);
const readJSON = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback);

// --- Sample inputs
// A workflow's input files are ordinary site media: the original sits in COMFY_MEDIA_ORIGINALS as
// <article>/<stem>.png (or .jpg / .webp), media:sync uploads it to R2 as WebP, and the LoadImage node names
// the file the Pod will write into input/, <stem>.webp. So one name links node, original and R2 object.
const MEDIA_MANIFEST = path.resolve("src", "_data", "media.json");
const ORIGINAL_EXTS = [".png", ".jpg", ".jpeg", ".webp"];

export const inputFileName = (node) =>
  INPUT_NODES.has(node.type) && node.mode !== 4
    ? String(node.widgets_values?.[0] ?? "").replace(/ \[(input|output|temp)\]$/, "") || null
    : null;

/**
 * Logical media name for an input file: the registered original with the same stem; before it is
 * registered, the original actually sitting in COMFY_MEDIA_ORIGINALS (a .jpg must not be looked for
 * as .png at its first media:sync); else <stem>.png.
 */
export const inputMediaName = (article, fileName, manifest = {}, originalsRoot = process.env.COMFY_MEDIA_ORIGINALS) => {
  const stem = `${article}/${fileName.replace(/\.[^./]+$/, "")}`;
  const names = ORIGINAL_EXTS.map((ext) => stem + ext);
  return (
    names.find((name) => manifest[name]) ??
    (originalsRoot ? names.find((name) => fs.existsSync(path.join(originalsRoot, name))) : undefined) ??
    `${stem}.png`
  );
};

const globToRegExp = (glob) =>
  new RegExp(`^${glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*\/?/g, "\0").replace(/\*/g, "[^/]*").replace(/\0/g, ".*")}$`);

/**
 * `/media/...` references for every sample input the profiles use, so media:sync uploads them and
 * check:media accounts for them. `listFiles`/`readText` let the pre-commit hook read the git index.
 */
export const profileInputReferences = ({
  listFiles = () => fg.sync(["runpod/profiles/*.yaml", "src/workflows/**/*.json"]),
  readText = (file) => fs.readFileSync(file, "utf8"),
  manifest = readJSON(MEDIA_MANIFEST, {}),
} = {}) => {
  const files = listFiles();
  const references = [];
  for (const yamlFile of files.filter((f) => /^runpod\/profiles\/[^/]+\.yaml$/.test(f))) {
    const source = YAML.parse(readText(yamlFile));
    if (!source?.article) continue;
    const patterns = (source.workflows ?? []).map(globToRegExp);
    for (const file of files.filter((f) => f.endsWith(".json") && patterns.some((re) => re.test(f)))) {
      const workflow = JSON.parse(readText(file));
      for (const node of eachNode(workflow)) {
        const name = inputFileName(node);
        // Only <stem>.webp inputs reach the Pod; the lock warns about the rest and skips them, so they
        // are not sample inputs and need no original.
        if (name?.endsWith(".webp")) references.push({ file, ref: `/media/${inputMediaName(source.article, name, manifest)}` });
      }
    }
  }
  return references;
};

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

// Same rule as SAFE_PART in runpod/image/bootstrap/__main__.py.
const SAFE_PART = /^[A-Za-z0-9][A-Za-z0-9._ +()-]*$/;
const safePath = (value, nested = false) =>
  (nested ? String(value).split("/") : [String(value)]).every((part) => SAFE_PART.test(part) && part !== "." && part !== "..");

// Returns { profile, errors, warnings }. `profile` is null when there are errors.
// `strictLock` (check:runpod) turns a model missing from the lock into an error; the build only warns.
export const buildProfile = (id, { siteURL, strictLock = false, coreNodes = readJSON(CORE_NODES_PATH, { nodes: [] }).nodes } = {}) => {
  const errors = [];
  const warnings = [];
  const where = (file) => path.relative(process.cwd(), file);
  const source = readProfileSource(id);
  const lock = readJSON(lockPath(id), { models: {} });
  const core = new Set(coreNodes);
  const overrideNodes = source.overrides?.custom_nodes ?? [];
  const overrideTypes = new Map(overrideNodes.flatMap((n) => (n.nodes ?? []).map((type) => [type, n.id])));

  if (source.id !== id) errors.push(`${id}.yaml: id is "${source.id}", expected "${id}"`);
  // profileInputReferences (media:sync, check:media) matches these with a small glob of its own that
  // knows only `*` and `**`; anything else would make it and the Pod disagree on the workflow list.
  for (const pattern of source.workflows ?? []) {
    if (!/^[A-Za-z0-9_./*-]+$/.test(pattern)) errors.push(`${id}.yaml: workflows pattern ${pattern} may use only * and ** as wildcards`);
  }
  if (!["latest", "verified"].includes(source.comfyui?.default)) {
    errors.push(`${id}.yaml: comfyui.default must be latest or verified`);
  }
  if (source.comfyui?.default === "verified" && !source.comfyui?.verified_commit) {
    errors.push(`${id}.yaml: comfyui.default is verified but verified_commit is empty`);
  }
  // The article card reads these straight from the YAML, so check their types here: YAML reads `no`
  // as the string "no" (which would still add the referral code) and `4090` as a number.
  if ("referral" in source && typeof source.referral !== "boolean") {
    errors.push(`${id}.yaml: referral must be true or false, got ${JSON.stringify(source.referral)}`);
  }
  if ("template" in source && !(typeof source.template === "string" && /^[a-z0-9]+$/.test(source.template))) {
    errors.push(`${id}.yaml: template must be a RunPod template ID such as 16mbtha5fk`);
  }
  const recommended = source.gpu?.recommended;
  if (recommended != null && !(Array.isArray(recommended) && recommended.every((gpu) => typeof gpu === "string" && gpu.trim()))) {
    errors.push(`${id}.yaml: gpu.recommended must be a list of GPU names such as "RTX 4090"`);
  }

  // Workflows follow the order the Japanese article introduces them (the Pod lists them, and opens the
  // `open` ones as tabs, in this order); any the article does not link come last, by name.
  const articleFile = path.resolve("src", "content", "ja", `${source.article}.md`);
  if (!fs.existsSync(articleFile)) errors.push(`${id}.yaml: article ${source.article} has no ${where(articleFile)}`);
  const articleText = fs.existsSync(articleFile) ? fs.readFileSync(articleFile, "utf8") : "";
  const articleOrder = (file) => {
    const index = articleText.indexOf(`/workflows/${path.relative(WORKFLOW_ROOT, file).split(path.sep).join("/")}`);
    return index === -1 ? Infinity : index;
  };
  const files = fg
    .sync(source.workflows ?? [], { cwd: process.cwd(), absolute: true })
    .sort((a, b) => articleOrder(a) - articleOrder(b) || a.localeCompare(b));
  if (files.length === 0) errors.push(`${id}.yaml: workflows match no files`);

  // Tabs the Pod opens on a reader's first visit: the files `open` names, or just the article's first
  // workflow. Opening every workflow buried the one the reader came for under a row of tabs; the rest
  // wait in the sidebar's Workflows tab. `folders` groups them there (folder name -> patterns); a
  // workflow goes to the first folder that matches it, so a catch-all can come last.
  const repoPath = (file) => path.relative(process.cwd(), file).split(path.sep).join("/");
  const matching = (patterns, label) => {
    if (!Array.isArray(patterns) || !patterns.every((p) => typeof p === "string" && /^[A-Za-z0-9_./*-]+$/.test(p))) {
      errors.push(`${id}.yaml: ${label} must be a list of workflow paths, with only * and ** as wildcards`);
      return new Set();
    }
    const found = new Set();
    for (const pattern of patterns) {
      const re = globToRegExp(pattern);
      const hits = files.filter((file) => re.test(repoPath(file)));
      if (!hits.length) errors.push(`${id}.yaml: ${label} entry ${pattern} matches none of the profile's workflows`);
      hits.forEach((file) => found.add(file));
    }
    return found;
  };
  const opened = source.open == null ? new Set(files.slice(0, 1)) : matching(source.open, "open");
  const folderOf = new Map();
  if (source.folders != null && (typeof source.folders !== "object" || Array.isArray(source.folders))) {
    errors.push(`${id}.yaml: folders must map a folder name to a list of workflow paths`);
  } else {
    for (const [folder, patterns] of Object.entries(source.folders ?? {})) {
      if (!safePath(folder)) errors.push(`${id}.yaml: folder name ${folder} is not safe as a path`);
      for (const file of matching(patterns, `folders.${folder}`)) {
        if (!folderOf.has(file)) folderOf.set(file, folder);
      }
    }
  }

  const models = new Map();
  const customNodes = new Map();
  const workflows = [];
  const inputs = new Map();

  const manifest = readJSON(MEDIA_MANIFEST, {});
  const mediaHost = readJSON(path.resolve("src", "_data", "site.json"), {}).media?.host;
  const addInput = (node, origin) => {
    const name = inputFileName(node);
    if (!name || inputs.has(name)) return;
    if (!name.endsWith(".webp")) {
      warnings.push(`${origin} node ${node.id} ${node.type}: ${name} should be <stem>.webp (the Pod writes the R2 WebP under that name)`);
      return;
    }
    const media = inputMediaName(source.article, name, manifest);
    const entry = manifest[media];
    if (!entry) {
      warnings.push(`${origin} node ${node.id} ${node.type}: sample input ${media} is not in media.json (put the original in COMFY_MEDIA_ORIGINALS and commit)`);
      return;
    }
    // R2 keys are the first 16 hex of the object's sha256, so the Pod can verify what it downloads.
    const hash = entry.key.match(/([0-9a-f]{16})\.\w+$/)?.[1];
    inputs.set(name, { name, media, url: `https://${mediaHost}/${entry.key}`, sha256_prefix: hash, size_bytes: entry.bytes });
  };

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

  // Custom nodes install their latest release unless the profile source pins one. The `ver` saved
  // in a workflow is ignored on purpose (owner decision, see the ADR); the Pod records what it got.
  const addCustomNode = (node) => {
    if (!customNodes.has(node.id)) customNodes.set(node.id, node);
  };
  for (const node of overrideNodes) {
    const version = String((node.git ? node.commit : node.version) ?? "latest");
    addCustomNode(node.git ? { id: node.id, version, source: "git", git: node.git } : { id: node.id, version, source: "registry" });
  }

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

      addInput(node, origin);

      if (props.cnr_id && props.cnr_id !== "comfy-core") {
        addCustomNode({ id: props.cnr_id, version: "latest", source: "registry" });
      } else if (!props.cnr_id && props.aux_id) {
        addCustomNode({ id: props.aux_id, version: "latest", source: "git", git: `https://github.com/${props.aux_id}` });
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

    // `path` lets the Pod fetch workflows from wherever it fetched the profile (a preview or local build).
    const publicPath = `/workflows/${path.relative(WORKFLOW_ROOT, file).split(path.sep).join("/")}`;
    workflows.push({
      name: path.basename(file),
      ...(folderOf.has(file) ? { folder: folderOf.get(file) } : {}),
      open: opened.has(file),
      path: publicPath,
      url: new URL(publicPath, siteURL).href,
      sha256: crypto.createHash("sha256").update(raw).digest("hex"),
    });
  }

  for (const model of source.overrides?.models ?? []) addModel(model, `${id}.yaml`);

  let totalBytes = 0;
  for (const [key, model] of models) {
    const locked = lock.models?.[model.url];
    if (!locked) {
      (strictLock ? errors : warnings).push(`${key}: not in ${id}.lock.json, size unknown (run npm run runpod:refresh)`);
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
    site: new URL("/", siteURL).href.replace(/\/$/, ""),
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
      // Generous on purpose: the image itself, custom node dependencies, outputs, and models a reader
      // adds through Manager all share the container disk. Rounded up to 10 GB.
      recommended_disk_gb: Math.ceil(((totalBytes / 1e9) * 1.5 + 40) / 10) * 10,
    },
    requires_hf_token: sortedModels.some((m) => m.requires_hf_token),
    unsafe_format: sortedModels.some((m) => m.unsafe_format),
    workflows,
    inputs: [...inputs.values()].sort((a, b) => a.name.localeCompare(b.name)),
    custom_nodes: [...customNodes.values()].sort((a, b) => a.id.localeCompare(b.id)),
    models: sortedModels,
  };
  // The Pod refuses names that are unsafe as paths (bootstrap/__main__.py check_paths); catch them here
  // first, with the same rule, so a profile never passes the check and then stops every Pod.
  const unsafe = [
    ...profile.models.filter((m) => !safePath(m.name) || !safePath(m.directory, true)).map((m) => `model ${m.directory}/${m.name}`),
    ...profile.workflows.filter((w) => !safePath(w.name) || (w.folder != null && !safePath(w.folder))).map((w) => `workflow ${w.name}`),
    ...profile.custom_nodes.filter((n) => !safePath(n.id, true)).map((n) => `custom node ${n.id}`),
  ];
  if (unsafe.length) return { profile: null, errors: [...errors, `${id}: names not safe as paths on the Pod: ${unsafe.join(", ")}`], warnings };
  return { profile, errors, warnings };
};

// --- Status page columns (runpod/tips.yaml -> /runpod/tips.json)
const TIP_LANGS = ["ja", "en", "zh"];

export const buildTips = () => {
  const file = path.join(RUNPOD_DIR, "tips.yaml");
  if (!fs.existsSync(file)) return { tips: [], errors: [] };
  const errors = [];
  const tips = (YAML.parse(fs.readFileSync(file, "utf8")) ?? []).map((tip, index) => {
    const entry = {};
    for (const lang of TIP_LANGS) {
      const article = path.resolve("src", "content", lang, `${tip.link}.md`);
      if (!tip[lang]?.title || !tip[lang]?.body) errors.push(`tips.yaml #${index + 1}: missing ${lang} title/body`);
      if (!fs.existsSync(article)) {
        errors.push(`tips.yaml #${index + 1}: ${lang}/${tip.link} does not exist`);
        continue;
      }
      const title = fs.readFileSync(article, "utf8").match(/^title:\s*"?(.+?)"?\s*$/m)?.[1] ?? tip.link;
      entry[lang] = { ...tip[lang], link: { path: `/${lang}/${tip.link}/`, title } };
    }
    return entry;
  });
  return { tips, errors };
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
  const { tips, errors: tipErrors } = buildTips();
  failures.push(...tipErrors);
  fs.mkdirSync(path.join(outDir, "runpod"), { recursive: true });
  fs.writeFileSync(path.join(outDir, "runpod", "tips.json"), `${JSON.stringify({ tips }, null, 2)}\n`);
  if (failures.length) throw new Error(`RunPod profile errors:\n  ${failures.join("\n  ")}`);
};
