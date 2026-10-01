#!/usr/bin/env node
// Refresh the network-derived inputs of the RunPod profiles and commit the result:
//   - runpod/profiles/<id>.lock.json: size, sha256 and gated status per model url
//   - runpod/core-nodes.json: node types that ship with ComfyUI master
//
// Usage: npm run runpod:refresh [-- <profile-id>...] [-- --skip-core]
// Needs network access and git. HF_TOKEN is used when set (only to read gated repo metadata).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildProfile, CORE_NODES_PATH, listProfileIds, lockPath } from "./profiles.mjs";

const args = process.argv.slice(2);
const skipCore = args.includes("--skip-core");
const ids = args.filter((a) => !a.startsWith("--"));
const hfHeaders = process.env.HF_TOKEN ? { Authorization: `Bearer ${process.env.HF_TOKEN}` } : {};

const writeJSON = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

// Node ids from ComfyUI's own sources: NODE_CLASS_MAPPINGS dicts and V3 `node_id="..."`.
const refreshCoreNodes = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "comfyui-"));
  try {
    execFileSync("git", ["clone", "--quiet", "--depth", "1", "https://github.com/comfyanonymous/ComfyUI.git", dir]);
    const commit = execFileSync("git", ["-C", dir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const nodes = new Set();
    const scan = (file) => {
      const text = fs.readFileSync(file, "utf8");
      for (const m of text.matchAll(/node_id\s*=\s*"([^"]+)"/g)) nodes.add(m[1]);
      for (const block of text.matchAll(/NODE_CLASS_MAPPINGS\s*=\s*\{([\s\S]*?)\n\}/g)) {
        for (const m of block[1].matchAll(/^\s*"([^"]+)"\s*:/gm)) nodes.add(m[1]);
      }
    };
    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".py")) scan(full);
      }
    };
    scan(path.join(dir, "nodes.py"));
    walk(path.join(dir, "comfy_extras"));
    walk(path.join(dir, "comfy_api_nodes"));
    writeJSON(CORE_NODES_PATH, { comfyui_commit: commit, nodes: [...nodes].sort() });
    console.log(`core-nodes.json: ${nodes.size} nodes from ComfyUI ${commit.slice(0, 7)}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

const fetchJSON = async (url, init = {}) => {
  const res = await fetch(url, { ...init, headers: { ...hfHeaders, ...(init.headers ?? {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
};

const lookupHuggingFace = async (models) => {
  const results = {};
  const byRepo = new Map();
  for (const m of models) {
    const key = `${m.repo_id}@${m.revision}`;
    byRepo.set(key, [...(byRepo.get(key) ?? []), m]);
  }
  for (const group of byRepo.values()) {
    const { repo_id, revision } = group[0];
    const info = await fetchJSON(`https://huggingface.co/api/models/${repo_id}`);
    const gated = Boolean(info.gated);
    // A failed request throws: the caller then keeps the existing lock instead of writing nulls.
    const files = await fetchJSON(`https://huggingface.co/api/models/${repo_id}/paths-info/${encodeURIComponent(revision)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths: group.map((m) => m.path_in_repo) }),
    });
    for (const model of group) {
      const file = files.find((f) => f.path === model.path_in_repo);
      if (!file) throw new Error(`${model.url}: not found in ${repo_id}@${revision}`);
      results[model.url] = {
        size_bytes: file.size ?? null,
        sha256: file.lfs?.oid ?? null,
        requires_hf_token: gated,
      };
    }
  }
  return results;
};

const lookupHead = async (model) => {
  const res = await fetch(model.url, { method: "HEAD", redirect: "follow" });
  const size = Number(res.headers.get("x-linked-size") ?? res.headers.get("content-length"));
  if (!res.ok || !size) console.warn(`  ${model.url}: size unknown (${res.status})`);
  return { size_bytes: res.ok && size ? size : null, sha256: null, requires_hf_token: false };
};

if (!skipCore) refreshCoreNodes();

for (const id of ids.length ? ids : listProfileIds()) {
  // Build with the refreshed core list; the lock is what we are about to write, so ignore its warnings.
  const { profile, errors } = buildProfile(id, { siteURL: "https://example.invalid" });
  if (!profile) {
    console.error(`${id}: fix these first:\n  ${errors.join("\n  ")}`);
    process.exitCode = 1;
    continue;
  }
  const models = {};
  try {
    Object.assign(models, await lookupHuggingFace(profile.models.filter((m) => m.source === "hf")));
    for (const model of profile.models.filter((m) => m.source !== "hf")) models[model.url] = await lookupHead(model);
  } catch (error) {
    console.error(`${id}: ${error.message}; ${id}.lock.json left unchanged`);
    process.exitCode = 1;
    continue;
  }
  const sorted = Object.fromEntries(Object.entries(models).sort(([a], [b]) => a.localeCompare(b)));
  writeJSON(lockPath(id), { checked_at: new Date().toISOString().slice(0, 10), models: sorted });
  const total = Object.values(sorted).reduce((sum, m) => sum + (m.size_bytes ?? 0), 0);
  console.log(`${id}.lock.json: ${Object.keys(sorted).length} models, ${(total / 1e9).toFixed(2)} GB`);
}
