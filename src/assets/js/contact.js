const CONTACT_SELECTOR = "[data-contact-page]";
const REPORT_LINK_SELECTOR = "[data-contact-report-link]";
const CONTACT_STATUS_MESSAGES = {
  sent: "投稿しました。ありがとうございます。",
  error: "送信に失敗しました。時間をおいて再試行してください。",
  turnstile: "認証を完了してください。",
  minLength: "20文字以上で入力してください。",
  operatorSending: "送信中です...",
  operatorSent: "送信しました。ありがとうございます。",
  operatorTurnstile: "認証に失敗しました。再度お試しください。",
  operatorInvalid: "入力内容を確認してください。",
  operatorConfig: "サーバ設定エラーです。管理者に連絡してください。",
  operatorError: "送信に失敗しました。時間をおいて再試行してください。"
};

function getStatusMessage(root, key) {
  const attrName = `status${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  return root?.dataset?.[attrName] || CONTACT_STATUS_MESSAGES[key] || "";
}

function getCookieValue(name) {
  if (!name) return "";
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim();
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.slice(name.length + 1));
    }
  }
  return "";
}

function setStatus(node, message, isError = false) {
  if (!node) return;
  node.textContent = message || "";
  node.classList.toggle("is-error", Boolean(isError));
}

function formatReportedUrlInput(rawUrl) {
  const value = (rawUrl || "").trim();
  if (!value) return "";
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch (error) {
    // keep raw value when URL parsing fails
  }
  return value;
}

function normalizeReportedUrl(rawUrl) {
  const value = (rawUrl || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  if (value.startsWith("/")) {
    return `${window.location.origin}${value}`;
  }
  return `${window.location.origin}/${value.replace(/^\/+/, "")}`;
}

function disableForm(form, disabled) {
  const controls = form.querySelectorAll("input, textarea, select, button");
  controls.forEach((control) => {
    if ("disabled" in control) {
      control.disabled = disabled;
    }
  });
}

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
  const pageUrl = form.querySelector('input[name="page_url"]')?.value?.trim() || "";
  const body = form.querySelector('textarea[name="message"]')?.value?.trim() || "";
  const extra = form.querySelector('textarea[name="extra"]')?.value?.trim() || "";
  const lines = [
    "対象ページ:",
    pageUrl,
    "",
    "内容:",
    body
  ];
  if (extra) {
    lines.push("", "スクショ/ログ:", extra);
  }
  return lines.join("\n");
}

function buildRequestMessage(form) {
  const topic = form.querySelector('input[name="topic"]')?.value?.trim() || "";
  const expectation = form.querySelector('textarea[name="expectation"]')?.value?.trim() || "";
  const lines = [
    "テーマ:",
    topic
  ];
  if (expectation) {
    lines.push("", "期待する内容:", expectation);
  }
  return lines.join("\n");
}

function buildFeedbackMessage(form) {
  const body = form.querySelector('textarea[name="message"]')?.value?.trim() || "";
  const publishPermission = form.querySelector('input[name="publish_permission"]:checked')?.value || "deny";
  const publishSentence = publishPermission === "deny"
    ? "この内容をサイトに掲載/引用しないでほしい"
    : "この内容をサイトに掲載/引用して良い";
  const lines = [
    "内容:",
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

async function waitForTurnstile() {
  for (let i = 0; i < 40; i += 1) {
    if (window.turnstile?.render) return true;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  return false;
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function renderConfirmMessage(node, message) {
  if (!node) return;
  const labelPrefixes = [
    "対象ページ:",
    "内容:",
    "スクショ/ログ:",
    "テーマ:",
    "期待する内容:",
    "この内容をサイトに掲載/引用",
    "返信用メールアドレス:",
    "お名前:",
    "ご要件:",
    "ご相談内容:",
    "環境:"
  ];
  const hiddenSingleLines = new Set([
    "記事リクエスト",
    "修正・誤字報告",
    "感想・その他"
  ]);

  const html = String(message || "")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (hiddenSingleLines.has(trimmed)) return "";
      const matched = labelPrefixes.find((prefix) => line.startsWith(prefix));
      if (!matched) {
        return `<span class="contact-page__confirm-value">${escapeHtml(trimmed)}</span>`;
      }
      const value = line.slice(matched.length).trimStart();
      if (!value) {
        return `<span class="contact-page__confirm-label">${escapeHtml(matched)}</span>`;
      }
      return `<span class="contact-page__confirm-label">${escapeHtml(matched)}</span>\n<span class="contact-page__confirm-value">${escapeHtml(value)}</span>`;
    })
    .join("\n");

  node.innerHTML = html;
}

function setContactConfirmMessage(form, message) {
  const node = form.querySelector("[data-contact-confirm-message]");
  renderConfirmMessage(node, message);
}

function wireContactForms(root) {
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
      if (!turnstileContainer || widgetId !== null) return;
      const sitekey = (turnstileContainer.dataset.sitekey || "").trim();
      if (!sitekey) return;
      const ready = await waitForTurnstile();
      if (!ready || !window.turnstile?.render) return;

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
        await turnstileState.ensureTurnstileWidget();
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
      }
    });
  });
}

function wireOperatorForm(root, statusRoot) {
  const form = root.querySelector("[data-operator-form]");
  if (!form) return;
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
    categoryLabel.textContent = labelText || "選択してください";
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
      "返信用メールアドレス:",
      replyTo
    ];
    if (name) {
      lines.push("", "お名前:", name);
    }
    if (category) {
      lines.push("", "ご要件:", category);
    }
    lines.push("", "ご相談内容:", body);
    if (environment) {
      lines.push("", "環境:", environment);
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

    document.addEventListener("pointerdown", (event) => {
      if (!categorySelect?.contains(event.target)) {
        setCategoryOpen(false);
      }
    }, true);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setCategoryOpen(false);
      }
    });
  }

  const setTurnstileTokenState = (hasToken) => {
    form.dataset.turnstileTokenReady = hasToken ? "true" : "false";
    syncOperatorSubmitState(form);
  };

  const ensureTurnstileWidget = async () => {
    if (!turnstileContainer || turnstileWidgetId !== null) return;
    const sitekey = (turnstileContainer.dataset.sitekey || "").trim();
    if (!sitekey) return;
    const ready = await waitForTurnstile();
    if (!ready || !window.turnstile?.render) return;

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
      await ensureTurnstileWidget();
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

function updateReportLinks(root = document) {
  const links = root.querySelectorAll(REPORT_LINK_SELECTOR);
  if (!links.length) return;
  const currentUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;

  links.forEach((link) => {
    try {
      const url = new URL(link.getAttribute("href"), window.location.origin);
      url.searchParams.set("url", currentUrl);
      link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      // ignore malformed href
    }
  });
}

export default function initContact(root = document.getElementById("page") || document) {
  updateReportLinks(root);

  const contactRoot = root.querySelector(CONTACT_SELECTOR);
  if (!contactRoot) return;
  if (contactRoot.dataset.initialized === "true") return;
  contactRoot.dataset.initialized = "true";

  wireContactForms(contactRoot);
  wireOperatorForm(root, contactRoot);
}
