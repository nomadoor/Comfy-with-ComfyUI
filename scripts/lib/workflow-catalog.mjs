// Workflow catalog (/workflows/index.json): every workflow JSON an article links, with the articles
// that show it, the heading it sits under, the models and custom nodes it needs, and the measured
// performance the article gives. Built after each build from the article sources and the workflow
// files, so it cannot drift from what the pages show. Meant for agents that look for a workflow
// rather than for an article (llms.txt and the API catalog point here).

import fs from "node:fs";
import path from "node:path";
import { splitFrontmatter } from "./files.mjs";
import { eachNode } from "./workflow-graph.mjs";
import { readDates } from "./workflow-dates.mjs";

export const CATALOG_SCHEMA_VERSION = 1;
const WORKFLOW_ROOT = path.resolve("src", "workflows");
const CONTENT_ROOT = path.resolve("src", "content");
const LANG_ORDER = ["ja", "en", "zh"];
// Wider than MODEL_EXT in workflow-graph.mjs on purpose: the catalog also lists ONNX models
// (detectors and the like) that readers download, which the Pod checks do not need to know.
const MODEL_FILE = /\.(safetensors|gguf|ckpt|pt|pth|bin|sft|onnx)$/i;

// `{% workflow "/workflows/…json", level=…, … %}`, `{% workflowPicker "!/workflows/…json", … %}` and
// plain `[](/workflows/…json)` links (or `(../../../workflows/…json)`) all name the file the page
// shows. Only those forms count: a path quoted in a shortcode or picker, or the target of a link. A
// path merely mentioned in the text, or another site's /workflows/, is not a workflow the page shows.
const WORKFLOW_REF = /(?<="!?|\(|\((?:\.\.\/)*\.\.)\/workflows\/[^\s"')]+?\.json(?=[")])/g;
const SHORTCODE = /\{%\s*workflow\s+"(\/workflows\/[^"]+\.json)"([^%]*)%\}/g;

// The catalog is written after every build, so a page with broken frontmatter is listed without
// its metadata instead of stopping the build (check:content reports it).
export const articleFrontmatter = (text) => {
  try {
    return splitFrontmatter(text);
  } catch {
    return { data: {}, body: text.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "") };
  }
};

const stripMarkdown = (text) =>
  text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*+/g, "") // emphasis; underscores stay, they are mostly snake_case names
    .trim();

