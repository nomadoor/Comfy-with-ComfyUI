const article = document.querySelector(".article-body");
const tocContainer = document.querySelector(".toc__links");

function toPixels(value, baseSize) {
  if (!value) return 0;
  const numeric = parseFloat(value);
  if (Number.isNaN(numeric)) return 0;
  if (value.includes("rem") || value.includes("em")) return numeric * baseSize;
  return numeric;
}

function getScrollOffset() {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const baseFont = parseFloat(styles.fontSize) || 16;
  const headerVar = styles.getPropertyValue("--header-height").trim();
  const paddingVar = styles.getPropertyValue("--space-lg").trim();
  const headerEl = document.querySelector(".site-header");
  const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
  const header = toPixels(headerVar, baseFont) || headerHeight;
  const padding = toPixels(paddingVar, baseFont);
  return Math.max(header + padding, 0);
}

function generateSlug(text, index) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\s-]/g, "")
      .replace(/\s+/g, "-") || `heading-${index}`
  );
}

if (article && tocContainer) {
  const headings = Array.from(article.querySelectorAll("h2, h3"));
  if (!headings.length) {
    tocContainer.innerHTML = "";
  } else {
    const entries = headings.map((heading, index) => {
      if (!heading.id) {
        heading.id = generateSlug(heading.textContent, index);
      }
      return {
        id: heading.id,
        text: heading.textContent.trim(),
        depth: heading.tagName === "H3" ? 3 : 2
      };
    });

    const fragment = document.createDocumentFragment();
    entries.forEach((entry) => {
      const link = document.createElement("a");
      link.href = `#${entry.id}`;
      link.textContent = entry.text;
      link.dataset.depth = entry.depth;
      link.className = "toc__link";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.getElementById(entry.id);
        if (!target) return;
        const offset = getScrollOffset();
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      });
      fragment.appendChild(link);
    });

    tocContainer.innerHTML = "";
    tocContainer.appendChild(fragment);

    const tocLinks = Array.from(tocContainer.querySelectorAll(".toc__link"));
    let activeId = headings[0].id;
    let headingPositions = [];

    function computePositions() {
      headingPositions = headings.map(
        (heading) => heading.getBoundingClientRect().top + window.scrollY
      );
    }

    function updateActiveLink() {
      if (!headingPositions.length) return;
      const offset = getScrollOffset();
      const scrollY = window.scrollY;
      let candidateIndex = 0;

      for (let i = 0; i < headingPositions.length; i++) {
        if (scrollY + offset >= headingPositions[i] - 1) {
          candidateIndex = i;
        } else {
          break;
        }
      }

      const candidate = headings[candidateIndex].id;
      if (candidate === activeId) return;
      activeId = candidate;
      tocLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${candidate}`;
        link.classList.toggle("is-active", isActive);
      });
    }

    const recomputeAndUpdate = () => {
      computePositions();
      updateActiveLink();
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", recomputeAndUpdate, { passive: true });
    window.addEventListener("load", recomputeAndUpdate);
    document.addEventListener("imageFade:loaded", recomputeAndUpdate);

    recomputeAndUpdate();
  }
}
