---
name: publish-pr
description: Use when pushing a branch, opening a pull request, updating pull request metadata, or preparing PR titles and bodies for this repository.
---

# Publish PR

## Rules

- Push or update a PR only when the owner explicitly asks for it.
- Default to a draft PR unless the owner asks for ready-for-review.
- Keep the PR title focused on the change itself.
- Do not prefix PR titles with agent labels such as `[codex]`, `[claude]`, or similar. They add noise and are not part of the project change.
- Use one PR for one intent.
- Do not stage unrelated changes.

## PR Body

Include:

- what changed
- why it changed
- notable behavior or workflow impact
- checks run
- known advisory warnings or follow-up items

## Checks Before Publishing

- `git status --short --branch`
- `git diff --check`
- `npm run check` when project files changed
- `npm run build` when content, Eleventy config, nav, or scripts changed
