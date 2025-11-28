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

const isProfileNav = () => Boolean(window.__CW_PROFILE_NAV__);

const runIdle = (fn) => {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(fn, { timeout: 500 });
  } else {
    setTimeout(fn, 0);
  }
};

const profileStep = (label, fn) => {
  if (!isProfileNav()) return fn();
  const t0 = performance.now();
  const result = fn();
  const t1 = performance.now();
  console.log(`[nav-prof] ${label}: ${(t1 - t0).toFixed(1)}ms`);
  return result;
};

export default function initPage(root = document.getElementById("page") || document) {
  if (isProfileNav()) console.log("[nav-prof] initPage start");

  // Content-scoped modules (re-run per navigation)
  profileStep("toc", () => runIdle(() => initToc?.(root)));
  profileStep("lightbox", () => initLightbox?.(root));
  profileStep("gyazo-toggle", () => initGyazoToggle?.(root));
  profileStep("code-copy", () => initCodeCopy?.(root));
  profileStep("copy-json", () => initCopyJson?.(root));

  // Global-once modules (idempotent / guarded inside)
  profileStep("assistant", () => initAssistant?.());
  profileStep("lang-switcher", () => initLangSwitcher?.());
  profileStep("search", () => initSearch?.());

  if (isProfileNav()) console.log("[nav-prof] initPage end");
}
