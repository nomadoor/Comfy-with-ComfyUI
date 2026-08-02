let lightboxEl = null;
let imageEl = null;
let rawImageEl = null;
let videoEl = null;
let mediaEl = null;
let closeButtons = [];
let prevButton = null;
let nextButton = null;
let zoomControls = null;
let zoomOutButton = null;
let zoomInButton = null;
let zoomResetButton = null;
let zoomValueEl = null;
let helpEl = null;
let keyHandler = null;
let currentIndex = 0;
let mediaItems = [];
let initializedMedia = new WeakSet();
let controlsBound = false;
let showToken = 0;
let scale = 1;
let panX = 0;
let panY = 0;
let dragStart = null;
let pinchStart = null;
let pointerMoved = false;
const activePointers = new Map();

const MIN_SCALE = 1;
const FALLBACK_MAX_SCALE = 5;
const ZOOM_STEP = 0.5;
let maxScale = FALLBACK_MAX_SCALE;

const LIGHTBOX_LABELS = {
  ja: {
    dialog: "画像プレビュー",
    close: "閉じる",
    previous: "前の画像",
    next: "次の画像",
    zoomOut: "縮小",
    zoomIn: "拡大",
    reset: "倍率と位置をリセット",
    help: "クリックで拡大・＋／−／ホイール／ピンチで拡大縮小・ドラッグで移動",
  },
  en: {
    dialog: "Image preview",
    close: "Close",
    previous: "Previous image",
    next: "Next image",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    reset: "Reset zoom and position",
    help: "Click to zoom · Use + / −, scroll, or pinch to zoom · Drag to move",
  },
  zh: {
    dialog: "图片预览",
    close: "关闭",
    previous: "上一张图片",
    next: "下一张图片",
    zoomOut: "缩小",
    zoomIn: "放大",
    reset: "重置缩放和位置",
    help: "点击放大・使用＋／−、滚轮或双指缩放・拖动移动",
  },
};

