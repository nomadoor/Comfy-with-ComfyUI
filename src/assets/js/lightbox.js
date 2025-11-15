const LIGHTBOX_ICONS = {
  close:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  prev:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 4L7 12L15 20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 20L17 12L9 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function renderIcon(name) {
  return `<span class="lightbox__icon" aria-hidden="true">${LIGHTBOX_ICONS[name] || ""}</span>`;
}

function buildLightbox() {
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
        <img data-lightbox-image alt="" />
        <button class="lightbox__nav lightbox__nav--next" type="button" data-lightbox-next aria-label="次の画像">
          ${renderIcon("next")}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);
  return wrapper;
}

export function initLightbox() {
  const images = Array.from(document.querySelectorAll(".article-body img"));
  if (!images.length) return;

  const lightbox = buildLightbox();
  const imageEl = lightbox.querySelector("[data-lightbox-image]");
  const closeButtons = lightbox.querySelectorAll("[data-lightbox-close]");
  const prevButton = lightbox.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");

  let currentIndex = 0;
  let zoomed = false;
  let keyHandler = null;

  function getImageSource(target) {
    if (!target) return "";
    return target.dataset.fullSrc || target.currentSrc || target.src;
  }

  function updateZoom() {
    imageEl.style.transform = zoomed ? "scale(2)" : "scale(1)";
    imageEl.classList.toggle("is-zoomed", zoomed);
  }

  function show(index) {
    currentIndex = (index + images.length) % images.length;
    const target = images[currentIndex];
    const source = getImageSource(target);
    if (source) {
      imageEl.removeAttribute("srcset");
      imageEl.removeAttribute("sizes");
      imageEl.src = source;
    }
    imageEl.alt = target.alt || "";
    zoomed = false;
    updateZoom();
    lightbox.classList.add("is-open");
    document.documentElement.classList.add("lightbox-open");
    attachKeyHandler();
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.documentElement.classList.remove("lightbox-open");
    detachKeyHandler();
  }

  function next(step = 1) {
    show(currentIndex + step);
  }

  function toggleZoom() {
    zoomed = !zoomed;
    updateZoom();
  }

  function onKeyDown(event) {
    if (!lightbox.classList.contains("is-open")) return;
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

  images.forEach((img, index) => {
    img.style.cursor = "zoom-in";
    img.dataset.lightboxIndex = String(index);
    img.addEventListener("click", () => show(index));
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        show(index);
      }
    });
    if (!img.hasAttribute("tabindex")) {
      img.setAttribute("tabindex", "0");
    }
  });

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
  lightbox.querySelector(".lightbox__backdrop").addEventListener("click", close);
}

initLightbox();
