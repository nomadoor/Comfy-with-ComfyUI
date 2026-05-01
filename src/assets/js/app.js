import initPage from "./page.js";
import initLinkBehavior from "./link-behavior.js";
import initRouter from "./router.js";
import initWebMcp from "./webmcp.js";
import initContentScrollProxy from "./content-scroll-proxy.js";

const bootstrap = () => {
  let hasInitError = false;

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
    initContentScrollProxy();
  } catch (error) {
    hasInitError = true;
    console.error("[app] initContentScrollProxy failed", error);
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
