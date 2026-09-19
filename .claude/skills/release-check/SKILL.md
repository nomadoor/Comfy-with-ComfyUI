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

- `npm run build` failing on media that is not in `src/_data/media.json` is expected while an article is unpublished — the pre-commit `media:sync` registers it. See [preview-site](../preview-site/SKILL.md).
- Nav, slug or `ops/ia.md` changes need the dev server restarted before they show up.
- In this environment, Playwright may need approval because Eleventy dev server binds `0.0.0.0`.
- Report checks that were not run and why.
- Do not push or open/update PRs unless the owner explicitly says to do so.

## Pipeline

The last check before publishing in the article pipeline ([article-authoring](../article-authoring/SKILL.md)). Passing these checks is not permission to commit, push, or open a PR.

Next, only on an explicit request: [publish-pr](../publish-pr/SKILL.md).
