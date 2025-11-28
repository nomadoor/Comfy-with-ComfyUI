# ADR: Assistant Rail – Close Button Behavior

## Status
Accepted — implemented on `fix/assistant-rail-collapse`

## Context
- When users opened an assistant view (help or form) and pressed ❌ to return, the panel sometimes stayed expanded even though the pointer was off the assistant area.
- Users expect: after ❌ the three options reappear and remain clickable; if the pointer is not over the assistant panel, it should collapse after the standard hover-out delay. If the pointer is over the panel, it stays open.

## Decision
- Close button calls `closeView({ keepExpanded: false })`; we immediately return to the panel view.
- After returning to panel (pointer devices), we run the existing delay chain: a 50ms defer then `delayedCollapse` (400ms) that collapses only if neither the avatar nor panel are hovered. This keeps options visible and clickable, and collapses naturally when the pointer is away.
- No synthetic events or extra listeners are added; collapse is purely hover‑driven.
- Window remains hidden/non-interactive in panel view via existing aria/pointer state.

## Consequences
- After ❌, options remain clickable immediately.
- If the pointer is away, the built‑in 50ms + 400ms collapse path hides the rail; hovering cancels the collapse.
- No extra timers or synthetic events beyond the existing hover-based collapse logic.

## References
- Code: `src/assets/js/assistant-rail.js` (closeView and delayedCollapse logic)
- Branch: `fix/assistant-rail-collapse`
