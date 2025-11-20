const SUCCESS_VISIBLE_MS = 1000;
const successTimerKey = Symbol("workflowJsonSuccessTimer");

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
  const node = document.getElementById(targetId);
  if (!node) return;

  const text = node.textContent.trim();
  const markSuccess = () => {
    showSuccessState(button);
  };

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

function bindCopyButtons() {
  document.querySelectorAll("[data-copy-json]").forEach(btn => {
    btn.addEventListener("click", () => copyJson(btn));
  });
}

function bindDownloadButtons() {
  document.querySelectorAll("[data-download-json]").forEach(anchor => {
    anchor.addEventListener("click", () => showSuccessState(anchor));
  });
}

bindCopyButtons();
bindDownloadButtons();
