function markLoaded(img) {
  img.dataset.loaded = "true";
}

function watchImage(img) {
  if (img.complete) {
    markLoaded(img);
  } else {
    img.addEventListener("load", () => markLoaded(img), { once: true });
    img.addEventListener("error", () => markLoaded(img), { once: true });
  }
}

export function initImageFade() {
  const images = Array.from(document.querySelectorAll(".article-body img"));
  images.forEach(watchImage);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node instanceof HTMLImageElement &&
          node.matches(".article-body img")
        ) {
          watchImage(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

initImageFade();
