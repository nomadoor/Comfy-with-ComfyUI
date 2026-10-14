import initImageFade from "./image-fade.js";
import initLinkBehavior from "./link-behavior.js";
import initMobileNav from "./mobile-nav.js";
import initPage from "./page.js";
import initRouter from "./router.js";
import { initSidebar } from "./sidebar.js";
import initThemeToggle from "./theme-toggle.js";
import initWebMcp from "./webmcp.js";

// The persistent shell (header, sidebar, theme) is set up once per full page load; the router
// swaps only #page and runs initPage() again for it.
const SHELL = [
  ["initSidebar", initSidebar],
  ["initMobileNav", initMobileNav],
  ["initThemeToggle", initThemeToggle],
  ["initImageFade", initImageFade]
];

const bootstrap = () => {
  let hasInitError = false;

  for (const [name, init] of SHELL) {
    try {
      init();
    } catch (error) {
      hasInitError = true;
      console.error(`[app] ${name} failed`, error);
    }
  }

  try {
    initLinkBehavior();
  } catch (error) {
    hasInitError = true;
    console.error("[app] initLinkBehavior failed", error);
  }

  try {
    initPage();
  } catch (error) {
    hasInitError = true;
    console.error("[app] initPage failed", error);
  }

  try {
    initRouter();
  } catch (error) {
    hasInitError = true;
    console.error("[app] initRouter failed", error);
  }

  try {
    initWebMcp();
  } catch (error) {
    console.warn("[app] initWebMcp failed", error);
  }

  if (hasInitError) {
    document.documentElement.classList.remove("js");
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => bootstrap(), { once: true });
} else {
  bootstrap();
}
