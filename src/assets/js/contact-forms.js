// The three reader forms on the contact page (fix report, article request, feedback). They send
// to the same feedback endpoint as the assistant rail.
import { disableForm, formatReportedUrlInput, getCookieValue, getStatusMessage, normalizeReportedUrl, renderConfirmMessage, resolveOperatorI18n, setStatus, waitForTurnstile } from "./contact-common.js";

function syncContactSubmitState(form) {
  if (!form) return;
  const submit = form.querySelector("[data-contact-submit]");
  if (!submit) return;

  const requiredFields = form.querySelectorAll("input[required], textarea[required], select[required]");
  const isValid = Array.from(requiredFields).every((field) => {
    const value = typeof field.value === "string" ? field.value.trim() : "";
    if (!value) return false;
    return field.checkValidity();
  });

  submit.disabled = !isValid;
}

function applyContactType(root, type) {
  const currentType = type === "request" || type === "feedback" ? type : "fix";
  root.dataset.contactType = currentType;

  const typeButtons = root.querySelectorAll("[data-contact-type-btn]");
  typeButtons.forEach((button) => {
    const isActive = button.dataset.contactTypeBtn === currentType;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  const forms = root.querySelectorAll("[data-contact-form]");
  forms.forEach((form) => {
    const isActive = form.dataset.contactForm === currentType;
    form.hidden = !isActive;
    disableForm(form, !isActive);
    setContactFormState(form, "input");
    if (isActive) {
      syncContactSubmitState(form);
    }
  });
}

function buildFixMessage(form) {
  const i18n = resolveOperatorI18n();
  const pageUrl = form.querySelector('input[name="page_url"]')?.value?.trim() || "";
  const body = form.querySelector('textarea[name="message"]')?.value?.trim() || "";
  const extra = form.querySelector('textarea[name="extra"]')?.value?.trim() || "";
  const lines = [
    i18n.pageUrl,
    pageUrl,
    "",
    i18n.content,
    body
  ];
  if (extra) {
    lines.push("", i18n.screenshotLog, extra);
  }
  return lines.join("\n");
}

function buildRequestMessage(form) {
  const i18n = resolveOperatorI18n();
  const topic = form.querySelector('input[name="topic"]')?.value?.trim() || "";
  const expectation = form.querySelector('textarea[name="expectation"]')?.value?.trim() || "";
  const lines = [
    i18n.topic,
    topic
  ];
  if (expectation) {
    lines.push("", i18n.expectation, expectation);
  }
  return lines.join("\n");
}

function buildFeedbackMessage(form) {
  const i18n = resolveOperatorI18n();
  const body = form.querySelector('textarea[name="message"]')?.value?.trim() || "";
  const publishPermission = form.querySelector('input[name="publish_permission"]:checked')?.value || "deny";
  const publishSentence = publishPermission === "deny"
    ? i18n.publishDenySentence
    : i18n.publishAllowSentence;
  const lines = [
    i18n.content,
    body,
    "",
    publishSentence
  ];
  return lines.join("\n");
}

function mapSubmitTypeToEndpointType(submitType) {
  if (submitType === "form-request") return "request";
  if (submitType === "form-feedback") return "feedback";
  return "report";
}

async function submitToTipsEndpoint(submitType, message, sourceUrl, turnstileToken = "") {
  const rail = document.querySelector(".assistant-rail");
  if (!rail) return false;
  const endpoint = (rail.dataset.feedbackEndpoint || "").trim();
  if (!endpoint) return false;
  const endpointType = mapSubmitTypeToEndpointType(submitType);

  const headers = { "Content-Type": "application/json" };
  const csrfCookie = rail.dataset.csrfCookie || "";
  const csrfHeader = rail.dataset.csrfHeader || "";
  const csrfToken = csrfCookie ? getCookieValue(csrfCookie) : "";
  if (csrfToken && csrfHeader) {
    headers[csrfHeader] = csrfToken;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    credentials: "same-origin",
    body: JSON.stringify({
      type: endpointType,
      message,
      url: sourceUrl || window.location.href,
      lang: document.documentElement.lang || "ja",
      turnstileToken: String(turnstileToken || ""),
      labels: endpointType === "report" ? ["report"] : []
    })
  });

  return response.ok;
}

function buildContactMessage(form, submitType) {
  if (submitType === "form-correction") return buildFixMessage(form);
  if (submitType === "form-request") return buildRequestMessage(form);
  return buildFeedbackMessage(form);
}

function setContactFormState(form, state) {
  if (!form) return;
  const nextState = state === "confirm" ? "confirm" : "input";
  form.dataset.formState = nextState;
  const confirm = form.querySelector("[data-contact-confirm]");
  if (confirm) {
    confirm.hidden = nextState !== "confirm";
  }
}

function setContactConfirmMessage(form, message) {
  const node = form.querySelector("[data-contact-confirm-message]");
  renderConfirmMessage(node, message);
}

export function wireContactForms(root) {
  const forms = root.querySelectorAll("[data-contact-form]");
  const turnstileStateMap = new WeakMap();

  forms.forEach((form) => {
    const turnstileContainer = form.querySelector("[data-contact-turnstile]");
    let widgetId = null;

    const setTurnstileTokenState = (hasToken) => {
      form.dataset.turnstileTokenReady = hasToken ? "true" : "false";
      const sendButton = form.querySelector("[data-contact-confirm-send]");
      if (sendButton) {
        const isConfirmState = form.dataset.formState === "confirm";
        sendButton.disabled = !isConfirmState || !hasToken || form.dataset.sending === "true";
      }
    };

    const ensureTurnstileWidget = async () => {
      if (!turnstileContainer) return false;
      if (widgetId !== null) return true;
      const sitekey = (turnstileContainer.dataset.sitekey || "").trim();
      if (!sitekey) return false;
      const ready = await waitForTurnstile();
      if (!ready || !window.turnstile?.render) return false;

      widgetId = window.turnstile.render(turnstileContainer, {
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
      return widgetId !== null;
    };

    const resetTurnstile = () => {
      setTurnstileTokenState(false);
      try {
        if (widgetId !== null && typeof window.turnstile?.reset === "function") {
          window.turnstile.reset(widgetId);
        }
      } catch (error) {
        // ignore
      }
    };

    turnstileStateMap.set(form, {
      getWidgetId: () => widgetId,
      ensureTurnstileWidget,
      resetTurnstile,
      hasContainer: Boolean(turnstileContainer)
    });

    setTurnstileTokenState(false);

    const fields = form.querySelectorAll("input, textarea, select");
    fields.forEach((field) => {
      field.addEventListener("input", () => syncContactSubmitState(form));
      field.addEventListener("change", () => syncContactSubmitState(form));
    });
    syncContactSubmitState(form);
    setContactFormState(form, "input");
  });

  const segment = root.querySelector("[data-contact-segment]");
  if (segment) {
    segment.addEventListener("click", (event) => {
      const button = event.target.closest("[data-contact-type-btn]");
      if (!button) return;
      applyContactType(root, button.dataset.contactTypeBtn);
    });
  }

  const params = new URLSearchParams(window.location.search);
  const initialType = params.get("type");
  const prefillUrl = params.get("url");
  if (prefillUrl) {
    const target = root.querySelector("[data-contact-fix-url]");
    if (target) {
      target.value = formatReportedUrlInput(prefillUrl);
    }
  }
  applyContactType(root, initialType);

  const submitButtons = root.querySelectorAll("[data-contact-submit]");
  submitButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const form = button.closest("form");
      const statusNodes = form?.querySelectorAll("[data-contact-status]");
      const setContactStatus = (message, isError = false) => {
        statusNodes?.forEach((node) => setStatus(node, message, isError));
      };
      if (!form) return;
      const minLength = Number.parseInt(form.dataset.contactMessageMinLength || "0", 10);
      if (minLength > 0) {
        const messageField = form.querySelector('textarea[name="message"]');
        const length = messageField?.value?.trim().length || 0;
        if (length < minLength) {
          setContactStatus(getStatusMessage(root, "minLength"), true);
          messageField?.focus();
          return;
        }
      }
      if (!form.reportValidity()) return;

      const submitType = button.dataset.contactSubmitType;
      const sourceInput = form.querySelector('input[name="page_url"]')?.value?.trim() || "";
      const sourceUrl = normalizeReportedUrl(sourceInput) || window.location.href;
      const message = buildContactMessage(form, submitType);
      form.dataset.contactSubmitType = submitType;
      form.dataset.contactSourceUrl = sourceUrl;
      form.dataset.contactPendingMessage = message;
      setContactConfirmMessage(form, message);
      setContactFormState(form, "confirm");
      setContactStatus("");

      const turnstileState = turnstileStateMap.get(form);
      if (turnstileState?.hasContainer) {
        const ready = await turnstileState.ensureTurnstileWidget();
        if (!ready) {
          setContactStatus(getStatusMessage(root, "turnstileUnavailable"), true);
          return;
        }
        turnstileState.resetTurnstile();
      }
    });
  });

  const confirmBackButtons = root.querySelectorAll("[data-contact-confirm-back]");
  confirmBackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const form = button.closest("form");
      if (!form) return;
      const turnstileState = turnstileStateMap.get(form);
      if (turnstileState?.hasContainer) {
        turnstileState.resetTurnstile();
      }
      setContactFormState(form, "input");
    });
  });

  const confirmSendButtons = root.querySelectorAll("[data-contact-confirm-send]");
  confirmSendButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const form = button.closest("form");
      const statusNodes = form?.querySelectorAll("[data-contact-status]");
      const setContactStatus = (message, isError = false) => {
        statusNodes?.forEach((node) => setStatus(node, message, isError));
      };
      if (!form) return;
      // One request at a time: a second click would resend with a Turnstile token the endpoint
      // has already used, and its failure would replace the "sent" status of the first request.
      if (form.dataset.sending === "true") return;
      const submitType = form.dataset.contactSubmitType || "form-correction";
      const sourceUrl = form.dataset.contactSourceUrl || window.location.href;
      const message = form.dataset.contactPendingMessage || buildContactMessage(form, submitType);
      const turnstileState = turnstileStateMap.get(form);
      const widgetId = turnstileState?.getWidgetId?.();

      let turnstileToken = "";
      try {
        if (widgetId !== null && typeof window.turnstile?.getResponse === "function") {
          turnstileToken = String(window.turnstile.getResponse(widgetId) || "").trim();
        }
      } catch (error) {
        turnstileToken = "";
      }

      if (!turnstileToken) {
        setContactStatus(getStatusMessage(root, "turnstile"), true);
        return;
      }

      form.dataset.sending = "true";
      button.disabled = true;
      try {
        const sent = await submitToTipsEndpoint(submitType, message, sourceUrl, turnstileToken);
        if (sent) {
          setContactFormState(form, "input");
          form.reset();
          setContactStatus(getStatusMessage(root, "sent"));
          if (turnstileState?.hasContainer) {
            turnstileState.resetTurnstile();
          }
          syncContactSubmitState(form);
        } else {
          setContactStatus(getStatusMessage(root, "error"), true);
        }
      } catch (error) {
        setContactStatus(getStatusMessage(root, "error"), true);
      } finally {
        form.dataset.sending = "false";
        button.disabled = form.dataset.formState !== "confirm" || form.dataset.turnstileTokenReady !== "true";
      }
    });
  });
}
