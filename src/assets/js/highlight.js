const payload = (() => {
  try {
    const raw = sessionStorage.getItem("cw-highlight");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to parse highlight payload", error);
    return null;
  }
})();

if (payload && payload.url && payload.term) {
  const samePage = payload.url.replace(/#.*$/, "") === window.location.pathname;
  if (samePage) {
    const target = document.querySelector(".article-body");
    if (target) {
      const regex = new RegExp(payload.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      target.innerHTML = target.innerHTML.replace(regex, (match) => `<mark class="highlight">${match}</mark>`);
    }
  }
  sessionStorage.removeItem("cw-highlight");
}
