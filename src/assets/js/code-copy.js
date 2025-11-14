function initCodeCopy() {
  const blocks = document.querySelectorAll("pre code");
  blocks.forEach((code) => {
    const pre = code.parentElement;
    if (!pre || pre.classList.contains("code-block")) return;
    pre.classList.add("code-block");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.setAttribute("aria-label", "Copy code");
    button.textContent = "Copy";

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy"), 1600);
      } catch (error) {
        button.textContent = "Error";
        setTimeout(() => (button.textContent = "Copy"), 1600);
      }
    });

    pre.appendChild(button);
  });
}

document.addEventListener("DOMContentLoaded", initCodeCopy);