const LIGHTBOX_ICONS = {
  close:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  prev:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 4L7 12L15 20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 20L17 12L9 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  minus:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  reset:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4V10H10M20 20V14H14M5.1 15A8 8 0 0 0 18.7 17M18.9 9A8 8 0 0 0 5.3 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function renderIcon(name) {
  return `<span class="lightbox__icon" aria-hidden="true">${LIGHTBOX_ICONS[name] || ""}</span>`;
}

function getLightboxLabels() {
  const rawLang = document.documentElement.lang || document.body?.lang || "en";
  const lang = rawLang.toLowerCase().split("-")[0];
  return LIGHTBOX_LABELS[lang] || LIGHTBOX_LABELS.en;
}

function getMediaRatio(target) {
  if (!target) return 1;
  const attrWidth = Number(target.getAttribute?.("width"));
  const attrHeight = Number(target.getAttribute?.("height"));
  if (attrWidth > 0 && attrHeight > 0) {
    return attrWidth / attrHeight;
  }
  if (target.naturalWidth && target.naturalHeight) {
    return target.naturalWidth / target.naturalHeight;
  }
  if (target.videoWidth && target.videoHeight) {
    return target.videoWidth / target.videoHeight;
  }
  return 1;
}

function buildLightbox() {
  if (lightboxEl) return lightboxEl;
  const labels = getLightboxLabels();
  const wrapper = document.createElement("div");
  wrapper.className = "lightbox";
  wrapper.innerHTML = `
    <div class="lightbox__backdrop" data-lightbox-backdrop></div>
    <div class="lightbox__content" role="dialog" aria-modal="true" aria-label="${labels.dialog}">
      <button class="lightbox__close" type="button" data-lightbox-close aria-label="${labels.close}">
        ${renderIcon("close")}
      </button>
      <div class="lightbox__controls">
        <p class="lightbox__help" data-lightbox-help>${labels.help}</p>
        <div class="lightbox__zoom-controls" data-lightbox-zoom-controls hidden>
          <button class="lightbox__reset-button" type="button" data-lightbox-zoom-reset aria-label="${labels.reset}">
            ${renderIcon("reset")}
          </button>
          <div class="lightbox__zoom-level">
            <button class="lightbox__zoom-button" type="button" data-lightbox-zoom-out aria-label="${labels.zoomOut}">
              ${renderIcon("minus")}
            </button>
            <span class="lightbox__zoom-value" data-lightbox-zoom-value>100%</span>
            <button class="lightbox__zoom-button" type="button" data-lightbox-zoom-in aria-label="${labels.zoomIn}">
              ${renderIcon("plus")}
            </button>
          </div>
        </div>
      </div>
      <div class="lightbox__image-area">
        <button class="lightbox__nav lightbox__nav--prev" type="button" data-lightbox-prev aria-label="${labels.previous}">
          ${renderIcon("prev")}
        </button>
        <div class="lightbox__media">
          <div class="lightbox__image-stack" data-lightbox-image>
            <img class="lightbox__raw-image" data-lightbox-raw data-fade-init="true" alt="" draggable="false" />
          </div>
          <video data-lightbox-video playsinline></video>
        </div>
        <button class="lightbox__nav lightbox__nav--next" type="button" data-lightbox-next aria-label="${labels.next}">
          ${renderIcon("next")}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);
  lightboxEl = wrapper;
  imageEl = wrapper.querySelector("[data-lightbox-image]");
  rawImageEl = wrapper.querySelector("[data-lightbox-raw]");
  videoEl = wrapper.querySelector("[data-lightbox-video]");
  mediaEl = wrapper.querySelector(".lightbox__media");
  closeButtons = wrapper.querySelectorAll("[data-lightbox-close]");
  prevButton = wrapper.querySelector("[data-lightbox-prev]");
  nextButton = wrapper.querySelector("[data-lightbox-next]");
  zoomControls = wrapper.querySelector("[data-lightbox-zoom-controls]");
  zoomOutButton = wrapper.querySelector("[data-lightbox-zoom-out]");
  zoomInButton = wrapper.querySelector("[data-lightbox-zoom-in]");
  zoomResetButton = wrapper.querySelector("[data-lightbox-zoom-reset]");
  zoomValueEl = wrapper.querySelector("[data-lightbox-zoom-value]");
  helpEl = wrapper.querySelector("[data-lightbox-help]");
  return wrapper;
}

function updateLightboxLabels() {
  if (!lightboxEl) return;
  const labels = getLightboxLabels();
  lightboxEl.querySelector(".lightbox__content")?.setAttribute("aria-label", labels.dialog);
  lightboxEl.querySelector("[data-lightbox-close]")?.setAttribute("aria-label", labels.close);
  lightboxEl.querySelector("[data-lightbox-prev]")?.setAttribute("aria-label", labels.previous);
  lightboxEl.querySelector("[data-lightbox-next]")?.setAttribute("aria-label", labels.next);
  zoomOutButton?.setAttribute("aria-label", labels.zoomOut);
  zoomInButton?.setAttribute("aria-label", labels.zoomIn);
  zoomResetButton?.setAttribute("aria-label", labels.reset);
  if (helpEl) helpEl.textContent = labels.help;
}

function getMediaSource(target) {
  if (!target) return "";
  const gyazoFig = target.closest("[data-gyazo-id]");
  if (gyazoFig) {
    const gid = gyazoFig.getAttribute("data-gyazo-id");
    if (gid) return `https://i.gyazo.com/${gid}.mp4`;
  }

  if (target.dataset.fullSrc) {
    return target.dataset.fullSrc;
  }

  const pick = target.currentSrc || target.src || "";

  // Recover the raw asset if older markup only exposes a Gyazo max_size preview.
  try {
    const u = new URL(pick);
    if (u.hostname === "i.gyazo.com") {
      const m = u.pathname.match(/\/([a-f0-9]{32})\/max_size\/\d+\.(png|jpg|jpeg|gif)$/i);
      if (m) {
        const id = m[1];
        return `https://gyazo.com/${id}/raw`;
      }
    }
  } catch {
    /* ignore */
  }

  return pick;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getPanBounds(nextScale = scale) {
  const imageWidth = imageEl?.clientWidth || 0;
  const imageHeight = imageEl?.clientHeight || 0;
  const viewportWidth = mediaEl?.clientWidth || imageWidth;
  const viewportHeight = mediaEl?.clientHeight || imageHeight;
  return {
    x: Math.max(0, (imageWidth * nextScale - viewportWidth) / 2),
    y: Math.max(0, (imageHeight * nextScale - viewportHeight) / 2),
  };
}

function updateMaxScale() {
  maxScale = FALLBACK_MAX_SCALE;
  if (imageEl && rawImageEl?.naturalWidth && rawImageEl.naturalHeight) {
    const fittedWidth = imageEl.clientWidth;
    const fittedHeight = imageEl.clientHeight;
    if (fittedWidth && fittedHeight) {
      maxScale = Math.max(
        MIN_SCALE,
        rawImageEl.naturalWidth / fittedWidth,
        rawImageEl.naturalHeight / fittedHeight
      );
    }
  }
  scale = Math.min(scale, maxScale);
  if (imageEl) imageEl.dataset.zoomMax = String(maxScale);
}

function handleViewportResize() {
  if (!lightboxEl?.classList.contains("is-open") || imageEl?.hidden) return;
  updateMaxScale();
  applyTransform();
}

function applyTransform() {
  if (!imageEl) return;
  if (scale <= MIN_SCALE) {
    scale = MIN_SCALE;
    panX = 0;
    panY = 0;
    imageEl.style.transform = "none";
  } else {
    const bounds = getPanBounds();
    panX = clamp(panX, -bounds.x, bounds.x);
    panY = clamp(panY, -bounds.y, bounds.y);
    imageEl.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`;
  }

  imageEl.classList.toggle("is-zoomed", scale > MIN_SCALE);
  imageEl.dataset.zoomScale = String(scale);
  mediaEl?.classList.toggle("is-pannable", scale > MIN_SCALE);

  if (zoomValueEl) zoomValueEl.textContent = `${Math.round(scale * 100)}%`;
  if (zoomResetButton) zoomResetButton.disabled = scale <= MIN_SCALE;
  if (zoomOutButton) zoomOutButton.disabled = scale <= MIN_SCALE;
  if (zoomInButton) zoomInButton.disabled = scale >= maxScale;
}

function resetView() {
  scale = MIN_SCALE;
  panX = 0;
  panY = 0;
  activePointers.clear();
  dragStart = null;
  pinchStart = null;
  pointerMoved = false;
  applyTransform();
}

function setScale(nextScale, clientX = null, clientY = null) {
  if (!imageEl || imageEl.hidden) return;
  const previousScale = scale;
  const clampedScale = clamp(nextScale, MIN_SCALE, maxScale);

  if (clampedScale === MIN_SCALE) {
    resetView();
    return;
  }

  if (clientX != null && clientY != null && mediaEl) {
    const rect = mediaEl.getBoundingClientRect();
    const pointX = clientX - (rect.left + rect.width / 2);
    const pointY = clientY - (rect.top + rect.height / 2);
    const ratio = clampedScale / previousScale;
    panX = pointX - (pointX - panX) * ratio;
    panY = pointY - (pointY - panY) * ratio;
  }

  scale = clampedScale;
  applyTransform();
}

function zoomBy(amount, clientX = null, clientY = null) {
  setScale(scale + amount, clientX, clientY);
}

function stopLightboxVideo() {
  if (!videoEl) return;
  videoEl.pause();
  videoEl.removeAttribute("src");
  videoEl.hidden = true;
}

function resetImageLayers() {
  if (!imageEl || !rawImageEl) return;
  maxScale = FALLBACK_MAX_SCALE;
  imageEl.dataset.zoomMax = String(maxScale);
  imageEl.style.backgroundImage = "";
  rawImageEl.onload = null;
  rawImageEl.onerror = null;
  rawImageEl.removeAttribute("src");
  rawImageEl.alt = "";
}

function setImageViewerVisible(visible) {
  if (imageEl) imageEl.hidden = !visible;
  if (zoomControls) zoomControls.hidden = !visible;
  if (helpEl) helpEl.hidden = !visible;
}

function loadRawImage(source, token) {
  if (!rawImageEl || !imageEl || !source) return;
  const rawImage = rawImageEl;
  rawImage.onload = () => {
    rawImage.onload = null;
    rawImage.onerror = null;
    if (token !== showToken || rawImage.getAttribute("src") !== source) return;
    imageEl.style.backgroundImage = "";
    updateMaxScale();
    applyTransform();
  };
  rawImage.onerror = () => {
    rawImage.onload = null;
    rawImage.onerror = null;
    // Keep the preview visible when raw loading fails.
  };
  rawImage.fetchPriority = "high";
  rawImage.src = source;
}

function showImage(target, source, token) {
  setImageViewerVisible(true);
  if (!imageEl || !rawImageEl) return;

  const previewSource = target.currentSrc || target.src;
  imageEl.style.backgroundImage = previewSource ? `url(${JSON.stringify(previewSource)})` : "";
  rawImageEl.alt = target.alt || "";
  loadRawImage(source, token);
}

function showVideo(target, source) {
  setImageViewerVisible(false);
  if (!videoEl) return;

  videoEl.hidden = false;
  if (source) {
    videoEl.src = source;
    videoEl.load();
  }

  const figure = target.closest("[data-gyazo-toggle]");
  const mode = figure?.dataset.gyazoMode || figure?.getAttribute("data-gyazo-initial") || "loop";
  const isPlayer = mode === "player";
  videoEl.loop = !isPlayer;
  videoEl.muted = !isPlayer;
  videoEl.autoplay = !isPlayer;
  videoEl.controls = true;

  if (isPlayer) {
    videoEl.pause();
    return;
  }
  const playPromise = videoEl.play();
  if (playPromise?.catch) playPromise.catch(() => { });
}

function show(index) {
  if (!mediaItems.length) return;
  const token = ++showToken;
  currentIndex = (index + mediaItems.length) % mediaItems.length;
  const target = mediaItems[currentIndex];
  const highResSource = getMediaSource(target);
  const isVideo = target.tagName.toLowerCase() === "video";
  const ratio = getMediaRatio(target);
  lightboxEl?.style.setProperty("--lightbox-ratio", ratio.toString());

  // Reset state
  resetView();
  stopLightboxVideo();
  resetImageLayers();

  if (isVideo) {
    showVideo(target, highResSource);
  } else {
    showImage(target, highResSource, token);
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
  resetView();
  detachKeyHandler();
}

function next(step = 1) {
  show(currentIndex + step);
}

function handleBackdropClick() {
  if (scale > MIN_SCALE) {
    resetView();
    return;
  }
  close();
}

function handleMediaClick(event) {
  if (event.target === mediaEl) {
    handleBackdropClick();
  }
}

function getPointerDistance(first, second) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function getPointerCenter(first, second) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function beginPinch() {
  if (activePointers.size < 2 || !mediaEl) return;
  const [first, second] = Array.from(activePointers.values());
  const center = getPointerCenter(first, second);
  const rect = mediaEl.getBoundingClientRect();
  const centerX = center.x - (rect.left + rect.width / 2);
  const centerY = center.y - (rect.top + rect.height / 2);
  pinchStart = {
    distance: Math.max(1, getPointerDistance(first, second)),
    scale,
    localX: (centerX - panX) / scale,
    localY: (centerY - panY) / scale,
  };
  dragStart = null;
}

function handlePointerDown(event) {
  if (imageEl.hidden || (event.pointerType === "mouse" && event.button !== 0)) return;
  imageEl.setPointerCapture?.(event.pointerId);
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  pointerMoved = false;

  if (activePointers.size === 2) {
    beginPinch();
    return;
  }

  dragStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    panX,
    panY,
  };
}

function handlePointerMove(event) {
  if (!activePointers.has(event.pointerId)) return;
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (activePointers.size >= 2 && pinchStart && mediaEl) {
    const [first, second] = Array.from(activePointers.values());
    const distance = Math.max(1, getPointerDistance(first, second));
    const center = getPointerCenter(first, second);
    const rect = mediaEl.getBoundingClientRect();
    const centerX = center.x - (rect.left + rect.width / 2);
    const centerY = center.y - (rect.top + rect.height / 2);
    scale = clamp(pinchStart.scale * (distance / pinchStart.distance), MIN_SCALE, maxScale);
    panX = centerX - pinchStart.localX * scale;
    panY = centerY - pinchStart.localY * scale;
    pointerMoved = true;
    applyTransform();
    return;
  }

  if (!dragStart || dragStart.pointerId !== event.pointerId || scale <= MIN_SCALE) return;
  const deltaX = event.clientX - dragStart.x;
  const deltaY = event.clientY - dragStart.y;
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) pointerMoved = true;
  panX = dragStart.panX + deltaX;
  panY = dragStart.panY + deltaY;
  imageEl.classList.add("is-dragging");
  applyTransform();
}

function handlePointerEnd(event) {
  activePointers.delete(event.pointerId);
  if (imageEl.hasPointerCapture?.(event.pointerId)) {
    imageEl.releasePointerCapture(event.pointerId);
  }
  imageEl.classList.remove("is-dragging");
  pinchStart = null;

  if (activePointers.size === 1) {
    const [pointerId, pointer] = Array.from(activePointers.entries())[0];
    dragStart = { pointerId, x: pointer.x, y: pointer.y, panX, panY };
  } else {
    dragStart = null;
  }
}

function handleWheel(event) {
  if (imageEl.hidden) return;
  event.preventDefault();
  const amount = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
  zoomBy(amount, event.clientX, event.clientY);
}

function handleImageClick(event) {
  event.stopPropagation();
  if (pointerMoved) {
    event.preventDefault();
    pointerMoved = false;
    return;
  }
  if (scale === MIN_SCALE) {
    setScale(2, event.clientX, event.clientY);
  }
}

function onKeyDown(event) {
  if (!lightboxEl || !lightboxEl.classList.contains("is-open")) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;
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
    case "+":
    case "=":
      event.preventDefault();
      zoomBy(ZOOM_STEP);
      break;
    case "-":
    case "_":
      event.preventDefault();
      zoomBy(-ZOOM_STEP);
      break;
    case "0":
      event.preventDefault();
      resetView();
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
  updateLightboxLabels();

  mediaItems.forEach((media, index) => {
    if (initializedMedia.has(media)) return;
    initializedMedia.add(media);

    media.style.cursor = "zoom-in";

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
    zoomOutButton.addEventListener("click", (event) => {
      event.stopPropagation();
      zoomBy(-ZOOM_STEP);
    });
    zoomInButton.addEventListener("click", (event) => {
      event.stopPropagation();
      zoomBy(ZOOM_STEP);
    });
    zoomResetButton.addEventListener("click", (event) => {
      event.stopPropagation();
      resetView();
    });
    imageEl.addEventListener("click", handleImageClick);
    imageEl.addEventListener("pointerdown", handlePointerDown);
    imageEl.addEventListener("pointermove", handlePointerMove);
    imageEl.addEventListener("pointerup", handlePointerEnd);
    imageEl.addEventListener("pointercancel", handlePointerEnd);
    mediaEl.addEventListener("click", handleMediaClick);
    mediaEl.addEventListener("wheel", handleWheel, { passive: false });
    lightboxEl.querySelector(".lightbox__backdrop").addEventListener("click", handleBackdropClick);
    window.addEventListener("resize", handleViewportResize);
    controlsBound = true;
  }
};

export default initLightbox;
