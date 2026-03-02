# ADR: Allow Gyazo MP4 as Hero Media (2025-12-13)

- Status: Accepted  
- Date: 2025-12-13

## Context
- Pages currently support only images for `hero.image`.
- Some topics are better represented by a short loop clip (Gyazo mp4), and authors want to reuse the same Gyazo assets already used in article bodies.

## Decision
- Treat `hero.image` as "hero media" and allow Gyazo `.mp4` URLs in addition to images.
- When `hero.image` ends with `.mp4`, render a `<video>` element in the hero:
  - `muted`, `autoplay`, `loop`, `playsinline`
  - `aria-hidden="true"` and `tabindex="-1"` (decorative media)
  - Use the existing hero sizing (12rem height) with `object-fit: cover`, plus the existing scrim overlay.

## Consequences
- Authors can set `hero.image: https://gyazo.com/<id>.mp4` (or other `.mp4`) without changing markdown body structure.
- No new JS behavior required; handled at template render time.
- If a future need arises for controls or audio, it requires a new ADR (hero media is currently decorative by contract).

## Files
- Updated: `src/includes/hero.njk`
- Updated: `ops/requirements.md`
- Added: `ops/adr/2025-12-13-hero-gyazo-video.md`

