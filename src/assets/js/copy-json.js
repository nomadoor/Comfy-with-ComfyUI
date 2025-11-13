function copyJson(button) {
  const targetId = button.getAttribute("data-copy-json");
  const node = document.getElementById(targetId);
  if (!node) return;

  const text = node.textContent.trim();
  const markSuccess = () => {
    button.classList.add("is-success");
    setTimeout(() => button.classList.remove("is-success"), 1500);
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

bindCopyButtons();
