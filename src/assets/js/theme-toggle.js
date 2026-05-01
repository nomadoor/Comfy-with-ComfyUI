const STORAGE_KEY = "cw-theme";
const DEFAULT_THEME = "dark";

function applyTheme(theme, buttons) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  buttons.forEach((button) => {
    button.dataset.theme = theme;
    button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  });
}

function initThemeToggle() {
  const buttons = Array.from(document.querySelectorAll("[data-theme-toggle]"));
  const stored = window.localStorage?.getItem(STORAGE_KEY);
  const initial = stored === "light" ? "light" : DEFAULT_THEME;
  applyTheme(initial, buttons);

  if (!buttons.length) return;

  buttons.forEach((button) => button.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || DEFAULT_THEME;
    const next = current === "light" ? "dark" : "light";
    applyTheme(next, buttons);
    try {
      window.localStorage?.setItem(STORAGE_KEY, next);
    } catch (error) {
      console.warn("Theme storage failed", error);
    }
  }));
}

initThemeToggle();
