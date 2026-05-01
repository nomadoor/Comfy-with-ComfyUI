# ADR: Notes Section

Date: 2026-05-02

## Context

The owner wants to replace the existing FAQ / Troubleshooting section with a broader Notes section. Notes should cover troubleshooting, concepts, experiments, release notes, and short practical writeups without forcing them into a category tree.

## Decision

- Replace the active `faq` section key with `notes`.
- Move existing FAQ articles to `src/content/<lang>/notes/` and update their `section` / permalink metadata.
- Do not keep duplicate FAQ pages. Publish Cloudflare Pages `_redirects` entries from each old `/<lang>/faq/<slug>/` URL to the matching `/<lang>/notes/<slug>/` URL.
- The Notes sidebar panel renders differently from other sections:
  - fixed `find` link at the top, with a small search icon but no persistent filled background,
  - Updated / Views segment control, with Views rendered disabled until view-count data exists,
  - flat article title list with no category headings or indentation.
- Add `/notes/find/` for local note discovery. It lists all Notes as cards, supports text filtering by title / summary / tags, exposes tag pills that write into the local search field, and provides Updated / Views sorting. Views remains visible but disabled until view-count data exists, because a clickable control that produces the same order is visually noisy and misleading.
- Notes finder cards reuse the shared `workflow-related` card styling. They show only the thumbnail/placeholder and title. Summary and `noteTags` remain in data attributes for local filtering, but they are not rendered inside each card.
- Notes finder controls follow the compact blog index pattern: a slim centered local search field followed by centered `#tag` helper buttons. These tag buttons only write the tag text into the search field; they do not represent a persistent selected facet, so they do not receive active-state styling. The helper buttons are a manually curated recommended set, not a complete list of every `noteTags` value.
- Use `noteTags` for Notes finder facets. Do not use regular `tags` for Notes, because regular tags drive workflow / capability relationships elsewhere in the site.
- `noteTags` remain flat in front matter, chips, and filtering, but the authoring rule separates them into tier1 primary facets and tier2 secondary details. The Note finder helper buttons render only tier1 tags that are actually present in the current language's Notes.
- On individual Note pages, `noteTags` chips link to `/notes/find/?q=<tag>` in the current language. The finder reads `q` and initializes the local search field with that value.
- Views sorting is driven by `src/_data/pageViews.json`, keyed by canonical page URL. The file covers the whole site, and Notes templates read only matching Notes URLs from it.
- Generate `pageViews.json` with `scripts/update-page-views.mjs`, using Cloudflare Web Analytics GraphQL `rumPageloadEventsAdaptiveGroups`. Treat `count` grouped by `dimensions.requestPath` as the page-load metric for sorting. The script reads `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_RUM_SITE_TAG` from the environment or local `.env.local`; secrets must not be committed.
- Refresh `pageViews.json` once per day with GitHub Actions. The scheduled workflow commits only when the generated JSON changes, so the site is not rebuilt for identical analytics data.
- Add `created` and `updated` front matter to content pages using the best available Git history dates when exact editorial dates are unknown.

## Consequences

- Existing article URLs under `/faq/` become redirect-only legacy routes.
- Search and sitemap should expose only the canonical `/notes/` pages.
- Notes finder facets are intentionally isolated from regular tags, so Notes pages do not participate in workflow tag-chip or related-workflow behavior.
- The Views control is enabled only when `pageViews.json` contains at least one positive count for the current Notes list.
