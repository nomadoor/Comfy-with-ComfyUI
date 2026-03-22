# ADR: Workflow Picker Shortcode (2026-01-14)

- Status: Accepted  
- Date: 2026-01-14

## Context
- Some pages need to surface multiple workflow JSON files in a compact UI.
- Existing workflow copy/download UI handles a single file per row and requires repetitive markup.
- The new UI must keep authoring lightweight while matching current copy/download behavior.

## Decision
1) Introduce a Nunjucks shortcode `workflowPicker` that accepts a variable list of JSON file paths.
2) Support a `!` prefix to mark the default option without reordering arguments.
3) Render a select + Copy + Download UI using existing workflow JSON styles.
4) Add a dedicated JS initializer to update download targets and copy JSON text via `fetch(..., { cache: "no-store" })`.
5) Provide a clipboard fallback using a hidden textarea when `navigator.clipboard` is unavailable.

## Consequences
- Authoring becomes shorter: a single shortcode replaces multiple workflow rows.
- Multiple pickers can exist on a page without collisions (unique IDs per block).
- Requires `:has()` support only for unrelated media-inline styling; picker behavior is pure JS.

## Files
- Updated: `.eleventy.js`
- Updated: `src/assets/js/page.js`
- Added: `src/assets/js/workflow-picker.js`
- Updated: `src/assets/css/site.css`

