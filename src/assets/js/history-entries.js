// Scroll positions per history entry for the view-transition router.
//
// Each entry the router creates carries a `routerId` in history.state. Positions are kept in memory
// (and in sessionStorage across reloads) keyed by that id, because by the time `popstate` fires the
// browser has already moved to the next entry and the one being left can no longer be written.
// While the router runs, `history.scrollRestoration` is "manual"; restoring is done here.

const STORAGE_KEY = "cw-router-scroll";
const MAX_POSITIONS = 100;
const RESTORE_CANCEL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];

const positions = new Map();
let currentId = null; // the entry history is on
let shownId = null; // the entry whose content is on screen (lags currentId while a Back is loading)
let restoreGeneration = 0; // bumped by every entry change so stale restore retries stop
let anchoringPausedBy = null; // generation of the restore that turned scroll anchoring off

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const readStored = () => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    Object.entries(stored).forEach(([id, y]) => {
      if (typeof y === "number") positions.set(id, y);
    });
  } catch {
    /* storage unavailable */
  }
};

const writeStored = () => {
  while (positions.size > MAX_POSITIONS) positions.delete(positions.keys().next().value);
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(positions)));
  } catch {
    /* storage unavailable */
  }
};

// Record the on-screen page's position under the entry that shows it, not the entry history already
// moved to while its content is still loading.
const rememberCurrent = (y = window.scrollY) => {
  if (!shownId) return;
  positions.delete(shownId); // re-insert so the most recent entries survive pruning
  positions.set(shownId, y);
};

// Called once the content for the current entry is on screen (after a swap or a same-page popstate).
export const markEntryShown = () => {
  shownId = currentId;
};

export const getCurrentEntryId = () => currentId;

const adoptEntry = (state) => {
  if (state && typeof state.routerId === "string") {
    currentId = state.routerId;
    return;
  }
  currentId = newId();
  try {
    window.history.replaceState({ ...(state || {}), routerId: currentId }, "");
  } catch {
    /* no-op */
  }
};

// Scroll to `y` and keep it there while late layout (images, video posters, fonts) changes the page
// height. The watch ends after a short settling window once the position is reached, or after a longer
// limit while the page is still too short to reach it. User input or a newer navigation stops it.
const RESTORE_SETTLE_MS = 2500;
const RESTORE_GRACE_MS = 350;
const RESTORE_MAX_MS = 10000;
export const restoreScroll = (y) => {
  if (typeof y !== "number") return;
  const generation = ++restoreGeneration;
  let active = true;
  let observer = null;
  // Scroll anchoring is paused while restoring, so the browser does not move scrollY on its own when
  // late content changes height. Any other move away from `y` on a page tall enough to reach it comes
  // from the user (scrollbar drag, find-in-page, autoscroll send no input events) and ends the restore.
  const root = document.documentElement;
  root.style.overflowAnchor = "none";
  anchoringPausedBy = generation;
  const restoreStartedAt = performance.now();
  const onScroll = () => {
    // A smooth scroll that was running when Back fired can still emit a frame or two; ignore those.
    if (performance.now() - restoreStartedAt < RESTORE_GRACE_MS) return;
    const reachable = document.documentElement.scrollHeight - window.innerHeight >= y - 1;
    if (reachable && Math.abs(window.scrollY - y) > 2) stop();
  };
  const stop = () => {
    active = false;
    observer?.disconnect();
    RESTORE_CANCEL_EVENTS.forEach((type) => window.removeEventListener(type, stop));
    window.removeEventListener("scroll", onScroll);
    // Whichever restore paused anchoring last turns it back on, even if a newer entry change stopped it.
    if (anchoringPausedBy === generation) {
      root.style.overflowAnchor = "";
      anchoringPausedBy = null;
    }
  };
  const attempt = () => {
    if (!active) return;
    if (generation !== restoreGeneration) {
      stop();
      return;
    }
    if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, left: 0, behavior: "auto" });
  };
  RESTORE_CANCEL_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true, once: true }));
  window.addEventListener("scroll", onScroll, { passive: true });
  if ("ResizeObserver" in window) {
    observer = new ResizeObserver(attempt);
    observer.observe(document.body);
  }
  attempt();
  requestAnimationFrame(attempt);
  [100, 300, 700, 1200].forEach((delay) => setTimeout(attempt, delay));
  if (document.readyState !== "complete") window.addEventListener("load", attempt, { once: true });
  const stopWhenSettled = () => {
    if (!active) return;
    const reached = Math.abs(window.scrollY - y) <= 1;
    if (reached || performance.now() - restoreStartedAt >= RESTORE_MAX_MS) {
      stop();
    } else {
      setTimeout(stopWhenSettled, 500);
    }
  };
  setTimeout(stopWhenSettled, RESTORE_SETTLE_MS);
};

// Push a new entry, remembering the scroll position of the entry being left. Pass `leavingY` when the
// content has already been swapped, since a shorter new page clamps window.scrollY.
export const pushEntry = (url, leavingY = window.scrollY) => {
  restoreGeneration += 1;
  rememberCurrent(leavingY);
  currentId = newId();
  shownId = currentId;
  window.history.pushState({ routerId: currentId }, "", url);
};

// Replace the URL of the current entry, keeping its id.
export const replaceEntryUrl = (url) => {
  window.history.replaceState(window.history.state, "", url);
};

// Called on popstate: remember where the left entry was and return the saved position of the new one.
export const enterPoppedEntry = (state) => {
  restoreGeneration += 1;
  rememberCurrent();
  adoptEntry(state);
  if (positions.has(currentId)) return positions.get(currentId);
  return typeof state?.scrollY === "number" ? state.scrollY : null;
};

export const initHistoryEntries = () => {
  if (!("scrollRestoration" in window.history)) return;
  readStored();
  adoptEntry(window.history.state);
  shownId = currentId;
  window.history.scrollRestoration = "manual";

  window.addEventListener("pagehide", () => {
    rememberCurrent();
    writeStored();
    try {
      window.history.replaceState({ ...(window.history.state || {}), scrollY: window.scrollY }, "");
    } catch {
      /* no-op */
    }
  });

  // Reloads and cross-document Back/Forward: the browser does not restore while in manual mode.
  const navigation = performance.getEntriesByType?.("navigation")?.[0];
  if (navigation && (navigation.type === "reload" || navigation.type === "back_forward")) {
    const y = positions.get(currentId) ?? window.history.state?.scrollY;
    if (typeof y === "number") restoreScroll(y);
  }
};
