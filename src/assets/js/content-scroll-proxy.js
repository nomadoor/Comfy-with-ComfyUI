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
const MIDDLE_SCROLL_EXCLUDED_SELECTOR = [
  EXCLUDED_SELECTOR,
  "a",
  "[role='button']",
].join(", ");
const MIDDLE_SCROLL_DEAD_ZONE_PX = 8;
const MIDDLE_SCROLL_SPEED_MULTIPLIER = 10;
const MIDDLE_SCROLL_MAX_SPEED_PX_PER_SECOND = 2400;

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

const getMiddleScrollVelocity = (offset) => {
  const distance = Math.abs(offset);
  if (distance <= MIDDLE_SCROLL_DEAD_ZONE_PX) return 0;

  const speed = (distance - MIDDLE_SCROLL_DEAD_ZONE_PX) * MIDDLE_SCROLL_SPEED_MULTIPLIER;
  return Math.sign(offset) * Math.min(speed, MIDDLE_SCROLL_MAX_SPEED_PX_PER_SECOND);
};

const initContentScrollProxy = () => {
  if (initialized) return;
  initialized = true;

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  let middleScrollState = null;
  let middleScrollFrame = 0;
  let suppressNextMiddleAuxClick = false;
  let clearMiddleAuxClickTimer = 0;

  const stopMiddleScroll = () => {
    middleScrollState = null;
    document.documentElement.style.cursor = "";
    if (middleScrollFrame) {
      window.cancelAnimationFrame(middleScrollFrame);
      middleScrollFrame = 0;
    }
  };

  const clearMiddleAuxClickSuppressionSoon = () => {
    if (clearMiddleAuxClickTimer) {
      window.clearTimeout(clearMiddleAuxClickTimer);
    }
    clearMiddleAuxClickTimer = window.setTimeout(() => {
      suppressNextMiddleAuxClick = false;
      clearMiddleAuxClickTimer = 0;
    }, 100);
  };

  const tickMiddleScroll = (timestamp) => {
    if (!middleScrollState || !desktopQuery.matches || !canScroll(middleScrollState.contentScroll)) {
      stopMiddleScroll();
      return;
    }

    const elapsedSeconds = middleScrollState.lastTimestamp
      ? Math.min((timestamp - middleScrollState.lastTimestamp) / 1000, 0.05)
      : 0;
    middleScrollState.lastTimestamp = timestamp;

    const velocityX = getMiddleScrollVelocity(middleScrollState.currentX - middleScrollState.anchorX);
    const velocityY = getMiddleScrollVelocity(middleScrollState.currentY - middleScrollState.anchorY);

    if (elapsedSeconds && (velocityX || velocityY)) {
      middleScrollState.contentScroll.scrollBy({
        left: velocityX * elapsedSeconds,
        top: velocityY * elapsedSeconds,
        behavior: "auto",
      });
    }

    middleScrollFrame = window.requestAnimationFrame(tickMiddleScroll);
  };

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
      if (event.target.closest(MIDDLE_SCROLL_EXCLUDED_SELECTOR)) return;

      const contentScroll = document.querySelector(CONTENT_SCROLL_SELECTOR);
      if (!canScroll(contentScroll)) return;

      event.preventDefault();
      stopMiddleScroll();
      suppressNextMiddleAuxClick = true;
      middleScrollState = {
        contentScroll,
        anchorX: event.clientX,
        anchorY: event.clientY,
        currentX: event.clientX,
        currentY: event.clientY,
        lastTimestamp: 0,
      };
      document.documentElement.style.cursor = "all-scroll";
      middleScrollFrame = window.requestAnimationFrame(tickMiddleScroll);
    },
    { passive: false }
  );

  document.addEventListener(
    "mousemove",
    (event) => {
      if (!middleScrollState) return;
      middleScrollState.currentX = event.clientX;
      middleScrollState.currentY = event.clientY;
    },
    { passive: true }
  );

  document.addEventListener("mouseup", (event) => {
    if (event.button === 1) {
      stopMiddleScroll();
      clearMiddleAuxClickSuppressionSoon();
    }
  });

  document.addEventListener(
    "auxclick",
    (event) => {
      if (event.button !== 1 || !suppressNextMiddleAuxClick) return;
      suppressNextMiddleAuxClick = false;
      if (clearMiddleAuxClickTimer) {
        window.clearTimeout(clearMiddleAuxClickTimer);
        clearMiddleAuxClickTimer = 0;
      }
      event.preventDefault();
    },
    { passive: false }
  );

  window.addEventListener("blur", () => {
    stopMiddleScroll();
    suppressNextMiddleAuxClick = false;
  });
};

export default initContentScrollProxy;
