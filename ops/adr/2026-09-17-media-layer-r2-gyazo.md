# ADR: Storage-independent media layer for R2 and Gyazo

- Date: 2026-09-17
- Status: Accepted

## Context

Some Gyazo-hosted images are currently unavailable (see `2026-09-16-gyazo-outage-notice.md`). Affected pages are restored by re-capturing screenshots, not by bulk export from Gyazo.

Before this change, Gyazo rules were spread across the site: `.eleventy.js` renderers, the `imageVariant` filter, the hero/OGP templates (`.mp4` → `.jpg`), the assistant rail (`panel.video.id`), `lightbox.js` (Gyazo ID → mp4 URL), and UI hooks named `gyazo-*`. Markdown used `{gyazo=image|loop|player}`, which mixed the display mode with the storage provider.

## Decision

### Storage policy

- **Cloudflare R2 is the primary permanent media storage.** New screenshots go to R2.
- **Gyazo is not prohibited or deprecated.** It remains a supported media source, especially for heavy media such as videos. Support for Gyazo is not removed when R2 migration progresses.
- R2 bucket `media.bucket` (`comfy-with-comfyui-media`) is served only through the custom domain `media.host` (`img.comfyui.nomadoor.net`); both live in `src/_data/site.json`. The `r2.dev` URL stays disabled.
- Object keys are `u/<first 16 hex chars of sha256>.<ext>` over the uploaded bytes. Objects are never overwritten; replacing media means a new key and a new URL.
- Objects are uploaded with an explicit `Content-Type` and `Cache-Control: public, max-age=31536000, immutable`.
- A Bucket Lock retention rule of 30 days protects published objects from deletion and overwrite. It is not a backup: keep local originals backed up and periodically copy the bucket elsewhere.
- Cloudflare setup (bucket, custom domain, r2.dev, Bucket Lock) is done by the owner in the dashboard.

### Manifest

- `src/_data/media.json` is the Git-tracked inventory of R2 media, keyed by public URL: `{ width, height, type, bytes }`, plus optional `poster` (an R2 image URL in the manifest) for videos.
- Every R2 URL used by the site must be recorded there. mp4 files are registered manually for now; the manifest format already supports them.
- The build reads R2 dimensions from the manifest and makes no network requests for R2 media. Gyazo dimensions keep using the build-time oEmbed cache.

### Display mode vs. source

- `{media=image|loop|player}` is the official Markdown syntax and describes **only how media is displayed**. It behaves the same for R2 and Gyazo URLs. `{gyazo=…}` remains a compatible alias; `mediaRow` accepts both in `img="… {media=loop}"` and as `mode`/`media`/`gyazo` parameters.
- `resolveMedia(url, { mode, size })` in `.eleventy.js` is the single place that knows about storage. It returns `{ kind, mode, src, fullSrc, width, height, srcset, poster }`:
  - R2: `src = fullSrc = url`, dimensions and `poster` from the manifest.
  - Gyazo: `max_size` preview, `/raw` full image, ID-derived mp4 for videos, `max_size` still as `poster`.
  - Other URLs: used as-is.
  - Without `mode`, video vs. image is inferred from the manifest type or the `.mp4` extension (used for hero and data-driven media).
- Markdown images, `{media}`/`{gyazo}` embeds, `mediaRow`, the compatibility `gyazoVideoLoop`/`gyazoVideoPlayer` shortcodes, hero, OGP, related cards, Notes finder cards, and the assistant rail video all go through `resolveMedia`. The `imageVariant` filter is replaced by the `resolveMedia` filter. Video figures are rendered by one shared function.
- OGP and card thumbnails use `poster`; when a video has none, OGP falls back to `site.ogImage` and cards show the placeholder icon.
- The assistant rail stores `panel.video.url` instead of a Gyazo ID.

### Client and UI naming

- Every article image and video carries `data-full-src` with the real full-resolution URL. `lightbox.js` reads only that attribute and contains no host-specific logic.
- Storage-specific UI names are removed: `gyazo-toggle` → `media-toggle`, `article-video--gyazo` → `article-video--toggleable`, `data-gyazo-toggle`/`data-gyazo-initial` → `data-media-toggle`/`data-media-initial`, figure state `data-media-mode`, `gyazo-toggle.js` → `media-toggle.js`.

