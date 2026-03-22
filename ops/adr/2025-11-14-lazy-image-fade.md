# ADR: Lazy Image Sizing & Fade-In (2025-11-14)

- Status: Accepted
- Date: 2025-11-14

## Context
- Markdown images were lazy-loaded with Gyazo previews but lacked fixed dimensions, causing CLS when multiple images appeared in sequence.
- Designers want a quick fade-in so images donÅft flash brightly when they finish loading.
- We already cache Gyazo metadata; we needed to wire it into EleventyÅfs image renderer and add a lightweight front-end enhancer.

## Decision
1. Extend .eleventy.js to collect Gyazo IDs across src/**/*.{md,njk,json}, call GyazoÅfs oEmbed API, and cache width/height in .cache/gyazo-images.json (using ast-glob).
2. Update the Markdown renderer (imageVariant) to emit width/height plus srcset/sizes, ensuring the layout reserves space before pixels arrive. Lightbox still fetches the full-res asset.
3. Add src/assets/js/image-fade.js, which watches .article-body img, sets data-loaded="true" when each image finishes (or errors), and lets CSS fade them in over ~200?ms.
4. Keep hero images eager-loaded (unchanged) and only apply the fade/placeholder styling to article images.

## Consequences
- CLS is eliminated for Gyazo-backed content while previews remain lightweight.
- Fade-in makes lazy-loaded content feel smoother without touching hero media or other components.
- The cached metadata must stay in .cache/gyazo-images.json; build scripts should not delete it unless regenerating.
- ast-glob is now a dev dependency; Eleventy builds require Node fetch (already available in v18+).
