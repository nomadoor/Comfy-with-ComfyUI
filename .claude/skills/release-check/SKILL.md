---
name: release-check
description: Use for final verification before commit, merge, PR review, or release readiness checks, especially after content, workflow, nav, layout, or JavaScript changes.
---

# Release Check

## Baseline

Always start with:

```bash
git status --short --branch
git diff --check
```

## Standard Checks

- Content/nav/workflow changes: `npm run check`
- Site generation: `npm run build`
- UI, search, notes, nav, form, client JS, or layout changes: `npm run test:playwright`

## Notes

- In this environment, Playwright may need approval because Eleventy dev server binds `0.0.0.0`.
- Report checks that were not run and why.
- Do not push or open/update PRs unless the owner explicitly says to do so.
