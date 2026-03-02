# ADR: Heading Permalink Icon (Copy Link) (2025-12-15)

- Status: Accepted
- Date: 2025-12-15

## Context
- Readers often want to share a link to a specific heading, not just the page.
- Direct hash links already work, but the UI provides no affordance to discover/copy the heading permalink.
- The site must stay minimal and avoid persistent visual clutter in articles.

## Decision
- Add a small permalink icon to the **left of article H2/H3** headings.
- The icon is **hidden by default** and becomes visible on **hover** (and keyboard focus for accessibility).
- Clicking the icon **copies** the canonical URL including the heading hash (e.g. `.../sd15-hires-fix/#basic-method`) to the clipboard.
- Copy success feedback is shown briefly via a visual state change.
- The icon asset is temporary and will be replaced later.

## Consequences
- Authors do not need to manually write “copy link” anchors in content.
- Implementation must remain ESM-only and work with the view-transition router (re-initialize on page swaps).
- UI strings must be localized via Eleventy data (JA/EN).

