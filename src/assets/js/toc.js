const article = document.querySelector(".article-body");
const tocContainer = document.querySelector(".toc__links");

if (article && tocContainer) {
  const headings = Array.from(article.querySelectorAll("h2, h3"));
  const entries = headings.map((heading, index) => {
    if (!heading.id) {
      const slug = heading.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\s-]/g, "")
        .replace(/\s+/g, "-") || `heading-${index}`;
      heading.id = slug;
    }
    return { id: heading.id, text: heading.textContent.trim(), depth: heading.tagName === "H3" ? 3 : 2 };
  });

  const fragment = document.createDocumentFragment();
  entries.forEach(entry => {
    const link = document.createElement("a");
    link.href = `#${entry.id}`;
    link.textContent = entry.text;
    link.dataset.depth = entry.depth;
    link.className = "toc__link";
    fragment.appendChild(link);
  });
  tocContainer.innerHTML = "";
  tocContainer.appendChild(fragment);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const link = tocContainer.querySelector(`a[href="#${entry.target.id}"]`);
        if (link) {
          link.classList.toggle("is-active", entry.isIntersecting);
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 }
  );

  headings.forEach(h => observer.observe(h));
}
