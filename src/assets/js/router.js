import initPage from "./page.js";
import { refreshActiveNav } from "./link-behavior.js";
import { updateLangLinks } from "./lang-switcher.js";

const CONTAINER_SELECTOR = "#page";
const ROUTER_IGNORE_ATTR = "data-router-ignore";
const FETCH_HEADER = { "X-Requested-With": "view-transition-router" };
const supportsViewTransitions =
  "startViewTransition" in document &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let isNavigating = false;
let currentPathname = window.location.pathname;

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

const updateHead = (nextDoc) => {
  document.title = nextDoc.title || document.title;

  const nextLang = nextDoc.documentElement.lang || nextDoc.body.getAttribute("lang");
  if (nextLang) {
    document.documentElement.lang = nextLang;
    document.body.setAttribute("lang", nextLang);
  }

  const currentDesc = document.querySelector('meta[name="description"]');
  const nextDesc = nextDoc.querySelector('meta[name="description"]');
  if (currentDesc && nextDesc) {
    currentDesc.setAttribute("content", nextDesc.getAttribute("content") || "");
  }
};

const swapContent = (nextDoc, destinationUrl) => {
  const nextPage = nextDoc.querySelector(CONTAINER_SELECTOR);
  const currentPage = document.querySelector(CONTAINER_SELECTOR);
  if (!nextPage || !currentPage) return false;

  currentPage.className = nextPage.className || currentPage.className;
  currentPage.innerHTML = nextPage.innerHTML;

  currentPathname = destinationUrl.pathname;
  return true;
};

const scrollToTarget = (url) => {
  if (url.hash) {
    const id = decodeURIComponent(url.hash.substring(1));
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

const reinitializePage = (destinationUrl) => {
  document.body.classList.remove("nav-open", "search-open");
  initPage();
  refreshActiveNav(destinationUrl.pathname);
  updateLangLinks(destinationUrl.pathname);
  scrollToTarget(destinationUrl);
};

const navigateTo = async (url, { replace = false } = {}) => {
  if (isNavigating) return;
  const destinationUrl = new URL(url, window.location.href);
  if (!isSameOrigin(destinationUrl.href)) {
    window.location.href = destinationUrl.href;
    return;
  }

  isNavigating = true;
  try {
    const response = await fetch(destinationUrl.href, { headers: FETCH_HEADER, credentials: "same-origin" });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("text/html")) {
      window.location.href = destinationUrl.href;
      return;
    }
    const html = await response.text();
    const parser = new DOMParser();
    const nextDoc = parser.parseFromString(html, "text/html");

    const performSwap = () => {
      if (!swapContent(nextDoc, destinationUrl)) {
        window.location.href = destinationUrl.href;
        return;
      }
      updateHead(nextDoc);
      reinitializePage(destinationUrl);
    };

    if (supportsViewTransitions) {
      await document.startViewTransition(() => performSwap()).finished;
    } else {
      performSwap();
    }

    const nextUrl = destinationUrl.pathname + destinationUrl.search + destinationUrl.hash;
    if (replace) {
      window.history.replaceState({}, "", nextUrl);
    } else {
      window.history.pushState({}, "", nextUrl);
    }
  } catch (error) {
    console.error("[router] navigation failed, falling back to full reload", error);
    window.location.href = destinationUrl.href;
  } finally {
    isNavigating = false;
  }
};

const handleClick = (event) => {
  if (!shouldHandleClick(event)) return;
  const anchor = event.target.closest("a[href]");
  const href = anchor.getAttribute("href");
  const targetUrl = new URL(href, window.location.href);
  if (targetUrl.pathname === currentPathname && targetUrl.hash) {
    // In-page hash; let browser handle
    return;
  }
  event.preventDefault();
  navigateTo(targetUrl);
};

const handlePopState = () => {
  navigateTo(window.location.href, { replace: true });
};

const initRouter = () => {
  window.addEventListener("click", handleClick);
  window.addEventListener("popstate", handlePopState);
};

export default initRouter;
