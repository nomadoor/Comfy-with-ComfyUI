const sectionButtons = document.querySelectorAll(".sidebar__section-btn");
const navPanels = document.querySelectorAll(".sidebar__nav-panel");

function activateSection(key) {
  sectionButtons.forEach(btn => {
    const isActive = btn.dataset.sectionKey === key;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  navPanels.forEach(panel => {
    panel.classList.toggle("is-active", panel.dataset.sectionPanel === key);
  });
}

sectionButtons.forEach(btn => {
  btn.addEventListener("click", () => activateSection(btn.dataset.sectionKey));
});
