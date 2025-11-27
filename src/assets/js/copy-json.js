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

function copyJson(button) {
  const targetId = button.getAttribute("data-copy-json");
  const node = targetId ? document.getElementById(targetId) : null;
  if (!node) return;

  const text = node.textContent.trim();
  const markSuccess = () => showSuccessState(button);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(markSuccess).catch(markSuccess);
    return;
  }

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
  if (success) {
    markSuccess();
  }
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
