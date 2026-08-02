# ADR: Gyazo Image Variants & Lightbox Full-Resolution (2025-11-14)

- Status: Accepted
- Date: 2025-11-14

## Context
- Hero/inline images currently point straight at Gyazo originals (often 1–2 MB), which adds ~0.3s to each navigation even in local dev.
- Markdown content lacks `loading="lazy"` and responsive `srcset`, so every inline image decodes eagerly and blocks rendering.
- Lightbox reuses whatever `src` was in the document, so downsized previews look blurry when zoomed.
- Designers confirmed the hero already has a scrim, so the global brightness filter can stay on body media while heroes only need grayscale.

## Decision
1. Add a build-time helper (`imageVariant`) that rewrites Gyazo URLs to `/max_size/{n}` previews, keeps the original as `data-full-src`, and applies `srcset`/`sizes` + lazy-loading for Markdown images.
2. Use the helper for hero media so the hero requests the lighter preview, preserves the original link for zoom, and keeps eager loading / width / height to avoid CLS.
3. Update the lightbox script to prefer `data-full-src` so zoomed images always pull the untouched original file on demand.
4. Restore the global `filter: brightness(0.85)` for regular media but remove the extra brightness from hero images; retain grayscale to match the mock.
5. Document the change via this ADR; no `/ops` token updates were required beyond the ADR entry.

The untouched original is loaded through `https://gyazo.com/<id>/raw`, which redirects to the canonical raw asset with its actual file extension. A `/max_size/<n>` URL may be used for the page preview and responsive `srcset`, but must not be emitted as `data-full-src` or substituted by the lightbox.

Normal page media uses the reduced variants only. When the viewer opens, its one visible `<img>` immediately requests raw while the already-loaded preview is painted as that element's background. Raw remains visible and paintable throughout the request; once load completes, its own pixels cover the preview and the background is cleared. A failed raw request leaves the preview background visible. This avoids both a same-element `src` replacement and an occluded second image whose rasterization may be deferred until a viewport repaint.

Assign one `onload` and `onerror` handler before setting the raw source, overwriting them on each view, and use the viewer generation token plus requested URL to ignore stale completions. Exclude the Lightbox image from the site's global image-fade animation because the preview background already provides its loading presentation. Do not preload raw media during normal page viewing.

## Consequences
- Regular navigation now downloads smaller hero/inline assets while maintaining sharp lightbox zooms.
- All Markdown images lazy-load by default, freeing the main thread and avoiding layout jumps despite remote Gyazo hosting.
- Hero visuals stay on spec (scrim + grayscale) without double darkening, and future hero updates just call the same helper.
- If we ever need precise CLS guarantees for inline images, we can extend the helper to fetch width/height; the current pipeline centralizes that logic.
