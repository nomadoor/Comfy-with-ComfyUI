#!/usr/bin/env node
// Put a `## guide` section with the article links (JA / EN / ZH) at the end of each workflow's
// first MarkdownNote, so a workflow opened on its own still leads back to its article. It goes
// after `## models` and stays plain: the note is about running the workflow, not about the site.
//
// Usage: node scripts/add-workflow-guide.mjs <section>/<slug> <workflow.json|dir>... [--write]
//
// Only the note text changes. An existing `## guide` section is replaced, wherever it is.
// Without --write it only prints what would change.
import fs from "node:fs";
import path from "node:path";

const SITE = JSON.parse(fs.readFileSync("src/_data/site.json", "utf8")).url;
const LANGS = [
  ["ja", "日本語"],
  ["en", "English"],
  ["zh", "中文"],
];

const args = process.argv.slice(2);
const write = args.includes("--write");
const [article, ...targets] = args.filter((a) => a !== "--write");
if (!article || !/^[\w-]+\/[\w-]+$/.test(article) || targets.length === 0) {
  console.error("Usage: node scripts/add-workflow-guide.mjs <section>/<slug> <workflow.json|dir>... [--write]");
  process.exit(2);
}

const langs = LANGS.filter(([lang]) => fs.existsSync(path.join("src", "content", lang, `${article}.md`)));
if (langs.length === 0) {
  console.error(`No article found for ${article}`);
  process.exit(1);
}
const guide = ["## guide", "", ...langs.map(([lang, label]) => `- [${label}](${SITE}/${lang}/${article}/)`)].join("\n");

const listWorkflows = (target) =>
  fs.statSync(target).isDirectory()
    ? fs.readdirSync(target).filter((f) => f.endsWith(".json")).sort().map((f) => path.join(target, f))
    : [target];

let changed = 0;
const skipped = [];
for (const file of targets.flatMap(listWorkflows)) {
  const raw = fs.readFileSync(file, "utf8");
  const workflow = JSON.parse(raw);
  const note = (workflow.nodes ?? []).find((n) => n.type === "MarkdownNote" && typeof n.widgets_values?.[0] === "string");
  if (!note) {
    skipped.push(`${file}: no MarkdownNote`);
    continue;
  }
  // Drop any earlier guide section (up to the next heading), then append the current one.
  const rest = note.widgets_values[0].replace(/^#{2,3} guide\n[\s\S]*?(?=^#{2,3} |(?![\s\S]))/m, "").trim();
  const text = `${rest}\n\n${guide}`;
  if (text === note.widgets_values[0]) continue;
  note.widgets_values[0] = text;
  // Newer frontends can restore widget values by name; keep that copy in step.
  if (note.widgets_values_named && typeof note.widgets_values_named === "object") note.widgets_values_named.text = text;
  changed += 1;
  console.log(`${write ? "updated" : "would update"}: ${path.basename(file)} node ${note.id}`);
  if (write) {
    const eol = raw.endsWith("\r\n") ? "\r\n" : raw.endsWith("\n") ? "\n" : "";
    fs.writeFileSync(file, JSON.stringify(workflow, null, 2) + eol);
  }
}

console.log(`\n${changed} workflow${changed === 1 ? "" : "s"} ${write ? "updated" : "to update"}.\n\n${guide}`);
if (skipped.length) console.log(`\nSkipped:\n  ${skipped.join("\n  ")}`);
