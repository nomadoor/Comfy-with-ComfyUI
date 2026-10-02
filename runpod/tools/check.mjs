#!/usr/bin/env node
// Validate every RunPod profile offline (errors fail, warnings are printed).
// Usage: npm run check:runpod [-- --print <id>]
import { buildProfile, buildTips, listProfileIds, readProfileSource } from "./profiles.mjs";

const args = process.argv.slice(2);
const printId = args.includes("--print") ? args[args.indexOf("--print") + 1] : null;
let failed = false;
// One profile per article: the article card picks its profile by `article`, so a second one would be ignored.
const articles = new Map();

for (const id of listProfileIds()) {
  const article = readProfileSource(id).article;
  if (articles.has(article)) {
    console.error(`[runpod] error: ${id}.yaml and ${articles.get(article)}.yaml both use article ${article}`);
    failed = true;
  }
  articles.set(article, id);
  const { profile, errors, warnings } = buildProfile(id, { siteURL: "https://comfyui.nomadoor.net", strictLock: true });
  for (const warning of warnings) console.warn(`[runpod] warning: ${warning}`);
  for (const error of errors) console.error(`[runpod] error: ${error}`);
  if (!profile) {
    failed = true;
    continue;
  }
  if (id === printId) console.log(JSON.stringify(profile, null, 2));
  const gb = (profile.storage.models_total_bytes / 1e9).toFixed(2);
  console.log(
    `${id}: ${profile.workflows.length} workflows, ${profile.models.length} models (${gb} GB), ` +
      `${profile.custom_nodes.length} custom nodes, disk ${profile.storage.recommended_disk_gb} GB`
  );
}

const { tips, errors: tipErrors } = buildTips();
for (const error of tipErrors) console.error(`[runpod] error: ${error}`);
if (tipErrors.length) failed = true;
else console.log(`tips.yaml: ${tips.length} columns`);

if (failed) process.exit(1);
console.log("RunPod profile checks passed.");
