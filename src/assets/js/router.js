import initPage from "./page.js";
import { refreshActiveNav } from "./link-behavior.js";
import { updateLangLinks } from "./lang-switcher.js";
import { setActiveSectionByPathname } from "./sidebar.js";
import { enterPoppedEntry, getCurrentEntryId, initHistoryEntries, markEntryShown, pushEntry, replaceEntryUrl, restoreScroll } from "./history-entries.js";

const CONTAINER_SELECTOR = "#page";
const ROUTER_IGNORE_ATTR = "data-router-ignore";
const FETCH_HEADER = { "X-Requested-With": "view-transition-router" };
const supportsViewTransitions =
  "startViewTransition" in document &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isProfileNav = () => Boolean(window.__CW_PROFILE_NAV__);
const PREFETCH_LIMIT = 3;
const prefetched = new Set();
const inflight = new Set();
const prefetchCache = new Map(); // pathname+search -> html string
const debounceTimers = new Map(); // pathname+search -> timer

let activeNavigation = null; // { controller, committed, fellBack }
let pendingNavigation = null; // latest navigation requested while a committed one is transitioning
let currentPathname = window.location.pathname;
let currentSearch = window.location.search;
let linkObserver = null;

const isSameOrigin = (url) => {
  try {
    return new URL(url, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
};

const shouldHandleClick = (event) => {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false; // only left click
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

  const anchor = event.target.closest("a[href]");
  if (!anchor) return false;
  if (anchor.hasAttribute(ROUTER_IGNORE_ATTR)) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  if (!isSameOrigin(href)) return false;
  return true;
};

const shouldPrefetch = (anchor) => {
  if (anchor.hasAttribute(ROUTER_IGNORE_ATTR)) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    const targetUrl = new URL(href, window.location.href);
    if (!isSameOrigin(targetUrl.href)) return false;
    if (targetUrl.pathname === currentPathname) return false;
    return true;
  } catch {
    return false;
  }
};

const prefetch = (url) => {
  const key = url.pathname + url.search;
  if (prefetched.has(key) || inflight.has(key)) return;
  if (inflight.size >= PREFETCH_LIMIT) return;
  inflight.add(key);
  fetch(url.href, { headers: FETCH_HEADER, credentials: "same-origin" })
    .then((resp) => (resp.ok ? resp.text() : null))
    .then((html) => {
      if (html) prefetchCache.set(key, html);
    })
    .catch(() => {})
    .finally(() => {
      inflight.delete(key);
      prefetched.add(key);
    });
};

const schedulePrefetch = (anchor, delay = 80) => {
  if (!anchor || !shouldPrefetch(anchor)) return;
  try {
    const url = new URL(anchor.getAttribute("href"), window.location.href);
    const key = url.pathname + url.search;
    if (prefetched.has(key) || inflight.has(key)) return;
    if (debounceTimers.has(key)) return;
    const timer = setTimeout(() => {
      debounceTimers.delete(key);
      prefetch(url);
    }, delay);
    debounceTimers.set(key, timer);
  } catch {
    /* no-op */
  }
};

const handlePrefetchHover = (event) => {
  const anchor = event.target.closest("a[href]");
  if (!anchor || !shouldPrefetch(anchor)) return;
  schedulePrefetch(anchor);
};

const setupIntersectionPrefetch = () => {
  if (!("IntersectionObserver" in window)) return;
  if (linkObserver) linkObserver.disconnect();
  linkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          schedulePrefetch(entry.target);
        }
      });
    },
    { root: null, rootMargin: "100px", threshold: 0.01 }
  );
  document.querySelectorAll("a[href]").forEach((anchor) => {
    if (shouldPrefetch(anchor)) {
      linkObserver.observe(anchor);
    }
  });
};

const updateHead = (nextDoc) => {
  document.title = nextDoc.title || document.title;

  const nextLang = nextDoc.documentElement.lang || nextDoc.body.getAttribute("lang");
  if (nextLang) {
    document.documentElement.lang = nextLang;
    document.body.setAttribute("lang", nextLang);
  }

  // Replace every page-specific head tag (canonical, OG/Twitter, article meta, JSON-LD, hreflang,
  // robots, description) with the next page's set, so the head matches a direct load.
  document.head.querySelectorAll("[data-page-meta]").forEach((node) => node.remove());
  const anchor = document.head.querySelector("title");
  const nextTags = [...nextDoc.head.querySelectorAll("[data-page-meta]")].map((node) => document.importNode(node, true));
  if (anchor) {
    anchor.after(...nextTags);
  } else {
    document.head.prepend(...nextTags);
  }
};

