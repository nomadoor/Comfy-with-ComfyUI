# ADR: Inline Search Toggle in Header (2026-01-15)

- Status: Accepted  
- Date: 2026-01-15

## Context
- The search icon currently appears only on mobile (to reveal the search field).
- On desktop, users asked for the search icon to sit inside the search input, aligned to the right.
- The icon sizing should match existing header icon buttons.

## Decision
1) Add an inline search icon button inside the desktop search box.
2) Keep the existing mobile search toggle button in the header actions for small screens.
3) The inline button focuses the search input (no mobile overlay behavior).

## Consequences
- Desktop search input gains a right-aligned icon consistent with header icon sizing.
- Mobile behavior remains unchanged.

## Files
- Updated: `src/includes/header.njk`
- Updated: `src/assets/css/site.css`
- Updated: `src/assets/js/mobile-nav.js`

