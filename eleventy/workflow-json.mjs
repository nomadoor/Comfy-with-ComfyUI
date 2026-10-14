// Workflow JSON rows: the inline row a Markdown link or `{% workflow %}` becomes, the
// `{% workflowPicker %}` dropdown, and the Performance popup both of them can carry.
import fsSync from "node:fs";
import path from "node:path";
import { DEFAULT_LANG, escapeHTML, getRenderLang, hashString, siteData } from "./site.mjs";

const ICON_SPRITES = {
  copy: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="var(--icon-stroke-width, 1.5)" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect class="icon__fill" x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>',
  download: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="var(--icon-stroke-width, 1.5)" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
};
const WORKFLOW_I18N = siteData?.i18n?.workflow || {};
const WORKFLOW_ROOT = path.join(process.cwd(), "src", "workflows");
const WORKFLOW_LABELS = {
  copyLabel: "Copy",
  downloadLabel: "Download",
  copiedLabel: "Copied",
  downloadedLabel: "Downloaded",
  performanceLabel: "Performance",
  levelLabel: "level"
};

export function extractInlineJsonLink(children = []) {
  if (!children.length) return null;
  const meaningful = children.filter((token) => {
    if (!token) return false;
    if (token.type === "softbreak" || token.type === "hardbreak") return false;
    if (token.type === "text" && token.content.trim().length === 0) return false;
    return true;
  });
  if (meaningful.length < 2) return null;
  const open = meaningful[0];
  const closeIdx = meaningful.findIndex((token) => token.type === "link_close");
  if (open.type !== "link_open" || closeIdx === -1) {
    return null;
  }
  if (closeIdx !== meaningful.length - 1) {
    return null;
  }
  const href = open.attrGet("href") || "";
  if (!href.toLowerCase().endsWith(".json")) {
    return null;
  }
  const textContent = meaningful.slice(1, closeIdx).map((token) => token.content || "").join("").trim();
  return { href, text: textContent };
}

function getWorkflowLabel(key, lang = DEFAULT_LANG) {
  const langKey = lang || DEFAULT_LANG;
  const localized = WORKFLOW_I18N?.[key]?.[langKey];
  if (localized) return localized;
  const fallback = WORKFLOW_I18N?.[key]?.[DEFAULT_LANG];
  if (fallback) return fallback;
  return WORKFLOW_LABELS[key] || "";
}

