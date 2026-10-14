// The operator contact form: posts to /api/contact (functions/api/contact.ts) after a confirmation
// step and Turnstile.
import { getStatusMessage, renderConfirmMessage, resolveOperatorI18n, setStatus, waitForTurnstile } from "./contact-common.js";

function syncOperatorSubmitState(form) {
  if (!form) return;
  const previewButton = form.querySelector("[data-operator-preview]");
  const sendButton = form.querySelector("[data-operator-send]");
  const backButton = form.querySelector("[data-operator-confirm-back]");
  const isConfirmState = form.dataset.formState === "confirm";
  const hasTurnstileToken = form.dataset.turnstileTokenReady === "true";

  if (form.dataset.sending === "true") {
    if (previewButton) previewButton.disabled = true;
    if (sendButton) sendButton.disabled = true;
    if (backButton) backButton.disabled = true;
    return;
  }

  const requiredFields = form.querySelectorAll("input[required], textarea[required], select[required]");
  const isValid = Array.from(requiredFields).every((field) => {
    const value = typeof field.value === "string" ? field.value.trim() : "";
    if (!value) return false;
    return field.checkValidity();
  });

  if (previewButton) previewButton.disabled = !isValid || isConfirmState;
  if (sendButton) sendButton.disabled = !isConfirmState || !hasTurnstileToken;
  if (backButton) backButton.disabled = !isConfirmState;
}

