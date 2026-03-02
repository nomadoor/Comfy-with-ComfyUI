# ADR: Header Bell Link to News Page (2026-01-15)

- Status: Accepted  
- Date: 2026-01-15

## Context
- The site header needs a quick access link to site updates.
- The UI should align with existing header icon button styling.
- URL structure must follow the established IA rules (standalone page, not in nav).

## Decision
1) Add a bell icon button to the header.
2) The bell links to the standalone News page:
   - JA: `/ja/news/`
   - EN: `/en/news/`
3) The icon uses the same sizing/spacing as the search icon button.
4) On mobile, the bell appears to the right of the search icon.

## Consequences
- One additional header action in all views.
- Adds a standalone News page outside the main nav.

## Files
- Updated: header template
- Updated: `src/assets/css/site.css`
- Added: `src/assets/icons/bell.svg`