### Upload workflow

`npm run media:put -- <file.png|jpg> [...] [--alt "説明"] [--force] [--dry-run] [--no-clipboard]`

1. Remove metadata without re-encoding (`scripts/lib/media-metadata.mjs`):
   - Keep pixel data and everything that affects appearance: PNG `IHDR/PLTE/IDAT/IEND/tRNS/bKGD/sBIT/pHYs/gAMA/cHRM/sRGB/iCCP/cICP/mDCV/cLLI/acTL/fcTL/fdAT`; JPEG image segments, JFIF APP0, ICC profile APP2, Adobe APP14.
   - Remove ComfyUI workflow/prompt text chunks, EXIF (incl. GPS), XMP, comments, timestamps, Photoshop/IPTC, and other APPn/private chunks.
   - Reject instead of modifying: EXIF Orientation other than 1, MPF / Ultra HDR gain maps, JPEG data after EOI.
   - Verify after removal: the result re-parses, CRCs and dimensions match, image data (IDAT stream / JPEG image segments and scan data) is byte-identical, and nothing removable remains.
2. Hash to the key; skip when the URL is already in the manifest unless `--force` is given (used for registered objects that are not in the bucket yet, such as test fixtures). Objects under Bucket Lock still reject re-uploads.
3. `npx wrangler r2 object put --remote` with Content-Type and Cache-Control. Authentication uses `npx wrangler login`; no long-lived API token is stored for this workflow.
4. Append to `media.json` after each successful upload.
5. Print the `![](…){media=image}` snippets and copy them to the clipboard (UTF-8 PowerShell on WSL).

### Checks

- `npm run check:media` (part of `npm run check`) fails when:
  - a manifest entry is malformed, its `type` does not match the extension, or its `poster` is not a recorded R2 image;
  - an R2 URL in content, data, includes, or layouts is not recorded in the manifest;
  - an R2 file does not match its display mode (`{media=image}` on video, `{media=loop|player}` on an image);
  - any media (R2 or Gyazo) uses an unknown display mode.
- Gyazo URLs are valid external media and never fail the check by themselves.
- The Eleventy build itself does not fail on these conditions.
- `/internal/media-fixtures/` (`src/internal/media-fixtures.md`, `robots: noindex`, `searchExclude: true`, not in nav/sitemap/llms.txt/search) is exercised by `tests/media.spec.ts`. R2 and Gyazo requests are fulfilled from `tests/fixtures/media/` (`r2-image.png`, and `r2-video.mp4`, a 32×32 synthetic H.264 clip registered manually in `media.json`). Player click-to-open is asserted with a normally sized Gyazo player; the 32px R2 player is covered by markup assertions because native controls cover such small videos. `tests/media-metadata.spec.ts` covers metadata removal.
- `base.njk` emits `<meta name="robots">` from the `robots` front matter field.

## Out of scope

- Bulk migration of existing Gyazo media.
- WebP/AVIF conversion, responsive variants, and Image Transformations (would be generated inside `resolveMedia` only).
- Automated mp4 upload (metadata removal for video needs ffmpeg).

## Scope

- `.eleventy.js`
- `src/_data/site.json`, `src/_data/media.json`
- `src/includes/hero.njk`, `src/includes/toc.njk`, `src/layouts/base.njk`, `src/layouts/page.njk`, `src/content/*/notes/find.njk`
- `src/assets/js/lightbox.js`, `src/assets/js/media-toggle.js`, `src/assets/js/page.js`, `src/assets/css/site.css`
- `src/internal/media-fixtures.md`, `tests/media.spec.ts`, `tests/media-metadata.spec.ts`, `tests/fixtures/media/`
- `scripts/media-upload.mjs`, `scripts/lib/media-metadata.mjs`, `scripts/check-media.mjs`, `package.json`
- `ops/style-writing.md`, `ops/style-design.md`, `ops/requirements.md`, `ops/principles.md`, `.claude/skills/article-authoring/SKILL.md`
