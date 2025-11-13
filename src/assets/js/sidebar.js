const sectionButtons = Array.from(document.querySelectorAll(".sidebar__section-btn"));
const navPanels = Array.from(document.querySelectorAll(".sidebar__nav-panel"));

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
  navPanels.forEach((panel) => {
    const isActive = panel.dataset.sectionPanel === key;
    panel.classList.toggle("is-active", isActive);
    panel.toggleAttribute("hidden", !isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });
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

const initialActive =
  sectionButtons.find((btn) => btn.classList.contains("is-active")) || sectionButtons[0];
if (initialActive) {
  activateSection(initialActive.dataset.sectionKey, { focus: false });
}
