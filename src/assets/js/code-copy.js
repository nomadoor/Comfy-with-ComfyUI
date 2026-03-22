const SUCCESS_VISIBLE_MS = 1000;
const successTimerKey = Symbol("codeCopySuccessTimer");

function markCopiedState(button) {
  button.classList.add("is-copied");
  if (button[successTimerKey]) {
    clearTimeout(button[successTimerKey]);
  }
  button[successTimerKey] = setTimeout(() => {
    button.classList.remove("is-copied");
    button[successTimerKey] = null;
  }, SUCCESS_VISIBLE_MS);
}

async function copyText(text) {
  if (!text) return false;
  // Prefer async clipboard when available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // fall through to legacy path
    }
  }

  // Fallback: use a temporary textarea + execCommand
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

const initCodeCopy = () => {
  const blocks = document.querySelectorAll("pre code");
  const iconMarkup =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const copyLabel = "Copy";
  const copiedLabel = "Copied";
  blocks.forEach((code) => {
    const pre = code.parentElement;
    if (!pre || pre.classList.contains("code-block")) return;
    pre.classList.add("code-block");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.setAttribute("aria-label", copyLabel);
    button.dataset.label = copyLabel;
    button.dataset.successLabel = copiedLabel;
    button.innerHTML = `<span class="code-copy__icon" aria-hidden="true">${iconMarkup}</span><span class="sr-only">${copyLabel}</span>`;

    button.addEventListener("click", async () => {
      const ok = await copyText(code.textContent);
      if (ok) {
        markCopiedState(button);
      } else {
        console.warn("Code copy failed");
      }
    });

    pre.appendChild(button);
  });
};

export default initCodeCopy;
