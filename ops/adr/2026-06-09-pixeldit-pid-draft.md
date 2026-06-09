# ADR: PixelDiT / PiD Draft Page

## Status

Accepted

## Context

The owner requested a new Japanese draft article for PixelDiT / PiD based on the Scrapbox note at:

- https://scrapbox.io/work4ai/%F0%9F%A6%8APixelDiT_%2F_PiD

The placement was left to the agent, with Z-Image or upscale/restoration suggested as likely candidates.

PixelDiT is a pixel-space diffusion model, while PiD uses pixel diffusion as a decoder that can replace VAE decode and upscale latent diffusion outputs. It is a separate architecture from Z-Image. In ComfyUI usage, one practical example can be shown with Z-Image / Z-Image-Turbo because PiD provides Flux-family checkpoints that can accept compatible latents, but PixelDiT / PiD must not be treated as a child topic of Z-Image.

## Decision

Add a Japanese draft page at:

- `src/content/ja/basic-workflows/pixeldit-pid.md`

Place it under **Basic Workflows > Other Foundation Models > PixelDiT / PiD** in the Japanese navigation, immediately after the Z-Image group.

This keeps the first draft visually near the Z-Image workflow examples without implying that PixelDiT / PiD belongs to the Z-Image architecture. A later IA move to the upscale/restoration group remains possible if the article grows into a broader PiD upscaling guide.

## Consequences

- The initial page was JA only. EN/ZH translations are added after the owner explicitly requested other languages.
- No existing slugs are renamed.
- The page can link to PixelDiT and PiD references, but should stay a light draft rather than a full theory article.
- Per owner feedback, the page should explain PixelDiT first and PiD second, instead of combining them in a shared opening summary.
