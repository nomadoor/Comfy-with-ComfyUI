// Media step cards. Each `mediaRow` shortcode renders one step (media + explanation); after a page is
// rendered, `groupMediaSteps` gathers adjacent steps of the same kind into one card. The card lists
// every step (image beside its explanation) so the reader only scrolls; the lightbox shows a step's
// explanation next to its enlarged image.

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

const escapeHTML = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const stripTags = (html = "") => html.replace(/<[^>]+>/g, "");

// Step titles are often written "1. Name"; the cards already show the steps in order.
const stripNumber = (text = "") => text.replace(/^\s*\d+\s*[.．]\s*/, "");

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
 * @param {{ media: string, files: string, body: string }} step
 *   media: image or video markup; files: rendered `mediaFooter` (workflow file rows);
 *   body: rendered explanation.
 */
export function renderMediaStep({ media = "", files = "", body = "" }) {
  // The step's title is a leading bold-only paragraph or a leading heading (`### Name`). A heading is
  // turned into the title paragraph too: steps are not document sections and stay out of the TOC.
  const text = body.replace(
    /^\s*(?:<p><strong>([\s\S]*?)<\/strong><\/p>|<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>)/,
    (match, bold, heading) => `<p class="media-steps__title">${stripNumber(bold ?? heading)}</p>`
  );
  const kind = /data-json-src/.test(files + body) ? "workflows" : "breakdown";
  // The workflow file row opens the explanation.
  return `<div class="media-step" data-kind="${kind}"><div class="media-step__media">${media}</div><div class="media-step__text">${files ? `<div class="media-steps__files">${files}</div>` : ""}${text}</div></div>`;
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

// The card is titled after the last heading before it.
const topicBefore = (html, index) => {
  const headings = [...html.slice(0, index).matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/g)];
  return stripTags(headings.at(-1)?.[2] || "").trim();
};

// Each step is its own floating card; the first one carries the kind header for the whole run.
const renderCard = (steps, { kind, topic }) => {
  const header = `<div class="media-steps__header"><span class="media-steps__icon">${kindIcon(kind)}</span><span class="media-steps__kicker">${KINDS[kind].label}</span>${topic ? `<span class="media-steps__topic">${escapeHTML(topic)}</span>` : ""}</div>`;
  const items = steps
    .map(
      (step, i) =>
        `<div class="media-steps__step">${i === 0 ? header : ""}<div class="media-steps__body"><div class="media-steps__media">${step.media}</div><div class="media-steps__text">${step.text}</div></div></div>`
    )
    .join("");
  return `<div class="media-steps media-steps--${kind}">${items}</div>`;
};

/**
 * Replace the page's media steps with step cards.
 * @param {string} html rendered page
 * @param {{ section?: string }} page
 */
export function groupMediaSteps(html, { section = "" } = {}) {
  if (!html.includes('<div class="media-step" ')) return html;
  let out = "";
  let cursor = 0;
  for (const steps of groupRuns(html, readSteps(html))) {
    const kind = section === "notes" ? "walkthrough" : steps[0].kind;
    out += html.slice(cursor, steps[0].start);
    out += renderCard(steps, { kind, topic: topicBefore(html, steps[0].start) });
    cursor = steps.at(-1).end;
  }
  return out + html.slice(cursor);
}
