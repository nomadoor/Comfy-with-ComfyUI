// Shared by the reader forms and the operator form on the contact page: status lines, URL
// clean-up, the confirmation preview, and waiting for Turnstile.
import { CONTACT_CONFIRM_HIDDEN_LINES, CONTACT_CONFIRM_LABEL_PREFIXES, CONTACT_FORM_STRINGS, CONTACT_STATUS_STRINGS, localized } from "./strings.js";
import { loadTurnstile } from "./turnstile.js";

export function getStatusMessage(root, key) {
  const attrName = `status${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  return root?.dataset?.[attrName] || localized(CONTACT_STATUS_STRINGS, root?.dataset?.lang)[key] || "";
}

export function getCookieValue(name) {
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

export const resolveOperatorI18n = () => localized(CONTACT_FORM_STRINGS);

export function setStatus(node, message, isError = false) {
  if (!node) return;
  node.textContent = message || "";
  node.classList.toggle("is-error", Boolean(isError));
}

export function formatReportedUrlInput(rawUrl) {
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

export function normalizeReportedUrl(rawUrl) {
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

export function disableForm(form, disabled) {
  const controls = form.querySelectorAll("input, textarea, select, button");
  controls.forEach((control) => {
    if ("disabled" in control) {
      control.disabled = disabled;
    }
  });
}

export async function waitForTurnstile() {
  await loadTurnstile();
  for (let i = 0; i < 160; i += 1) {
    if (window.turnstile?.render) return true;
    if (i === 80) {
      await loadTurnstile();
    }
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  return false;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderConfirmMessage(node, message) {
  if (!node) return;

  const html = String(message || "")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (CONTACT_CONFIRM_HIDDEN_LINES.has(trimmed)) return "";
      const matched = CONTACT_CONFIRM_LABEL_PREFIXES.find((prefix) => line.startsWith(prefix));
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
