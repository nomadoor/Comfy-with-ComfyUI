let docClickAttached = false;
let currentContainer = null;
const initialized = new WeakSet();

const initSearch = () => {
  const container = document.querySelector("[data-search]");
  if (!container || initialized.has(container)) return;
  initialized.add(container);
  currentContainer = container;

  const input = container.querySelector("[data-search-input]");
  const resultsEl = container.querySelector("[data-search-results]");
  const lang = document.documentElement.lang || "ja";
  const MAX_RESULTS = 10;
  const MIN_CHARS = 2;
  let index = [];
  let loaded = false;
  let loading = false;
  let debounceTimer = null;
  let lastQuery = "";
  let activeIndex = -1;

  const hideResults = () => {
    if (resultsEl) {
      resultsEl.hidden = true;
      resultsEl.innerHTML = "";
    }
    activeIndex = -1;
  };

  const setHighlightPayload = (url, term) => {
    try {
      sessionStorage.setItem(
        "cw-highlight",
        JSON.stringify({ url, term })
      );
    } catch (error) {
      console.warn("Highlight storage failed", error);
    }
  };

  const updateActiveResult = () => {
    const items = resultsEl?.querySelectorAll(".search-result") || [];
    items.forEach((el, idx) => {
      const isActive = idx === activeIndex;
      el.classList.toggle("is-active", isActive);
      if (isActive) {
        el.scrollIntoView({ block: "nearest" });
      }
    });
  };

  const navigateResults = (direction) => {
    const items = resultsEl?.querySelectorAll(".search-result") || [];
    if (!items.length) return;
    if (activeIndex === -1) {
      activeIndex = direction === 1 ? 0 : items.length - 1;
    } else {
      activeIndex = (activeIndex + direction + items.length) % items.length;
    }
    updateActiveResult();
  };

  const activateCurrentResult = () => {
    const items = resultsEl?.querySelectorAll(".search-result") || [];
    if (activeIndex >= 0 && activeIndex < items.length) {
      items[activeIndex].click();
    }
  };

  const renderResults = (items = [], query = "") => {
    if (!resultsEl) return;
    if (!items.length || !query) {
      hideResults();
      return;
    }
    const fragment = document.createDocumentFragment();
    items.slice(0, MAX_RESULTS).forEach((item) => {
      const result = document.createElement("a");
      result.className = "search-result";
      result.href = item.url;
      result.dataset.highlightTerm = query;
      result.setAttribute("tabindex", "-1");
      result.setAttribute("role", "option");
      result.innerHTML = `
        <span class="search-result__title"></span>
        ${item.summary ? `<span class="search-result__summary"></span>` : ""}
      `;
      const titleEl = result.querySelector(".search-result__title");
      if (titleEl) titleEl.textContent = item.title;
      if (item.summary) {
        const summaryEl = result.querySelector(".search-result__summary");
        if (summaryEl) summaryEl.textContent = item.summary;
      }
      fragment.appendChild(result);
    });
    resultsEl.innerHTML = "";
    resultsEl.appendChild(fragment);
    resultsEl.hidden = false;
    activeIndex = -1;
  };

  resultsEl?.addEventListener("click", (event) => {
    const target = event.target.closest(".search-result");
    if (!target) return;
    const term = target.dataset.highlightTerm;
    if (term) {
      setHighlightPayload(target.getAttribute("href"), term);
    }
  });

  const loadIndex = async () => {
    if (loaded || loading) return;
    loading = true;
    try {
      const response = await fetch(`/search/index-${lang}.json`);
      if (response.ok) {
        index = await response.json();
        loaded = true;
      }
    } catch (error) {
      console.error("Failed to load search index", error);
    } finally {
      loading = false;
    }
  };

  const performSearch = (query) => {
    if (!query || query.length < MIN_CHARS || !index.length) {
      hideResults();
      return;
    }
    const normalized = query.toLowerCase();
    const results = index.filter((item) => {
      const text = [
        item.title,
        item.summary,
        (item.tags || []).join(" "),
        item.content
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(normalized);
    });
    renderResults(results, query);
  };

  if (input) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        navigateResults(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        navigateResults(-1);
      } else if (event.key === "Enter") {
        if (activeIndex >= 0) {
          event.preventDefault();
          activateCurrentResult();
        }
      } else if (event.key === "Escape") {
        hideResults();
      }
    });

    input.addEventListener("input", () => {
      const value = input.value.trim();
      lastQuery = value;
      if (!value || value.length < MIN_CHARS) {
        hideResults();
        return;
      }
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        await loadIndex();
        performSearch(value);
      }, 150);
    });

    input.addEventListener("focus", () => {
      const value = input.value.trim();
      if (value.length >= MIN_CHARS && value === lastQuery && resultsEl && resultsEl.innerHTML) {
        resultsEl.hidden = false;
      }
    });
  }

  if (!docClickAttached) {
    document.addEventListener("click", (event) => {
      if (currentContainer && !currentContainer.contains(event.target)) {
        const results = currentContainer.querySelector("[data-search-results]");
        if (results) {
          results.hidden = true;
          results.innerHTML = "";
        }
      }
    });
    docClickAttached = true;
  }
};

export default initSearch;
