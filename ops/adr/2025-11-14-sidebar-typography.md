# ADR: Sidebar Label Line-Height

- Status: Accepted
- Date: 2025-11-14

## Context
- Sidebar navigation buttons (`.sidebar__section-btn`) use flexbox to vertically center icon + label pairs.
- Our global `body { line-height: 1.7; }` combined with Berlin Type caused the label spans to render with excess top padding, so the text looked higher than the icon even though flex alignment was applied.
- Multiple attempts (font inheritance, button resets) did not eliminate the perceived offset until we forced the label span to use “normal” line metrics.

## Decision
- Set `.sidebar__section-label { line-height: normal; }` so the browser falls back to the font’s native metrics instead of the inherited 1.7 multiplier.
- Keep other typography tokens untouched to avoid side effects in markdown content; scope the fix strictly to the sidebar label span.

## Consequences
- Sidebar text now visually centers with its icons across JA/EN without additional wrappers or transforms.
- Future button-like components that mix Berlin Type + Zen Kaku should prefer `line-height: normal` (or an explicit value) when they must align with icons.
- No global line-height changes were needed, so article typography remains as previously approved.
