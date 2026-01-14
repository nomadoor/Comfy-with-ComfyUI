const SUCCESS_VISIBLE_MS = 1000;
const ERROR_VISIBLE_MS = 2400;
const PICKER_BOUND_FLAG = "workflowPickerBound";

function getScope(root) {
  if (root && typeof root.querySelectorAll === "function") {
    return root;
  }
  return document;
}

function getBasename(file = "") {
  const clean = String(file).split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || clean;
}

function showSuccessState(element) {
  element.classList.add("is-success");
  if (element.__successTimer) {
    clearTimeout(element.__successTimer);
  }
  element.__successTimer = setTimeout(() => {
    element.classList.remove("is-success");
    element.__successTimer = null;
  }, SUCCESS_VISIBLE_MS);
}

function showErrorMessage(messageNode, text) {
  if (!messageNode) return;
  messageNode.textContent = text;
  messageNode.classList.add("is-error");
  if (messageNode.__errorTimer) {
    clearTimeout(messageNode.__errorTimer);
  }
  messageNode.__errorTimer = setTimeout(() => {
    messageNode.textContent = "";
    messageNode.classList.remove("is-error");
    messageNode.__errorTimer = null;
  }, ERROR_VISIBLE_MS);
}

function updateActionLabels(container, file) {
  const baseName = getBasename(file);
  const copyButton = container.querySelector("[data-workflow-picker-copy]");
  const downloadLink = container.querySelector("[data-workflow-picker-download]");
  const copyLabel = copyButton?.getAttribute("data-label") || "Copy";
  const downloadLabel = downloadLink?.getAttribute("data-label") || "Download";
  if (copyButton) {
    copyButton.setAttribute("aria-label", `${copyLabel} ${baseName}`);
  }
  if (downloadLink) {
    downloadLink.setAttribute("aria-label", `${downloadLabel} ${baseName}`);
  }
}

function setRecommendedSuffix(select, suffix, enabled) {
  if (!select) return;
  const options = Array.from(select.options || []);
  options.forEach((option) => {
    const label = option.getAttribute("data-label") || option.textContent || "";
    const isRecommended = option.getAttribute("data-recommended") === "true";
    option.textContent = isRecommended && enabled ? `${label}${suffix}` : label;
  });
}

function updateDownloadLink(container, file) {
  const downloadLink = container.querySelector("[data-workflow-picker-download]");
  if (!downloadLink) return;
  downloadLink.href = file;
  downloadLink.setAttribute("download", getBasename(file));
  updateActionLabels(container, file);
}

async function copyWorkflowJson(container, file) {
  const messageNode = container.querySelector("[data-workflow-picker-message]");
  const errorLabel = container.getAttribute("data-error-label") || "Copy failed";
  try {
    const response = await fetch(file, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.status}`);
    }
    const text = await response.text();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
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
    if (!success) {
      throw new Error("Copy fallback failed");
    }
    return true;
  } catch (error) {
    console.warn(error);
    showErrorMessage(messageNode, errorLabel);
    return false;
  }
}

function bindPicker(container) {
  if (container.dataset[PICKER_BOUND_FLAG]) return;
  container.dataset[PICKER_BOUND_FLAG] = "true";

  const select = container.querySelector("[data-workflow-picker-select]");
  const copyButton = container.querySelector("[data-workflow-picker-copy]");
  const downloadLink = container.querySelector("[data-workflow-picker-download]");
  if (!select || !copyButton || !downloadLink) return;
  const suffix = container.getAttribute("data-recommended-suffix") || "";

  updateDownloadLink(container, select.value);
  setRecommendedSuffix(select, suffix, false);

  select.addEventListener("change", () => {
    updateDownloadLink(container, select.value);
    setRecommendedSuffix(select, suffix, false);
  });

  select.addEventListener("focus", () => {
    setRecommendedSuffix(select, suffix, true);
  });

  select.addEventListener("mousedown", () => {
    setRecommendedSuffix(select, suffix, true);
  });

  select.addEventListener("blur", () => {
    setRecommendedSuffix(select, suffix, false);
  });

  copyButton.addEventListener("click", async () => {
    const ok = await copyWorkflowJson(container, select.value);
    if (ok) {
      showSuccessState(copyButton);
    }
  });

  downloadLink.addEventListener("click", () => {
    showSuccessState(downloadLink);
  });
}

export default function initWorkflowPicker(root) {
  const scope = getScope(root);
  scope.querySelectorAll("[data-workflow-picker]").forEach((container) => {
    bindPicker(container);
  });
}
