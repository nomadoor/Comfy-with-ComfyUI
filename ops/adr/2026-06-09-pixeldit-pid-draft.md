# ADR: PixelDiT / PiD Draft Page

## Status

Accepted

## Context

The owner requested a new Japanese draft article for PixelDiT / PiD based on the Scrapbox note at:

- https://scrapbox.io/work4ai/%F0%9F%A6%8APixelDiT_%2F_PiD

The placement was left to the agent, with Z-Image or upscale/restoration suggested as likely candidates.

PixelDiT is a pixel-space diffusion model, while PiD uses pixel diffusion as a decoder that can replace VAE decode and upscale latent diffusion outputs. In ComfyUI usage, the immediate practical example is close to Z-Image / Z-Image-Turbo workflows, especially when using PiD checkpoints for Flux-family latents that include Z-Image.

## Decision

Add a Japanese draft page at:

- `src/content/ja/basic-workflows/pixeldit-pid.md`

Place it under **Basic Workflows > Other Foundation Models > Z-Image > PixelDiT / PiD** in the Japanese navigation.

This keeps the first draft near the workflow family the owner is currently using, while still allowing a later IA move to the upscale/restoration group if the article grows into a broader PiD upscaling guide.

## Consequences

- The initial page is JA only, following the project rule that EN/ZH pages are not added unless explicitly requested.
- No existing slugs are renamed.
- The page can link to PixelDiT and PiD references, but should stay a light draft rather than a full theory article.
