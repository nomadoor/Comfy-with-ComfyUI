const SUCCESS_VISIBLE_MS = 1000;
const successTimerKey = Symbol("workflowJsonSuccessTimer");
const COPY_BOUND_FLAG = "jsonCopyBound";
const DOWNLOAD_BOUND_FLAG = "jsonDownloadBound";

function getScope(root) {
  if (root && typeof root.querySelectorAll === "function") {
    return root;
  }
  return document;
}

function showSuccessState(element, className = "is-success") {
  element.classList.add(className);
  if (element[successTimerKey]) {
    clearTimeout(element[successTimerKey]);
  }
  element[successTimerKey] = setTimeout(() => {
    element.classList.remove(className);
    element[successTimerKey] = null;
  }, SUCCESS_VISIBLE_MS);
}

function fetchJsonText(url) {
  return fetch(url, { credentials: "same-origin" }).then((response) => {
    if (!response.ok) throw new Error(`Failed to fetch JSON: ${response.status}`);
    return response.text().then((text) => text.trim());
  });
}

function copyWithTextarea(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "fixed";
  temp.style.top = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (error) {
    console.warn("Copy fallback failed", error);
  }
  document.body.removeChild(temp);
  if (!success) throw new Error("Copy fallback failed");
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
  copyWithTextarea(text);
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
