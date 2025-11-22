// app.js
// Swup本体は base.njk で CDN (https://unpkg.com/swup@4/dist/Swup.umd.js) を先に読み込み、window.Swup として提供される前提。

import initPage from "./page.js";

document.documentElement.classList.add("is-swup-enabled");

const clearOverlays = () => {
  document.body.classList.remove("nav-open", "search-open");
};

const bootstrap = () => {
  initPage();

  if (!window.Swup) {
    // Swupが読み込まれない場合は何もせずフルリロード挙動に任せる
    return;
  }

  const swup = new window.Swup({
    containers: ["#page"],
    linkSelector: 'a[href^="/"]:not([data-no-swup])',
  });

  swup.on("animationOutStart", clearOverlays);
  swup.on("contentReplaced", () => {
    clearOverlays();
    initPage();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
