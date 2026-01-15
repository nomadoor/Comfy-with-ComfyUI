const SUCCESS_VISIBLE_MS = 1000;
const ERROR_VISIBLE_MS = 2400;
const PICKER_BOUND_FLAG = "workflowPickerBound";
const OPEN_CLASS = "is-open";
const OPTION_SELECTED_CLASS = "is-selected";

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

function updatePickerWidth(picker) {
  if (!picker) return;
  const options = Array.from(picker.querySelectorAll(".workflow-picker__option"));
  if (!options.length) return;
  const maxLength = options.reduce((max, option) => {
    const label = option.textContent || "";
    return Math.max(max, label.length);
  }, 0);
  if (maxLength > 0) {
    picker.style.setProperty("--workflow-picker-width", `${Math.min(maxLength + 1, 48)}ch`);
  }
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

  const picker = container.querySelector("[data-workflow-picker-control]");
  const toggle = container.querySelector("[data-workflow-picker-toggle]");
  const list = container.querySelector("[data-workflow-picker-list]");
  const label = container.querySelector(".workflow-picker__label");
  const copyButton = container.querySelector("[data-workflow-picker-copy]");
  const downloadLink = container.querySelector("[data-workflow-picker-download]");
  if (!picker || !toggle || !list || !label || !copyButton || !downloadLink) return;

  const selectedOption = list.querySelector(`.${OPTION_SELECTED_CLASS}`) || list.querySelector("[data-value]");
  if (selectedOption) {
    label.textContent = selectedOption.textContent || "";
    updateDownloadLink(container, selectedOption.getAttribute("data-value") || "");
  }
  updatePickerWidth(picker);

  const closePicker = () => {
    toggle.setAttribute("aria-expanded", "false");
    picker.classList.remove(OPEN_CLASS);
  };

  const openPicker = () => {
    toggle.setAttribute("aria-expanded", "true");
    picker.classList.add(OPEN_CLASS);
  };

  const togglePicker = () => {
    if (picker.classList.contains(OPEN_CLASS)) {
      closePicker();
    } else {
      openPicker();
    }
  };

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    togglePicker();
  });

  list.addEventListener("click", (event) => {
    const option = event.target.closest(".workflow-picker__option");
    if (!option) return;
    list.querySelectorAll(`.${OPTION_SELECTED_CLASS}`).forEach((node) => {
      node.classList.remove(OPTION_SELECTED_CLASS);
      node.setAttribute("aria-selected", "false");
    });
    option.classList.add(OPTION_SELECTED_CLASS);
    option.setAttribute("aria-selected", "true");
    label.textContent = option.textContent || "";
    updateDownloadLink(container, option.getAttribute("data-value") || "");
    closePicker();
  });

  document.addEventListener("click", (event) => {
    if (!picker.contains(event.target)) {
      closePicker();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!picker.classList.contains(OPEN_CLASS)) return;
    if (event.key === "Escape") {
      closePicker();
      toggle.focus();
    }
  });

  copyButton.addEventListener("click", async () => {
    const current = list.querySelector(`.${OPTION_SELECTED_CLASS}`) || list.querySelector("[data-value]");
    const file = current?.getAttribute("data-value") || "";
    const ok = await copyWorkflowJson(container, file);
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
