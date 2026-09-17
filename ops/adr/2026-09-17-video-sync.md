# ADR: Synchronized side-by-side loop videos

- Date: 2026-09-17
- Status: Accepted

## Context

Articles often place comparison clips side by side (for example MiniMax H3 `ref2va` / `fl2va` / `Hybrid`, or 0.25 MP / 1.0 MP outputs). Each video started when it finished loading and looped on its own, so clips that show the same motion drifted apart and could not be compared frame by frame. The MiniMax H3 comparison groups all have identical durations (5.875 s, 141 frames at 24 fps).

## Decision

`src/assets/js/video-sync.js` (initialized after `media-toggle.js` in `page.js`):

- **Automatic**: a paragraph of media (`.article-media-row`) containing two or more videos in Loop mode becomes a sync group. No Markdown syntax is added. Images in the same row are ignored.
- **Duration rule**: the group is formed only when durations differ by at most 0.5 s (≈12 frames at 24 fps), which absorbs differences from how files were saved. Larger differences keep native, independent looping (`data-video-sync="skipped"` on the row).
- **Start and loop together**: native `loop` is turned off. All videos reset to 0, wait until they can play, and start at once. When the longest video (the leader) ends, the whole group restarts; shorter followers hold their last frame until then.
- **Drift correction** every 250 ms against the leader: ≤ 0.04 s → no change; ≤ 0.3 s → follower `playbackRate` ± up to 0.1 (smooth catch-up); > 0.3 s → seek to the leader's time.
- **Buffering**: when any video fires `waiting`, the group pauses; when all can play again, followers align to the leader and playback resumes.
- **Player mode**: `media-toggle.js` dispatches `media-modechange`; the row rebuilds its group from videos still in Loop mode. With fewer than two, the group dissolves and native looping is restored.
- **Visibility**: an `IntersectionObserver` pauses the group off-screen and restarts it from 0 when the row becomes visible.
- **Client-side navigation**: `router.js` swaps page content without reloading, so each check also tears down a group whose row is no longer in the document (clearing its timer and observer without resuming the detached videos).
- Active groups set `data-video-sync="active"` on the row.

## Testing

- `tests/video-sync.spec.ts`: duration and drift-correction rules; end-to-end playback on the fixture page with generated VP9 WebM clips (Playwright's Chromium cannot decode H.264): alignment across a loop restart, recovery from a forced 1 s drift, a >0.5 s duration difference left unsynced, and dissolving the group when one video switches to Player. Requires ffmpeg with libvpx-vp9 (skipped otherwise); CI installs ffmpeg so these and the other video tests run there.
- Real H.264 articles are checked manually on localhost.

## Scope

- `src/assets/js/video-sync.js`, `src/assets/js/media-toggle.js`, `src/assets/js/page.js`
- `tests/video-sync.spec.ts`, `tests/fixtures/media/media.json`, `tests/fixtures/media/media-fixtures.md`
