const EXTERNAL_CLASS = "link--external";
const INTERNAL_CLASS = "link--internal";
const LINK_TYPE_ATTRIBUTE = "linkType";
const REL_TOKENS = ["noopener", "noreferrer"];
const CLASSIFY_SELECTOR = 'a[href]:not([data-link-ignore])';
const BASE_ORIGIN = window.location.origin;
const ARTICLE_SCOPE_SELECTOR = ".article-body";
const ARTICLE_ICON_CLASS = "article-link__icon";
const SVG_NS = "http://www.w3.org/2000/svg";
let observerInitialized = false;
let navLinks = [];

function normalizePathname(url) {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    return pathname
      .replace(/index\.html?$/i, "")
      .replace(/\/+$/, "/")
      || "/";
  } catch {
    return "/";
  }
}

function collectNavLinks() {
  navLinks = Array.from(document.querySelectorAll(".nav-list__link.link--internal"));
}

function setActiveNavLink(pathname = window.location.pathname) {
  if (!navLinks.length) collectNavLinks();
  const current = normalizePathname(pathname);
  navLinks.forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href) return;
    const normalized = normalizePathname(href);
    const isActive = normalized === current;
    anchor.classList.toggle("is-active", isActive);
    if (isActive) {
      anchor.setAttribute("aria-current", "page");
    } else {
      anchor.removeAttribute("aria-current");
    }
  });
}

function normalizeRel(existingRel = "") {
  const tokens = existingRel
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
  for (const required of REL_TOKENS) {
    if (!tokens.includes(required)) {
      tokens.push(required);
    }
  }
  return tokens.join(" ");
}

function determineLinkType(href) {
  if (!href) {
    return "internal";
  }
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return "internal";
  }
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return "external";
  }
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:")) {
    return "internal";
  }
  try {
    const parsed = new URL(trimmed, BASE_ORIGIN);
    return parsed.origin === BASE_ORIGIN ? "internal" : "external";
  } catch {
    return "internal";
  }
}

function enhanceAnchor(anchor) {
  if (!(anchor instanceof HTMLAnchorElement)) {
    return;
  }
  const href = anchor.getAttribute("href");
  const linkType = determineLinkType(href);
  const isArticleLink = Boolean(anchor.closest(ARTICLE_SCOPE_SELECTOR));

  anchor.dataset[LINK_TYPE_ATTRIBUTE] = linkType;
  anchor.classList.remove(linkType === "external" ? INTERNAL_CLASS : EXTERNAL_CLASS);
  anchor.classList.add(linkType === "external" ? EXTERNAL_CLASS : INTERNAL_CLASS);

  if (linkType === "external" && !anchor.hasAttribute("download")) {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", normalizeRel(anchor.getAttribute("rel") || ""));
  }

  if (linkType === "external" && isArticleLink) {
    ensureArticleLinkIcon(anchor);
  } else if (isArticleLink) {
    removeArticleLinkIcon(anchor);
  }
}

function enhanceAllLinks(root = document) {
  if (!root) return;
  if (root instanceof HTMLAnchorElement && root.matches(CLASSIFY_SELECTOR)) {
    enhanceAnchor(root);
    return;
  }
  const anchors = root.querySelectorAll(CLASSIFY_SELECTOR);
  anchors.forEach(enhanceAnchor);
}

function setupMutationObserver() {
  if (!("MutationObserver" in window)) {
    return;
  }
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return;
        }
        enhanceAllLinks(node);
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function createExternalIconSvg() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "var(--icon-stroke-width, 1.5)");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M20 4L10 14M20 4V10M20 4H14M10 4H4V20H20V14");
  svg.appendChild(path);

  return svg;
}

function ensureArticleLinkIcon(anchor) {
  if (anchor.querySelector(`.${ARTICLE_ICON_CLASS}`)) {
    return;
  }
  const wrapper = document.createElement("span");
  wrapper.className = ARTICLE_ICON_CLASS;
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.appendChild(createExternalIconSvg());
  anchor.appendChild(wrapper);
}

function removeArticleLinkIcon(anchor) {
  const icon = anchor.querySelector(`.${ARTICLE_ICON_CLASS}`);
  if (icon) {
    icon.remove();
  }
}

const initLinkBehavior = () => {
  if (!observerInitialized) {
    enhanceAllLinks(document);
    setupMutationObserver();
    collectNavLinks();
    observerInitialized = true;
  }
  setActiveNavLink();
};

export const refreshActiveNav = setActiveNavLink;

export default initLinkBehavior;
