const initMobileNav = () => {
  const menuBtn = document.querySelector(".site-header__menu-btn");
  const searchToggle = document.querySelector("[data-search-toggle]");
  const searchInput = document.querySelector("[data-search-input]");
  const body = document.body;
  // Target the sidebar itself as it will be the overlay
  const sidebar = document.querySelector(".app-shell__sidebar");
  const navBackdrop = document.querySelector(".nav-backdrop");
  const navLinks = Array.from(document.querySelectorAll(".sidebar a"));

  if (!menuBtn || !sidebar) return;

  const toggleNav = () => {
    const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", !isExpanded);
    body.classList.toggle("nav-open");
  };

  const NAV_TRANSITION_MS = 300;

  const closeNav = () => {
    menuBtn.setAttribute("aria-expanded", "false");
    // trigger closing animation on mobile
    body.classList.add("nav-closing");
    body.classList.remove("nav-open");
    setTimeout(() => body.classList.remove("nav-closing"), NAV_TRANSITION_MS);
  };

  const closeSearch = () => {
    if (searchToggle) searchToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("search-open");
  };

  const toggleSearch = () => {
    const isExpanded = searchToggle.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeSearch();
    } else {
      closeNav();
      searchToggle.setAttribute("aria-expanded", "true");
      body.classList.add("search-open");
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 0);
      }
    }
  };

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleNav();
  });

  if (searchToggle) {
    searchToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSearch();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeNav);
  }

  // Close when following a sidebar link to avoid overlay残留によるフリッカー
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
      closeSearch();
    });
  });

  // Close when clicking outside the sidebar (on the backdrop)
  // Since sidebar is the overlay, we check if click is NOT on sidebar
  document.addEventListener("click", (e) => {
    if (body.classList.contains("nav-open") &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)) {
      closeNav();
    }
    if (body.classList.contains("search-open") &&
      searchToggle &&
      !searchToggle.contains(e.target) &&
      !document.querySelector(".site-header__search")?.contains(e.target)) {
      closeSearch();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      closeNav();
    }
    if (e.key === "Escape" && body.classList.contains("search-open")) {
      closeSearch();
    }
  });
};

initMobileNav();
