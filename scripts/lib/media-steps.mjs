// Media step cards. Each `mediaRow` shortcode renders one step (media + explanation); after a page is
// rendered, `groupMediaSteps` gathers adjacent steps of the same kind into one card that shows one
// step at a time (image frame on top, explanation below). src/assets/js/media-steps.js drives it.

const LABELS = {
  ja: { steps: "手順", prev: "前の手順", next: "次の手順" },
  en: { steps: "Steps", prev: "Previous step", next: "Next step" },
  zh: { steps: "步骤", prev: "上一步", next: "下一步" }
};

// Card kinds. Breakdowns explain the workflow above them (optional reading, the only kind in the
// accent colour); workflow steps carry their own workflow JSON; Notes rows are walkthroughs.
const KINDS = {
  breakdown: {
    label: "Deep dive",
    icon: '<circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>'
  },
  workflows: {
    label: "Workflows",
    icon: '<path d="M6 3A3 3 0 106 9A3 3 0 006 3Z"></path><path d="M18 15A3 3 0 1018 21A3 3 0 0018 15Z"></path><path d="M6 9V12A3 3 0 009 15H15A3 3 0 0118 18"></path><path d="M18 3A3 3 0 1018 9A3 3 0 0018 3Z"></path><path d="M6 9V12A3 3 0 009 15H15A3 3 0 0018 12V9"></path>'
  },
  walkthrough: {
    label: "Walkthrough",
    icon: '<path d="M15 3V19M15 3L9 5M15 3L21 5V21L15 19M15 19L9 21M9 5V21M9 5L3 3V19L9 21"></path>'
  }
};

// The image frame takes the card's median aspect ratio, clamped to this range.
const FRAME_RATIO_MIN = 1.2;
const FRAME_RATIO_MAX = 2.4;
const FRAME_RATIO_DEFAULT = 16 / 9;

const escapeHTML = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const stripTags = (html = "") => html.replace(/<[^>]+>/g, "");


// Step headings are often written "1. Name"; the progress bar numbers steps already.
const stripNumber = (text = "") => text.replace(/^\s*\d+\s*[.．]\s*/, "");

const chevron = (d) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CHEVRON_LEFT = chevron("M15 4L7 12L15 20");
const CHEVRON_RIGHT = chevron("M9 20L17 12L9 4");

