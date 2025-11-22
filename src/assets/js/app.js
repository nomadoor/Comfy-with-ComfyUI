// app.js : Swupは暫定オフ（安定優先）。必要なら ENABLE_SWUP を true にして再検証。
import initPage from "./page.js";

const ENABLE_SWUP = false;

const bootstrap = () => {
  initPage();

  if (!ENABLE_SWUP) return;
  if (!window.Swup) return;

  const swup = new window.Swup({
    containers: ["#page"],
    linkSelector: 'a[href^="/"]:not([data-no-swup])',
  });

  swup.on("animationOutStart", () => {
    document.body.classList.remove("nav-open", "search-open");
  });
  swup.on("contentReplaced", () => {
    document.body.classList.remove("nav-open", "search-open");
    initPage();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
