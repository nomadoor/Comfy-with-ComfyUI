# ADR: Qwen-Image-2.1 article draft

- Date: 2026-09-21
- Status: Accepted

## Context

Qwen-Image-2.1 was released on 2026-09-20 with native ComfyUI support. The site already has pages for Qwen-Image, Qwen-Image-Edit, and Qwen-Image-Layered, but it does not yet have a page for Qwen-Image-2.1.

## Decision

- Draft a Japanese `basic-workflows` article with `slug` and `navId` set to `qwen-image-2-1`.
- Keep the new page separate from the existing Qwen-Image pages so their stable URLs remain unchanged.
- Treat Japanese as the source. The owner later requested EN/ZH localization and matching navigation before the pull request.
- Use `/media/basic-workflows/qwen-image-2-1/<logical name>` for new article media. Do not add new Gyazo references or physical R2 URLs.
- Place the Japanese page immediately after the `Qwen-Image` entry and its children under `基本のworkflow` → `他の基盤モデル`, so the Qwen family stays contiguous. It is a sibling rather than a child of `Qwen-Image`: 2.1 supersedes that generation rather than being a variant of it. Nav position does not affect the existing pages' URLs.

## Scope

- `src/content/ja/basic-workflows/qwen-image-2-1.md`
- `src/_data/nav.ja.yml`, `src/_data/nav.en.yml`, and `src/_data/nav.zh.yml`
- `src/content/en/basic-workflows/qwen-image-2-1.md` and `src/content/zh/basic-workflows/qwen-image-2-1.md`
- `src/content/ja/news.md`, `src/content/en/news.md`, and `src/content/zh/news.md`
- `src/workflows/basic-workflows/qwen-image-2-1/` when owner-provided workflows are added
- R2 media entries created by the established media sync flow

## Consequences

- The article can be drafted without changing existing Qwen-Image URLs or localized pages.
- All three localized pages share the same workflow files and R2 media.
