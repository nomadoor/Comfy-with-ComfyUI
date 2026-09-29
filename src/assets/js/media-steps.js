// Step cards (markup from scripts/lib/media-steps.mjs). Slides and texts are stacked in fixed grids,
// so switching steps only swaps what is visible: the card keeps one height and nothing around it
// moves. Steps change from the progress bar, the bottom buttons, the edge zones, swipes and the
// left / right arrow keys.

const SWIPE_MIN_PX = 48;
const controllers = new WeakMap();
let keysBound = false;

// The card the reader is looking at: the one with the most of itself on screen, as long as that is
// a real share of the viewport (or of the card, when the card is short).
const cardInView = () => {
  const viewport = window.innerHeight;
  let best = null;
  let bestVisible = 0;
  document.querySelectorAll("[data-media-steps]").forEach((card) => {
    if (!controllers.has(card)) return;
    const rect = card.getBoundingClientRect();
    const visible = Math.min(rect.bottom, viewport) - Math.max(rect.top, 0);
    if (visible < Math.min(viewport * 0.4, rect.height * 0.5) || visible <= bestVisible) return;
    best = card;
    bestVisible = visible;
  });
  return best;
};

// Left / right arrow keys step through the card in view, without having to focus it first.
const bindKeys = () => {
  if (keysBound) return;
  keysBound = true;
  document.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (document.documentElement.classList.contains("lightbox-open")) return;
    if (event.target.closest?.("input, textarea, select, [contenteditable], [role='menu'], [role='tablist'], .app-shell__sidebar, header")) return;
    const card = cardInView();
    if (!card) return;
    event.preventDefault();
    controllers.get(card).step(event.key === "ArrowRight" ? 1 : -1);
  });
};

const bindSwipe = (area, step) => {
  let start = null;
  area.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    start = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
  }, { passive: true });
  area.addEventListener("touchend", (event) => {
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    start = null;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    step(dx < 0 ? 1 : -1);
  });
};

const initCard = (card) => {
  if (card.dataset.mediaStepsReady) return;
  const surface = card.querySelector(".media-steps__card");
  const stage = card.querySelector(".media-steps__stage");
  const segments = [...card.querySelectorAll("[data-media-steps-go]")];
  const slides = [...card.querySelectorAll(".media-steps__slide")];
  const texts = [...card.querySelectorAll(".media-steps__text")];
  const prevButtons = [...card.querySelectorAll("[data-media-steps-prev]")];
  const nextButtons = [...card.querySelectorAll("[data-media-steps-next]")];
  const prevTitle = card.querySelector("[data-media-steps-prev-title]");
  const nextTitle = card.querySelector("[data-media-steps-next-title]");
  if (!surface || !stage || !slides.length || slides.length !== texts.length || segments.length !== slides.length) return;
  card.dataset.mediaStepsReady = "true";

  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

  const render = () => {
    slides.forEach((slide, i) => {
      const active = i === current;
      for (const el of [slide, texts[i]]) {
        el.classList.toggle("is-active", active);
        el.inert = !active;
      }
      if (!active) slide.querySelectorAll("video").forEach((video) => video.pause());
      segments[i].classList.toggle("is-active", active);
      segments[i].classList.toggle("is-done", i < current);
      if (active) segments[i].setAttribute("aria-current", "step");
      else segments[i].removeAttribute("aria-current");
    });
    prevButtons.forEach((button) => (button.disabled = current === 0));
    nextButtons.forEach((button) => (button.disabled = current === slides.length - 1));
    if (prevTitle) prevTitle.textContent = segments[current - 1]?.title || "";
    if (nextTitle) nextTitle.textContent = segments[current + 1]?.title || "";
  };

  const select = (index) => {
    const target = Math.min(Math.max(index, 0), slides.length - 1);
    if (target === current) return;
    current = target;
    render();
  };
  const step = (delta) => select(current + delta);

  card.addEventListener("click", (event) => {
    const go = event.target.closest("[data-media-steps-go]");
    if (go) select(Number(go.dataset.mediaStepsGo));
    else if (event.target.closest("[data-media-steps-prev]")) step(-1);
    else if (event.target.closest("[data-media-steps-next]")) step(1);
  });
  bindSwipe(stage, step);
  controllers.set(card, { step });

  // The edge zones begin at the image, below the header and progress bar.
  // Bounding boxes, not offsetTop: offsetTop rounds to whole pixels.
  const placeEdges = () =>
    surface.style.setProperty("--media-steps-edge-top", `${stage.getBoundingClientRect().top - surface.getBoundingClientRect().top}px`);
  placeEdges();
  if (typeof ResizeObserver === "function") new ResizeObserver(placeEdges).observe(surface);

  render();
};

export default function initMediaSteps(root = document) {
  const cards = root.querySelectorAll("[data-media-steps]");
  cards.forEach(initCard);
  if (cards.length) bindKeys();
}