// The `{% workflow %}` arguments as the article writes them (see ops/adr/2026-09-21-workflow-performance.md).
export const parsePerformance = (args) => {
  const level = args.match(/\blevel=(\d)/)?.[1];
  if (!level) return null;
  const text = (key) => args.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1] ?? null;
  const tags = [...(args.match(/\btags=\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([^"]*)"/g)].map((m) => m[1]);
  const speeds = [...(args.match(/\bsamplers=\[([\s\S]*)\]/)?.[1] ?? "").matchAll(/speed:\s*"([^"]*)"/g)].map((m) => m[1]);
  return { level: Number(level), gpu: text("gpu"), ram: text("ram"), time: text("time"), tags, sampler_speeds: speeds };
};

// Where each workflow appears in one article: the nearest heading above it, and its performance.
// Fenced code is skipped: a `##` or a workflow path inside it is an example, not the page's own.
export const scanArticle = (body) => {
  const found = new Map();
  let heading = null;
  let fence = null;
  for (const line of body.split("\n")) {
    // A fence may open inside a list item (`- ```text`); it closes on a run of the same character at
    // least as long, with nothing after it (CommonMark).
    if (fence) {
      const close = line.match(/^\s*(`{3,}|~{3,})\s*$/)?.[1];
      if (close && close[0] === fence[0] && close.length >= fence.length) fence = null;
      continue;
    }
    const open = line.match(/^\s*(?:(?:[-*+]|\d+[.)])\s+)?(`{3,}|~{3,})/)?.[1];
    if (open) {
      fence = open;
      continue;
    }
    const h = line.match(/^#{2,4}\s+(.+?)\s*#*\s*$/);
    if (h) {
      heading = stripMarkdown(h[1]);
      continue;
    }
    for (const ref of line.match(WORKFLOW_REF) ?? []) {
      if (!found.has(ref)) found.set(ref, { heading, performance: null });
    }
    for (const m of line.matchAll(SHORTCODE)) {
      const entry = found.get(m[1]);
      if (entry && !entry.performance) entry.performance = parsePerformance(m[2]);
    }
  }
  return found;
};

// Models: the loaders' `properties.models` (url and folder, as ComfyUI's missing-model dialog reads
// them); then the links in its note's `## models` list that no loader lists (older notes list them
// without folders, and a note may offer alternatives the loaders do not pick); failing both, just
// the file names its loaders ask for. Each model says which of the two it came from.
export const noteModels = (workflow) => {
  const models = new Map();
  for (const node of eachNode(workflow)) {
    if (node.type !== "MarkdownNote" && node.type !== "Note") continue;
    const text = String(node.widgets_values?.[0] ?? "");
    const section = text.match(/^##\s*models\s*\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/im)?.[1];
    if (!section) continue;
    let directory = null;
    for (const line of section.split("\n")) {
      const folder = line.match(/^-\s+([A-Za-z0-9_./-]+)\s*$/);
      if (folder) {
        directory = folder[1];
        continue;
      }
      const link = line.match(/^(\s*)-\s+\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)(?:\s*\(([^)]+)\))?/);
      if (!link) continue;
      const model = { name: link[2], directory: link[1] ? directory : null, url: link[3], size: link[4] ?? null };
      const key = `${model.directory ?? ""}/${model.name}`;
      if (!models.has(key)) models.set(key, model); // several notes may repeat the list
    }
  }
  return [...models.values()];
};

export const workflowFacts = (workflow) => {
  const fromLoaders = new Map();
  const customNodes = new Map();
  const askedFor = new Set();
  for (const node of eachNode(workflow)) {
    if (node.mode === 4) continue; // bypassed
    // Any widget naming a model file asks for one, whatever the node is called (custom loaders are
    // not always "…Loader"). Notes are text, not choices. widgets_values is a list for most nodes and
    // an object for some (VideoHelperSuite, for one).
    const widgets = /Note$/.test(node.type ?? "") ? [] : node.widgets_values;
    for (const value of Array.isArray(widgets) ? widgets : Object.values(widgets ?? {})) {
      if (typeof value === "string" && !value.includes("\n") && MODEL_FILE.test(value)) {
        askedFor.add(value.split(/[\\/]/).pop());
      }
    }
    for (const model of node.properties?.models ?? []) {
      if (model?.name && model?.url) {
        fromLoaders.set(`${model.directory ?? ""}/${model.name}`, { name: model.name, directory: model.directory ?? null, url: model.url, source: "loaders" });
      }
    }
    const { cnr_id: cnr, aux_id: aux } = node.properties ?? {};
    if (cnr && cnr !== "comfy-core") customNodes.set(cnr, { id: cnr, source: "registry" });
    else if (!cnr && aux) customNodes.set(aux, { id: aux, source: "github" });
  }
  const byLoaders = new Set([...fromLoaders.values()].map((m) => m.name));
  const fromNote = noteModels(workflow)
    .filter((m) => !byLoaders.has(m.name))
    .map((m) => ({ ...m, source: "note" }));
  const linked = [...fromLoaders.values(), ...fromNote];
  const known = new Set(linked.map((m) => m.name));
  const namesOnly = [...askedFor].filter((name) => !known.has(name)).map((name) => ({ name, directory: null, url: null, source: null }));
  const models = [...linked, ...namesOnly];
  return {
    models: models.sort((a, b) => `${a.directory ?? ""}/${a.name}`.localeCompare(`${b.directory ?? ""}/${b.name}`)),
    models_source: fromLoaders.size ? "loaders" : linked.length ? "note" : namesOnly.length ? "names_only" : "none",
    custom_nodes: [...customNodes.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };
};

/**
 * @param {{ siteURL: string, pages: { inputPath: string, url: string }[], dates?: Record<string, string> }} options
 *   `pages`: the built pages (Eleventy's results), so article URLs are the ones actually published.
 *   `dates`: src/_data/workflowDates.json by default (see workflow-dates.mjs).
 */
export const buildWorkflowCatalog = ({ siteURL, pages, dates = readDates() }) => {
  const site = siteURL.replace(/\/$/, "");
  const entries = new Map();
  for (const page of pages) {
    const input = path.resolve(page.inputPath);
    if (!input.startsWith(CONTENT_ROOT + path.sep) || !input.endsWith(".md") || !page.url) continue;
    const { data, body } = articleFrontmatter(fs.readFileSync(input, "utf8"));
    if (data.robots === "noindex" || data.draft === true) continue;
    for (const [ref, where] of scanArticle(body)) {
      const file = path.join(WORKFLOW_ROOT, ref.slice("/workflows/".length));
      if (!fs.existsSync(file)) continue;
      if (!entries.has(ref)) entries.set(ref, { file, articles: [] });
      entries.get(ref).articles.push({
        // The locale folder (src/content/<lang>/…) when the frontmatter does not say.
        lang: data.lang ?? path.relative(CONTENT_ROOT, input).split(path.sep)[0],
        title: data.title ?? null,
        url: new URL(page.url, `${site}/`).href,
        heading: where.heading,
        performance: where.performance,
      });
    }
  }

  const workflows = [...entries.entries()]
    .map(([ref, { file, articles }]) => {
      articles.sort((a, b) => LANG_ORDER.indexOf(a.lang) - LANG_ORDER.indexOf(b.lang) || a.url.localeCompare(b.url));
      // Performance is measured once and repeated in every language; the Japanese page is the source.
      const performance = articles.find((a) => a.lang === "ja" && a.performance)?.performance ?? articles.find((a) => a.performance)?.performance ?? null;
      return {
        name: path.basename(file),
        url: `${site}${ref}`,
        updated: dates[ref.slice("/workflows/".length)] ?? null,
        articles: articles.map(({ performance: _, ...article }) => article),
        performance,
        ...workflowFacts(JSON.parse(fs.readFileSync(file, "utf8"))),
      };
    })
    .sort((a, b) => a.url.localeCompare(b.url));

  return {
    schema_version: CATALOG_SCHEMA_VERSION,
    site,
    description:
      "Every ComfyUI workflow JSON published on Comfy with ComfyUI (CC0), with the articles that explain it. " +
      "Japanese articles are the source of truth. Workflow files are the ComfyUI UI format (open or drag into ComfyUI). " +
      "models_source tells where the model list comes from: loaders (the workflow's own properties.models, plus any model its Markdown note links that no loader lists), note (only links in its note), " +
      "names_only (only the file names its loaders ask for; find them through the article), or none (it picks no model file; a custom node may still download its own). " +
      "Each model's source says the same per model (loaders, note, or null for a bare file name). " +
      "A model with directory null does not say which models/ folder it belongs in. " +
      "updated is the last day the workflow's build changed (YYYY-MM-DD); filling in model or custom node metadata does not move it.",
    generated_at: new Date().toISOString(),
    count: workflows.length,
    workflows,
  };
};

export const writeWorkflowCatalog = ({ outDir, siteURL, pages }) => {
  const catalog = buildWorkflowCatalog({ siteURL, pages });
  const target = path.join(outDir, "workflows", "index.json");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(catalog, null, 2) + "\n");
  return catalog;
};
