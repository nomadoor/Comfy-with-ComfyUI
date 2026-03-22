# ADR: Nav Label Line-Clamp via Inner Span (2025-12-13)

- Status: Accepted  
- Date: 2025-12-13

## Context
- Long nav labels (especially FAQ items) were overflowing or visually clipping when two-line ellipsis was applied directly on the link block.
- Prior attempts using `-webkit-line-clamp` on `.nav-list__link` interacted poorly with padding/line-height and caused spill-over in the sidebar.
- IA requires preserving full titles in data; shortening text in `nav.ja.yml` is undesirable.

## Decision
1) Wrap nav label text in a dedicated element: `<span class="nav-list__label">`.
2) Restore `.nav-list__link` (and `.nav-list__no-link`) to flex container layout; apply the 2-line clamp only to `.nav-list__label`.
3) Add `word-break: break-all;` to the label to better handle long English/Japanese mixes; keep two-line ellipsis (`-webkit-line-clamp: 2`).

## Consequences
- Ellipsis and line-height are confined to the label text, so padding/box sizing no longer push text outside the container.
- Full titles remain in nav data; truncation is purely presentational.
- Minimal markup change (`nav-list.njk`), scoped CSS update; no build tooling changes required.

## Files
- Updated: `src/includes/nav-list.njk`
- Updated: `src/assets/css/site.css`

