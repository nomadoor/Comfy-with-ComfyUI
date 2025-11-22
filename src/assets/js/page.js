import initToc from "./toc.js";
import initAssistant from "./assistant-rail.js";
import initLangSwitcher from "./lang-switcher.js";
import initLightbox from "./lightbox.js";
import initSearch from "./search.js";
import initLinkBehavior from "./link-behavior.js";

export default function initPage() {
  initToc?.();
  initAssistant?.();
  initLangSwitcher?.();
  initLightbox?.();
  initSearch?.();
  initLinkBehavior?.();
}
