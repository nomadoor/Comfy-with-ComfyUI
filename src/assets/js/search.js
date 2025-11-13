export function initSearchBox(root = document) {
  const form = root.querySelector(".search-box");
  if (!form) return;
  const input = form.querySelector(".search-box__input");
  const resultsEl = form.querySelector(".search-box__results");
  if (!input || !resultsEl) return;

  input.addEventListener("input", () => {
    const query = input.value.trim();
    if (!query) {
      resultsEl.innerHTML = "";
      return;
    }
    resultsEl.innerHTML = `<div class="search-result">Searching for "${query}"Åc (stub)</div>`;
  });
}

initSearchBox();
