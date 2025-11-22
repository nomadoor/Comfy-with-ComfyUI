// page-transition.js
// Swup本体は base.njk で CDN 経由で先に読み込まれ、window.Swup として提供される前提。
document.documentElement.classList.add("is-swup-enabled");

// ページ内初期化フック: 各機能の init を呼ぶだけの薄いレイヤー
import initPage from "./page.js";

const swup = new window.Swup({
  containers: ["#page"],
  linkSelector: 'a[href^="/"]:not([data-no-swup])',
});

const clearOverlays = () => {
  document.body.classList.remove("nav-open", "search-open");
};

swup.on("animationOutStart", clearOverlays);
swup.on("contentReplaced", () => {
  clearOverlays();
  initPage();
});

// 初回ロード時も実行
initPage();
