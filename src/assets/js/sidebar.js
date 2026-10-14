import { sortNotes } from "./notes-sort.js";

// The sidebar is part of the persistent shell: initSidebar() runs once per full page load (from
// app.js), and the router keeps the open section in step through setActiveSectionByPathname().
const NAV_SCROLL_KEY = "sidebar-scroll";

let sectionButtons = [];
let sectionTabs = [];
let navPanels = [];
let navWrapper = null;
let sectionSelector = null;
let sectionSelectorToggle = null;
let sectionSelectorLabel = null;
let sectionKeys = new Set();

// Storage can throw (blocked site data, some private modes).
const readNavScroll = () => {
  try {
    return sessionStorage.getItem(NAV_SCROLL_KEY);
  } catch {
    return null;
  }
};

const saveNavScroll = (value) => {
  try {
    sessionStorage.setItem(NAV_SCROLL_KEY, value);
  } catch {
    // Storage unavailable: the scroll position is simply not restored.
  }
};

function setSectionSelectorOpen(isOpen) {
  if (!sectionSelector || !sectionSelectorToggle) return;
  sectionSelector.classList.toggle("is-open", isOpen);
  sectionSelectorToggle.setAttribute("aria-expanded", String(isOpen));
}

function syncSectionSelectorLabel(key) {
  if (!sectionSelectorLabel) return;
  const active = sectionButtons.find((btn) => btn.dataset.sectionKey === key);
  const text = active?.querySelector(".sidebar__section-label")?.textContent?.trim();
  if (text) {
    sectionSelectorLabel.textContent = text;
  }
}

function activateSection(key, { focus = true } = {}) {
  sectionButtons.forEach((btn) => {
    const isActive = btn.dataset.sectionKey === key;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
    btn.setAttribute("tabindex", isActive ? "0" : "-1");
    if (isActive && focus) {
      btn.focus();
    }
  });
  sectionTabs.forEach((tab) => {
    const isActive = tab.dataset.sectionTab === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  navPanels.forEach((panel) => {
    const isActive = panel.dataset.sectionPanel === key;
    panel.classList.toggle("is-active", isActive);
    panel.toggleAttribute("hidden", !isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });
  syncSectionSelectorLabel(key);
  setSectionSelectorOpen(false);
}

function focusNext(currentIndex, direction) {
  if (!sectionButtons.length) return;
  const total = sectionButtons.length;
  const targetIndex = (currentIndex + direction + total) % total;
  const target = sectionButtons[targetIndex];
  if (target) {
    activateSection(target.dataset.sectionKey);
  }
}

export function initSidebar() {
  sectionButtons = Array.from(document.querySelectorAll(".sidebar__section-btn"));
  sectionTabs = Array.from(document.querySelectorAll(".sidebar__section-tab"));
  navPanels = Array.from(document.querySelectorAll(".sidebar__nav-panel"));
  navWrapper = document.querySelector(".sidebar__nav-wrapper");
  sectionSelector = document.querySelector("[data-section-selector]");
  sectionSelectorToggle = sectionSelector?.querySelector("[data-section-selector-toggle]") || null;
  sectionSelectorLabel = sectionSelector?.querySelector("[data-section-selector-label]") || null;
  sectionKeys = new Set(sectionButtons.map((btn) => btn.dataset.sectionKey));

  if (navWrapper) {
    const saved = readNavScroll();
    if (saved !== null) {
      navWrapper.scrollTop = parseFloat(saved);
    }
  }

  sectionButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => activateSection(btn.dataset.sectionKey));
    btn.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusNext(index, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusNext(index, -1);
          break;
        case "Home":
          event.preventDefault();
          activateSection(sectionButtons[0].dataset.sectionKey);
          break;
        case "End":
          event.preventDefault();
          activateSection(sectionButtons[sectionButtons.length - 1].dataset.sectionKey);
          break;
        default:
          break;
      }
    });
  });

  if (sectionSelectorToggle) {
    sectionSelectorToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setSectionSelectorOpen(!sectionSelector?.classList.contains("is-open"));
    });
  }

  document.addEventListener("click", (event) => {
    if (!sectionSelector || !sectionSelector.classList.contains("is-open")) return;
    if (sectionSelector.contains(event.target)) return;
    setSectionSelectorOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!sectionSelector || !sectionSelector.classList.contains("is-open")) return;
    setSectionSelectorOpen(false);
    if (sectionSelectorToggle && typeof sectionSelectorToggle.focus === "function") {
      sectionSelectorToggle.focus();
    }
  });

  sectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateSection(tab.dataset.sectionTab, { focus: false }));
  });

  document.querySelectorAll("[data-notes-nav]").forEach((notesNav) => {
    const list = notesNav.querySelector("[data-notes-list]");
    const buttons = Array.from(notesNav.querySelectorAll("[data-notes-sort]"));
    if (!list || !buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.dataset.notesSort || "updated";
        buttons.forEach((item) => {
          const isActive = item === button;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });
        sortNotes(list, "[data-updated]", mode);
      });
    });

    sortNotes(list, "[data-updated]", "updated");
  });

  const initialActive =
    sectionButtons.find((btn) => btn.classList.contains("is-active")) || sectionButtons[0];
  if (initialActive) {
    activateSection(initialActive.dataset.sectionKey, { focus: false });
  }

  if (navWrapper) {
    let ticking = false;
    navWrapper.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        saveNavScroll(navWrapper.scrollTop);
        ticking = false;
      });
    });
    window.addEventListener("pagehide", () => {
      saveNavScroll(navWrapper.scrollTop);
    });
  }
}

export function setActiveSectionByPathname(pathname = window.location.pathname) {
  if (!sectionButtons.length) return;
  const parts = pathname.split("/").filter(Boolean);
  // Expecting /<lang>/<section>/...
  const sectionKey = parts[1];
  // Pages outside a section (home, news, contact) render with the first section open; match that.
  const target = sectionKey && sectionKeys.has(sectionKey) ? sectionKey : sectionButtons[0].dataset.sectionKey;
  if (!target) return;
  activateSection(target, { focus: false });
}
