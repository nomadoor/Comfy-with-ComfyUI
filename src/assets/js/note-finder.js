import { sortNotes } from "./notes-sort.js";

export default function initNoteFinder(root = document) {
  const finder = root.querySelector("[data-note-finder]");
  if (!finder || finder.dataset.initialized === "true") return;
  finder.dataset.initialized = "true";

  const input = finder.querySelector("[data-note-query]");
  const clearButton = finder.querySelector("[data-note-clear]");
  const grid = finder.querySelector("[data-note-grid]");
  const empty = finder.querySelector("[data-note-empty]");
  const sortButtons = Array.from(finder.querySelectorAll("[data-note-sort]"));
  const tagButtons = Array.from(finder.querySelectorAll("[data-note-tag]"));
  if (!input || !grid) return;

  let sortMode = "updated";

  const updateClearButton = () => {
    const hasQuery = Boolean(input.value.trim());
    finder.classList.toggle("is-clearable", hasQuery);
    if (clearButton) {
      clearButton.hidden = !hasQuery;
    }
  };

  const applyFilter = () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;
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
    updateClearButton();
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
  clearButton?.addEventListener("click", () => {
    input.value = "";
    input.focus();
    applyFilter();
  });
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
      sortNotes(grid, "[data-note-card]", sortMode);
      applyFilter();
    });
  });

  sortNotes(grid, "[data-note-card]", sortMode);
  applyFilter();
}
