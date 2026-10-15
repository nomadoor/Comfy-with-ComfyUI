# ADR: Contact Information Architecture and Submission Flow (2026-02-17)

- Status: Accepted
- Date: 2026-02-17

## Context
- "How to use this site", "About", tips rail, and contact entry points had overlap and weak primary routing.
- Mobile/compact contexts require clear, low-friction contact paths.
- `mailto:` launch-only flow was unreliable and hard to validate.

## Decision
1) Define contact as the primary routing hub with clear split:
   - Site-related reports/requests/feedback (GitHub issue pipeline).
   - Operator inquiry form (direct server-side email pipeline).
2) Keep confirm-step UX before submission on both tracks.
3) Require Turnstile at confirm/send stage for both tracks.
4) Standardize the assistant rail submission behavior to mirror contact flow semantics (confirm + verify + submit).
5) Keep About page as content asset, but prioritize contact-oriented routing in active navigation/footer decisions.
6) Maintain language parity (JA/EN/ZH) for contact page structure and core labels.

## Consequences
- One consistent "where to contact" model for users.
- Better anti-spam posture and fewer false-submit paths than `mailto`-only.
- Increased maintenance requirement for i18n parity across contact variants.
- Any future entry-point changes (footer/sidebar/how-to links) should be updated together to avoid routing drift.

## Operations (added 2026-10-15)
- One Turnstile widget serves every form: sitekey `0x4AAAAAACDRKSjHX9hYMgnR`, given to the pages by the Pages variable `ASSISTANT_TURNSTILE_SITEKEY` (`site.turnstileSiteKey` in `src/_data/site.json` is the same value, as the fallback for local builds). Its secret key must be set in two places:
  - the feedback worker, `TURNSTILE_SECRET` (site-related reports, requests and feedback; see `2025-11-28-assistant-feedback-worker.md`);
  - the Pages project, Production variable `TURNSTILE_SECRET` (the operator form, `/api/contact`).
  A secret from another widget is accepted by Cloudflare but fails every real submission with `invalid-input-secret`.
- Pages variables for `/api/contact`: `TURNSTILE_SECRET`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (and `ASSISTANT_TURNSTILE_SITEKEY`, `ASSISTANT_FEEDBACK_ENDPOINT` for the pages). A changed variable takes effect with the next deployment: use "Retry deployment" on the latest production deployment.
- `/api/contact` logs why it refused a submission (Turnstile error codes, or which input check failed), never the values. Watch them with `npx wrangler pages deployment tail <deployment id> --project-name comfy-with-comfyui` (the id from `wrangler pages deployment list --environment production`) while sending one test.
- 2026-10-15: both tracks had been failing silently. The operator form's Pages secret belonged to the widget the form used before the same-day switch to the shared sitekey (`invalid-input-secret` on every send), and the feedback worker's GitHub token had expired. A visitor only saw "送信に失敗しました", and nothing told the owner. After a change to either pipeline, send one test through each track.

## Files / Areas
- Contact pages: `src/content/ja/contact.md`, `src/content/en/contact.md`, `src/content/zh/contact.md`
- Contact behavior: `src/assets/js/contact.js` (entry), `contact-common.js`, `contact-forms.js` (site-related track), `contact-operator.js` (operator form), UI strings in `strings.js`
- Assistant rail behavior/copy hooks: `src/includes/toc.njk`, `src/assets/js/assistant-rail.js`
- Server endpoint: `functions/api/contact.ts`

