let langSwitcherInitialized = false;
let attentionTimer = null;
const ATTENTION_TTL_MS = 24 * 60 * 60 * 1000;

const parsePathLang = (pathname) => {
  const match = pathname.match(/^\/([a-z]{2})\//);
  return match ? match[1] : "ja";
};

const normalizeSupportedLang = (locale) => {
  const value = String(locale || "").toLowerCase();
  if (value.startsWith("ja")) return "ja";
  if (value.startsWith("en")) return "en";
  if (value.startsWith("zh")) return "zh";
  return null;
};

const getPreferredSupportedLang = () => {
  const candidates = [];
  if (Array.isArray(navigator.languages)) {
    candidates.push(...navigator.languages);
  }
  if (navigator.language) {
    candidates.push(navigator.language);
  }

  for (const candidate of candidates) {
    const normalized = normalizeSupportedLang(candidate);
    if (normalized) return normalized;
  }
  return null;
};

const getAttentionStorageKey = (currentLang, preferredLang) =>
  `lang_attention_seen:${currentLang}:${preferredLang}`;

const hasRecentAttention = (currentLang, preferredLang) => {
  try {
    const raw = localStorage.getItem(getAttentionStorageKey(currentLang, preferredLang));
    if (!raw) return false;
    return Number(raw) > Date.now();
  } catch {
    return false;
  }
};

const markAttentionShown = (currentLang, preferredLang) => {
  try {
    const expiresAt = Date.now() + ATTENTION_TTL_MS;
    localStorage.setItem(getAttentionStorageKey(currentLang, preferredLang), String(expiresAt));
  } catch {
    // Ignore storage failures (private mode / quota / disabled storage).
  }
};

const triggerLangAttention = () => {
  const langContainer = document.querySelector(".sidebar__lang");
  if (!langContainer) return;

  const currentLang = parsePathLang(window.location.pathname);
  const preferredLang = getPreferredSupportedLang();
  const shouldHighlight = Boolean(preferredLang && preferredLang !== currentLang);
  if (!shouldHighlight) {
    langContainer.classList.remove("is-attention");
    if (attentionTimer) {
      window.clearTimeout(attentionTimer);
      attentionTimer = null;
    }
    return;
  }
  if (hasRecentAttention(currentLang, preferredLang)) return;

  langContainer.classList.remove("is-attention");
  // Force reflow so the animation can replay when the 1-day TTL has expired.
  void langContainer.offsetWidth;
  langContainer.classList.add("is-attention");
  markAttentionShown(currentLang, preferredLang);

  if (attentionTimer) {
    window.clearTimeout(attentionTimer);
  }
  attentionTimer = window.setTimeout(() => {
    langContainer.classList.remove("is-attention");
  }, 6200);
};

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

  updateLangLinks(window.location.pathname);
  setMenuState(false);
  triggerLangAttention();
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
