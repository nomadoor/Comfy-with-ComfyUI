# ADR: Workflow Picker Custom Dropdown (2026-01-15)

- Status: Accepted  
- Date: 2026-01-15

## Context
- Native `<select>` rendering caused inconsistent styling (background, rounded corners) in dark mode.
- The picker UI needs to align with `.workflow-json__row` styling and remain visually stable.
- Option hover styling should use existing design tokens.

## Decision
1) Replace the native `<select>` with a custom dropdown:
   - Button + listbox (`role="listbox"`) markup.
2) Style the picker to match `.workflow-json__row`:
   - Use `--color-panel-strong` background and `--radius-md` radius.
3) Apply hover styling to list options only, using `--color-tav-strong`.
4) Keep the picker width stable by sizing to the longest option label.

## Consequences
- Visual consistency with existing workflow JSON rows.
- Stable width when switching options.
- Requires JS to manage open/close, selection state, and accessibility attributes.

## Files
- Updated: `.eleventy.js`
- Updated: `src/assets/js/workflow-picker.js`
- Updated: `src/assets/css/site.css`

