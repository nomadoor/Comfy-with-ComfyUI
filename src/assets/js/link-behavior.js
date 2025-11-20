const EXTERNAL_CLASS = "link--external";
const INTERNAL_CLASS = "link--internal";
const LINK_TYPE_ATTRIBUTE = "linkType";
const REL_TOKENS = ["noopener", "noreferrer"];
const CLASSIFY_SELECTOR = 'a[href]:not([data-link-ignore])';
const BASE_ORIGIN = window.location.origin;

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

  anchor.dataset[LINK_TYPE_ATTRIBUTE] = linkType;
  anchor.classList.remove(linkType === "external" ? INTERNAL_CLASS : EXTERNAL_CLASS);
  anchor.classList.add(linkType === "external" ? EXTERNAL_CLASS : INTERNAL_CLASS);

  if (linkType === "external" && !anchor.hasAttribute("download")) {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", normalizeRel(anchor.getAttribute("rel") || ""));
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

enhanceAllLinks(document);
setupMutationObserver();
