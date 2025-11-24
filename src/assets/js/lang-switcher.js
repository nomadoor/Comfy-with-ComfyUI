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

export const updateLangLinks = (pathname) => {
  const menu = document.querySelector("[data-lang-menu]");
  if (!menu) return;

  const links = menu.querySelectorAll("a");
  const currentLangMatch = pathname.match(/^\/([a-z]{2})\//);
  const currentLang = currentLangMatch ? currentLangMatch[1] : "ja";

  links.forEach((link) => {
    // Get the target language code from the initial href or data attribute if we added one.
    // Since the structure is /<lang>/..., we can try to infer the target lang from the link's text or existing href.
    // A safer way is to check the link's existing href to see which lang it points to.
    const href = link.getAttribute("href");
    if (!href) return;

    const linkLangMatch = href.match(/^\/([a-z]{2})\//);
    const targetLang = linkLangMatch ? linkLangMatch[1] : null;

    if (targetLang) {
      // Replace the language segment in the current pathname with the target language
      // Assuming URL structure is /:lang/:section/:slug/
      const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${targetLang}/`);
      link.setAttribute("href", newPath);

      // Update active state
      if (targetLang === currentLang) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    }
  });
};

export default initLangSwitcher;
