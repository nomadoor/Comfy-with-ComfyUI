# ADR: Layout Rails & Hero Refresh

- Status: Accepted
- Date: 2025-11-14

## Context
- Sidebar/TOC columns needed to remain perfectly aligned during zoom or fast scroll, and the right rail must host multiple future components (TOC + tips, etc.).
- Hero sizing and component border radii were inconsistent with the latest direction (12rem hero, consistent 0.5rem corners, centered content).
- TOC required a more precise structure (own border only, active link highlight aligned) plus space for a character tips block.

## Decision
1. Introduce `right-rail` container with generic sections; keep TOC confined to the first section and reserve a tips placeholder block anchored at the column bottom.
2. Use fixed-position rails with explicit offset tokens (`--column-gap`, `--shell-padding`, 16em rail widths) so the layout remains centered while the rails align with their placeholder columns.
3. Standardize border radii with `--radius-md = 0.5rem` applied across hero, cards, chips, media, etc.
4. Set hero height to `12rem`, flex-center its content, remove default margins, and keep the grayscale/scrim treatment.
5. Update TOC styles: remove panel padding-left, rely on border overlap for the active indicator, and limit headings to H2/H3 (existing script already does).

## Consequences
- Future right-rail modules can be added without renaming classes; the tips placeholder is already wired.
- Hero and general components now share a single curvature token, simplifying visual consistency.
- Automated Playwright checks cover rail alignment and copy feedback, guarding against regressions.
- Any new component using pill shapes must explicitly opt into `--radius-pill` since the default is now 0.5rem.
