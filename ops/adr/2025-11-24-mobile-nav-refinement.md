# ADR: Mobile Nav Refinement Round (2025-11-24)

## Context
- After Gemini’s initial mobile nav, we iterated to stabilize UI and align with the prior ADR (2025-11-21) while keeping desktop unchanged.
- Issues encountered: missing overlays, misaligned header items, disappearing logo, overuse of z-index, and mobile sidebar layout collapse.
- Goal: predictable layering (minimal z-index), centered logo with left menu/right actions, dark scrim for search and nav, and mobile-specific sidebar scrolling without affecting desktop.

## Decisions
1) Header (mobile ≤1100px)
- Structure: menu (left), centered logo, search toggle + actions (right) using a 3-part layout and absolutely centered logo.
- Logo sizing: width 100% with max-width 260px to avoid mask collapse; no scaling.
- Search toggle shows a dropdown search field; desktop remains unchanged.

2) Overlays & z-index policy
- Use a minimal stack: scrim z=0, nav-backdrop z=1, search dropdown/sidebar z=2, search results z=3. Removed ad-hoc higher values and hero content z-index.
- Scrim applies to both search-open and nav-open states.

3) Mobile sidebar behavior
- Sidebar is a fixed overlay with max-height calc(100vh - header); overlay width 85% (max 320px).
- ody.nav-open locks body scroll; scrollbar confined to the sidebar.
- Removed flex on .app-shell__sidebar to stop layout collapse; keep inner .rail as the flex container.
- Nav wrapper unbounded (overflow visible) on mobile.

4) Backdrops
- Added .nav-backdrop element to DOM and wired it in mobile-nav.js so clicking the scrim closes the nav; search keeps its own scrim.

## Implemented Changes (branch eature/mobile-nav)
- CSS: header mobile centering, overlay palette tuned, z-index reduced, sidebar height/scroll refactor, nav/search scrims.
- JS: mobile-nav.js handles nav backdrop click, maintains nav-open/search-open states, and body scroll lock.
- Templates: ase.njk includes .nav-backdrop; header retains desktop markup.

## Rationale
- Reduce layering complexity and prevent elements from being hidden by overly high z-index values.
- Preserve desktop layout completely while providing a usable mobile nav/search experience with clear focus states.
- Prevent double-scroll/overflow issues by isolating scroll to the sidebar when open.

## Status
- Implemented and visually checked on desktop and mobile breakpoints; ready for further UI polish if needed.
