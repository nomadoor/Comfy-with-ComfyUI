let initializedFigures = new WeakSet();

function applyGyazoMode(figure, mode) {
  const video = figure.querySelector("video");
  const toggle = figure.querySelector(".gyazo-toggle");
  const labelEl = toggle?.querySelector(".gyazo-toggle__text");
  if (!video || !toggle || !labelEl) return;

  const loopLabel = toggle.dataset.loopLabel || "Loop";
  const playerLabel = toggle.dataset.playerLabel || "Player";
  const isPlayer = mode === "player";

  figure.dataset.gyazoMode = mode;
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

const initGyazoToggle = () => {
  const figures = document.querySelectorAll("[data-gyazo-toggle]");
  figures.forEach((figure) => {
    if (initializedFigures.has(figure)) return;
    initializedFigures.add(figure);

    const toggle = figure.querySelector(".gyazo-toggle");
    if (!toggle) return;

    const frame = figure.querySelector(".article-video__frame");
    if (frame) {
      frame.addEventListener("mouseleave", () => {
        if (toggle.matches(":focus")) {
          toggle.blur();
        }
      });
    }

    const initial = figure.getAttribute("data-gyazo-initial") === "player" ? "player" : "loop";
    applyGyazoMode(figure, initial);

    toggle.addEventListener("click", () => {
      const next = figure.dataset.gyazoMode === "player" ? "loop" : "player";
      applyGyazoMode(figure, next);
    });
  });
};

export default initGyazoToggle;
