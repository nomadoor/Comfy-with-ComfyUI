const pagesUrl = process.env.CF_PAGES_URL || process.env.URL || "";
const isPagesPreview =
  pagesUrl.endsWith(".pages.dev") &&
  (process.env.CF_PAGES_BRANCH || "") !== "main";

const assistantFeedbackEndpoint =
  process.env.ASSISTANT_FEEDBACK_ENDPOINT ||
  (isPagesPreview ? "https://comfyui-feedback-staging.nomadoor.workers.dev" : "");
const assistantFeedbackCsrfCookie =
  process.env.ASSISTANT_FEEDBACK_CSRF_COOKIE || "assistant_feedback_csrf";
const assistantFeedbackCsrfHeader =
  process.env.ASSISTANT_FEEDBACK_CSRF_HEADER || "X-CSRF-Token";
const assistantTurnstileSitekey =
  process.env.ASSISTANT_TURNSTILE_SITEKEY || "";

export default {
  assistantFeedbackEndpoint,
  assistantFeedbackCsrfCookie,
  assistantFeedbackCsrfHeader,
  assistantTurnstileSitekey
};
