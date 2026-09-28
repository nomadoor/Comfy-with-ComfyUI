# 2026-09-28: Add Conditioning Zero Out Note

## Status

Accepted

## Context

`Conditioning Zero Out` appears frequently in CFG-distilled model workflows, but its practical purpose is difficult to infer from the node name alone. The owner wants a short Japanese column that explains why the node is useful before discussing its internal representation.

## Decision

Add localized notes at:

- `/ja/notes/conditioning-zero-out/`
- `/en/notes/conditioning-zero-out/`
- `/zh/notes/conditioning-zero-out/`

The note starts from CFG 1.0 and the required `negative` input on `KSampler`, then explains `Conditioning Zero Out` as a convenient way to satisfy that input without another Text Encode operation. A second half distinguishes zeroed conditioning from the conditioning produced by an empty prompt and warns against treating them as interchangeable when CFG is greater than 1.0.

Use the existing flat Notes structure and `noteTags`, without adding a fixed sidebar navigation entry. Japanese is the source page, with English and Simplified Chinese translations kept structurally aligned. The article includes three example workflows, five explanatory screenshots, and one hero image that is also displayed at the top of the article.

## Consequences

- The article is discoverable through Notes and Note finder.
- The same workflows and media are shared by all three languages.
- Each localized News page receives one new-page row dated 2026-09-28.
