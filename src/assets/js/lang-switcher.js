const toggle = document.querySelector("[data-lang-toggle]");
const menu = document.querySelector("[data-lang-menu]");

function setMenuState(isOpen) {
  if (!toggle || !menu) return;
  menu.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
}

if (toggle && menu) {
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
}
