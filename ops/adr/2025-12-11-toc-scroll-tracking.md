# ADR: Switch TOC Active State Logic to Scroll Event

- **Date**: 2025-12-11
- **Status**: Accepted

## Context

The Table of Contents (TOC) active state tracking was previously implemented using `IntersectionObserver`. While efficient, this approach caused significant UI issues in the context of our Single Page Application (SPA) architecture (using the View Transition Router):

1.  **Initial Flicker**: Upon navigating to a new page, the `IntersectionObserver` would often fire multiple times as layout elements (hero images, fonts) shifted, causing the active link to flicker rapidly between different headings or no selection.
2.  **Unstable "Empty" State**: When scrolling between sections, or when a heading was just outside the intersection threshold but effectively "active" for the reader, the Observer would sometimes report no visible headings, causing the active state to be cleared unexpectedly.
3.  **Top of Page Behavior**: Users reported that when at the very top of the page, the first heading (H2) was not active because it hadn't crossed the specific intersection threshold yet.

## Decision

We have decided to replace the `IntersectionObserver` logic with a robust, legacy-style **Scroll Event + requestAnimationFrame** approach.

### Implementation Details

1.  **Scroll Event Listener**: We listen to `window.scroll` but throttle the actual logic using `requestAnimationFrame` (`ticking` flag) to ensure performance.
2.  **Position-based Activation**:
    -   Instead of checking "what is intersecting", we calculate "which heading owns the current viewport".
    -   We iterate through headings and find the last heading whose top position (`getBoundingClientRect().top`) is above or near the header offset line.
3.  **Consistent Fallback**:
    -   If we are at the very top of the page (above the first heading), we **defaults to the first heading**. This ensures the TOC is never empty and provides immediate context.
4.  **SPA Lifecycle Integration**:
    -   `initToc` is called on every navigation.
    -   We force an immediate `update()` call on `init`, `load`, and `imageFade:loaded` events to handle layout shifts without waiting for a scroll event.
    -   We explicitly clean up scroll/resize listeners on re-initialization to prevent memory leaks or duplicate handlers.

## Consequences

### Positive
-   **Eliminated Flicker**: The active state is now deterministic based on scroll position, not transient intersection events.
-   **Stable UX**: The active link sticks to the current section reliably, even during fast scrolling.
-   **Immediate Feedback**: Clicking a TOC link or loading a page with a hash updates the active state immediately.
-   **Always Active**: The TOC no longer goes "dark" at the top of the page.

### Negative
-   **Main Thread Usage**: Scroll events fire frequently. However, the `requestAnimationFrame` throttling and efficient DOM reads (caching headings where possible, though we re-read rects) minimize the impact. In modern browsers, this overhead is negligible for the number of headings we have.

## Related Files
-   `src/assets/js/toc.js`
