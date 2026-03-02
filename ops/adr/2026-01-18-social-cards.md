# ADR: Social Cards (OGP / Twitter)

Date: 2026-01-18

## Context

Links shared on social platforms did not render rich cards because the site lacked
Open Graph and Twitter meta tags.

## Decision

Add OGP + Twitter card meta tags to the base layout.

- Card type: `summary` (no large image cards).
- Title/description derived from page `title` and `summary`.
- URL uses absolute `site.url + page.url`.
- Image uses hero image when available and not a video; otherwise fall back to a
  site-wide default image.
- Add `site.url` and `site.ogImage` to `src/_data/site.json`.

## Consequences

Social previews will render consistently for both JA/EN pages. Pages with only
video heroes will use the shared fallback image.
