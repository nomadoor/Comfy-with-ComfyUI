let docClickAttached = false;
const containers = new Set();
const initialized = new WeakSet();

const initSearch = () => {
  const found = document.querySelectorAll("[data-search]");
  if (!found.length) return;

  found.forEach((container) => {
    if (initialized.has(container)) return;
    initialized.add(container);
    containers.add(container);

    const input = container.querySelector("[data-search-input]");
    const resultsEl = container.querySelector("[data-search-results]");
    const lang = document.documentElement.lang || "ja";
    const MAX_RESULTS = 5;
    const HISTORY_LIMIT = 5;
    const MIN_CHARS = 2;
    const HISTORY_STORAGE_KEY = `cw-search-history:${lang}`;
    const I18N = {
      ja: { recent: "最近の検索", clear: "履歴をクリア", fromHistory: "履歴" },
      en: { recent: "Recent searches", clear: "Clear history", fromHistory: "History" },
      zh: { recent: "最近搜索", clear: "清除历史", fromHistory: "历史" }
    };
    const i18n = I18N[lang] || I18N.en;
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

    const loadHistory = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
        if (!Array.isArray(parsed)) return [];
        return parsed
          .map((item) => String(item || "").trim())
          .filter(Boolean)
          .slice(0, HISTORY_LIMIT);
      } catch {
        return [];
      }
    };

    const saveHistory = (term) => {
      const normalizedTerm = String(term || "").trim();
      if (normalizedTerm.length < MIN_CHARS) return;
      const next = [
        normalizedTerm,
        ...loadHistory().filter(
          (existing) => existing.toLowerCase() !== normalizedTerm.toLowerCase()
        )
      ].slice(0, HISTORY_LIMIT);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn("Search history storage failed", error);
      }
    };

    const clearHistory = () => {
      try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      } catch (error) {
        console.warn("Search history clear failed", error);
      }
    };

    const renderHistory = () => {
      if (!resultsEl) return;
      const history = loadHistory();
      if (!history.length) {
        hideResults();
        return;
      }

      const fragment = document.createDocumentFragment();
      const heading = document.createElement("div");
      heading.className = "search-results__heading";
      heading.textContent = i18n.recent;
      fragment.appendChild(heading);

      history.forEach((term) => {
        const result = document.createElement("button");
        result.type = "button";
        result.className = "search-result";
        result.dataset.historyTerm = term;
        result.setAttribute("tabindex", "-1");
        result.setAttribute("role", "option");
        result.innerHTML = `
          <span class="search-result__title"></span>
          <span class="search-result__summary"></span>
        `;
        const titleEl = result.querySelector(".search-result__title");
        const summaryEl = result.querySelector(".search-result__summary");
        if (titleEl) titleEl.textContent = term;
        if (summaryEl) summaryEl.textContent = i18n.fromHistory;
        fragment.appendChild(result);
      });

      const clear = document.createElement("button");
      clear.type = "button";
      clear.className = "search-results__clear";
      clear.dataset.clearSearchHistory = "true";
      clear.textContent = i18n.clear;
      fragment.appendChild(clear);

      resultsEl.innerHTML = "";
      resultsEl.appendChild(fragment);
      resultsEl.hidden = false;
      activeIndex = -1;
    };

    const resetSearchUi = () => {
      hideResults();
      if (input) {
        input.value = "";
        input.blur();
      }
      document.body.classList.remove("search-open");
      document
        .querySelectorAll("[data-search-toggle]")
        .forEach((toggle) => toggle.setAttribute("aria-expanded", "false"));
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
      const clearButton = event.target.closest("[data-clear-search-history]");
      if (clearButton) {
        clearHistory();
        if (input?.value.trim()) {
          hideResults();
        } else {
          renderHistory();
        }
        return;
      }

      const historyTarget = event.target.closest("[data-history-term]");
      if (historyTarget && input) {
        const term = historyTarget.dataset.historyTerm || "";
        input.value = term;
        lastQuery = term;
        loadIndex().then(() => performSearch(term));
        return;
      }

      const target = event.target.closest(".search-result");
      if (!target || target.dataset.historyTerm) return;
      const term = target.dataset.highlightTerm;
      if (term) {
        saveHistory(term);
        setHighlightPayload(target.getAttribute("href"), term);
      }
      resetSearchUi();
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

    const computeScore = (item, normalized) => {
      const title = String(item.title || "").toLowerCase();
      const summary = String(item.summary || "").toLowerCase();
      const tags = (item.tags || []).join(" ").toLowerCase();
      const content = String(item.content || "").toLowerCase();
      const slug = String(item.slug || "").toLowerCase();

      let score = 0;
      if (title === normalized) score += 2000;
      else if (title.startsWith(normalized)) score += 1200;
      else if (title.includes(normalized)) score += 900;

      if (slug === normalized) score += 800;
      else if (slug.includes(normalized)) score += 500;

      if (tags.includes(normalized)) score += 350;
      if (summary.includes(normalized)) score += 200;
      if (content.includes(normalized)) score += 80;

      // Prefer shorter/cleaner titles as tie-breaker.
      score -= Math.min(title.length, 120) * 0.1;
      return score;
    };

    const performSearch = (query) => {
      if (!query || query.length < MIN_CHARS || !index.length) {
        hideResults();
        return;
      }
      const normalized = query.toLowerCase();
      const results = index
        .map((item) => {
          const text = [
          item.title,
          item.summary,
          (item.tags || []).join(" "),
          item.content
          ]
            .join(" ")
            .toLowerCase();
          if (!text.includes(normalized)) return null;
          return { ...item, _score: computeScore(item, normalized) };
        })
        .filter(Boolean)
        .sort((a, b) => b._score - a._score);
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
          renderHistory();
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
        if (!value) {
          renderHistory();
          return;
        }
        if (value.length >= MIN_CHARS && value === lastQuery && resultsEl && resultsEl.innerHTML) {
          resultsEl.hidden = false;
        }
      });
    }
  });

  if (!docClickAttached) {
    document.addEventListener("click", (event) => {
      containers.forEach((container) => {
        if (!container.contains(event.target)) {
          const results = container.querySelector("[data-search-results]");
          if (results) {
            results.hidden = true;
            results.innerHTML = "";
          }
        }
      });
    });
    docClickAttached = true;
  }
};

export default initSearch;
