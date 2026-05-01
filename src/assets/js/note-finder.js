function sortCards(grid, mode) {
  const cards = Array.from(grid.querySelectorAll("[data-note-card]"));
  cards.sort((a, b) => {
    if (mode === "views") {
      const views = Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
      if (views !== 0) return views;
    }
    const updated = String(b.dataset.updated || "").localeCompare(String(a.dataset.updated || ""));
    if (updated !== 0) return updated;
    return String(a.dataset.title || "").localeCompare(String(b.dataset.title || ""));
  });
  cards.forEach((card) => grid.appendChild(card));
}

export default function initNoteFinder(root = document) {
  const finder = root.querySelector("[data-note-finder]");
  if (!finder || finder.dataset.initialized === "true") return;
  finder.dataset.initialized = "true";

  const input = finder.querySelector("[data-note-query]");
  const grid = finder.querySelector("[data-note-grid]");
  const empty = finder.querySelector("[data-note-empty]");
  const sortButtons = Array.from(finder.querySelectorAll("[data-note-sort]"));
  const tagButtons = Array.from(finder.querySelectorAll("[data-note-tag]"));
  if (!input || !grid) return;

  let sortMode = "updated";

  const applyFilter = () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;
    tagButtons.forEach((button) => {
      const tag = String(button.dataset.noteTag || "").toLowerCase();
      button.classList.toggle("is-active", Boolean(query && tag === query));
    });
    Array.from(grid.querySelectorAll("[data-note-card]")).forEach((card) => {
      const haystack = [
        card.dataset.title || "",
        card.dataset.summary || "",
        card.dataset.noteTags || ""
      ].join(" ");
      const isVisible = !query || haystack.includes(query);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (empty) {
      empty.hidden = visibleCount > 0;
    }
  };

  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      input.value = query;
    }
  } catch {
    /* Ignore malformed URL state and keep the default empty finder. */
  }

  input.addEventListener("input", applyFilter);
  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.noteTag || "";
      input.focus();
      applyFilter();
    });
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sortMode = button.dataset.noteSort || "updated";
      sortButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      sortCards(grid, sortMode);
      applyFilter();
    });
  });

  sortCards(grid, sortMode);
  applyFilter();
}
