# ADR: Prev/Next Links Under Related Pages

Date: 2026-01-31

## Context

Readers need a simple way to move through pages in the same section without
returning to the sidebar or search.

## Decision

Add a previous/next link row below the related pages block on each article page.
The order is derived from `_data/nav.<lang>.yml` in the current locale. Each
link uses a caret plus the page title label.

## Consequences

Article pages will expose sequential navigation that stays aligned with the
nav YAML ordering for both JA and EN.
