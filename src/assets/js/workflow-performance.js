const BOUND_ATTRIBUTE = "data-performance-bound";
let documentClickBound = false;

function getScope(root) {
  return root && typeof root.querySelectorAll === "function" ? root : document;
}

function closePerformance(wrapper, { dismiss = false } = {}) {
  const trigger = wrapper.querySelector("[data-performance-trigger]");
  wrapper.classList.remove("is-open");
  wrapper.classList.toggle("is-dismissed", dismiss);
  trigger?.setAttribute("aria-expanded", "false");
}

function bindDocumentClick() {
  if (documentClickBound) return;
  documentClickBound = true;
  document.addEventListener("click", (event) => {
    document.querySelectorAll("[data-workflow-performance].is-open").forEach((wrapper) => {
      if (!wrapper.contains(event.target)) closePerformance(wrapper, { dismiss: true });
    });
  }, true);
}

function bindPerformance(wrapper) {
  if (wrapper.hasAttribute(BOUND_ATTRIBUTE)) return;
  const trigger = wrapper.querySelector("[data-performance-trigger]");
  if (!trigger) return;
  wrapper.setAttribute(BOUND_ATTRIBUTE, "");

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const shouldOpen = !wrapper.classList.contains("is-open");
    if (shouldOpen) {
      wrapper.classList.remove("is-dismissed");
      wrapper.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    } else {
      closePerformance(wrapper, { dismiss: true });
    }
  });

  wrapper.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const visibleFromFocus = wrapper.contains(document.activeElement);
    if (!wrapper.classList.contains("is-open") && !visibleFromFocus) return;
    closePerformance(wrapper, { dismiss: true });
    trigger.focus();
  });

  wrapper.addEventListener("focusout", (event) => {
    if (!wrapper.contains(event.relatedTarget)) {
      wrapper.classList.remove("is-dismissed");
    }
  });

  wrapper.addEventListener("pointerenter", () => {
    if (!wrapper.contains(document.activeElement)) {
      wrapper.classList.remove("is-dismissed");
    }
  });
}

export default function initWorkflowPerformance(root) {
  bindDocumentClick();
  const scope = getScope(root);
  scope.querySelectorAll("[data-workflow-performance]").forEach(bindPerformance);
}