export function wireOperatorForm(root, statusRoot) {
  const form = root.querySelector("[data-operator-form]");
  if (!form) return;
  const i18n = resolveOperatorI18n();
  const confirmBlock = form.querySelector("[data-operator-confirm]");
  const confirmMessage = form.querySelector("[data-operator-confirm-message]");
  const turnstileContainer = form.querySelector("[data-operator-turnstile]");
  const categorySelect = form.querySelector("[data-contact-category]");
  const categoryInput = form.querySelector("[data-contact-category-input]");
  const categoryLabel = form.querySelector("[data-contact-category-label]");
  const categoryToggle = form.querySelector("[data-contact-category-toggle]");
  const categoryMenu = form.querySelector("[data-contact-category-menu]");
  let turnstileWidgetId = null;

  const fields = form.querySelectorAll("input, textarea, select");
  fields.forEach((field) => {
    field.addEventListener("input", () => syncOperatorSubmitState(form));
    field.addEventListener("change", () => syncOperatorSubmitState(form));
  });
  syncOperatorSubmitState(form);

  const setOperatorStatus = (message, isError = false) => {
    const nodes = form.querySelectorAll("[data-operator-status]");
    nodes.forEach((node) => setStatus(node, message, isError));
  };

  const setCategoryOpen = (isOpen) => {
    if (!categorySelect || !categoryToggle || !categoryMenu) return;
    categorySelect.classList.toggle("is-open", isOpen);
    categoryToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    categoryMenu.hidden = !isOpen;
  };

  const setCategoryValue = (value, labelText) => {
    if (!categoryInput || !categoryLabel || !categoryMenu) return;
    categoryInput.value = value || "";
    categoryLabel.textContent = labelText || i18n.categoryPlaceholder;
    const options = categoryMenu.querySelectorAll("[data-contact-category-option]");
    options.forEach((option) => {
      const isSelected = option.dataset.value === value;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
    syncOperatorSubmitState(form);
  };

  const setOperatorFormState = (state) => {
    const nextState = state === "confirm" ? "confirm" : "input";
    form.dataset.formState = nextState;
    if (confirmBlock) {
      confirmBlock.hidden = nextState !== "confirm";
    }
    if (nextState !== "input") {
      setCategoryOpen(false);
    }
    syncOperatorSubmitState(form);
  };

  const buildOperatorMessage = () => {
    const replyTo = form.querySelector('input[name="reply_to"]')?.value?.trim() || "";
    const name = form.querySelector('input[name="name"]')?.value?.trim() || "";
    const category = categoryLabel?.textContent?.trim() || "";
    const body = form.querySelector('textarea[name="body"]')?.value?.trim() || "";
    const environment = form.querySelector('input[name="environment"]')?.value?.trim() || "";
    const lines = [
      i18n.replyTo,
      replyTo
    ];
    if (name) {
      lines.push("", i18n.name, name);
    }
    if (category) {
      lines.push("", i18n.category, category);
    }
    lines.push("", i18n.body, body);
    if (environment) {
      lines.push("", i18n.environment, environment);
    }
    return lines.join("\n");
  };

  if (categoryToggle && categoryMenu) {
    categoryToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const nextOpen = !categorySelect.classList.contains("is-open");
      setCategoryOpen(nextOpen);
    });

    categoryMenu.addEventListener("click", (event) => {
      event.stopPropagation();
      const option = event.target.closest("[data-contact-category-option]");
      if (!option) return;
      setCategoryValue(option.dataset.value || "", option.textContent?.trim() || "");
      setCategoryOpen(false);
      categoryToggle.focus();
    });

    // Document listeners outlive router content swaps; drop them once this form leaves the page.
    const documentListeners = new AbortController();
    const whileConnected = (handler) => (event) => {
      if (!form.isConnected) {
        documentListeners.abort();
        return;
      }
      handler(event);
    };

    document.addEventListener("pointerdown", whileConnected((event) => {
      if (!categorySelect?.contains(event.target)) {
        setCategoryOpen(false);
      }
    }), { capture: true, signal: documentListeners.signal });

    document.addEventListener("keydown", whileConnected((event) => {
      if (event.key === "Escape") {
        setCategoryOpen(false);
      }
    }), { signal: documentListeners.signal });
  }

  const setTurnstileTokenState = (hasToken) => {
    form.dataset.turnstileTokenReady = hasToken ? "true" : "false";
    syncOperatorSubmitState(form);
  };

  const ensureTurnstileWidget = async () => {
    if (!turnstileContainer) return false;
    if (turnstileWidgetId !== null) return true;
    const sitekey = (turnstileContainer.dataset.sitekey || "").trim();
    if (!sitekey) return false;
    const ready = await waitForTurnstile();
    if (!ready || !window.turnstile?.render) return false;

    turnstileWidgetId = window.turnstile.render(turnstileContainer, {
      sitekey,
      callback: (token) => {
        setTurnstileTokenState(Boolean(token));
      },
      "expired-callback": () => {
        setTurnstileTokenState(false);
      },
      "error-callback": () => {
        setTurnstileTokenState(false);
      }
    });
    return turnstileWidgetId !== null;
  };

  const resetTurnstile = () => {
    setTurnstileTokenState(false);
    try {
      if (turnstileWidgetId !== null && typeof window.turnstile?.reset === "function") {
        window.turnstile.reset(turnstileWidgetId);
      }
    } catch (error) {
      // ignore
    }
  };

  const previewButton = form.querySelector("[data-operator-preview]");
  if (previewButton) {
    previewButton.addEventListener("click", async () => {
      if (!form.reportValidity()) return;
      const message = buildOperatorMessage();
      renderConfirmMessage(confirmMessage, message);
      setOperatorStatus("");
      const ready = await ensureTurnstileWidget();
      if (!ready) {
        setOperatorStatus(getStatusMessage(statusRoot, "operatorTurnstileUnavailable"), true);
        return;
      }
      setOperatorFormState("confirm");
    });
  }

  const backButton = form.querySelector("[data-operator-confirm-back]");
  if (backButton) {
    backButton.addEventListener("click", () => {
      setOperatorFormState("input");
      setOperatorStatus("");
      resetTurnstile();
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.formState !== "confirm") return;
    if (!form.reportValidity()) return;

    form.dataset.sending = "true";
    syncOperatorSubmitState(form);
    setOperatorStatus(getStatusMessage(statusRoot, "operatorSending"));

    try {
      const formData = new FormData(form);
      let turnstileToken = String(formData.get("cf-turnstile-response") || "").trim();
      try {
        if (!turnstileToken && turnstileWidgetId !== null && typeof window.turnstile?.getResponse === "function") {
          turnstileToken = String(window.turnstile.getResponse(turnstileWidgetId) || "").trim();
        }
      } catch (error) {
        turnstileToken = "";
      }
      if (!turnstileToken) {
        setOperatorStatus(getStatusMessage(statusRoot, "operatorTurnstile"), true);
        resetTurnstile();
        return;
      }
      formData.set("cf-turnstile-response", turnstileToken);

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
        credentials: "same-origin"
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch (error) {
        payload = null;
      }

      if (!response.ok || !payload?.ok) {
        const errorKey = payload?.error === "turnstile"
          ? "operatorTurnstile"
          : payload?.error === "invalid"
            ? "operatorInvalid"
            : payload?.error === "config"
              ? "operatorConfig"
            : "operatorError";
        setOperatorStatus(getStatusMessage(statusRoot, errorKey), true);
        resetTurnstile();
        return;
      }

      form.reset();
      setCategoryValue("", "");
      resetTurnstile();
      setOperatorStatus(getStatusMessage(statusRoot, "operatorSent"));
      setOperatorFormState("input");
    } catch (error) {
      setOperatorStatus(getStatusMessage(statusRoot, "operatorError"), true);
      resetTurnstile();
    } finally {
      form.dataset.sending = "false";
      syncOperatorSubmitState(form);
    }
  });

  setOperatorFormState("input");
  setTurnstileTokenState(false);
  setCategoryValue(categoryInput?.value || "", "");
}
