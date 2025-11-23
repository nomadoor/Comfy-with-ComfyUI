import initPage from "./page.js";
import initLinkBehavior from "./link-behavior.js";
import initRouter from "./router.js";

const bootstrap = () => {
  initLinkBehavior();
  initPage();
  initRouter();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => bootstrap(), { once: true });
} else {
  bootstrap();
}
