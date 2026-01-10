const fitRows = (root = document) => {
  const rows = root.querySelectorAll(".article-media-row");
  rows.forEach((row) => {
    const mediaFrames = Array.from(row.querySelectorAll(".article-media__frame"));
    const videoFrames = Array.from(row.querySelectorAll(".article-video__frame"));
    const isMixed = mediaFrames.length > 0 && videoFrames.length > 0;
    row.classList.toggle("article-media-row--mixed", isMixed);
    const items = isMixed ? [...mediaFrames, ...videoFrames] : mediaFrames;
    if (!items.length) return;

    // Reset any previous sizing
    items.forEach((frame) => {
      frame.style.removeProperty("--media-scale");
    });

    const gap = parseFloat(getComputedStyle(row).gap || "0") || 0;
    const available = row.clientWidth - gap * Math.max(items.length - 1, 0);
    if (available <= 0) return;

    const widths = items.map((frame) => frame.offsetWidth || frame.getBoundingClientRect().width);
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

    if (!totalWidth || totalWidth <= available) return;

    const scale = available / totalWidth;

    items.forEach((frame) => {
      frame.style.setProperty("--media-scale", scale.toString());
    });
  });
};

const cleanupMap = new WeakMap();

export default function initMediaRowFit(root = document) {
  // If already initialized for this root, clean up previous listener to avoid duplicates.
  if (cleanupMap.has(root)) {
    cleanupMap.get(root)?.();
    cleanupMap.delete(root);
  }

  let resizeTimer = null;
  const run = () => fitRows(root);
  run();

  const onResize = () => {
    if (resizeTimer) {
      cancelAnimationFrame(resizeTimer);
    }
    resizeTimer = requestAnimationFrame(run);
  };

  window.addEventListener("resize", onResize);

  const cleanup = () => {
    window.removeEventListener("resize", onResize);
    if (resizeTimer) {
      cancelAnimationFrame(resizeTimer);
      resizeTimer = null;
    }
  };

  cleanupMap.set(root, cleanup);
  return cleanup;
}
