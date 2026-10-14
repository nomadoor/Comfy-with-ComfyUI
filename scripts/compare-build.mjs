// Builds a base git ref and the current working tree into separate folders under .cache/compare
// and reports every output file that differs. Use it to prove that a refactor leaves the
// published site unchanged:
//
//   npm run compare:build            # base = main
//   npm run compare:build -- HEAD~1  # any ref
//
// The base is checked out in a temporary git worktree (never `git stash`), so uncommitted work
// stays where it is. Both builds run with the same environment: no deployment commit (asset
// version "dev"), no local media originals. Timestamps that change on every build are masked.
// Exit code 0 means identical output, 1 means differences, 2 means a build failed.
//
// Limits: the base build borrows this checkout's node_modules, so a dependency upgrade shows no
// difference here. Ordering in collections only became deterministic with the frontmatter-based
// page date; a base older than that may differ in sitemap, search index and related-card order.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORK = path.join(ROOT, ".cache", "compare");
const baseRef = process.argv[2] || "main";
const SHOW_LINES = 3;

// Values that differ between two builds of the same source.
// generated_at is the build time; site_commit is the checked-out commit, which differs between
// the base worktree and the working tree whenever HEAD is not the base ref.
const VOLATILE = [/"generated_at": "[^"]*"/g, /"site_commit": "[^"]*"/g];
// Only text is masked; anything else is compared byte for byte.
const TEXT_EXTENSIONS = new Set([".html", ".json", ".xml", ".txt", ".js", ".mjs", ".css", ".svg", ".md"]);

const buildEnv = () => {
  const env = { ...process.env };
  for (const key of ["CF_PAGES_COMMIT_SHA", "GITHUB_SHA", "COMFY_MEDIA_ORIGINALS", "COMFY_MEDIA_PREVIEW_CHANGED", "COMFY_MEDIA_FIXTURES"]) {
    delete env[key];
  }
  return env;
};

const build = (cwd, outDir, label) => {
  fs.rmSync(outDir, { recursive: true, force: true });
  const result = spawnSync("npx", ["@11ty/eleventy", `--output=${outDir}`, "--quiet"], {
    cwd,
    env: buildEnv(),
    encoding: "utf8"
  });
  if (result.status !== 0) {
    console.error(`[compare:build] ${label} build failed`);
    console.error(result.stdout, result.stderr);
    return false;
  }
  return true;
};

const git = (...args) => {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr.trim()}`);
};

const listFiles = (dir) => {
  const out = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(path.relative(dir, full));
    }
  };
  walk(dir);
  return out.sort();
};

const normalize = (buffer) => {
  let text = buffer.toString("utf8");
  for (const pattern of VOLATILE) text = text.replace(pattern, (match) => match.replace(/"[^"]*"$/, '"…"'));
  return text;
};

const firstDifference = (a, b) => {
  const left = a.split("\n");
  const right = b.split("\n");
  const index = left.findIndex((line, i) => line !== right[i]);
  const at = index === -1 ? left.length : index;
  return {
    line: at + 1,
    base: left.slice(at, at + SHOW_LINES),
    head: right.slice(at, at + SHOW_LINES)
  };
};

const baseSrc = path.join(WORK, "base-src");
const baseOut = path.join(WORK, "base");
const headOut = path.join(WORK, "head");

fs.mkdirSync(WORK, { recursive: true });
// A run that was interrupted can leave the worktree registered, or its folder deleted by hand.
if (fs.existsSync(baseSrc)) git("worktree", "remove", "--force", baseSrc);
git("worktree", "prune");
try {
  git("worktree", "add", "--detach", baseSrc, baseRef);
} catch (error) {
  console.error(`[compare:build] cannot check out ${baseRef}: ${error.message}`);
  process.exit(2);
}

let built = false;
try {
  fs.symlinkSync(path.join(ROOT, "node_modules"), path.join(baseSrc, "node_modules"), "dir");
  console.log(`[compare:build] building ${baseRef} …`);
  built = build(baseSrc, baseOut, baseRef);
  if (built) {
    console.log("[compare:build] building working tree …");
    built = build(ROOT, headOut, "working tree");
  }
} finally {
  git("worktree", "remove", "--force", baseSrc);
}
if (!built) process.exit(2);

const baseFiles = new Set(listFiles(baseOut));
const headFiles = new Set(listFiles(headOut));
const removed = [...baseFiles].filter((file) => !headFiles.has(file));
const added = [...headFiles].filter((file) => !baseFiles.has(file));
const changed = [];

for (const file of baseFiles) {
  if (!headFiles.has(file)) continue;
  const a = fs.readFileSync(path.join(baseOut, file));
  const b = fs.readFileSync(path.join(headOut, file));
  if (a.equals(b)) continue;
  if (!TEXT_EXTENSIONS.has(path.extname(file))) {
    changed.push({ file, line: 0, base: ["(binary)"], head: ["(binary)"] });
    continue;
  }
  const left = normalize(a);
  const right = normalize(b);
  if (left !== right) changed.push({ file, ...firstDifference(left, right) });
}

removed.forEach((file) => console.log(`- removed  ${file}`));
added.forEach((file) => console.log(`+ added    ${file}`));
changed.forEach(({ file, line, base, head }) => {
  console.log(`~ changed  ${file}:${line}`);
  base.forEach((text) => console.log(`    - ${text.slice(0, 200)}`));
  head.forEach((text) => console.log(`    + ${text.slice(0, 200)}`));
});

const total = removed.length + added.length + changed.length;
console.log(
  total
    ? `[compare:build] ${total} difference(s) against ${baseRef} (outputs kept in .cache/compare/).`
    : `[compare:build] identical to ${baseRef} (${headFiles.size} files).`
);
process.exit(total ? 1 : 0);
