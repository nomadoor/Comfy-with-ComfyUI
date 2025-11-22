let langSwitcherInitialized = false;

const initLangSwitcher = () => {
  if (langSwitcherInitialized) return;
  const toggle = document.querySelector("[data-lang-toggle]");
  const menu = document.querySelector("[data-lang-menu]");
  if (!toggle || !menu) return;
  langSwitcherInitialized = true;

  const setMenuState = (isOpen) => {
    menu.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  toggle.addEventListener("click", () => {
    const next = !menu.classList.contains("is-open");
    setMenuState(next);
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      setMenuState(false);
    }
  });

  setMenuState(false);
};

export default initLangSwitcher;
