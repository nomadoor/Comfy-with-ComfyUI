# ADR: Unify Turnstile Sitekey Resolution for Contact and Assistant (2026-02-17)

- Status: Accepted
- Date: 2026-02-17

## Context
- Production behavior diverged: assistant rail Turnstile rendered, while `/contact/` Turnstile did not.
- Root cause was key-source drift:
  - Assistant used `env.assistantTurnstileSitekey` (with fallback).
  - Contact pages used `site.turnstileSiteKey` directly.
- If those values differ by environment/domain allowlist, one surface passes and the other fails.

## Decision
1) Use the same sitekey resolution order on contact pages as assistant rail:
   - `env.assistantTurnstileSitekey or site.turnstileSiteKey or ''`
2) Keep empty-string fallback for missing configuration (no literal placeholder key).
3) Apply consistently to JA/EN/ZH contact pages and both contact form blocks (site form + operator form).

## Consequences
- Contact and assistant behave consistently per environment.
- Turnstile domain-allowlist management becomes single-key focused.
- Preview/production mismatches are reduced when only env key is changed.

## Files
- Updated: `src/content/ja/contact.md`
- Updated: `src/content/en/contact.md`
- Updated: `src/content/zh/contact.md`
- Reference parity target: `src/includes/toc.njk`

