import initToc from "./toc.js";
import initAssistant from "./assistant-rail.js";
import initLangSwitcher from "./lang-switcher.js";
import initLightbox from "./lightbox.js";
import initSearch from "./search.js";
import initGyazoToggle from "./gyazo-toggle.js";
import initCodeCopy from "./code-copy.js";
import initCopyJson from "./copy-json.js"; // workflow JSON copy/download
import "./sidebar.js"; // legacy auto-init; sidebar is persistent shell
import "./mobile-nav.js"; // handles nav/search toggles; persistent shell
import "./theme-toggle.js"; // global theme switcher
import "./image-fade.js"; // progressive image reveal
import "./highlight.js"; // search term highlight per page load

export default function initPage(root = document.getElementById("page") || document) {
  // Content-scoped modules (re-run per navigation)
  initToc?.(root);
  initLightbox?.(root);
  initGyazoToggle?.(root);
  initCodeCopy?.(root);
  initCopyJson?.(root);

  // Global-once modules (idempotent / guarded inside)
  initAssistant?.();
  initLangSwitcher?.();
  initSearch?.();
}
