# ADR: Full-size WebP in R2 with Cloudflare Image Transformations

- Date: 2026-09-17
- Status: Accepted
- Supersedes (in part): `2026-09-17-media-layer-r2-gyazo.md` — the upload/metadata-removal steps and the image key format. The logical `/media/` naming, `media.json` role, display modes, fixtures, and checks remain as described there.

## Context

The first real screenshot (MiniMax H3, 3872×1553) was 1.5 MB as PNG, and the media layer served that full PNG for article images, cards, and OGP. Measured on this image:

| Output | Size |
|---|---|
| PNG (metadata removed) | 1,460 KB |
| Full-size WebP q90 (sharp) | 246 KB |
| Article 1600px WebP q90 (sharp / Cloudflare) | 67 KB / 68 KB |
| Thumbnail 640×360 cover WebP q90 (Cloudflare) | 19 KB |
| OGP 1200px JPEG q85 (Cloudflare) | 46 KB |

At q90, ComfyUI node text stays readable at 100% (lightbox) and article size looks the same as PNG. Cloudflare's resized output was visually equivalent to sharp.

Images are replaced often. Storing four derived files per image (thumbnail/article/full/OGP) would add four unreferenced objects per replacement and require re-uploading everything to change a size.

## Decision

### Roles

| Where | What | Role |
|---|---|---|
| Local originals (`E:\ai\comfy-with-comfyui-media`, `/mnt/e/ai/comfy-with-comfyui-media`) | PNG/JPEG with ComfyUI workflow metadata, as-is | Human-managed source of truth |
| R2 `images/<hash>.webp` | One full-size WebP per image, no metadata | Only public image object; lightbox source; transformation source |
| Cloudflare Image Transformations | thumbnail / article / og presets | Resized display variants, generated and cached at the edge |
| `src/workflows/*.json` | Workflow JSON | Official workflow distribution (Copy / Download) |

Original PNGs are never uploaded to R2 (no `originals/` prefix).

### Upload

`npm run media:put -- <section>/<article slug>/<file>.png` (options unchanged: `--alt`, `--replace`, `--force`, `--dry-run`, `--no-clipboard`):

1. Validate the logical name and locate the original under `COMFY_MEDIA_ORIGINALS`.
2. Encode with sharp (`scripts/lib/media-image.mjs`): reject non PNG/JPEG and animated images, apply EXIF orientation to pixels (`rotate()`), keep the original size (capped at WebP's 16383 px), `webp({ quality: 90 })`.
3. Verify the output: WebP with the expected dimensions whose RIFF chunks are only image data (`VP8 `, `VP8L`, `VP8X`, `ALPH`), so EXIF/XMP/ICC/animation chunks are rejected. Chunks are parsed rather than scanning bytes, which could match marker strings inside compressed pixels.
4. Key = `images/<first 16 hex of sha256(WebP)>.webp`; compare with `media.json` (same key → skip; different → `--replace` required, references listed).
5. Upload with `Content-Type: image/webp` and `Cache-Control: public, max-age=31536000, immutable`; then write `media.json`.

sharp is a devDependency pinned to an exact version: encoding is deterministic for a given version and environment, which keeps content-hash keys stable. The pin does not cover the platform-specific native build, so upgrading sharp or uploading from a different OS/CPU can change the bytes. The effect is limited to `media:put` requiring `--replace` and storing a new object (the old one becomes unreferenced); uploads are expected to run from the owner's single WSL environment, so no containerized uploader is introduced.

`scripts/lib/media-metadata.mjs` (PNG/JPEG metadata removal without re-encoding) is removed; WebP re-encoding plus output verification replaces it.

### `media.json`

Unchanged shape; image entries now point to the WebP:

```json
"basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va.png": {
  "key": "images/<hash>.webp", "width": 3872, "height": 1553, "type": "image/webp", "bytes": 252406
}
```

Logical names keep the original extension (`.png`, `.jpg`, `.jpeg`) and must have `type: image/webp` and an `images/<16 hex>.webp` key. Videos (`.mp4`) are unchanged (`videos/<hash>.mp4`, manual registration, optional `poster`).

### Transformation presets

Defined once in `src/_data/site.json` → `media.transforms`:

| Preset | Options | Used for |
|---|---|---|
| `thumbnail` | `width=640,height=360,fit=cover,quality=90,format=webp,onerror=redirect` | Related cards, Notes finder (`resolveMedia` size ≤ 640) |
| `article` | `width=1600,height=800,fit=scale-down,quality=90,format=webp,onerror=redirect` | Article images, `mediaRow`, hero, lightbox preview |
| `og` | `width=1200,height=1200,fit=scale-down,quality=85,format=jpeg,onerror=redirect` | `og:image` / `twitter:image` |

URLs: `https://media.comfyui.nomadoor.net/cdn-cgi/image/<preset>/images/<hash>.webp`. `resolveMedia()` returns `src` (thumbnail or article), `fullSrc` (the R2 WebP), `poster`, and `og`; `base.njk` uses `og`, then `poster`, then `site.ogImage`. Gyazo resolution is unchanged.

Observed behavior (verified 2026-09-17): responses keep the source's immutable `Cache-Control` and hit the edge cache on repeat; `format=webp` returns WebP to clients that accept it and falls back (e.g. PNG) otherwise (`Vary: Accept`); with `onerror=redirect`, a failed transformation returns 307 to the source object.

### Quota and WAF allowlist

- Free plan: 5,000 unique transformations per month (image × options). Exceeding it serves cached transformations as usual, returns error 9422 for new ones, and is not billed; `onerror=redirect` then falls back to the full-size WebP. Expected usage is roughly one article variant per image plus thumbnail/og for heroes (~1,250/month even if all ~950 former Gyazo images moved to R2).
- Any option string was transformable before restriction, which would let anyone exhaust the quota. A WAF custom rule (action Block) in the `nomadoor.net` zone allows `/cdn-cgi/image/` only on `media.comfyui.nomadoor.net` with exactly the three presets on `images/` sources. `npm run media:waf-expression` prints the expression from `site.json`; **changing a preset requires updating the WAF rule at the same time.** Verified: presets 200; other options, reordered/extra options, non-`images/` or external sources, other hosts, `..` traversal, and encoded variants 403.
- Transformations are enabled on the zone with the default same-zone source origins.

### Bucket Lock

The lock rule now retains objects for 7 days (all prefixes). Every R2 image can be regenerated from local originals, so the lock only guards against accidental or buggy deletion; a shorter period limits how long mistakenly published content cannot be removed.

### Checks and tests

- `check:media` validates the WebP key/type rules and that each preset is a plain option string containing `onerror=redirect`.
- `tests/media-image.spec.ts`: metadata-free WebP output from a ComfyUI-style PNG, deterministic bytes, EXIF orientation, rejected inputs.
- `tests/media.spec.ts`: article/thumbnail/og/full URLs, OGP from a video poster, lightbox full WebP, and every rendered `/cdn-cgi/image/` URL matching the WAF expression.

## Out of scope

- `media:gc` for unreferenced R2 objects (separate PR).
- `srcset`, AVIF, automated mp4 upload.

## Consequences

- One R2 object per image replacement; resizing policy changes need only `site.json` + WAF rule updates.
- Cloudflare Image Transformations becomes a runtime dependency, but failures degrade to the full-size WebP instead of broken images.
- The first R2 PNG (`images/d465bba4eb99eee3.png`) is no longer referenced after migrating its entry.
