# ADR: Storage-independent media layer for R2 and Gyazo

- Date: 2026-09-17
- Status: Accepted

## Context

Some Gyazo-hosted images are currently unavailable (see `2026-09-16-gyazo-outage-notice.md`). Affected pages are restored by re-capturing screenshots, not by bulk export from Gyazo.

Before this change, Gyazo rules were spread across the site: `.eleventy.js` renderers, the `imageVariant` filter, the hero/OGP templates (`.mp4` → `.jpg`), the assistant rail (`panel.video.id`), `lightbox.js` (Gyazo ID → mp4 URL), and UI hooks named `gyazo-*`. Markdown used `{gyazo=image|loop|player}`, which mixed the display mode with the storage provider.

Writing articles against hash-named R2 URLs would also make Markdown hard to read and tie articles to one storage layout.

## Decision

### Storage policy

- **Cloudflare R2 is the primary permanent media storage.** New screenshots go to R2.
- **Gyazo is not prohibited or deprecated.** It remains a supported media source, especially for heavy media such as videos. Gyazo support is not removed as R2 adoption progresses.
- R2 bucket `media.bucket` (`comfy-with-comfyui-media`) is served only through the custom domain `media.host` (`img.comfyui.nomadoor.net`); both live in `src/_data/site.json`. The `r2.dev` URL stays disabled.
- Objects are uploaded with an explicit `Content-Type` and `Cache-Control: public, max-age=31536000, immutable`, and are never overwritten.
- A Bucket Lock retention rule of 30 days is added after the first real upload has been verified. It is not a backup.
- Cloudflare setup (bucket, custom domain, r2.dev, Bucket Lock) is done by the owner in the dashboard.

### Four layers

| Layer | Example | Role |
|---|---|---|
| Local originals | `$COMFY_MEDIA_ORIGINALS/flux-2-klein/001.png` | Human-organized source of truth, outside the repository. May contain ComfyUI workflow metadata. Backed up by the owner. |
| Markdown / data | `![](/media/flux-2-klein/001.png){media=image}` | Logical reference. |
| `src/_data/media.json` | `"flux-2-klein/001.png": { "key": "images/<hash>.png", … }` | Logical name → R2 key and metadata. Production media only. |
| R2 | `https://img.comfyui.nomadoor.net/images/<hash>.png` | Public, immutable, content-addressed objects. |

### Logical names

- A logical name is the original's path relative to `COMFY_MEDIA_ORIGINALS`, so no separate `source` field is stored.
- Allowed form: a lowercase ASCII relative POSIX path whose segments match `[a-z0-9][a-z0-9._-]*`, ending in `.png`, `.jpg`, `.jpeg`, or `.mp4`. Forbidden: uppercase, leading or trailing `/`, empty segments (`//`), `.`/`..` segments, segments ending in `.`, and Windows reserved names (`con`, `prn`, `aux`, `nul`, `com1-9`, `lpt1-9`).
- Article slugs are not part of R2 keys. A folder named after an article is only a naming convention for originals; shared media may live in any folder (for example `common/`).
- Published names are treated as stable IDs and are not renamed casually. Before publication, renaming is manual (original file, `media.json` key, references); `check:media` catches misses.
- `fixtures/` names are reserved for test fixtures and are rejected in the production manifest.

### `/media/` namespace

- `/media/` is a reserved virtual namespace. No real page or static file may use it.
- R2 media must always be referenced through `/media/<logical name>`. Writing a physical R2 URL (`https://<media.host>/…`) in content or data is an error. Gyazo and other external URLs are written directly as before.
- `check-markdown-links` skips `/media/`; `check:media` validates it.

### Manifest

```json
{
  "flux-2-klein/001.png": { "key": "images/a94f8d31c5e2b7d0.png", "width": 1920, "height": 1080, "type": "image/png", "bytes": 183241 },
  "flux-2-klein/demo.mp4": { "key": "videos/23d3bb96df2ebf63.mp4", "width": 1280, "height": 720, "type": "video/mp4", "bytes": 912345, "poster": "flux-2-klein/demo-poster.png" }
}
```

