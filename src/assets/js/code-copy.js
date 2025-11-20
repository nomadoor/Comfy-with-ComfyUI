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

function initCodeCopy() {
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
      try {
        await navigator.clipboard.writeText(code.textContent);
        markCopiedState(button);
      } catch (error) {
        console.warn("Code copy failed", error);
      }
    });

    pre.appendChild(button);
  });
}

document.addEventListener("DOMContentLoaded", initCodeCopy);
