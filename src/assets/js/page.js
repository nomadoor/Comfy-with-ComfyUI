import initToc from "./toc.js";
import initAssistant from "./assistant-rail.js";
import initLangSwitcher from "./lang-switcher.js";
import initLightbox from "./lightbox.js";
import initSearch from "./search.js";
import initGyazoToggle from "./gyazo-toggle.js";
import initCodeCopy from "./code-copy.js";
import initCopyJson from "./copy-json.js"; // workflow JSON copy/download
import initWorkflowPicker from "./workflow-picker.js";
import initMediaRowFit from "./media-row-fit.js";
import initHeadingAnchors from "./heading-anchors.js";
import initContact from "./contact.js";
import initNoteFinder from "./note-finder.js";
import "./sidebar.js"; // legacy auto-init; sidebar is persistent shell
import "./mobile-nav.js"; // handles nav/search toggles; persistent shell
import "./theme-toggle.js"; // global theme switcher
import "./image-fade.js"; // progressive image reveal
import initRelatedHero from "./related-hero.js";
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
  const hasHashTarget = Boolean(window.location.hash);
  profileStep("media-row-fit", () => (hasHashTarget ? initMediaRowFit?.(root) : runIdle(() => initMediaRowFit?.(root))));
  profileStep("toc", () => (hasHashTarget ? initToc?.(root) : runIdle(() => initToc?.(root))));
  profileStep("heading-anchors", () => initHeadingAnchors?.(root));
  profileStep("lightbox", () => initLightbox?.(root));
  profileStep("gyazo-toggle", () => initGyazoToggle?.(root));
  profileStep("code-copy", () => initCodeCopy?.(root));
  profileStep("copy-json", () => initCopyJson?.(root));
  profileStep("workflow-picker", () => initWorkflowPicker?.(root));
  profileStep("related-hero", () => initRelatedHero?.(root));
  profileStep("contact", () => initContact?.(root));
  profileStep("note-finder", () => initNoteFinder?.(root));

  // Global-once modules (idempotent / guarded inside)
  profileStep("assistant", () => initAssistant?.());
  profileStep("lang-switcher", () => initLangSwitcher?.());
  profileStep("search", () => initSearch?.());

  if (isProfileNav()) console.log("[nav-prof] initPage end");
}
