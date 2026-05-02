# 2026-05-02 Design And Content Polish

## Status

Accepted

## Context

Notes section work and sitewide date metadata are merged. The next work period is for small visual roughness fixes and article-level corrections found during normal reading.

## Decision

- Use a dedicated `feature/design-content-polish` branch for these small fixes.
- Keep changes focused on local design polish, copy corrections, broken links, and article metadata cleanup.
- Do not change IA, canonical URL structure, section ownership, or major layout behavior in this branch.
- Any larger design-system change still requires updating `ops/style-design.md` before implementation.

## Consequences

- Small corrections can be batched without creating a new ADR for each tiny adjustment.
- Review should focus on whether each change is local and consistent with the existing `/ops` rules.
