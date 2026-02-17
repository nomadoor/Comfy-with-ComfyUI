const CONTACT_SELECTOR = "[data-contact-page]";
const REPORT_LINK_SELECTOR = "[data-contact-report-link]";
const CONTACT_STATUS_MESSAGES = {
  sent: "投稿しました。ありがとうございます。",
  error: "送信に失敗しました。時間をおいて再試行してください。",
  mailto: "メールアプリの起動を試みました。開かない場合は下記メールアドレスへ直接ご連絡ください。",
  mailtoError: "メールアプリを起動できませんでした。本文をコピーしたので、メールに貼り付けて送信してください。"
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

function openMailtoUrl(mailtoUrl) {
  try {
    const anchor = document.createElement("a");
    anchor.href = mailtoUrl;
    anchor.style.display = "none";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    return true;
  } catch (error) {
    return false;
  }
}

async function copyTextToClipboard(text) {
  if (!text || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
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
  const submit = form.querySelector('button[type="submit"]');
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
  const pageUrl = form.querySelector('input[name="page_url"]')?.value?.trim() || "";
  const body = form.querySelector('textarea[name="message"]')?.value?.trim() || "";
  const extra = form.querySelector('textarea[name="extra"]')?.value?.trim() || "";
  const lines = [
    "修正・誤字報告",
    `対象ページ: ${pageUrl}`,
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
    "記事リクエスト",
    `テーマ: ${topic}`
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

async function submitToTipsEndpoint(submitType, message, sourceUrl) {
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
      turnstileToken: "",
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
  if (!node) return;
  node.textContent = message || "";
}

function wireContactForms(root) {
  const forms = root.querySelectorAll("[data-contact-form]");
  forms.forEach((form) => {
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
    button.addEventListener("click", () => {
      const form = button.closest("form");
      const status = form?.querySelector("[data-contact-status]");
      if (!form) return;
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
      setStatus(status, "");
    });
  });

  const confirmBackButtons = root.querySelectorAll("[data-contact-confirm-back]");
  confirmBackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const form = button.closest("form");
      if (!form) return;
      setContactFormState(form, "input");
    });
  });

  const confirmSendButtons = root.querySelectorAll("[data-contact-confirm-send]");
  confirmSendButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const form = button.closest("form");
      const status = form?.querySelector("[data-contact-status]");
      if (!form) return;
      const submitType = form.dataset.contactSubmitType || "form-correction";
      const sourceUrl = form.dataset.contactSourceUrl || window.location.href;
      const message = form.dataset.contactPendingMessage || buildContactMessage(form, submitType);

      try {
        const sent = await submitToTipsEndpoint(submitType, message, sourceUrl);
        if (sent) {
          setContactFormState(form, "input");
          form.reset();
          setStatus(status, getStatusMessage(root, "sent"));
          syncContactSubmitState(form);
        } else {
          setStatus(status, getStatusMessage(root, "error"), true);
        }
      } catch (error) {
        setStatus(status, getStatusMessage(root, "error"), true);
      }
    });
  });
}

function wireOperatorForm(root, statusRoot) {
  const form = root.querySelector("[data-operator-form]");
  if (!form) return;

  const fields = form.querySelectorAll("input, textarea, select");
  fields.forEach((field) => {
    field.addEventListener("input", () => syncOperatorSubmitState(form));
    field.addEventListener("change", () => syncOperatorSubmitState(form));
  });
  syncOperatorSubmitState(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const status = form.querySelector("[data-operator-status]");
    const replyTo = form.querySelector('input[name="reply_to"]')?.value?.trim() || "";
    const body = form.querySelector('textarea[name="body"]')?.value?.trim() || "";
    const environment = form.querySelector('input[name="environment"]')?.value?.trim() || "";
    const lines = [
      "[Contact] 個人相談・仕事依頼",
      `返信先: ${replyTo}`,
      "",
      "内容:",
      body
    ];
    if (environment) {
      lines.push("", "環境:", environment);
    }

    const subject = "[Comfy with ComfyUI] 個人相談・仕事依頼";
    const mailto = `mailto:nomadoor@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    const opened = openMailtoUrl(mailto);
    if (opened) {
      setStatus(status, getStatusMessage(statusRoot, "mailto"));
    } else {
      await copyTextToClipboard(lines.join("\n"));
      setStatus(status, getStatusMessage(statusRoot, "mailtoError"), true);
    }
  });
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
