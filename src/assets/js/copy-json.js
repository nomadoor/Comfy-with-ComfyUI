function copyJson(button) {
  const targetId = button.getAttribute("data-copy-json");
  const node = document.getElementById(targetId);
  if (!node) return;
  navigator.clipboard.writeText(node.textContent.trim()).then(() => {
    button.classList.add("is-success");
    setTimeout(() => button.classList.remove("is-success"), 1500);
  });
}

function bindCopyButtons() {
  document.querySelectorAll("[data-copy-json]").forEach(btn => {
    btn.addEventListener("click", () => copyJson(btn));
  });
}

bindCopyButtons();