function resolveJsonDiskPath(href = "", env = {}) {
  if (!href || /^https?:\/\//i.test(href)) {
    return null;
  }
  const cleanHref = href.split("?")[0].split("#")[0];
  if (!cleanHref.toLowerCase().endsWith(".json")) {
    return null;
  }
  let candidate;
  if (cleanHref.startsWith("/")) {
    candidate = path.join(process.cwd(), "src", cleanHref.replace(/^\//, ""));
  } else if (cleanHref.startsWith(".")) {
    const baseInput = env.page?.inputPath
      ? path.dirname(path.join(process.cwd(), env.page.inputPath))
      : path.join(process.cwd(), "src");
    candidate = path.resolve(baseInput, cleanHref);
  } else {
    return null;
  }
  const normalized = path.normalize(candidate);
  if (!normalized.startsWith(WORKFLOW_ROOT)) {
    return null;
  }
  return normalized;
}

function getIconMarkup(name) {
  return ICON_SPRITES[name] || "";
}

function getWorkflowBasename(file = "") {
  const clean = String(file).split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || clean;
}

function normalizeSamplerSpeed(input) {
  const match = String(input || "").trim().match(/^(\d+(?:\.\d+)?)\s+(s\/it|it\/s)$/);
  if (!match) return "";
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) return "";
  if (match[2] === "s/it") return `${match[1]} s/it`;

  const secondsPerIteration = 1 / value;
  const roundedSeconds = Number(secondsPerIteration.toPrecision(2));
  return `${roundedSeconds} s/it`;
}

function normalizeWorkflowPerformance(input) {
  if (!input || typeof input !== "object") return null;
  const level = Number(input.level);
  if (!Number.isInteger(level) || level < 1 || level > 3) return null;
  const rawRuns = Array.isArray(input.runs) ? input.runs : [input];
  const runs = rawRuns
    .map((run) => {
      if (!run || typeof run !== "object") return null;
      const gpu = String(run.gpu || "").trim();
      const ram = String(run.ram || "").trim();
      const time = String(run.time || "").trim();
      if (!gpu || !ram || !time) return null;
      const tagValues = Array.isArray(run.tags) ? run.tags : run.tags ? [run.tags] : [];
      const tags = tagValues.map((tag) => String(tag).trim()).filter(Boolean);
      const samplerValues = Array.isArray(run.samplers) ? run.samplers : [];
      const samplers = samplerValues
        .map((sampler) => {
          if (!sampler || typeof sampler !== "object") return null;
          const name = String(sampler.name || "").trim();
          const speed = normalizeSamplerSpeed(sampler.speed);
          if (!speed) return null;
          return { name, speed };
        })
        .filter(Boolean);
      const validSamplers = samplers.length > 1 && samplers.some((sampler) => !sampler.name)
        ? []
        : samplers;
      return { gpu, ram, time, tags, samplers: validSamplers };
    })
    .filter(Boolean);
  return runs.length ? { level, runs } : null;
}

function renderPerformanceMeter() {
  return '<span class="workflow-performance__meter" aria-hidden="true"></span>';
}

function renderPerformanceRuns(performance, { totalTimeLabel, samplerLabel }) {
  return performance.runs.map((run) => {
    const tags = run.tags.length
      ? `<span class="workflow-performance__tags">${run.tags.map((tag) => `<span class="workflow-performance__tag">${escapeHTML(tag)}</span>`).join("")}</span>`
      : "";
    const samplerMetrics = run.samplers.map((sampler) => `<div class="workflow-performance__metric workflow-performance__metric--sampler">
          <span class="workflow-performance__metric-label">${escapeHTML(sampler.name || samplerLabel)}</span>
          <span class="workflow-performance__sampler-speed">${escapeHTML(sampler.speed)}</span>
        </div>`).join("");
    return `<div class="workflow-performance__run">
      <span class="workflow-performance__gpu"><span class="workflow-performance__data-icon workflow-performance__data-icon--gpu" aria-hidden="true"></span>${escapeHTML(run.gpu)}</span>
      <div class="workflow-performance__metric workflow-performance__metric--total">
        <span class="workflow-performance__metric-label">${escapeHTML(totalTimeLabel)}</span>
        <span class="workflow-performance__time">${escapeHTML(run.time)}</span>
      </div>
      <span class="workflow-performance__details"><span class="workflow-performance__ram"><span class="workflow-performance__data-icon workflow-performance__data-icon--ram" aria-hidden="true"></span>${escapeHTML(run.ram)}</span>${tags}</span>
      ${samplerMetrics}
    </div>`;
  }).join("");
}

function renderPerformancePopup(performance, { id, label, totalTimeLabel, samplerLabel, measurementNote, file = "", hidden = false }) {
  return `<div class="workflow-performance__popup" id="${id}" role="tooltip" data-performance-level="${performance.level}"${file ? ` data-performance-file="${escapeHTML(file)}"` : ""}${hidden ? " hidden" : ""} data-performance-popup>
      <div class="workflow-performance__heading">${escapeHTML(label)}</div>
      <div class="workflow-performance__runs">${renderPerformanceRuns(performance, { totalTimeLabel, samplerLabel })}</div>
      <div class="workflow-performance__measurement-note">${escapeHTML(measurementNote)}</div>
    </div>`;
}

function renderWorkflowPerformance(performance, { fileName, id, lang = DEFAULT_LANG }) {
  if (!performance) return "";
  const popupId = `${id}-performance`;
  const performanceLabel = getWorkflowLabel("performanceLabel", lang);
  const levelLabel = getWorkflowLabel("levelLabel", lang);
  const totalTimeLabel = getWorkflowLabel("totalTimeLabel", lang);
  const samplerLabel = getWorkflowLabel("samplerLabel", lang);
  const measurementNote = getWorkflowLabel("performanceMeasurementNote", lang);
  return `<div class="workflow-performance" data-workflow-performance data-performance-label="${escapeHTML(performanceLabel)}" data-level-label="${escapeHTML(levelLabel)}">
    <button class="workflow-performance__trigger" type="button" aria-label="${escapeHTML(performanceLabel)} ${escapeHTML(levelLabel)} ${performance.level}: ${escapeHTML(fileName)}" aria-describedby="${popupId}" aria-expanded="false" data-level="${performance.level}" data-performance-trigger>
      ${renderPerformanceMeter(performance.level)}
    </button>
    ${renderPerformancePopup(performance, { id: popupId, label: performanceLabel, totalTimeLabel, samplerLabel, measurementNote })}
  </div>`;
}

function renderWorkflowPickerPerformance(items, defaultIndex, pickerId, lang = DEFAULT_LANG) {
  const entries = items
    .map((item, index) => ({ ...item, index }))
    .filter((entry) => entry.performance);
  if (!entries.length) return "";
  const selected = entries.find((entry) => entry.index === defaultIndex) || null;
  const fallback = selected || entries[0];
  const popupId = `${pickerId}-performance-${fallback.index}`;
  const performanceLabel = getWorkflowLabel("performanceLabel", lang);
  const levelLabel = getWorkflowLabel("levelLabel", lang);
  const totalTimeLabel = getWorkflowLabel("totalTimeLabel", lang);
  const samplerLabel = getWorkflowLabel("samplerLabel", lang);
  const measurementNote = getWorkflowLabel("performanceMeasurementNote", lang);
  const popups = entries.map((entry) => renderPerformancePopup(entry.performance, {
    id: `${pickerId}-performance-${entry.index}`,
    label: performanceLabel,
    totalTimeLabel,
    samplerLabel,
    measurementNote,
    file: entry.file,
    hidden: entry.index !== defaultIndex
  })).join("");
  return `<div class="workflow-performance"${selected ? "" : " hidden"} data-workflow-performance data-picker-performance data-performance-label="${escapeHTML(performanceLabel)}" data-level-label="${escapeHTML(levelLabel)}">
    <button class="workflow-performance__trigger" type="button" aria-label="${escapeHTML(performanceLabel)} ${escapeHTML(levelLabel)} ${fallback.performance.level}: ${escapeHTML(fallback.name)}" aria-describedby="${popupId}" aria-expanded="false" data-level="${fallback.performance.level}" data-performance-trigger>
      ${renderPerformanceMeter(fallback.performance.level)}
    </button>
    ${popups}
  </div>`;
}

export function renderJsonLinkRow(linkInfo, env, performanceInput = null) {
  const diskPath = resolveJsonDiskPath(linkInfo.href, env);
  if (!diskPath) {
    return null;
  }
  if (!fsSync.existsSync(diskPath)) {
    return null;
  }
  // Root-absolute URL so Copy/Download do not depend on the page URL at click time.
  const jsonUrl = `/${path.relative(path.join(process.cwd(), "src"), diskPath).split(path.sep).map(encodeURIComponent).join("/")}`;
  const counterState = env.ctx && typeof env.ctx === "object" ? env.ctx : env;
  counterState.__jsonLinkCounter = Number.isInteger(counterState.__jsonLinkCounter)
    ? counterState.__jsonLinkCounter + 1
    : 1;
  const pageKey = (env.page?.url || "page").replace(/[^a-z0-9]+/gi, "-");
  const fileName = path.basename(linkInfo.href.split("?")[0]);
  const baseKey = path.basename(fileName, path.extname(fileName)).replace(/[^a-z0-9]+/gi, "-") || "wf";
  const copyTargetId = `workflow-json-inline-${pageKey}-${baseKey}-${counterState.__jsonLinkCounter}`;
  const lang = getRenderLang(env);
  const copyLabel = getWorkflowLabel("copyLabel", lang);
  const downloadLabel = getWorkflowLabel("downloadLabel", lang);
  const copiedLabel = getWorkflowLabel("copiedLabel", lang);
  const downloadedLabel = getWorkflowLabel("downloadedLabel", lang);
  const copyIcon = getIconMarkup("copy");
  const downloadIcon = getIconMarkup("download");
  const escapedFile = escapeHTML(fileName);
  const performance = normalizeWorkflowPerformance(performanceInput);
  const performanceMarkup = renderWorkflowPerformance(performance, { fileName, id: copyTargetId, lang });
  return `<div class="workflow-json workflow-json--inline">
  <div class="workflow-json__row">
    <span class="workflow-json__filename">${escapedFile}</span>
    <div class="workflow-json__actions">
      <button class="workflow-json__icon" type="button" aria-label="${escapeHTML(copyLabel)} ${escapedFile}" data-copy-json="${copyTargetId}" data-json-src="${escapeHTML(jsonUrl)}" data-label="${escapeHTML(copyLabel)}" data-success-label="${escapeHTML(copiedLabel)}">
        ${copyIcon}
      </button>
      <a class="workflow-json__icon" href="${escapeHTML(jsonUrl)}" download="${escapedFile}" data-no-swup aria-label="${escapeHTML(downloadLabel)} ${escapedFile}" data-download-json="${copyTargetId}-download" data-label="${escapeHTML(downloadLabel)}" data-success-label="${escapeHTML(downloadedLabel)}">
        ${downloadIcon}
      </a>
      ${performanceMarkup}
    </div>
  </div>
</div>`;
}

export function registerWorkflowShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode("workflow", function (file, performance = {}) {
    const env = this || {};
    const href = typeof file === "string" ? file.trim() : "";
    if (!href) return "";
    return renderJsonLinkRow({ href, text: "" }, env, performance) || "";
  });

  eleventyConfig.addShortcode("workflowPicker", function (...rawArgs) {
    const env = this || {};
    const inputArgs = rawArgs.length === 1 && Array.isArray(rawArgs[0]) ? rawArgs[0] : rawArgs;
    const normalized = inputArgs
      .map((value) => {
        if (typeof value === "string") {
          return { file: value.trim(), performance: null };
        }
        if (value && typeof value === "object" && typeof value.file === "string") {
          return { file: value.file.trim(), performance: normalizeWorkflowPerformance(value) };
        }
        return null;
      })
      .filter(Boolean);

    if (!normalized.length) return "";

    const items = [];
    let defaultIndex = -1;

    normalized.forEach((entry) => {
      const isDefault = entry.file.startsWith("!");
      const file = isDefault ? entry.file.slice(1).trim() : entry.file;
      if (!file) return;
      const name = getWorkflowBasename(file);
      if (isDefault && defaultIndex === -1) {
        defaultIndex = items.length;
      }
      items.push({ file, name, performance: entry.performance });
    });

    if (!items.length) return "";
    if (defaultIndex < 0) defaultIndex = 0;

    // `this` is a fresh object per call; the page context (env.ctx) lives for the whole page,
    // so the counter keeps two pickers with the same files from sharing an id.
    const counterState = env.ctx && typeof env.ctx === "object" ? env.ctx : env;
    counterState.__workflowPickerCounter = (counterState.__workflowPickerCounter || 0) + 1;
    const pickerKey = hashString(items.map((item) => item.file).join("|"));
    const pickerId = `workflow-picker-${pickerKey}-${counterState.__workflowPickerCounter}`;
    const lang = getRenderLang(env);
    const copyLabel = getWorkflowLabel("copyLabel", lang);
    const downloadLabel = getWorkflowLabel("downloadLabel", lang);
    const copiedLabel = getWorkflowLabel("copiedLabel", lang);
    const downloadedLabel = getWorkflowLabel("downloadedLabel", lang);
    const copyErrorLabel = getWorkflowLabel("copyErrorLabel", lang);
    const selectLabel = getWorkflowLabel("selectLabel", lang);
    const copyIcon = getIconMarkup("copy");
    const downloadIcon = getIconMarkup("download");

    const defaultFile = items[defaultIndex].file;
    const defaultName = items[defaultIndex].name;
    const listId = `${pickerId}-list`;
    const toggleId = `${pickerId}-toggle`;
    const options = items.map((item, index) => {
      const isSelected = index === defaultIndex;
      return `<li class="workflow-picker__option${isSelected ? " is-selected" : ""}" role="option" data-value="${escapeHTML(item.file)}" aria-selected="${isSelected ? "true" : "false"}">${escapeHTML(item.name)}</li>`;
    }).join("");
    const performanceMarkup = renderWorkflowPickerPerformance(items, defaultIndex, pickerId, lang);

    return `<div class="workflow-json workflow-json--picker" data-workflow-picker="${pickerId}" data-error-label="${escapeHTML(copyErrorLabel)}">
  <div class="workflow-json__row workflow-json__row--picker">
    <div class="workflow-picker" data-workflow-picker-control>
      <button class="workflow-picker__button" type="button" id="${toggleId}" aria-haspopup="listbox" aria-expanded="false" aria-controls="${listId}" aria-label="${escapeHTML(selectLabel)}" data-workflow-picker-toggle>
        <span class="workflow-picker__label">${escapeHTML(defaultName)}</span>
        <span class="workflow-picker__caret" aria-hidden="true"></span>
      </button>
      <ul class="workflow-picker__list" id="${listId}" role="listbox" aria-labelledby="${toggleId}" data-workflow-picker-list>
        ${options}
      </ul>
    </div>
    <div class="workflow-json__actions">
      <button class="workflow-json__icon" type="button" aria-label="${escapeHTML(copyLabel)} ${escapeHTML(defaultName)}" data-workflow-picker-copy data-label="${escapeHTML(copyLabel)}" data-success-label="${escapeHTML(copiedLabel)}">
        ${copyIcon}
      </button>
      <a class="workflow-json__icon" href="${escapeHTML(defaultFile)}" download="${escapeHTML(defaultName)}" data-no-swup aria-label="${escapeHTML(downloadLabel)} ${escapeHTML(defaultName)}" data-workflow-picker-download data-label="${escapeHTML(downloadLabel)}" data-success-label="${escapeHTML(downloadedLabel)}">
        ${downloadIcon}
      </a>
      ${performanceMarkup}
    </div>
  </div>
  <span class="workflow-json__message" role="status" aria-live="polite" data-workflow-picker-message></span>
</div>`;
  });
}
