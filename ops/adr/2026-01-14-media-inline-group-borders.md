# ADR: Media Inline Group Border Trimming (2026-01-14)

- Status: Accepted  
- Date: 2026-01-14

## Context
- `.media-inline` renders with both top and bottom borders.
- When multiple `.media-inline` blocks are consecutive, borders stack and appear thicker than intended.
- We want consistent separators without changing content order or introducing new markup.

## Decision
1) Keep the existing `border-top`/`border-bottom` on `.media-inline` as the base style.
2) Use CSS sibling + `:has()` selectors to trim borders for consecutive groups:
   - Remove the top border on the first item in a consecutive group.
   - Remove the top border on all subsequent items to avoid doubled lines.
   - Remove the bottom border on the last item in a consecutive group.
3) This yields a single separator between adjacent items, while removing the extra line at the group start/end.

## Consequences
- Single `.media-inline` retains its top and bottom borders.
- Consecutive groups show only the internal separators (no extra line at the very top/bottom of the group).
- This relies on `:has()` support (acceptable per current browser targets).

## Files
- Updated: `src/assets/css/site.css`

