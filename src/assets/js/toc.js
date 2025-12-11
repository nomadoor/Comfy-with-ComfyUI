let tocState = {
  scrollHandler: null,
  resizeHandler: null,
  loadHandler: null,
  imageFadeHandler: null,
  headings: [],
  lastActiveId: null,
  observer: null,
  pendingId: null,
  pendingTimer: null,
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
  if (tocState.observer) tocState.observer.disconnect();
  if (tocState.pendingTimer) clearTimeout(tocState.pendingTimer);
  tocState.headings = [];
  tocState.lastActiveId = null;
  tocState.observer = null;
  tocState.pendingId = null;
  tocState.pendingTimer = null;

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
    const counts = new Map();

    heads.forEach((h) => {
      const baseText = (h.textContent || h.id || "section").trim().toLowerCase();
      const baseSlug = (h.id || baseText)
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "") || "section";

      const seen = counts.get(baseSlug) || 0;
      const next = seen + 1;
      counts.set(baseSlug, next);

      const finalId = seen === 0 ? baseSlug : `${baseSlug}-${next}`;
      if (h.id !== finalId) {
        h.id = finalId;
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
    tocState.lastActiveId = id;
  }

  function snapshotHeadings() {
    tocState.headings = getHeadings().map((heading) => ({
      id: heading.id,
      el: heading,
    }));
  }

  function createObserver() {
    if (!tocState.headings.length) snapshotHeadings();
    const offset = getScrollOffset();
    const rootMargin = `-${offset + 8}px 0px -60% 0px`;
    const thresholds = [0, 0.1, 0.25, 0.5, 0.75, 1];

    const visible = new Map();

    const pickActive = () => {
      if (!visible.size) return null;
      // choose the heading with the largest intersection ratio; tie-breaker: smallest top
      const sorted = Array.from(visible.entries()).sort((a, b) => {
        const [idA, dataA] = a;
        const [idB, dataB] = b;
        if (dataB.ratio !== dataA.ratio) return dataB.ratio - dataA.ratio;
        return dataA.top - dataB.top;
      });
      return sorted[0][0];
    };

    const commitPending = () => {
      if (tocState.pendingId && tocState.pendingId !== tocState.lastActiveId) {
        setActiveLink(tocState.pendingId);
      }
      tocState.pendingTimer = null;
    };

    tocState.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          visible.set(id, { ratio: entry.intersectionRatio, top: entry.boundingClientRect.top });
        } else {
          visible.delete(id);
        }
      });
      const activeId = pickActive();
      if (activeId) {
        if (tocState.pendingTimer) clearTimeout(tocState.pendingTimer);
        tocState.pendingId = activeId;
        // debounce to avoid rapid flicker during initial paint/layout shifts
        tocState.pendingTimer = setTimeout(commitPending, 80);
      }
    }, { root: null, rootMargin, threshold: thresholds });

    tocState.headings.forEach((h) => tocState.observer.observe(h.el));
  }

  function recomputeAndUpdate() {
    buildToc();
    snapshotHeadings();
    tocState.lastActiveId = null;
    if (tocState.observer) tocState.observer.disconnect();
    // delay observer start slightly to let layout settle after navigation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        createObserver();
        if (tocState.headings[0]) {
          setActiveLink(tocState.headings[0].id);
        }
      });
    });
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

  const handleResize = () => recomputeAndUpdate();
  const handleLoad = () => recomputeAndUpdate();
  const handleImageFade = () => recomputeAndUpdate();

  window.addEventListener("resize", handleResize, { passive: true });
  window.addEventListener("load", handleLoad);
  document.addEventListener("imageFade:loaded", handleImageFade);

  tocState.resizeHandler = handleResize;
  tocState.loadHandler = handleLoad;
  tocState.imageFadeHandler = handleImageFade;

  recomputeAndUpdate();
};

export default initToc;
