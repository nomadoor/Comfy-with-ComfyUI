# ADR: Notes Section

Date: 2026-05-02

## Context

The owner wants to replace the existing FAQ / Troubleshooting section with a broader Notes section. Notes should cover troubleshooting, concepts, experiments, release notes, and short practical writeups without forcing them into a category tree.

## Decision

- Replace the active `faq` section key with `notes`.
- Move existing FAQ articles to `src/content/<lang>/notes/` and update their `section` / permalink metadata.
- Do not keep duplicate FAQ pages. Publish Cloudflare Pages `_redirects` entries from each old `/<lang>/faq/<slug>/` URL to the matching `/<lang>/notes/<slug>/` URL.
- The Notes sidebar panel renders differently from other sections:
  - fixed `find` link at the top,
  - Updated / Views segment control, with Views rendered disabled until view-count data exists,
  - flat article title list with no category headings or indentation.
- Add `/notes/find/` for local note discovery. It lists all Notes as cards, supports text filtering by title / summary / tags, exposes tag pills that write into the local search field, and provides Updated / Views sorting. Views remains visible but disabled until view-count data exists, because a clickable control that produces the same order is visually noisy and misleading.
- Notes finder cards show only the thumbnail/placeholder and title. Summary and `noteTags` remain in data attributes for local filtering, but they are not rendered inside each card.
- Use `noteTags` for Notes finder facets. Do not use regular `tags` for Notes, because regular tags drive workflow / capability relationships elsewhere in the site.
- On individual Note pages, `noteTags` chips link to `/notes/find/?q=<tag>` in the current language. The finder reads `q` and initializes the local search field with that value.
- Add `created` and `updated` front matter to content pages using the best available Git history dates when exact editorial dates are unknown.

## Consequences

- Existing article URLs under `/faq/` become redirect-only legacy routes.
- Search and sitemap should expose only the canonical `/notes/` pages.
- Notes finder facets are intentionally isolated from regular tags, so Notes pages do not participate in workflow tag-chip or related-workflow behavior.
