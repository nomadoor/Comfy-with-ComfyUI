import { copyText } from "./clipboard.js";
import { flashClass } from "./flash.js";

const SUCCESS_VISIBLE_MS = 1000;

const initCodeCopy = () => {
  const blocks = document.querySelectorAll("pre code");
  // Same glyph as the `copy` icon in src/includes/icon.njk, so code blocks and workflow JSON match.
  const iconMarkup =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="var(--icon-stroke-width, 1.5)" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect class="icon__fill" x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>';
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
        flashClass(button, "is-copied", SUCCESS_VISIBLE_MS);
      } else {
        console.warn("Code copy failed");
      }
    });

    pre.appendChild(button);
  });
};

export default initCodeCopy;
