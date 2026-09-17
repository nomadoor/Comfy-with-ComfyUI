#!/usr/bin/env node
// Print the Cloudflare WAF custom rule expression (action: Block) that only allows the
// transformation presets defined in src/_data/site.json (media.transforms). Update the rule in the
// dashboard whenever the presets change; any other /cdn-cgi/image/ request in the zone is blocked.

import fs from "node:fs";
import path from "node:path";

const { media: config = {} } = JSON.parse(fs.readFileSync(path.resolve("src", "_data", "site.json"), "utf8"));
const presets = Object.values(config.transforms || {});
if (!config.host || !presets.length) {
  console.error("src/_data/site.json に media.host / media.transforms がありません");
  process.exit(1);
}

const allowed = presets
  .map((preset) => `starts_with(http.request.uri.path, "/cdn-cgi/image/${preset}/images/")`)
  .join("\n     or ");

console.log(`(starts_with(http.request.uri.path, "/cdn-cgi/image/")
 and not (http.host eq "${config.host}"
   and (${allowed})))`);
