const HEADING_SELECTOR = "h2, h3";
const ROOT_SELECTOR = ".article-body";
const ANCHOR_CLASS = "heading-anchor";
const SUCCESS_CLASS = "is-success";
const SUCCESS_TIMEOUT_MS = 1200;

const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

function ensureHeadingIds(headings = []) {
  const used = new Set();
  headings.forEach((heading) => {
    if (heading.id) used.add(heading.id);
  });

  headings.forEach((heading) => {
    if (heading.id) return;
    const base = slugify(heading.textContent || "section") || "section";
    let id = base;
    let n = 2;
    while (used.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    heading.id = id;
    used.add(id);
  });
}

async function writeClipboard(text) {
  const value = String(text || "");
  if (!value) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fall through
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.left = "-1000px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

function buildHeadingUrl(id) {
  const url = new URL(window.location.href);
  url.hash = id ? `#${encodeURIComponent(id)}` : "";
  return url.toString();
}

function decorateHeading(heading, { copyLabel, copiedLabel }) {
  if (!(heading instanceof HTMLElement)) return;
  if (!heading.id) return;
  if (heading.querySelector(`.${ANCHOR_CLASS}`)) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = ANCHOR_CLASS;
  btn.setAttribute("aria-label", copyLabel);
  btn.dataset.headingId = heading.id;

  const icon = document.createElement("span");
  icon.className = "heading-anchor__icon";
  icon.setAttribute("aria-hidden", "true");
  btn.appendChild(icon);

  let successTimer = null;

  const setSuccess = () => {
    btn.classList.add(SUCCESS_CLASS);
    btn.setAttribute("aria-label", copiedLabel);
    if (successTimer) window.clearTimeout(successTimer);
    successTimer = window.setTimeout(() => {
      btn.classList.remove(SUCCESS_CLASS);
      btn.setAttribute("aria-label", copyLabel);
    }, SUCCESS_TIMEOUT_MS);
  };

  btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const link = buildHeadingUrl(heading.id);
    const ok = await writeClipboard(link);
    if (ok) setSuccess();
  });

  heading.prepend(btn);
}

export default function initHeadingAnchors(root = document) {
  const scope = root instanceof Element ? root : document;
  const article = scope.querySelector(ROOT_SELECTOR);
  if (!article) return;

  const headings = Array.from(article.querySelectorAll(HEADING_SELECTOR));
  if (!headings.length) return;

  ensureHeadingIds(headings);

  const copyLabel =
    document.body?.dataset?.headingAnchorCopyLabel || "Copy heading link";
  const copiedLabel =
    document.body?.dataset?.headingAnchorCopiedLabel || "Copied";

  headings.forEach((heading) =>
    decorateHeading(heading, { copyLabel, copiedLabel })
  );
}