- `key` is `images/<first 16 hex of sha256>.<ext>` for images and `videos/<16 hex>.mp4` for videos. The public URL is `https://<media.host>/<key>`, so the host can change without touching Markdown or the manifest.
- `type` must match both the logical name's extension and the key.
- `poster` (videos only) is the logical name of a registered image.
- Entries are sorted by logical name when written by the uploader.

### Display mode vs. source

- `{media=image|loop|player}` is the official Markdown syntax and describes **only how media is displayed**. It behaves the same for `/media/` and Gyazo. `{gyazo=…}` remains a compatible alias; new content uses `{media=…}`. `mediaRow` accepts both in `img="… {media=loop}"` and as `mode`/`media`/`gyazo` parameters.
- `resolveMedia(url, { mode, size })` in `.eleventy.js` is the single place that knows about storage and returns `{ kind, mode, src, fullSrc, width, height, srcset, poster }`:
  - `/media/<name>`: key, dimensions, and poster from the manifest.
  - Gyazo: `max_size` preview, `/raw` full image, ID-derived mp4 for videos, `max_size` still as `poster`.
  - Other URLs: used as-is.
  - Without `mode`, video vs. image is inferred from the manifest type or the `.mp4` extension (hero and data files).
- An unregistered `/media/` name **fails production builds** (`eleventy` build mode). Dev servers (`--serve`/`--watch`) warn and render an empty source so work in progress stays viewable. `check:media` fails in both cases.
- Markdown images, `{media}`/`{gyazo}` embeds, `mediaRow`, the compatibility `gyazoVideoLoop`/`gyazoVideoPlayer` shortcodes, hero, OGP, related cards, Notes finder cards, and the assistant rail video all go through `resolveMedia`. The `imageVariant` filter is replaced by `resolveMedia`. Video figures are rendered by one shared function.
- OGP and card thumbnails use `poster`; without one, OGP falls back to `site.ogImage` and cards show the placeholder icon.
- The assistant rail stores `panel.video.url` instead of a Gyazo ID.

### Client and UI naming

- Every article image and video carries `data-full-src` with the real full-resolution URL. `lightbox.js` reads only that attribute and contains no host-specific logic. Clicking the video area opens the lightbox as before; native controls keep their own clicks.
- Storage-specific UI names are removed: `gyazo-toggle` → `media-toggle`, `article-video--gyazo` → `article-video--toggleable`, `data-gyazo-toggle`/`data-gyazo-initial` → `data-media-toggle`/`data-media-initial`, figure state `data-media-mode`, `gyazo-toggle.js` → `media-toggle.js`.

### Upload workflow

```bash
export COMFY_MEDIA_ORIGINALS=/mnt/d/comfy-with-comfyui-media   # machine-specific, not in the repo
npm run media:put -- flux-2-klein/001.png [...] [--alt "説明"] [--replace] [--force] [--dry-run] [--no-clipboard]
```

1. The argument is relative to `COMFY_MEDIA_ORIGINALS` (an absolute path inside it is also accepted) and becomes the logical name. Paths outside the root, invalid names, and names whose on-disk case differs (WSL-mounted Windows drives are case-insensitive) are rejected.
2. Remove metadata without re-encoding (`scripts/lib/media-metadata.mjs`):
   - Keep pixel data and everything that affects appearance: PNG `IHDR/PLTE/IDAT/IEND/tRNS/bKGD/sBIT/pHYs/gAMA/cHRM/sRGB/iCCP/cICP/mDCV/cLLI/acTL/fcTL/fdAT`; JPEG image segments, JFIF APP0, ICC profile APP2, Adobe APP14.
   - Remove ComfyUI workflow/prompt text chunks, EXIF (incl. GPS), XMP, comments, timestamps, Photoshop/IPTC, and other APPn/private chunks.
   - Reject instead of modifying: EXIF Orientation other than 1, MPF / Ultra HDR gain maps, JPEG data after EOI.
   - Verify after removal: the result re-parses, CRCs and dimensions match, image data is byte-identical, and nothing removable remains.
