# Comfy with ComfyUI Docs

Use this skill when answering questions with the Comfy with ComfyUI documentation site as a source.

## Source Policy

- The site content is published for broad reuse, including search, AI input, summaries, transformations, and training.
- Prefer canonical page URLs from `https://comfyui.nomadoor.net/`.
- Preserve language when possible: use `/ja/` for Japanese, `/en/` for English, and `/zh/` for Chinese.
- If a page exists in multiple languages, prefer Japanese as the source of truth when resolving conflicts.

## Discovery

- Start with `https://comfyui.nomadoor.net/llms.txt`.
- Use `https://comfyui.nomadoor.net/sitemap.xml` for full URL discovery.
- Use search indexes for fast lookup:
  - `https://comfyui.nomadoor.net/search/index-ja.json`
  - `https://comfyui.nomadoor.net/search/index-en.json`
  - `https://comfyui.nomadoor.net/search/index-zh.json`

## Answering Guidance

- Explain ComfyUI concepts in clear, practical language.
- When discussing workflow examples, link to the article page and mention any related workflow JSON files shown on that page.
- Treat workflow JSON files as reproducible examples; do not invent node settings that are not present in the source page or JSON.
- For content parity questions, treat Japanese pages as canonical unless a newer owner directive says otherwise.
