# ADR: Agent Operations Skills

## Status

Accepted

## Context

The owner requested a cleanup of the repository instructions for Claude Code and Codex.

The existing `AGENTS.md` contains useful project rules, but it also includes detailed task procedures that do not need to be loaded on every agent turn. The repository now has repeated agent workflows for article edits, workflow JSON updates, localization, release checks, and navigation/ADR changes.

## Decision

Keep `AGENTS.md` short and limited to repo-wide rules that are always relevant.

Move task-specific procedures into local skills under `.claude/skills/` so Claude Code can discover them directly and Codex can read the same project-local instructions when needed.

Prefer deterministic `scripts/check-*.mjs` checks for mechanical validation instead of relying on reminders in agent prose.

Do not copy broad permission, sandbox, or dangerous automation settings from external best-practice repositories.

## Consequences

- Agents start with less always-loaded instruction text.
- Detailed procedures stay available for the tasks that need them.
- Validation can become more reproducible as checks move into scripts.
- `/ops` remains the durable source for project decisions, IA, writing rules, and design rules.
