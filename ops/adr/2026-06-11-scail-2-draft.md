# ADR: SCAIL-2 Draft Page

## Status

Accepted

## Context

The owner requested a new Japanese draft article for SCAIL-2 based on:

- https://scrapbox.io/work4ai/SCAIL-2
- https://scrapbox.io/work4ai/%F0%9F%A6%8ASCAIL-2
- Official SCAIL-2 project, code, model, and paper material

The owner described SCAIL-2 as a Wan2.1-based human motion transfer model and requested it be placed below Wan-Animate.

## Decision

Add a Japanese draft page at:

- `src/content/ja/basic-workflows/scail-2.md`

Place it under **Basic Workflows > Video Workflows > Wan 2.1 > Wan-Animate > SCAIL-2**.

The initial draft should stay short and focus on the practical position of SCAIL-2 relative to Wan-Animate: direct driving-video conditioning instead of depending primarily on skeleton or mask intermediates.

## Consequences

- The initial page is JA only unless EN/ZH translations are explicitly requested.
- No existing slugs are renamed.
- Workflow JSONs can be added later when a reproducible ComfyUI workflow is available.