const belongsToCurrentDeployment = (nextDoc) => {
  const currentVersion = document.documentElement.dataset.assetVersion;
  const nextVersion = nextDoc.documentElement.dataset.assetVersion;
  return Boolean(currentVersion && nextVersion && currentVersion === nextVersion);
};

const swapContent = (nextDoc, destinationUrl) => {
  const nextPage = nextDoc.querySelector(CONTAINER_SELECTOR);
  const currentPage = document.querySelector(CONTAINER_SELECTOR);
  if (!nextPage || !currentPage) return false;

  currentPage.className = nextPage.className || currentPage.className;
  currentPage.innerHTML = nextPage.innerHTML;

  currentPathname = destinationUrl.pathname;
  currentSearch = destinationUrl.search;
  return true;
};

const scrollToTarget = (url, restoreY = null) => {
  if (typeof restoreY === "number") {
    restoreScroll(restoreY);
    return;
  }
  if (!url.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }

  const id = decodeURIComponent(url.hash.substring(1));
  const tryScroll = () => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  };

  // Try immediately; if content isn't laid out yet (images, etc.), retry shortly.
  if (tryScroll()) return;
  requestAnimationFrame(() => {
    if (tryScroll()) return;
    setTimeout(tryScroll, 80);
  });
};

const reinitializePage = (destinationUrl, { forceCenterNav = true, scrollNav = true, restoreY = null } = {}) => {
  document.body.classList.remove("nav-open", "search-open");
  initPage();
  setActiveSectionByPathname(destinationUrl.pathname);
  refreshActiveNav(destinationUrl.pathname, { forceCenter: forceCenterNav, scroll: scrollNav });
  updateLangLinks(destinationUrl.pathname);
  scrollToTarget(destinationUrl, restoreY);
};

const navigateTo = async (url, options = {}) => {
  if (activeNavigation) {
    if (activeNavigation.committed) {
      // History and content already changed and the transition is running; run the latest request next.
      pendingNavigation = { url, options };
      return;
    }
    // Still fetching: the newer request (a click, or Back/Forward) wins. Abort the old one before it
    // touches history so entries are never pushed on top of a popped one.
    activeNavigation.controller.abort();
  }
  const { replace = false, source = "unknown", restoreY = null } = options;
  const destinationUrl = new URL(url, window.location.href);
  const navigation = { controller: new AbortController(), committed: false, fellBack: false };
  const isAborted = () => navigation.controller.signal.aborted;
  const fallBack = () => {
    navigation.fellBack = true;
    pendingNavigation = null;
    window.location.href = destinationUrl.href;
  };
  if (!isSameOrigin(destinationUrl.href)) {
    fallBack();
    return;
  }

  activeNavigation = navigation;
  try {
    const cacheKey = destinationUrl.pathname + destinationUrl.search;
    let html = prefetchCache.get(cacheKey);
    let contentType = "text/html";
    if (!html) {
      const tFetchStart = performance.now();
      const response = await fetch(destinationUrl.href, {
        headers: FETCH_HEADER,
        credentials: "same-origin",
        signal: navigation.controller.signal
      });
      const tFetchEnd = performance.now();
      if (isProfileNav()) console.log(`[nav-prof] fetch ${destinationUrl.pathname}: ${(tFetchEnd - tFetchStart).toFixed(1)}ms`);

      contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.includes("text/html")) {
        if (!isAborted()) fallBack();
        return;
      }
      html = await response.text();
    } else if (isProfileNav()) {
      console.log(`[nav-prof] fetch ${destinationUrl.pathname}: prefetch-hit`);
    }
    if (isAborted()) return;
    const parser = new DOMParser();
    const nextDoc = parser.parseFromString(html, "text/html");
    if (!belongsToCurrentDeployment(nextDoc)) {
      fallBack();
      return;
    }
    // The header, sidebar, and search are rendered per language and are not swapped, so a page in
    // another language gets a full load instead of a content swap.
    if ((nextDoc.documentElement.lang || "") !== (document.documentElement.lang || "")) {
      fallBack();
      return;
    }
    const nextUrl = destinationUrl.pathname + destinationUrl.search + destinationUrl.hash;

    const entryAtCommit = getCurrentEntryId();
    const performSwap = () => {
      // Back/Forward landed between commit and this callback: history moved on, so leave the page to
      // the queued popstate navigation instead of pushing on top of the popped entry. A same-page hash
      // or TOC click in this gap also changes the entry; the newer click wins and this swap is dropped.
      if (getCurrentEntryId() !== entryAtCommit) return;
      const tSwapStart = performance.now();
      const leavingY = window.scrollY;
      if (!swapContent(nextDoc, destinationUrl)) {
        fallBack();
        return;
      }
      updateHead(nextDoc);
      if (replace) {
        replaceEntryUrl(nextUrl);
        markEntryShown();
      } else {
        pushEntry(nextUrl, leavingY);
      }
      const fromSidebar = source === "sidebar-nav";
      reinitializePage(destinationUrl, {
        forceCenterNav: !fromSidebar,
        scrollNav: !fromSidebar,
        restoreY
      });
      setupIntersectionPrefetch();
      if (isProfileNav()) console.log(`[nav-prof] swap+init ${destinationUrl.pathname}: ${(performance.now() - tSwapStart).toFixed(1)}ms`);
    };

    // From here on the navigation cannot be aborted; later requests wait for it.
    navigation.committed = true;
    if (supportsViewTransitions) {
      const tVTStart = performance.now();
      await document.startViewTransition(() => performSwap()).finished;
      if (isProfileNav()) console.log(`[nav-prof] view-transition ${destinationUrl.pathname}: ${(performance.now() - tVTStart).toFixed(1)}ms`);
    } else {
      performSwap();
    }
  } catch (error) {
    if (isAborted()) return;
    console.error("[router] navigation failed, falling back to full reload", error);
    fallBack();
  } finally {
    if (activeNavigation === navigation) {
      activeNavigation = null;
      if (pendingNavigation && !navigation.fellBack) {
        const next = pendingNavigation;
        pendingNavigation = null;
        navigateTo(next.url, next.options);
      }
    }
  }
};

