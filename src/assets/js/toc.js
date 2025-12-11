let tocState = {
  scrollHandler: null,
  resizeHandler: null,
  loadHandler: null,
  imageFadeHandler: null,
  headings: [],
  lastActiveId: null,
  ticking: false,
};

const initToc = () => {
  const article = document.querySelector(".article-body");
  const tocContainer = document.querySelector(".toc__links");
  if (!article || !tocContainer) return;

  // Cleanup existing listeners
  if (tocState.scrollHandler) window.removeEventListener("scroll", tocState.scrollHandler);
  if (tocState.resizeHandler) window.removeEventListener("resize", tocState.resizeHandler);
  if (tocState.loadHandler) window.removeEventListener("load", tocState.loadHandler);
  if (tocState.imageFadeHandler) document.removeEventListener("imageFade:loaded", tocState.imageFadeHandler);

  tocState.headings = [];
  tocState.lastActiveId = null;
  tocState.ticking = false;

  function toPixels(value, baseSize) {
    if (!value) return 0;
    const numeric = parseFloat(value);
    if (Number.isNaN(numeric)) return 0;
    if (value.includes("rem") || value.includes("em")) return numeric * baseSize;
    return numeric;
  }

  function getHeaderOffset() {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const baseFont = parseFloat(styles.fontSize) || 16;
    const headerVar = styles.getPropertyValue("--header-height").trim();
    const paddingVar = styles.getPropertyValue("--space-lg").trim();

    // Fallback if variables are missing
    let offset = 0;
    if (headerVar) offset += toPixels(headerVar, baseFont);
    else {
      const headerEl = document.querySelector(".site-header");
      if (headerEl) offset += headerEl.getBoundingClientRect().height;
    }

    if (paddingVar) offset += toPixels(paddingVar, baseFont);
    else offset += 20; // default padding

    return offset;
  }

  function getHeadings() {
    // Only select direct h2, h3 in the article to avoid accidentally picking up unwanted headers
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
    const currentHeadings = getHeadings();

    currentHeadings.forEach((heading) => {
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent || heading.id;
      link.className = "toc__link";
      link.dataset.targetId = heading.id;
      link.dataset.depth = heading.tagName.toLowerCase() === "h2" ? "2" : "3";
      frag.appendChild(link);
    });
    tocContainer.appendChild(frag);

    // Store headings with their elements for position checking
    tocState.headings = currentHeadings.map(h => ({
      id: h.id,
      el: h
    }));
  }

  function setActiveLink(id) {
    if (tocState.lastActiveId === id) return;

    const links = tocContainer.querySelectorAll(".toc__link");
    links.forEach((link) => {
      const isActive = link.dataset.targetId === id;
      link.classList.toggle("is-active", isActive);
    });
    tocState.lastActiveId = id;
  }

  function update() {
    tocState.ticking = false;
    if (!tocState.headings.length) return;

    const offset = getHeaderOffset();
    const scrollY = window.scrollY;

    // Strategy: Find the last heading that is above the "read line" (offset)
    // or simply finding the heading closest to the top but slightly above or crossing it.

    // Let's gather current positions relative to viewport
    // We want the heading that effectively "owns" the current viewport area.
    // Usually that means: The heading strictly above the offset line, closest to it.

    let activeId = null;

    // Margin allows a heading to become active slightly before it hits the exact top
    // improving perceived responsiveness.
    const activationMargin = 10;
    const checkLine = offset + activationMargin;

    // Headings are in document order.
    // We search for the last heading whose top position is <= checkLine.
    for (let i = 0; i < tocState.headings.length; i++) {
      const h = tocState.headings[i];
      const rect = h.el.getBoundingClientRect();

      // rect.top is relative to viewport. 
      // If rect.top <= checkLine, this heading has started (is above the line or just crossing).
      if (rect.top <= checkLine) {
        activeId = h.id;
      } else {
        // Once we find a heading that is below the checkLine,
        // subsequent headings are also below (assuming document order).
        // So the 'activeId' we found so far (the previous one) is the correct one.
        break;
      }
    }

    if (activeId) {
      setActiveLink(activeId);
    } else {
      // If no heading is above the line (Top of page), default to the first heading
      if (tocState.headings.length > 0) {
        setActiveLink(tocState.headings[0].id);
      } else {
        setActiveLink(null);
      }
    }
  }

  function onScroll() {
    if (!tocState.ticking) {
      window.requestAnimationFrame(update);
      tocState.ticking = true;
    }
  }

  // Initial Setup
  buildToc();
  // Run update immediately to set initial state
  update();

  // Re-calculate on resize / load / layout changes
  // Debounce resize merely to avoid excessive DOM writes/reads, 
  // though rAF throttling in update() handles most of it.
  const handleResize = onScroll;
  const handleLoad = () => {
    // Layout might shift after images load
    update();
    // Force a few more updates for safety in case of late layout shifts (fonts etc)
    setTimeout(update, 100);
    setTimeout(update, 300);
  };
  const handleImageFade = () => {
    update();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  window.addEventListener("load", handleLoad);
  document.addEventListener("imageFade:loaded", handleImageFade);

  tocState.scrollHandler = onScroll;
  tocState.resizeHandler = handleResize;
  tocState.loadHandler = handleLoad;
  tocState.imageFadeHandler = handleImageFade;

  // Handle click scrolling manually to ensure smooth scroll + immediate active set
  tocContainer.addEventListener("click", (event) => {
    const link = event.target.closest(".toc__link");
    if (!link) return;
    event.preventDefault();
    const targetId = link.dataset.targetId;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const offset = getHeaderOffset();
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      // Immediate feedback
      setActiveLink(targetId);
    }
  });

  // Safety: run update again after a short delay since single-page nav might handle scroll position async
  setTimeout(update, 50);
};

export default initToc;
