import initPage from "./page.js";
import initLinkBehavior, { refreshActiveNav } from "./link-behavior.js";

const ENABLE_SWUP = true;
const SWUP_CDN = "https://unpkg.com/swup@4.0.0?module";

const loadSwupCtor = async () => {
  // Prefer already-present global (for local bundling or previously loaded script)
  const globalSwup = window.Swup && (window.Swup.default || window.Swup);
  if (globalSwup) return globalSwup;

  try {
    const mod = await import(/* webpackIgnore: true */ SWUP_CDN);
    return mod?.default || null;
  } catch (error) {
    console.warn("[swup] Failed to load from CDN, falling back to full reloads.", error);
    return null;
  }
};

const bootstrap = async () => {
  const reinit = () => {
    document.body.classList.remove("nav-open", "search-open");
    initPage();
    refreshActiveNav();
  };

  // Initial load
  initLinkBehavior();
  reinit();

  if (!ENABLE_SWUP) return;

  const SwupCtor = await loadSwupCtor();
  if (!SwupCtor) return; // graceful: site still works as MPA

  const swup = new SwupCtor({
    containers: ["#page"],
    linkSelector: 'a[href^="/"]:not([data-no-swup])',
    animationSelector: null, // disable built-in animations to minimize flicker initially
  });

  const hookOn = swup.hooks?.on?.bind(swup.hooks);
  const on = swup.on?.bind(swup);
  const getPage = () => document.getElementById("page");
  const beforeOut = () => document.body.classList.remove("nav-open", "search-open");
  const showPage = () => {
    const page = getPage();
    if (page) page.classList.add("is-visible");
  };

  showPage();

  hookOn?.("visit:start", beforeOut);
  on?.("animation:out:start", beforeOut);

  const afterReplace = () => {
    reinit();
    showPage();
  };
  hookOn?.("content:replace", afterReplace);
  hookOn?.("page:view", afterReplace);
  on?.("content:replace", afterReplace);
  on?.("page:view", afterReplace);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => bootstrap(), { once: true });
} else {
  bootstrap();
}
