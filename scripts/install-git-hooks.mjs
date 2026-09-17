#!/usr/bin/env node
// Point git at .githooks (runs on `npm install` via the prepare script). No-op outside a git work tree
// and on CI / Cloudflare Pages builds.

import { spawnSync } from "node:child_process";

const inWorkTree = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { encoding: "utf8" }).stdout?.trim() === "true";
if (process.env.CI || process.env.CF_PAGES || !inWorkTree) process.exit(0);

const current = spawnSync("git", ["config", "--get", "core.hooksPath"], { encoding: "utf8" }).stdout?.trim();
if (current !== ".githooks") {
  spawnSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "inherit" });
  console.log("[hooks] git core.hooksPath set to .githooks");
}
