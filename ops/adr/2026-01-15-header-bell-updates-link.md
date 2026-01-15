# ADR: Header Bell Link to Updates (2026-01-15)

- Status: Accepted  
- Date: 2026-01-15

## Context
- The site header needs a quick access link to updates/news.
- The UI should align with existing header icon button styling.
- URL structure must follow the established IA rules.

## Decision
1) Add a bell icon button to the header.
2) The bell links to the existing Updates page:
   - JA: `/ja/begin-with/updates/`
   - EN: `/en/begin-with/updates/`
3) The icon uses the same sizing/spacing as the search icon button.
4) On mobile, the bell appears to the right of the search icon.

## Consequences
- One additional header action in all views.
- No new IA section is introduced; uses existing Updates page.

## Files
- Updated: header template
- Updated: `src/assets/css/site.css`
- Added: `src/assets/icons/bell.svg`

