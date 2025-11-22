let tocState = {
  scrollHandler: null,
  resizeHandler: null,
  loadHandler: null,
  imageFadeHandler: null,
};

const initToc = () => {
  const article = document.querySelector(".article-body");
  const tocContainer = document.querySelector(".toc__links");
  if (!article || !tocContainer) return;

  // remove previous listeners to avoid duplication on Swup replace
  if (tocState.scrollHandler) window.removeEventListener("scroll", tocState.scrollHandler);
  if (tocState.resizeHandler) window.removeEventListener("resize", tocState.resizeHandler);
  if (tocState.loadHandler) window.removeEventListener("load", tocState.loadHandler);
  if (tocState.imageFadeHandler) document.removeEventListener("imageFade:loaded", tocState.imageFadeHandler);

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
    return header + padding;
  }

  function getHeadings() {
    const heads = Array.from(article.querySelectorAll("h2, h3"));
    heads.forEach((h) => {
      if (!h.id) {
        const base = (h.textContent || "section").trim().toLowerCase();
        const slug = base
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-+|-+$/g, "")
          || `section-${Math.random().toString(36).slice(2, 8)}`;
        h.id = slug;
      }
    });
    return heads;
  }

  function buildToc() {
    tocContainer.innerHTML = "";
    const frag = document.createDocumentFragment();
    getHeadings().forEach((heading) => {
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent || heading.id;
      link.className = "toc__link";
      link.dataset.targetId = heading.id;
      link.dataset.depth = heading.tagName.toLowerCase() === "h2" ? "2" : "3";
      frag.appendChild(link);
    });
    tocContainer.appendChild(frag);
  }

  function setActiveLink(id) {
    const links = tocContainer.querySelectorAll(".toc__link");
    links.forEach((link) => {
      const isActive = link.dataset.targetId === id;
      link.classList.toggle("is-active", isActive);
    });
  }

  function getCurrentSectionId() {
    const headings = getHeadings();
    const offset = getScrollOffset();
    const scrollPos = window.scrollY + offset + 1;
    let currentId = headings[0]?.id;
    for (const heading of headings) {
      if (heading.offsetTop <= scrollPos) {
        currentId = heading.id;
      } else {
        break;
      }
    }
    return currentId;
  }

  function updateActiveLink() {
    const id = getCurrentSectionId();
    if (id) setActiveLink(id);
  }

  function recomputeAndUpdate() {
    buildToc();
    updateActiveLink();
  }

  tocContainer.addEventListener("click", (event) => {
    const link = event.target.closest(".toc__link");
    if (!link) return;
    event.preventDefault();
    const targetId = link.dataset.targetId;
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;
    const top = targetEl.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top, behavior: "smooth" });
    setActiveLink(targetId);
  });

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

  tocState.scrollHandler = handleScroll;
  tocState.resizeHandler = recomputeAndUpdate;
  tocState.loadHandler = recomputeAndUpdate;
  tocState.imageFadeHandler = recomputeAndUpdate;

  recomputeAndUpdate();
};

export default initToc;
