let lightboxEl = null;
let imageEl = null;
let videoEl = null;
let closeButtons = [];
let prevButton = null;
let nextButton = null;
let keyHandler = null;
let zoomed = false;
let currentIndex = 0;
let mediaItems = [];
let initializedMedia = new WeakSet();
let controlsBound = false;

const LIGHTBOX_ICONS = {
  close:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  prev:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 4L7 12L15 20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 20L17 12L9 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function renderIcon(name) {
  return `<span class="lightbox__icon" aria-hidden="true">${LIGHTBOX_ICONS[name] || ""}</span>`;
}

function buildLightbox() {
  if (lightboxEl) return lightboxEl;
  const wrapper = document.createElement("div");
  wrapper.className = "lightbox";
  wrapper.innerHTML = `
    <div class="lightbox__backdrop" data-lightbox-close></div>
    <div class="lightbox__content" role="dialog" aria-modal="true" aria-label="画像プレビュー">
      <button class="lightbox__close" type="button" data-lightbox-close aria-label="閉じる">
        ${renderIcon("close")}
      </button>
      <div class="lightbox__image-area">
        <button class="lightbox__nav lightbox__nav--prev" type="button" data-lightbox-prev aria-label="前の画像">
          ${renderIcon("prev")}
        </button>
        <div class="lightbox__media">
          <img data-lightbox-image alt="" />
          <video data-lightbox-video playsinline></video>
        </div>
        <button class="lightbox__nav lightbox__nav--next" type="button" data-lightbox-next aria-label="次の画像">
          ${renderIcon("next")}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);
  lightboxEl = wrapper;
  imageEl = wrapper.querySelector("[data-lightbox-image]");
  videoEl = wrapper.querySelector("[data-lightbox-video]");
  closeButtons = wrapper.querySelectorAll("[data-lightbox-close]");
  prevButton = wrapper.querySelector("[data-lightbox-prev]");
  nextButton = wrapper.querySelector("[data-lightbox-next]");
  return wrapper;
}

function getMediaSource(target) {
  if (!target) return "";
  const gyazoFig = target.closest("[data-gyazo-id]");
  if (gyazoFig) {
    const gid = gyazoFig.getAttribute("data-gyazo-id");
    if (gid) return `https://i.gyazo.com/${gid}.mp4`;
  }

  const pick = target.dataset.fullSrc || target.currentSrc || target.src || "";

  // If it's a Gyazo still image without max_size, force preview URL to avoid 403/404
  try {
    const u = new URL(pick);
    if (u.hostname === "i.gyazo.com" && !u.pathname.includes("/max_size/")) {
      const m = u.pathname.match(/\/([a-f0-9]{32})\.(png|jpg|jpeg|gif)$/i);
      if (m) {
        const id = m[1];
        const ext = m[2].toLowerCase() === "jpeg" ? "jpg" : m[2].toLowerCase();
        return `https://i.gyazo.com/${id}/max_size/1200.${ext}`;
      }
    }
  } catch {
    /* ignore */
  }

  return pick;
}

function updateZoom() {
  imageEl.style.transform = zoomed ? "scale(2)" : "scale(1)";
  imageEl.classList.toggle("is-zoomed", zoomed);
}

function show(index) {
  if (!mediaItems.length) return;
  currentIndex = (index + mediaItems.length) % mediaItems.length;
  const target = mediaItems[currentIndex];
  const highResSource = getMediaSource(target);
  const isVideo = target.tagName.toLowerCase() === "video";

  // Reset state
  zoomed = false;
  updateZoom();

  // Stop any playing video
  if (videoEl) {
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.style.display = "none";
  }

  if (isVideo) {
    imageEl.style.display = "none";
    if (videoEl) {
      videoEl.style.display = "block";
      if (highResSource) {
        videoEl.src = highResSource;
        videoEl.load();
      }
      // Mirror current mode (loop / player) from parent figure if present
      const figure = target.closest("[data-gyazo-toggle]");
      const mode = figure?.dataset.gyazoMode || figure?.getAttribute("data-gyazo-initial") || "loop";
      const isPlayer = mode === "player";
      videoEl.loop = !isPlayer;
      videoEl.muted = !isPlayer;
      videoEl.autoplay = !isPlayer;
      videoEl.controls = true; // always allow controls in lightbox

      if (!isPlayer) {
        const playPromise = videoEl.play();
        if (playPromise?.catch) playPromise.catch(() => { });
      } else {
        videoEl.pause();
      }
    }
  } else {
    imageEl.style.display = "block";

    // 1. Show the current (low-res) image immediately for instant feedback
    const currentSrc = target.currentSrc || target.src;
    if (currentSrc) {
      imageEl.removeAttribute("srcset");
      imageEl.removeAttribute("sizes");
      imageEl.src = currentSrc;
    }
    imageEl.alt = target.alt || "";

    // 2. If high-res is available and different, load it in background and swap
    if (highResSource && highResSource !== currentSrc) {
      const imgLoader = new Image();
      const capturedIndex = currentIndex;

      imgLoader.onload = () => {
        // Only swap if the user is still viewing the same image
        if (currentIndex === capturedIndex) {
          imageEl.src = highResSource;
        }
      };

      imgLoader.src = highResSource;
    }
  }

  lightboxEl.classList.add("is-open");
  document.documentElement.classList.add("lightbox-open");
  attachKeyHandler();
}

function close() {
  if (!lightboxEl) return;
  if (videoEl) {
    videoEl.pause();
  }
  lightboxEl.classList.remove("is-open");
  document.documentElement.classList.remove("lightbox-open");
  detachKeyHandler();
}

function next(step = 1) {
  show(currentIndex + step);
}

function toggleZoom() {
  // Zoom is only relevant for images
  if (imageEl.style.display !== "none") {
    zoomed = !zoomed;
    updateZoom();
  }
}

function onKeyDown(event) {
  if (!lightboxEl || !lightboxEl.classList.contains("is-open")) return;
  switch (event.key) {
    case "Escape":
      close();
      break;
    case "ArrowRight":
      next(1);
      break;
    case "ArrowLeft":
      next(-1);
      break;
    default:
      break;
  }
}

function attachKeyHandler() {
  if (keyHandler) return;
  keyHandler = onKeyDown;
  document.addEventListener("keydown", keyHandler);
}

function detachKeyHandler() {
  if (!keyHandler) return;
  document.removeEventListener("keydown", keyHandler);
  keyHandler = null;
}

const initLightbox = (root = document) => {
  mediaItems = Array.from(root.querySelectorAll(".article-body img, .article-body figure[data-gyazo-toggle] video"));
  if (!mediaItems.length) return;

  buildLightbox();

  mediaItems.forEach((media, index) => {
    if (initializedMedia.has(media)) return;
    initializedMedia.add(media);

    if (media.tagName.toLowerCase() === "img") {
      media.style.cursor = "zoom-in";
    } else {
      media.style.cursor = "zoom-in";
    }

    media.dataset.lightboxIndex = String(index);
    media.addEventListener("click", () => show(index));
    media.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        show(index);
      }
    });
    if (!media.hasAttribute("tabindex")) {
      media.setAttribute("tabindex", "0");
    }
  });

  if (!controlsBound) {
    closeButtons.forEach((btn) => btn.addEventListener("click", close));
    prevButton.addEventListener("click", (event) => {
      event.stopPropagation();
      next(-1);
    });
    nextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      next(1);
    });
    imageEl.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleZoom();
    });
    lightboxEl.querySelector(".lightbox__backdrop").addEventListener("click", close);
    controlsBound = true;
  }
};

export default initLightbox;