3. Compute the key and compare with the manifest:
   - not registered → upload and register;
   - same key → skip (`--force` re-uploads, e.g. to restore a missing object);
   - different key → error listing the files that reference the name; with `--replace`, list them, upload, and update the entry. The old object stays in R2.
4. Upload with `npx wrangler r2 object put --remote`, Content-Type, and Cache-Control. Authentication uses `npx wrangler login`; no long-lived API token is stored.
5. Write `media.json` after each upload, then print `![](/media/<name>){media=image}` and copy it to the clipboard (UTF-8 PowerShell on WSL).

mp4 is registered manually for now. ComfyUI video outputs (e.g. VideoHelperSuite) can embed the workflow in container metadata, so strip it first, for example `ffmpeg -i in.mp4 -map_metadata -1 -c copy out.mp4`, then hash (`sha256sum out.mp4 | cut -c1-16`), upload to `videos/<hash>.mp4` with the same headers, and add the entry.

### Test fixtures

- Production never contains fixtures: `src/_data/media.json` holds only real public media, and no fixture objects are uploaded to R2.
- `tests/fixtures/media/` holds the fixture manifest (`media.json`, `fixtures/…` names), the fixture page (`media-fixtures.md`), `r2-image.png`, and `r2-video.mp4` (32×32 synthetic H.264).
- With `COMFY_MEDIA_FIXTURES=1`, `.eleventy.js` merges the fixture manifest and adds the page as a virtual template at `/internal/media-fixtures/` (`robots: noindex`, `searchExclude: true`, not in nav/sitemap/llms.txt/search). Without it, neither is read.
- Playwright starts `npm run dev:test` (fixtures enabled, port 8091, output `.cache/playwright-site`), so a regular `npm run dev` server on 8080 and `_site` are never reused. R2 and Gyazo requests are fulfilled from local fixtures.
- `tests/media.spec.ts` covers `/media/` resolution, R2/Gyazo × image/loop/player, OGP poster, UI naming, and lightbox; `tests/media-metadata.spec.ts` covers metadata removal. Player click-to-open is asserted with a normally sized Gyazo player because native controls cover the 32px R2 fixture.
- `npm run check:build` verifies a production `_site` has no fixture page, no fixture references, and no unresolved `/media/` references.

### Checks

`npm run check:media` (part of `npm run check`):

- Errors: invalid logical names (including `fixtures/` in production), key/type/extension mismatches, invalid dimensions or bytes, invalid posters, unregistered `/media/` references, display mode mismatches (`{media=image}` on video, `{media=loop|player}` on an image), unknown display modes (any source), and physical R2 URLs in content or data.
- Advisory: production logical names not referenced by any page or setting (posters of used videos count as used). Nothing is deleted automatically.
- The fixture manifest is validated against the fixture page with the same rules.

CI runs `npm run check` → `npm run build` → Playwright.

## Out of scope

- Bulk migration of existing Gyazo media.
- WebP/AVIF conversion, responsive variants, and Image Transformations (would be generated inside `resolveMedia` only).
- Automated mp4 upload, folder-wide sync, rename tooling, and automatic deletion of unused objects.

## Scope

- `.eleventy.js`
- `src/_data/site.json`, `src/_data/media.json`
- `src/includes/hero.njk`, `src/includes/toc.njk`, `src/layouts/base.njk`, `src/layouts/page.njk`, `src/content/*/notes/find.njk`
- `src/assets/js/lightbox.js`, `src/assets/js/media-toggle.js`, `src/assets/js/page.js`, `src/assets/css/site.css`
- `scripts/media-upload.mjs`, `scripts/lib/media-metadata.mjs`, `scripts/lib/media-names.mjs`, `scripts/check-media.mjs`, `scripts/check-build-output.mjs`, `scripts/check-markdown-links.mjs`
- `tests/fixtures/media/`, `tests/media.spec.ts`, `tests/media-metadata.spec.ts`, `tests/layout.spec.ts`, `playwright.config.ts`, `package.json`, `.github/workflows/ci.yml`
- `ops/style-writing.md`, `ops/style-design.md`, `ops/requirements.md`, `ops/principles.md`, `.claude/skills/article-authoring/SKILL.md`
