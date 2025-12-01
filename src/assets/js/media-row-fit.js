const fitRows = (root = document) => {
  const rows = root.querySelectorAll(".article-media-row");
  rows.forEach((row) => {
    const items = Array.from(row.querySelectorAll(".article-media__frame"));
    if (!items.length) return;

    // Reset any previous sizing
    items.forEach((frame) => {
      frame.style.removeProperty("width");
      frame.style.removeProperty("max-width");
    });

    const gap = parseFloat(getComputedStyle(row).gap || "0") || 0;
    const rowWidth = row.clientWidth;
    const totalWidth =
      items.reduce((sum, frame) => sum + frame.getBoundingClientRect().width, 0) +
      gap * Math.max(items.length - 1, 0);

    if (!rowWidth || totalWidth <= rowWidth) return;

    const scale = rowWidth / totalWidth;

    items.forEach((frame) => {
      const currentWidth = frame.getBoundingClientRect().width;
      const targetWidth = Math.max(currentWidth * scale, 1);
      frame.style.width = `${targetWidth}px`;
      frame.style.maxWidth = `${targetWidth}px`;
    });
  });
};

let resizeTimer = null;

export default function initMediaRowFit(root = document) {
  const run = () => fitRows(root);
  run();
  window.addEventListener("resize", () => {
    if (resizeTimer) {
      cancelAnimationFrame(resizeTimer);
    }
    resizeTimer = requestAnimationFrame(run);
  });
}
