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

## Files / Areas
- Contact pages: `src/content/ja/contact.md`, `src/content/en/contact.md`, `src/content/zh/contact.md`
- Contact behavior: `src/assets/js/contact.js`
- Assistant rail behavior/copy hooks: `src/includes/toc.njk`, `src/assets/js/assistant-rail.js`
- Server endpoint: `functions/api/contact.ts`

