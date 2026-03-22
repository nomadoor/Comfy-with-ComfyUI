const STORAGE_KEY = "cw-theme";
const DEFAULT_THEME = "dark";

function applyTheme(theme, button) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (button) {
    button.dataset.theme = theme;
    button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }
}

function initThemeToggle() {
  const button = document.querySelector("[data-theme-toggle]");
  const stored = window.localStorage?.getItem(STORAGE_KEY);
  const initial = stored === "light" ? "light" : DEFAULT_THEME;
  applyTheme(initial, button);

  if (!button) return;

  button.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || DEFAULT_THEME;
    const next = current === "light" ? "dark" : "light";
    applyTheme(next, button);
    try {
      window.localStorage?.setItem(STORAGE_KEY, next);
    } catch (error) {
      console.warn("Theme storage failed", error);
    }
  });
}

initThemeToggle();
