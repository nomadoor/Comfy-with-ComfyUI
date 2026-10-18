// The day each workflow's build last changed (src/_data/workflowDates.json), for the catalog's
// `updated` (see ops/adr/2026-05-01-agent-discovery-and-ai-crawl-policy.md). Recorded at commit time
// by scripts/workflow-dates.mjs, so the build never needs the git history.

import fs from "node:fs";
import path from "node:path";

export const DATES_PATH = path.resolve("src", "_data", "workflowDates.json");

// Node properties that say where things come from rather than how the workflow is built. Filling
// them in (often in bulk, years after the workflow was made) must not make a workflow look new.
const METADATA = ["models", "cnr_id", "ver", "aux_id"];

// A node whose properties hold nothing but metadata compares like one without properties.
const stripMetadata = (node) => {
  if (!node?.properties) return node;
  const { properties: _, ...rest } = node;
  const properties = { ...node.properties };
  for (const key of METADATA) delete properties[key];
  return Object.keys(properties).length ? { ...rest, properties } : rest;
};

// The workflow without the node metadata above, as a string to compare. Text that is not JSON is
// compared as it is.
export const buildOf = (text) => {
  let workflow;
  try {
    workflow = JSON.parse(text);
  } catch {
    return text;
  }
  if (!workflow || typeof workflow !== "object") return text;
  const shaped = { ...workflow, nodes: (workflow.nodes ?? []).map(stripMetadata) };
  if (workflow.definitions?.subgraphs) {
    shaped.definitions = {
      ...workflow.definitions,
      subgraphs: workflow.definitions.subgraphs.map((s) => ({ ...s, nodes: (s.nodes ?? []).map(stripMetadata) })),
    };
  }
  return JSON.stringify(shaped);
};

// Whether two versions of a workflow differ in more than node metadata. A missing version (the file
// is new) always counts as a change.
export const buildChanged = (before, after) => before == null || buildOf(before) !== buildOf(after);

export const readDates = (file = DATES_PATH) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {});

export const writeDates = (dates, file = DATES_PATH) => {
  const sorted = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + "\n");
};

// Keys are paths under src/workflows with forward slashes, as in the workflow's URL.
export const workflowKey = (repoPath) => repoPath.replace(/^src\/workflows\//, "");
const isWorkflow = (p) => p.startsWith("src/workflows/") && p.endsWith(".json");

// `git diff/log --name-status -z` fields: status, path (or old and new path for renames and copies).
export const parseNameStatus = (fields) => {
  const changes = [];
  for (let i = 0; i < fields.length; ) {
    const status = fields[i++];
    if (!status) continue;
    if (status[0] === "R" || status[0] === "C") changes.push({ status: status[0], from: fields[i++], to: fields[i++] });
    else changes.push({ status: status[0], from: fields[i], to: fields[i++] });
  }
  return changes;
};

// Apply one commit's changes. `before(path)` and `after(path)` read the file on each side.
export const apply = (dates, changes, day, before, after) => {
  for (const { status, from, to } of changes) {
    if (status === "D") {
      if (isWorkflow(from)) delete dates[workflowKey(from)];
      continue;
    }
    if (!isWorkflow(to)) continue;
    const old = status === "A" ? null : before(from);
    const previous = status === "R" && isWorkflow(from) ? dates[workflowKey(from)] : dates[workflowKey(to)];
    if (status === "R" && isWorkflow(from)) delete dates[workflowKey(from)];
    dates[workflowKey(to)] = buildChanged(old, after(to)) || !previous ? day : previous;
  }
};

