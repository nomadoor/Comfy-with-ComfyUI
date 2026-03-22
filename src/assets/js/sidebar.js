const sectionButtons = Array.from(document.querySelectorAll(".sidebar__section-btn"));
const sectionTabs = Array.from(document.querySelectorAll(".sidebar__section-tab"));
const navPanels = Array.from(document.querySelectorAll(".sidebar__nav-panel"));
const navWrapper = document.querySelector(".sidebar__nav-wrapper");
const sectionSelector = document.querySelector("[data-section-selector]");
const sectionSelectorToggle = sectionSelector?.querySelector("[data-section-selector-toggle]") || null;
const sectionSelectorLabel = sectionSelector?.querySelector("[data-section-selector-label]") || null;
const NAV_SCROLL_KEY = "sidebar-scroll";

const SECTION_KEYS = new Set(sectionButtons.map((btn) => btn.dataset.sectionKey));

if (navWrapper) {
  const saved = sessionStorage.getItem(NAV_SCROLL_KEY);
  if (saved !== null) {
    navWrapper.scrollTop = parseFloat(saved);
  }
}

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
      sessionStorage.setItem(NAV_SCROLL_KEY, navWrapper.scrollTop);
      ticking = false;
    });
  });
  window.addEventListener("pagehide", () => {
    sessionStorage.setItem(NAV_SCROLL_KEY, navWrapper.scrollTop);
  });
}

export function setActiveSectionByPathname(pathname = window.location.pathname) {
  if (!sectionButtons.length) return;
  const parts = pathname.split("/").filter(Boolean);
  // Expecting /<lang>/<section>/...
  const sectionKey = parts[1];
  if (!sectionKey || !SECTION_KEYS.has(sectionKey)) return;
  activateSection(sectionKey, { focus: false });
}
