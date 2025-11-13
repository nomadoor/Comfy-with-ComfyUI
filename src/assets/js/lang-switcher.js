const toggle = document.querySelector("[data-lang-toggle]");
const menu = document.querySelector("[data-lang-menu]");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("is-open");
  });
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      menu.classList.remove("is-open");
    }
  });
}
