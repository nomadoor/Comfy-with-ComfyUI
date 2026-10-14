// The one place article h2/h3 ids are assigned. The TOC and the heading link buttons both
// call it, so an id is the same whichever runs first (the TOC runs first when the URL has
// a hash). Ids already present are kept; duplicates get -2, -3, … in document order.
const HEADING_SELECTOR = "h2, h3";

const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

export default function ensureHeadingIds(article) {
  const headings = Array.from(article.querySelectorAll(HEADING_SELECTOR));
  const used = new Set();
  headings.forEach((heading) => {
    if (heading.id) used.add(heading.id);
  });

  headings.forEach((heading) => {
    if (heading.id) return;
    const base = slugify(heading.textContent || "section") || "section";
    let id = base;
    let n = 2;
    while (used.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    heading.id = id;
    used.add(id);
  });
  return headings;
}
