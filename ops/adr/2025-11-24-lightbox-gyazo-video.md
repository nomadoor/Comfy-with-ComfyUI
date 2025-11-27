# ADR: Lightbox Support for Gyazo Loop/Player Videos (2025-11-24)

- Status: Accepted
- Date: 2025-11-24

## Context
- The site already supports Gyazo stills and inline Gyazo videos rendered as either looping clips or player embeds (`{gyazo=loop|player}` via Eleventy shortcodes and markdown-it).
- The lightbox overlay only handled `<img>` elements, so clicking a Gyazo video opened the Gyazo page instead of an in-page preview.
- We need consistent UX: all media in `.article-body` (images and Gyazo videos) should open in the same lightbox with keyboard navigation.

## Decision
1. Extend the lightbox JS to register both images and Gyazo videos under `.article-body figure[data-gyazo-toggle] video`.
2. Render a dedicated `<video data-lightbox-video>` inside the lightbox; switch between `<img>` and `<video>` depending on the selected media type.
3. Mirror the originating figure’s playback mode:
   - `loop` → autoplay, muted, loop on; controls hidden in-page but always available in lightbox.
   - `player` → controls visible; start paused unless the user plays.
4. Add CSS for `.lightbox__media` so videos share the same max dimensions as images and use a black background.

## Consequences
- Users can click Gyazo loop/player embeds and view them in the lightbox with keyboard navigation and next/prev controls.
- Videos no longer navigate away to gyazo.com; playback remains on-site.
- Minor increase in lightbox bundle size but no new dependencies.
