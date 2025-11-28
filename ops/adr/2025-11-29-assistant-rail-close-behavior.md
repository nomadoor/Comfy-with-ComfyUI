# ADR: Assistant Rail – Close Button Behavior

## Status
Accepted — implemented on `fix/assistant-rail-collapse`

## Context
- When users opened an assistant view (help or form) and pressed ❌ to return, the panel sometimes stayed expanded even though the pointer was off the assistant area.
- Users expect: after ❌ the three options reappear and remain clickable; if the pointer is not over the assistant panel, it should collapse after the standard hover-out delay. If the pointer is over the panel, it stays open.

## Decision
- Keep the existing expand-on-close behavior (options visible).
- Use only the panel hover state to decide collapse; no synthetic events or extra timers.
- Collapse is triggered via the existing delayedCollapse path (mouseleave → 200ms → collapse if panel not hovered).
- Close button now calls `closeView({ keepExpanded: true })` (as before) and relies on the hover-driven collapse logic; no extra post-close timers.
- Ensure the assistant window is non-interactive when hidden by keeping `aria-hidden`/pointer-events on the window in sync with view state (already enforced).

## Consequences
- After ❌, options remain clickable immediately.
- If the pointer is away from the panel, the next mouseleave (or lack of hover) causes the standard delayed collapse; hovering the panel keeps it open.
- No additional timers or synthetic events that previously blocked interaction.

## References
- Code: `src/assets/js/assistant-rail.js` (closeView and delayedCollapse logic)
- Branch: `fix/assistant-rail-collapse`
