# ADR: Article Media & Footer Refactor (2025-11-14)

- Status: Proposed
- Date: 2025-11-14

## Context
- Markdown images have been wrapped/rewrapped several times, but the current layout still injects extra horizontal padding and inconsistent max-width/max-height rules, causing CLS and awkward whitespace around tall assets.
- Image fade-in scripts rely on `data-loaded`, but the layout container keeps shifting because the CSS cascades fought each other (global rules vs. wrapper rules).
- The recently-added article footer is barebones and inherits sidebar typography, so it visually “dies” (no hierarchy, low contrast) and reads as a random block rather than a closing section.

## Decision
1. Rebuild the article media component from scratch: single wrapper, predictable `width:auto; max-width:min(100%, 720px); max-height:300px;` + `aspect-ratio`, no duplicated transitions, and eliminate `transition: all` so layout properties stay stable. All image-specific rules will live in one block so future tweaks don’t regress CLS.
2. Keep JS fade-in purely opacity-based; no layout props will animate. The wrapper will reserve the ratio via inline style (server-provided) so even lazy-loaded assets never shift the document flow.
3. Redesign the article footer: apply dedicated typography tokens (heading, body, link contrast), add spacing consistent with the main grid, and ensure it reads as a proper end section instead of a half-faded sidebar card.

## Consequences
- Images will finally have deterministic sizing, making CLS investigations straightforward and preventing future regressions.
- Footer gets a defined information architecture (title, blurb, link stack) so it can be extended with legal/contact info later without another overhaul.
- Work requires touching `.eleventy.js`, `src/assets/css/site.css`, and `src/layouts/page.njk`, followed by Serena/DevTools verification to ensure the CLS metric and visual baseline are clean.
