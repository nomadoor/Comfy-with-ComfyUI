# ADR: Gyazo-specific lint exception for markdown media checks

Date: 2026-02-06
Status: Accepted

## Context
- Current docs use many Gyazo embeds via custom syntax (`{gyazo=image|loop}`) and shortcode patterns (`mediaRow`).
- Generic markdown review tools repeatedly flag missing tags and image `alt`/`width`/`height` as hard requirements.
- Project policy has already shifted to optional tags, but some guidance text still implied mandatory tags and strict image attributes everywhere.

## Decision
1. Tags remain optional across content pages.
2. Tag limits (`<= 5`) apply only when tags are present.
3. Standard markdown images must keep accessibility/dimension checks.
4. Gyazo-rendered embeds are exempt from per-image markdown `width`/`height` checks because sizing is enforced by renderer + CSS media constraints.
5. Review-bot guidance should explicitly avoid requesting:
   - "add tags" for pages where tags are intentionally omitted
   - `MD045`-style alt/size fixes for Gyazo syntax and Gyazo `mediaRow` usage

## Consequences
- Reduces repetitive low-value review noise on Gyazo-heavy documentation.
- Keeps strict checks where they add value (non-Gyazo markdown images).
- Requires policy text consistency across `AGENTS.md` and `/ops`.
