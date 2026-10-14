import { copyWithTextarea } from "./clipboard.js";
import { getScope } from "./dom.js";
import { flashClass } from "./flash.js";

const SUCCESS_VISIBLE_MS = 1000;
const COPY_BOUND_FLAG = "jsonCopyBound";
const DOWNLOAD_BOUND_FLAG = "jsonDownloadBound";

const showSuccessState = (element) => flashClass(element, "is-success", SUCCESS_VISIBLE_MS);

function fetchJsonText(url) {
  return fetch(url, { credentials: "same-origin" }).then((response) => {
    if (!response.ok) throw new Error(`Failed to fetch JSON: ${response.status}`);
    return response.text().then((text) => text.trim());
  });
}

// Workflow JSON is not embedded in the page; it is fetched when the user copies it.
// The clipboard write starts synchronously inside the click with a pending ClipboardItem so Safari
// keeps the user activation while the JSON is still downloading. Rejects when fetch or copy fails.
export async function copyJsonFromUrl(url) {
  const textPromise = fetchJsonText(url);
  if (navigator.clipboard?.write && typeof ClipboardItem === "function") {
    try {
      const blobPromise = textPromise.then((text) => new Blob([text], { type: "text/plain" }));
      blobPromise.catch(() => {}); // handled via textPromise below if write rejects before consuming it
      await navigator.clipboard.write([new ClipboardItem({ "text/plain": blobPromise })]);
      return;
    } catch {
      // Fall back below; a fetch failure rethrows when the text is awaited.
    }
  }
  const text = await textPromise;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back to the textarea copy below.
    }
  }
  if (!copyWithTextarea(text)) throw new Error("Copy fallback failed");
}

function copyJson(button) {
  const url = button.getAttribute("data-json-src");
  if (!url) return;
  copyJsonFromUrl(url)
    .then(() => showSuccessState(button))
    .catch((error) => console.warn("Workflow JSON copy failed", error));
}

function bindCopyButtons(root) {
  const scope = getScope(root);
  scope.querySelectorAll("[data-copy-json]").forEach((btn) => {
    if (btn.dataset[COPY_BOUND_FLAG]) return;
    btn.dataset[COPY_BOUND_FLAG] = "true";
    btn.addEventListener("click", () => copyJson(btn));
  });
}

function bindDownloadButtons(root) {
  const scope = getScope(root);
  scope.querySelectorAll("[data-download-json]").forEach((anchor) => {
    if (anchor.dataset[DOWNLOAD_BOUND_FLAG]) return;
    anchor.dataset[DOWNLOAD_BOUND_FLAG] = "true";
    anchor.addEventListener("click", () => {
      showSuccessState(anchor);
    });
  });
}

export default function initWorkflowJson(root) {
  bindCopyButtons(root);
  bindDownloadButtons(root);
}