const handleClick = (event) => {
  const hashAnchor = event.target.closest("a[href]");
  if (hashAnchor && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    const href = hashAnchor.getAttribute("href");
    if (href && href !== "#") {
      try {
        const targetUrl = new URL(href, window.location.href);
        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
          const targetId = decodeURIComponent(targetUrl.hash.slice(1));
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            event.preventDefault();
            const nextHash = `#${encodeURIComponent(targetId)}`;
            // Record the starting point before scrolling; reduced motion jumps synchronously.
            if (window.location.hash !== nextHash) pushEntry(nextHash);
            targetEl.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "start"
            });
            return;
          }
        }
      } catch {
        // Let the existing navigation fallback handle malformed URLs.
      }
    }
  }

  if (!shouldHandleClick(event)) return;
  const anchor = event.target.closest("a[href]");
  const href = anchor.getAttribute("href");
  const targetUrl = new URL(href, window.location.href);
  if (targetUrl.pathname === currentPathname && targetUrl.hash) {
    // In-page hash; let browser handle
    return;
  }
  event.preventDefault();
  const source = anchor.closest(".sidebar") ? "sidebar-nav" : "content";
  navigateTo(targetUrl, { source });
};

const handlePopState = (event) => {
  // A fetch still in flight belongs to the entry the user just left; drop it.
  if (activeNavigation && !activeNavigation.committed) {
    activeNavigation.controller.abort();
    activeNavigation = null;
  }
  const destination = new URL(window.location.href);
  const restoreY = enterPoppedEntry(event.state);
  // Hash-only history entries belong to the page already shown: scroll instead of refetching.
  if (destination.pathname === currentPathname && destination.search === currentSearch) {
    markEntryShown();
    scrollToTarget(destination, restoreY);
    return;
  }
  navigateTo(destination.href, { replace: true, source: "popstate", restoreY });
};

const initRouter = () => {
  initHistoryEntries();
  window.addEventListener("click", handleClick);
  window.addEventListener("popstate", handlePopState);
  window.addEventListener("mouseover", handlePrefetchHover, { passive: true });
  window.addEventListener("focusin", handlePrefetchHover);
  setupIntersectionPrefetch();
};

export default initRouter;
