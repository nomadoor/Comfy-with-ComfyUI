// Orders Note entries by their data attributes: "views" puts the most viewed first, and
// "updated" (the default) the most recently updated; ties fall back to updated, then title.
// The sidebar's Notes list and the Note finder grid share this order.
export function sortNotes(container, itemSelector, mode) {
  const items = Array.from(container.querySelectorAll(itemSelector));
  items.sort((a, b) => {
    if (mode === "views") {
      const views = Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
      if (views !== 0) return views;
    }
    const updated = String(b.dataset.updated || "").localeCompare(String(a.dataset.updated || ""));
    if (updated !== 0) return updated;
    return String(a.dataset.title || "").localeCompare(String(b.dataset.title || ""));
  });
  items.forEach((item) => container.appendChild(item));
}
