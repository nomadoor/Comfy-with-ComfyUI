const initMobileNav = () => {
  const menuBtn = document.querySelector(".site-header__menu-btn");
  const body = document.body;
  // Target the sidebar itself as it will be the overlay
  const sidebar = document.querySelector(".app-shell__sidebar");

  if (!menuBtn || !sidebar) return;

  const toggleNav = () => {
    const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", !isExpanded);
    body.classList.toggle("nav-open");
  };

  const closeNav = () => {
    menuBtn.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
  };

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleNav();
  });

  // Close when clicking outside the sidebar (on the backdrop)
  // Since sidebar is the overlay, we check if click is NOT on sidebar
  document.addEventListener("click", (e) => {
    if (body.classList.contains("nav-open") &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      closeNav();
    }
  });
};

initMobileNav();
