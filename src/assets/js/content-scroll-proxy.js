let initialized = false;

const DESKTOP_QUERY = "(min-width: 1101px)";
const CONTENT_SCROLL_SELECTOR = ".app-shell__content-scroll";
const EXCLUDED_SELECTOR = [
  ".app-shell__sidebar",
  ".app-shell__toc",
  ".search-box",
  ".lang-menu",
  ".lang-toggle",
  ".theme-toggle",
  "button",
  "input",
  "select",
  "textarea",
].join(", ");
const MIDDLE_DRAG_EXCLUDED_SELECTOR = [
  EXCLUDED_SELECTOR,
  "a",
  "[role='button']",
].join(", ");

const getScrollableState = (element) => {
  if (!element) {
    return {
      isVerticallyScrollable: false,
      isHorizontallyScrollable: false,
    };
  }

  return {
    isVerticallyScrollable: element.scrollHeight > element.clientHeight,
    isHorizontallyScrollable: element.scrollWidth > element.clientWidth,
  };
};

const canScroll = (element) => {
  const { isVerticallyScrollable, isHorizontallyScrollable } = getScrollableState(element);
  return isVerticallyScrollable || isHorizontallyScrollable;
};

const initContentScrollProxy = () => {
  if (initialized) return;
  initialized = true;

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  let middleDragState = null;

  document.addEventListener(
    "wheel",
    (event) => {
      if (!desktopQuery.matches || event.defaultPrevented || event.ctrlKey) return;
      if (event.target.closest(EXCLUDED_SELECTOR)) return;

      const contentScroll = document.querySelector(CONTENT_SCROLL_SELECTOR);
      if (!canScroll(contentScroll)) return;

      event.preventDefault();
      contentScroll.scrollBy({
        top: event.deltaY,
        left: event.deltaX,
        behavior: "auto",
      });
    },
    { passive: false }
  );

  document.addEventListener(
    "mousedown",
    (event) => {
      if (!desktopQuery.matches || event.button !== 1 || event.defaultPrevented) return;
      if (event.target.closest(MIDDLE_DRAG_EXCLUDED_SELECTOR)) return;

      const contentScroll = document.querySelector(CONTENT_SCROLL_SELECTOR);
      if (!canScroll(contentScroll)) return;

      event.preventDefault();
      middleDragState = {
        contentScroll,
        lastX: event.clientX,
        lastY: event.clientY,
      };
    },
    { passive: false }
  );

  document.addEventListener(
    "mousemove",
    (event) => {
      if (!middleDragState) return;

      const deltaX = event.clientX - middleDragState.lastX;
      const deltaY = event.clientY - middleDragState.lastY;
      middleDragState.lastX = event.clientX;
      middleDragState.lastY = event.clientY;

      middleDragState.contentScroll.scrollBy({
        left: deltaX,
        top: deltaY,
        behavior: "auto",
      });
    },
    { passive: true }
  );

  document.addEventListener("mouseup", (event) => {
    if (event.button === 1) {
      middleDragState = null;
    }
  });

  window.addEventListener("blur", () => {
    middleDragState = null;
  });
};

export default initContentScrollProxy;
