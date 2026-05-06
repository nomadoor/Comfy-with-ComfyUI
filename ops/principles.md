# PRINCIPLES — Build Contract

## 1. OPS First
- Update `/ops` before writing code. No layout, token, or IA change lands in `/src` without a documented rule.
- ADR cadence: anything that changes IA, tokens, CI, or component sets requires ADR draft + approval.

## 2. Japanese Source First
- **JA is the source of truth for content.** New article work starts in Japanese.
- Do not create, translate, or update EN/ZH article pages unless the owner explicitly asks for that translation work in the current task.
- Do not add EN/ZH nav entries for a new JA article unless the matching EN/ZH pages are intentionally being created in the same owner-approved translation task.
- All UI chrome (nav, chips, buttons) must read the current locale from Eleventy data, never hard-coded.
- Existing EN/ZH pages may remain, but content parity is not a reason for agents to spend tokens on unsolicited translations.

## 3. Tags and Discovery
- Tags are optional metadata. If used, the tag slug ties nav, cards, workflows, and search facets together.
- Max 5 tags per page; overflow is a content bug that should block merge.
- Workflows inherit the tag slug from the page displaying them; list all workflows sharing that slug without omission.
- `tags` are primarily for `basic-workflows` pages and exist to connect `ai-capabilities` ↔ `basic-workflows` (chips/cards/related lists).
- `notes` uses `noteTags` instead of `tags`. These are local finder facets for `/notes/find/`, not workflow relation tags and not site-wide tag-chip links. They may reuse the same visual chip component as regular tags until a clearer distinction is designed.
- `noteTags` stay flat for users and implementation, but authoring distinguishes tier1 and tier2. Tier1 tags are category-like primary facets: `faq`, `troubleshoot`, and `project`. Tier2 tags are secondary details such as custom-node context, install state, error type, concept, model name, tool name, or topic nuance. Note finder helper buttons should expose the fixed tier1 set only.
- Other tag use outside `basic-workflows` remains an exception that requires explicit owner agreement.

## 4. Five Section Contract
- Section keys: `begin-with`, `data-utilities`, `ai-capabilities`, `basic-workflows`, `notes`.
- A slug must be unique inside its section across both languages.
- Sidebar ordering matches this list, and search filters respect the same buckets.

## 5. Experience Guardrails
- Match the provided mock layout (3 columns, tag chips below H1, workflow rail at bottom).
- JS is ESM-only, no frameworks, no global pollution; CSS sticks to vanilla + nesting.
- Performance budget: avoid loading unused workflows/search data (language-scoped fetch only), lazy-load heavy assets.

## 6. Trust & Quality
- CI must enforce slug uniqueness and nav integrity.
- Tag checks apply only when tags are present (optional field).
- Image dimension/alt checks are required for standard markdown images; Gyazo-rendered embeds (`{gyazo=image|loop}` and equivalent shortcodes) are exempt and rely on renderer/CSS-enforced layout constraints.
- Accessibility is non-negotiable: keyboard focus, ARIA labels on copy/download buttons, `prefers-reduced-motion` respected.
- No external tracking or heavyweight dependencies; if something feels heavy, propose it here first.

## 7. Delivery Ritual
- 1 PR = 1 intent (e.g., “app shell” or “search”), with mock-compliance screenshots attached.
- Document breaking questions as issues linked from `/ops`; never patch around ambiguity.
- Keep change logs in the PR description; this file should summarize enduring rules, not per-PR notes.
