const assistantFeedbackEndpoint =
  process.env.ASSISTANT_FEEDBACK_ENDPOINT || "";
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
