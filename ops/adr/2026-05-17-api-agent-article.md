# ADR: Add AI Agent API Article under Data Utilities

Date: 2026-05-17

## Context

The API subsection under Data & Image Utilities already explains what the ComfyUI
API is and how to run a workflow through it. The owner wants a follow-up article
that frames the same API path as a practical way to let an AI agent use ComfyUI.

## Decision

Add a Japanese article under the existing API group:

- Parent section: `data-utilities`
- Parent navigation group: `api`
- New page: `/ja/data-utilities/ai-agent-api/`
- Title: `ComfyUIのworkflowをAIエージェントに使わせる`

Use `ai-agent-api` as the slug because this page is about the API-based path for
AI agents to operate ComfyUI. Other agent usage patterns, if needed later, can
be split into separate pages with their own stable slugs.

The first version is based on the owner-provided heading outline. EN/ZH pages
and nav entries are added because the owner explicitly requested translation
work after the Japanese article stabilized.

## Consequences

- Japanese navigation gains one child entry below the existing API pages.
- The page stays focused on the API execution pattern first, with MCP discussed
  as context rather than as a separate tooling implementation.
- Future concrete scripts, workflow JSON, or MCP examples can be added after the
  owner provides the implementation direction.
