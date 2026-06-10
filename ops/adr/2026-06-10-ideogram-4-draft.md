# ADR: Ideogram 4.0 Draft Page

## Status

Accepted

## Context

The owner requested a new Japanese draft article for Ideogram 4.0 based on:

- Official Ideogram 4.0 documentation and release material
- https://scrapbox.io/work4ai/Ideogram_4.0
- https://scrapbox.io/work4ai/%F0%9F%A6%8AIdeogram_4.0

The owner requested the page be placed below PixelDiT / PiD in the navigation.

## Decision

Add a Japanese draft page at:

- `src/content/ja/basic-workflows/ideogram-4.md`

After explicit owner request, add translations at:

- `src/content/en/basic-workflows/ideogram-4.md`
- `src/content/zh/basic-workflows/ideogram-4.md`

Place it under **Basic Workflows > Other Foundation Models > Ideogram 4.0**, immediately after PixelDiT / PiD.

The page should stay focused on the ComfyUI workflow and practical reading of Ideogram 4.0 rather than becoming a full architecture paper summary.

## Consequences

- EN/ZH translations were added after explicit owner request.
- No existing slugs are renamed.
- Workflow explanation can use `mediaRow` blocks because the owner requested that format for the more complex workflow explanation.
