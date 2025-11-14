function buildLightbox() {
  const wrapper = document.createElement("div");
  wrapper.className = "lightbox";
  wrapper.innerHTML = `
    <div class="lightbox__backdrop" data-lightbox-close></div>
    <div class="lightbox__content" role="dialog" aria-modal="true" aria-label="画像プレビュー">
      <button class="lightbox__close" data-lightbox-close aria-label="閉じる">
        <img src="/assets/icons/Cross%20SVG%20File.svg" alt="" aria-hidden="true" />
      </button>
      <div class="lightbox__image-area">
        <button class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="前の画像">
          <img src="/assets/icons/Chevron%20Left%20SVG%20File.svg" alt="" aria-hidden="true" />
        </button>
        <img data-lightbox-image alt="" />
        <button class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="次の画像">
          <img src="/assets/icons/Chevron%20Right%20SVG%20File.svg" alt="" aria-hidden="true" />
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