const kindIcon = (kind) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${KINDS[kind].icon}</svg>`;

// End index of the <div> that opens at `start` (nested divs included), or -1.
const findDivEnd = (html, start) => {
  const tag = /<div\b|<\/div>/g;
  tag.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tag.exec(html))) {
    depth += match[0] === "</div>" ? -1 : 1;
    if (depth === 0) return match.index + match[0].length;
  }
  return -1;
};

// Inner HTML of the first <div class="className"> in `html`.
const innerOf = (html, className) => {
  const start = html.indexOf(`<div class="${className}">`);
  if (start === -1) return "";
  const end = findDivEnd(html, start);
  return end === -1 ? "" : html.slice(start + className.length + 14, end - 6);
};

/**
 * One step, as the `mediaRow` shortcode renders it.
 * @param {{ media: string, files: string, body: string, ratio: number | null }} step
 *   media: image or video markup; files: rendered `mediaFooter` (workflow file rows);
 *   body: rendered explanation; ratio: media width / height when known.
 */
export function renderMediaStep({ media = "", files = "", body = "", ratio = null }) {
  // A leading bold-only paragraph is the step's title.
  let title = "";
  const text = body.replace(/^\s*<p><strong>([\s\S]*?)<\/strong><\/p>/, (match, inner) => {
    const clean = stripNumber(inner);
    title = stripTags(clean).trim();
    return `<p class="media-steps__title">${clean}</p>`;
  });
  const kind = /data-json-src/.test(files + body) ? "workflows" : "breakdown";
  const attrs = [`data-kind="${kind}"`, `data-title="${escapeHTML(title)}"`];
  if (ratio) attrs.push(`data-ratio="${ratio.toFixed(3)}"`);
  // The workflow file row opens the explanation, so it sits in one place whatever the image's size.
  return `<div class="media-step" ${attrs.join(" ")}><div class="media-step__media">${media}</div><div class="media-step__text">${files ? `<div class="media-steps__files">${files}</div>` : ""}${text}</div></div>`;
}

const readSteps = (html) => {
  const steps = [];
  const open = /<div class="media-step" ([^>]*)>/g;
  let match;
  while ((match = open.exec(html))) {
    const end = findDivEnd(html, match.index);
    if (end === -1) break;
    const block = html.slice(match.index, end);
    const attr = (name) => match[1].match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
    steps.push({
      start: match.index,
      end,
      kind: attr("data-kind"),
      title: attr("data-title"),
      ratio: Number(attr("data-ratio")) || null,
      media: innerOf(block, "media-step__media"),
      text: innerOf(block, "media-step__text")
    });
    open.lastIndex = end;
  }
  return steps;
};

// Adjacent steps (only whitespace between) of the same kind share one card.
const groupRuns = (html, steps) => {
  const runs = [];
  for (const step of steps) {
    const run = runs.at(-1);
    const prev = run?.at(-1);
    if (prev && prev.kind === step.kind && !html.slice(prev.end, step.start).trim()) run.push(step);
    else runs.push([step]);
  }
  return runs;
};

const frameRatio = (steps) => {
  const ratios = steps.map((step) => step.ratio).filter(Boolean).sort((a, b) => a - b);
  const median = ratios.length ? ratios[Math.floor(ratios.length / 2)] : FRAME_RATIO_DEFAULT;
  return Math.min(Math.max(median, FRAME_RATIO_MIN), FRAME_RATIO_MAX).toFixed(3);
};

// The card is titled after the last heading before it.
const topicBefore = (html, index) => {
  const headings = [...html.slice(0, index).matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/g)];
  return stripTags(headings.at(-1)?.[2] || "").trim();
};

const renderCard = (steps, { kind, topic, labels }) => {
  const multi = steps.length > 1;
  const active = (i) => (i === 0 ? " is-active" : "");
  const slides = steps.map((step, i) => `<div class="media-steps__slide${active(i)}">${step.media}</div>`).join("");
  const texts = steps.map((step, i) => `<div class="media-steps__text${active(i)}">${step.text}</div>`).join("");
  const header = `<div class="media-steps__header"><span class="media-steps__icon">${kindIcon(kind)}</span><span class="media-steps__kicker">${KINDS[kind].label}</span>${topic ? `<span class="media-steps__topic">${escapeHTML(topic)}</span>` : ""}</div>`;
  const stage = `<div class="media-steps__stage" style="--media-steps-frame:${frameRatio(steps)}">${slides}</div>`;
  const textStack = `<div class="media-steps__texts">${texts}</div>`;

  if (!multi) {
    return `<div class="media-steps media-steps--${kind} media-steps--single"><div class="media-steps__card">${header}${stage}${textStack}</div></div>`;
  }

  const segments = steps
    .map(
      (step, i) =>
        `<button type="button" class="media-steps__segment${active(i)}" data-media-steps-go="${i}"${step.title ? ` title="${step.title}"` : ""}${i === 0 ? ' aria-current="step"' : ""}><span class="media-steps__bar" aria-hidden="true"></span><span class="media-steps__segment-label">${step.title || i + 1}</span></button>`
    )
    .join("");
  // Edge zones are pointer-only shortcuts; the footer buttons carry the accessible names.
  const edges = `<button type="button" class="media-steps__edge media-steps__edge--prev" data-media-steps-prev tabindex="-1" aria-hidden="true">${CHEVRON_LEFT}</button><button type="button" class="media-steps__edge media-steps__edge--next" data-media-steps-next tabindex="-1" aria-hidden="true">${CHEVRON_RIGHT}</button>`;
  const footer = `<div class="media-steps__footer"><button type="button" class="media-steps__nav media-steps__nav--prev" data-media-steps-prev aria-label="${escapeHTML(labels.prev)}">${CHEVRON_LEFT}<span class="media-steps__nav-title" data-media-steps-prev-title></span></button><button type="button" class="media-steps__nav media-steps__nav--next" data-media-steps-next aria-label="${escapeHTML(labels.next)}"><span class="media-steps__nav-title" data-media-steps-next-title>${steps[1].title}</span>${CHEVRON_RIGHT}</button></div>`;
  return `<div class="media-steps media-steps--${kind}" data-media-steps><div class="media-steps__card">${header}${edges}<div class="media-steps__progress" role="group" aria-label="${escapeHTML(labels.steps)}">${segments}</div>${stage}${textStack}${footer}</div></div>`;
};

/**
 * Replace the page's media steps with step cards.
 * @param {string} html rendered page
 * @param {{ lang?: string, section?: string }} page
 */
export function groupMediaSteps(html, { lang = "ja", section = "" } = {}) {
  if (!html.includes('<div class="media-step" ')) return html;
  const labels = LABELS[lang] || LABELS.ja;
  let out = "";
  let cursor = 0;
  for (const steps of groupRuns(html, readSteps(html))) {
    const kind = section === "notes" ? "walkthrough" : steps[0].kind;
    out += html.slice(cursor, steps[0].start);
    out += renderCard(steps, { kind, topic: topicBefore(html, steps[0].start), labels });
    cursor = steps.at(-1).end;
  }
  return out + html.slice(cursor);
}
