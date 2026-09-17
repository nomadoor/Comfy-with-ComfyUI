# ADR: Media authoring flow — local preview, automatic sync, and video

- Date: 2026-09-17
- Status: Accepted
- Supersedes (in part): the manual `npm run media:put` step in `2026-09-17-media-transforms.md`

## Context

Migrating the MiniMax H3 article from Gyazo exposed three gaps in the media tooling:

1. Uploading was a manual CLI step for the owner, who expected it to be part of the workflow.
2. `/media/...` references could not be previewed on localhost before uploading, which made writing articles impractical.
3. Videos (mp4) could not be uploaded (manual steps only, and ffmpeg was not installed).

Uploading during the Cloudflare Pages / CI build is not possible: originals live only on the owner's machine (`COMFY_MEDIA_ORIGINALS`), and build machines should not hold R2 write credentials.

## Decision

### Authoring flow

1. Place the original (PNG / JPEG / mp4) under `COMFY_MEDIA_ORIGINALS` as `<section>/<article slug>/<lowercase_snake_case>.<ext>`.
2. Write `![](/media/<logical name>){media=image|loop|player}` in the article.
3. Check it on the dev server (`npm run dev`); unuploaded originals preview directly.
4. Commit. The pre-commit hook runs `media:sync`, which uploads new or changed media and stages `src/_data/media.json`.

### Dev server preview

- Originals are hashed in chunks (large videos are not buffered whole). Paths are resolved canonically and must stay inside the canonical originals root, so symbolic links cannot expose files outside it.
- In `eleventy --serve` / `--watch`, `resolveMedia()` renders a `/media/` reference from the local original when it is not registered or when the original changed since upload (`source` differs). The URL is `/__media-originals/<logical name>`, served by an Eleventy dev server middleware (`scripts/lib/media-local-preview.mjs`) with Range support and `Cache-Control: no-store`. Paths are validated as logical names and must resolve inside the originals root.
- Dimensions come from the PNG/JPEG header, or for mp4 from the first video track's `tkhd` box (moov before or after mdat; a 90/270 degree display rotation swaps width and height), cached by size and mtime. Without them, video figures fell back to 16:9 and `object-fit: cover` cropped portrait clips.
- Production builds never use the preview and still fail on unregistered names. Playwright's `dev:test` clears `COMFY_MEDIA_ORIGINALS` so tests do not depend on local files.

### `media:sync`

`npm run media:sync [-- --dry-run] [-- --force]` (`scripts/media-sync.mjs`, logic in `scripts/lib/media-sync.mjs`):

- Collects `/media/` references from site sources (same scan as `check:media`, shared in `scripts/lib/media-refs.mjs`).
- For each referenced logical name, hashes the local original (`source`, first 16 hex of sha256 of the file) and compares it with `media.json`:
  - not registered → convert, upload, register (`added`);
  - `source` unchanged → skip without re-encoding;
  - `source` changed, same public bytes (e.g. only embedded workflow metadata changed) → update `source` only;
  - `source` changed, different public bytes → upload the new object and update the entry (`replaced`; the old object stays in R2);
  - original missing → keep a registered entry, or fail for an unregistered one.
- Images: full-size WebP q90 (`scripts/lib/media-image.mjs`). Videos: see below.
- Only objects referenced by the new entry are uploaded (a generated poster is skipped when a logical-name poster is kept). Objects already referenced by any entry are not uploaded again (Bucket Lock rejects overwrites). If an upload fails but the public object already exists with bytes matching its content-hash key, it is treated as uploaded, so a retry after a partial failure (e.g. video uploaded, poster not) succeeds. `media.json` is written after each completed entry.
- `media:put` and `scripts/media-upload.mjs` are removed.

### Pre-commit hook

- `.githooks/pre-commit` runs `media:sync --staged` (references are read from the git index, so unstaged edits cannot change what is uploaded or recorded) when staged files include `src/content`, `src/_data`, `src/includes`, `src/layouts`, or top-level `src/*.md|njk`, then stages `src/_data/media.json`. A failed sync aborts the commit; `SKIP_MEDIA_SYNC=1` bypasses it once.
- `npm install` runs `scripts/install-git-hooks.mjs` (the `prepare` script), which sets `core.hooksPath=.githooks`; it is a no-op on CI, Cloudflare Pages, or outside a git work tree.
- Uploads happen at commit time (not on save) because R2 objects are public and protected by Bucket Lock for 7 days.
- Replacing only an original (no tracked file changes) does not trigger the hook: run `npm run media:sync` and commit the updated `media.json`.

### Video (mp4)

`scripts/lib/media-video.mjs`, requires ffmpeg/ffprobe (`sudo apt install ffmpeg`):

- Accept mp4 with one H.264 video stream and AAC / MP3 / Opus audio; other codecs fail with a message to convert first.
- `ffmpeg -map 0:v:0 -map 0:a? -map_metadata -1 -map_chapters -1 -c copy -movflags +faststart` with bitexact flags: streams are copied without re-encoding, metadata (including ComfyUI workflow tags), chapters, and other streams are removed, and output is deterministic.
- Verify with ffprobe that only structural tags remain: format `major_brand`, `minor_version`, `compatible_brands`, and stream tags with ffmpeg's default values only (`language=und`, `handler_name=VideoHandler|SoundHandler`, `vendor_id=[0][0][0][0]`).
- Upload as `videos/<hash>.mp4` (`video/mp4`). `width`/`height` record the displayed size: the display rotation survives `-c copy`, so a 90/270 degree rotation swaps the coded size (matching the preview and the poster frame). The first frame becomes a full-size WebP poster stored as `images/<hash>.webp` and recorded inline:

```json
"basic-workflows/minimax-h3/minimax_h3_t2va_output.mp4": {
  "key": "videos/<hash>.mp4", "width": 1280, "height": 720, "type": "video/mp4", "bytes": 912345,
  "source": "<16 hex>",
  "poster": { "key": "images/<hash>.webp", "width": 1280, "height": 720, "bytes": 42000 }
}
```

- `poster` may still be the logical name of a registered image to use a chosen still instead of the first frame; `media:sync` keeps such a value.
- Poster images go through the same transformation presets (thumbnail / article / og) as other images.

### `media.json` additions

- `source` (optional, 16 hex): hash of the local original at the last sync.
- Video `poster`: generated frame object or logical name. `check:media` validates both.

## Consequences

- Authors never run an upload command; committing publishes referenced media.
- Commits touching site sources require `COMFY_MEDIA_ORIGINALS`, `wrangler login`, and (for videos) ffmpeg on the committing machine when new or changed media is referenced.
- The first frame may be a poor poster (e.g. a fade-in); set `poster` to a registered image in that case.

## Scope

- `.eleventy.js`, `package.json`, `.githooks/pre-commit`
- `scripts/media-sync.mjs`, `scripts/install-git-hooks.mjs`, `scripts/check-media.mjs`
- `scripts/lib/media-sync.mjs`, `scripts/lib/media-local-preview.mjs`, `scripts/lib/media-video.mjs`, `scripts/lib/media-refs.mjs`
- `tests/media-authoring.spec.ts`
- `ops/style-writing.md`, `ops/adr/2026-09-17-media-transforms.md`, `.claude/skills/article-authoring/SKILL.md`
