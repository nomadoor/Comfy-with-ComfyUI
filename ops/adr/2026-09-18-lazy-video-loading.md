# ADR: Lazy video loading and stable media boxes

- Date: 2026-09-18
- Status: Accepted

## Context

Article videos were rendered with `autoplay`, so opening a page downloaded every clip on it at once, whether or not the reader ever scrolled that far. On the MiniMax H3 page that is 18 clips and 28.6 MB within two seconds of opening. On a throttled 10 Mbps link with an 80 ms round trip (Firefox, 390 px viewport, one screen every 3 s), images that scrolled into view waited up to 5.5 s for bandwidth the videos were using; with videos blocked the same images waited at most 0.6 s.

Two media boxes also had no size until their media arrived, so the page reflowed around them:

- A video inside `.article-media-row` fell back to the 300 px placeholder width a browser gives an unloaded video, although the real dimensions are recorded (`media.json` for R2, `.cache/gyazo-images.json` for Gyazo) and are already written into the `--article-video-*` variables.
- On phone widths the column layout of `mediaRow` shrank `.media-inline__media-stack` to the media's own width, which is zero for an image that has not loaded.

Both predate the R2 migration and affect Gyazo pages too (checked on `wan-animate`, `wan-2-1-vace`, `scail-2`, `sd15-text2image`). Eager loading hid them: on a fast connection the boxes settled before a reader scrolled there. Lazy loading would move that reflow right in front of the reader, so the layout is fixed together with it.

## Decision

**Sizes first.** `.article-media-row:not(.article-media-row--mixed) .article-video__frame` takes its width from the recorded dimensions (as mixed rows already did), and on phone widths `.media-inline__media-stack` stretches to the column width. Measured blocked vs. loaded, every media box and the page height are now identical from first paint.

**`src/assets/js/video-lazy.js`** (initialized in `page.js` after `media-toggle.js`, before `video-sync.js`):

- Videos are rendered `preload="none"` without `autoplay`, and their poster frame is held in `data-poster` — as a `poster` attribute it would be fetched for every video as soon as the page renders (~1 MB on the MiniMax H3 page).
- A video within one viewport of the screen is *activated*: the poster is attached, `preload` becomes `auto`, and a Loop video starts playing. Leaving that range pauses it; buffered data is kept.
- Player videos are never activated: they only get their poster, and load when the reader presses play.
- Before a video loads, activation waits for the images within two viewports that are still loading (capped at 3 s), and article images are given a head start: `img[loading="lazy"]` within two viewports is switched to `loading="eager"`. A clip of several megabytes must not be queued ahead of the few dozen kilobytes an image needs.
- `video-sync.js` builds a row's group on the `media-activate` event rather than at page init, and rebuilds only when the set of Loop videos actually changed. It sets `preload="auto"` on its members, since a group needs every duration.
- The hero video keeps loading eagerly: it is on screen from the start. It now also carries a poster.
- Without JavaScript, videos do not play and no poster is shown; the box keeps its size.

## Results (MiniMax H3, same 10 Mbps setup)

| | before | after |
|---|---|---|
| video bytes on open, no scrolling | 28.6 MB (18 clips) | 2.8 MB (hero only) |
| image wait after entering the viewport (max) | 5.5 s | 1.1 s |
| media box size / page height, unloaded vs. loaded | differs (+352 px desktop, +1262 px phone) | identical |

Remaining: text still shifts by ~26 px when the web fonts arrive, which is unrelated to media.

## Testing

- `tests/media-lazy.spec.ts`: videos ship unloaded (`preload="none"`, no `autoplay`, poster in `data-poster`); a clip three viewports down is not requested until approached, then loads with its poster; a Player video is not downloaded by scrolling to it, only by playing; every media box has the same size with media blocked as when loaded, and none collapses to zero.
- `tests/video-sync.spec.ts` and `tests/media.spec.ts` cover synchronized playback and the media layer unchanged.
- Fixtures `far-loop` and `far-player` sit below a 300 vh spacer and use their own clips, so their requests can be told apart.

## Scope

Not included: re-encoding videos to smaller files, additional image transformation presets (would need a WAF rule change for little gain), and skipping autoplay for `prefers-reduced-motion`.
