import initPage from "./page.js";
import initLinkBehavior from "./link-behavior.js";
import initRouter from "./router.js";

const bootstrap = () => {
  try {
    initLinkBehavior();
    initPage();
    initRouter();
  } catch (error) {
    console.error("[app] bootstrap failed", error);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => bootstrap(), { once: true });
} else {
  bootstrap();
}
