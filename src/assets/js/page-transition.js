// Lightweight PJAX with Swup: keep header/sidebar, swap only #page
document.documentElement.classList.add("is-swup-enabled");

const swup = new window.Swup({
  containers: ["#page"],
  linkSelector: 'a[href^="/"]:not([data-no-swup])',
  animationSelector: '[class*="page"]',
});

const reinitScripts = [
  "/assets/js/toc.js",
  "/assets/js/assistant-rail.js",
  "/assets/js/lang-switcher.js",
  "/assets/js/lightbox.js",
  "/assets/js/search.js",
  "/assets/js/link-behavior.js",
];

const clearOverlays = () => {
  document.body.classList.remove("nav-open", "search-open");
};

swup.on("animationOutStart", clearOverlays);

swup.on("contentReplaced", () => {
  clearOverlays();
  // re-run page-level scripts on the new content
  reinitScripts.forEach((src) => {
    import(`${src}?swup=${Date.now()}`).catch(() => {});
  });
});
