#!/usr/bin/env node
// Keep src/_data/workflowDates.json: the day each workflow's build last changed.
//
//   --staged    record today for the staged workflows whose build changed (run by .githooks/pre-commit)
//   --backfill  rebuild the whole file from the git history (first-parent), under the same rule
//   --check     fail when a workflow has no date or a date names a file that no longer exists
//
// A change to node metadata only (`properties.models`, `cnr_id`, `ver`, `aux_id`) keeps the old date;
// see scripts/lib/workflow-dates.mjs.
import { spawnSync } from "node:child_process";
import path from "node:path";
import { listFiles } from "./lib/files.mjs";
import { apply, parseNameStatus, readDates, writeDates } from "./lib/workflow-dates.mjs";

const WORKFLOW_ROOT = "src/workflows";

const git = (args) => {
  const result = spawnSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28 });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr.trim()}`);
  return result.stdout;
};
// A file's text at `rev:path` (`:path` is the index), or null when it is not there.
const show = (spec) => {
  const result = spawnSync("git", ["show", spec], { encoding: "utf8", maxBuffer: 1 << 28 });
  return result.status === 0 ? result.stdout : null;
};

const today = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const staged = () => {
  const dates = readDates();
  const fields = git(["diff", "--cached", "--name-status", "-M", "-z", "--", WORKFLOW_ROOT]).split("\0");
  const changes = parseNameStatus(fields);
  if (!changes.length) return false;
  apply(dates, changes, today(), (p) => show(`HEAD:${p}`), (p) => show(`:${p}`));
  writeDates(dates);
  return true;
};

const backfill = () => {
  const dates = {};
  const log = git(["log", "--reverse", "--first-parent", "--diff-merges=first-parent", "-M", "--name-status", "-z", "--format=@@%H %cs", "--", WORKFLOW_ROOT]);
  // With -z each commit header is followed by NUL-separated fields; headers start with "@@".
  const commits = [];
  for (const field of log.split("\0")) {
    const header = field.match(/^\n?@@([0-9a-f]+) (\d{4}-\d{2}-\d{2})\n?(.*)$/s);
    if (header) {
      commits.push({ hash: header[1], day: header[2], fields: header[3] ? [header[3]] : [] });
    } else if (commits.length) {
      commits.at(-1).fields.push(field.replace(/^\n/, ""));
    }
  }
  for (const { hash, day, fields } of commits) {
    apply(dates, parseNameStatus(fields), day, (p) => show(`${hash}^:${p}`), (p) => show(`${hash}:${p}`));
  }
  writeDates(dates);
  console.log(`[workflow-dates] ${Object.keys(dates).length} workflows from ${commits.length} commits`);
};

const check = () => {
  const dates = readDates();
  const files = listFiles(path.resolve(WORKFLOW_ROOT), { extensions: [".json"] }).map((f) =>
    path.relative(path.resolve(WORKFLOW_ROOT), f).split(path.sep).join("/"),
  );
  const failures = [];
  for (const key of files) if (!dates[key]) failures.push(`${key}: no date in src/_data/workflowDates.json (commit it, or run scripts/workflow-dates.mjs --staged)`);
  const present = new Set(files);
  for (const [key, day] of Object.entries(dates)) {
    if (!present.has(key)) failures.push(`src/_data/workflowDates.json: ${key} no longer exists`);
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) failures.push(`src/_data/workflowDates.json: ${key}: "${day}" is not YYYY-MM-DD`);
  }
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`[workflow-dates] ${files.length} workflows dated`);
};

const mode = process.argv[2];
if (mode === "--staged") staged();
else if (mode === "--backfill") backfill();
else if (mode === "--check") check();
else {
  console.error("Usage: node scripts/workflow-dates.mjs --staged | --backfill | --check");
  process.exit(2);
}
