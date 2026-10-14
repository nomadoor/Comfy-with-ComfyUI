import { copyText } from "./clipboard.js";
import { flashClass } from "./flash.js";
import ensureHeadingIds from "./heading-ids.js";

const ROOT_SELECTOR = ".article-body";
const ANCHOR_CLASS = "heading-anchor";
const SUCCESS_CLASS = "is-success";
const SUCCESS_TIMEOUT_MS = 800;

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

  const setSuccess = () => {
    btn.setAttribute("aria-label", copiedLabel);
    flashClass(btn, SUCCESS_CLASS, SUCCESS_TIMEOUT_MS, { onEnd: () => btn.setAttribute("aria-label", copyLabel) });
  };

  btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const link = buildHeadingUrl(heading.id);
    const ok = await copyText(link);
    if (ok) setSuccess();
  });

  heading.prepend(btn);
}

export default function initHeadingAnchors(root = document) {
  const scope = root instanceof Element ? root : document;
  const article = scope.querySelector(ROOT_SELECTOR);
  if (!article) return;

  const headings = ensureHeadingIds(article);
  if (!headings.length) return;

  const copyLabel =
    document.body?.dataset?.headingAnchorCopyLabel || "Copy heading link";
  const copiedLabel =
    document.body?.dataset?.headingAnchorCopiedLabel || "Copied";

  headings.forEach((heading) =>
    decorateHeading(heading, { copyLabel, copiedLabel })
  );
}
