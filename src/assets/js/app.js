import initPage from "./page.js";
import initLinkBehavior from "./link-behavior.js";
import initRouter from "./router.js";

const bootstrap = () => {
  const fallbackNotice = document.querySelector("[data-js-fallback-notice]");
  try {
    initLinkBehavior();
    initPage();
    initRouter();
    window.__CW_APP_READY__ = true;
    window.__CW_APP_FAILED__ = false;
    if (fallbackNotice) {
      fallbackNotice.hidden = true;
    }
  } catch (error) {
    window.__CW_APP_READY__ = false;
    window.__CW_APP_FAILED__ = true;
    if (fallbackNotice) {
      fallbackNotice.hidden = false;
    }
    console.error("[app] bootstrap failed", error);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => bootstrap(), { once: true });
} else {
  bootstrap();
}
