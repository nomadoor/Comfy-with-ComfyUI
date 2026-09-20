# ADR: Qwen-Image-2.1 article draft

- Date: 2026-09-21
- Status: Proposed

## Context

Qwen-Image-2.1 was released on 2026-09-20 with native ComfyUI support. The site already has pages for Qwen-Image, Qwen-Image-Edit, and Qwen-Image-Layered, but it does not yet have a page for Qwen-Image-2.1.

## Decision

- Draft a Japanese `basic-workflows` article with `slug` and `navId` set to `qwen-image-2-1`.
- Keep the new page separate from the existing Qwen-Image pages so their stable URLs remain unchanged.
- Treat Japanese as the source. Do not create or update EN/ZH pages or navigation without a separate owner request.
- Use `/media/basic-workflows/qwen-image-2-1/<logical name>` for new article media. Do not add new Gyazo references or physical R2 URLs.
- Confirm the final Japanese sidebar position with the owner before updating navigation.

## Scope

- `src/content/ja/basic-workflows/qwen-image-2-1.md`
- `src/_data/nav.ja.yml` after placement approval
- `src/workflows/basic-workflows/qwen-image-2-1/` when owner-provided workflows are added
- R2 media entries created by the established media sync flow

## Consequences

- The article can be drafted without changing existing Qwen-Image URLs or localized pages.
- The page remains incomplete until its content, workflow files, media, and navigation placement are finalized.
