let initializedFigures = new WeakSet();

function applyMediaMode(figure, mode) {
  const video = figure.querySelector("video");
  const toggle = figure.querySelector(".media-toggle");
  const labelEl = toggle?.querySelector(".media-toggle__text");
  if (!video || !toggle || !labelEl) return;

  const loopLabel = toggle.dataset.loopLabel || "Loop";
  const playerLabel = toggle.dataset.playerLabel || "Player";
  const isPlayer = mode === "player";

  figure.dataset.mediaMode = mode;
  toggle.dataset.state = mode;
  toggle.setAttribute("aria-pressed", String(isPlayer));
  labelEl.textContent = isPlayer ? playerLabel : loopLabel;

  video.loop = !isPlayer;
  video.autoplay = !isPlayer;
  video.muted = !isPlayer;
  video.controls = isPlayer;

  if (isPlayer) {
    video.pause();
  } else {
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }
}

const initMediaToggle = () => {
  const figures = document.querySelectorAll("[data-media-toggle]");
  figures.forEach((figure) => {
    if (initializedFigures.has(figure)) return;
    initializedFigures.add(figure);

    const toggle = figure.querySelector(".media-toggle");
    if (!toggle) return;

    const frame = figure.querySelector(".article-video__frame");
    if (frame) {
      frame.addEventListener("mouseleave", () => {
        if (toggle.matches(":focus")) {
          toggle.blur();
        }
      });
    }

    const initial = figure.getAttribute("data-media-initial") === "player" ? "player" : "loop";
    applyMediaMode(figure, initial);

    toggle.addEventListener("click", () => {
      const next = figure.dataset.mediaMode === "player" ? "loop" : "player";
      applyMediaMode(figure, next);
      // video-sync.js rebuilds synchronized rows when a video enters or leaves Loop mode.
      figure.dispatchEvent(new CustomEvent("media-modechange", { bubbles: true, detail: { mode: next } }));
    });
  });
};

export default initMediaToggle;
