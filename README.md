# Comfy with ComfyUI

Documentation site for ComfyUI (JA/EN) built with Eleventy + Nunjucks and vanilla CSS/ESM.

## Quick start
1. `npm ci`
2. `npm run dev` – starts Eleventy at http://localhost:8080
3. `npm run build` – outputs to `_site`
4. `npm run test:playwright` – run e2e checks

## Content rules (very short)
- Pages live under `src/content/<lang>/<section>/<slug>.md` with frontmatter `layout`, `lang`, `section`, `slug`, `navId`, `title` (tags are optional; ai-capabilitiesは通常つけない)。
- Navigation slugs must match `src/_data/nav.<lang>.yml`.
- Workflows go in `src/workflows/<category>/<slug>.json` and are linked from pages.
- Refer to `/ops` files for IA, writing, and design tokens; they are the single source of truth.

## Scripts
- `npm run dev` – watch & serve
- `npm run build` – production build
- `npm run test:playwright` – smoke tests for layout/search

## Notes
- UTF-8 (no BOM) for all files.
- Images (Gyazoなど) should have width/height to avoid CLS.
