function markLoaded(img) {
  img.classList.add("is-loaded");
  img.dataset.loaded = "true";
  document.dispatchEvent(
    new CustomEvent("imageFade:loaded", { detail: { id: img.id || null } })
  );
}

function watchImage(img) {
  if (img.dataset.fadeInit === "true") return;
  img.dataset.fadeInit = "true";
  img.classList.add("img-fade");

  if (img.complete) {
    // Defer to next frame so animation applies
    requestAnimationFrame(() => requestAnimationFrame(() => markLoaded(img)));
  } else {
    img.addEventListener("load", () => markLoaded(img), { once: true });
    img.addEventListener("error", () => markLoaded(img), { once: true });
  }
}

export function initImageFade(root = document) {
  Array.from(root.querySelectorAll("img")).forEach(watchImage);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) {
          watchImage(node);
        } else if (node instanceof HTMLElement) {
          node.querySelectorAll?.("img").forEach(watchImage);
        }
      });
    });
  });

  observer.observe(root === document ? document.body : root, {
    childList: true,
    subtree: true,
  });

  // bfcache restore
  window.addEventListener("pageshow", (evt) => {
    if (evt.persisted) {
      Array.from(root.querySelectorAll("img")).forEach((img) => {
        if (!img.dataset.loaded) watchImage(img);
      });
    }
  });
}

initImageFade();
