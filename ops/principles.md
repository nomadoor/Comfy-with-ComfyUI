# PRINCIPLES — Build Contract

## 1. OPS First
- Update `/ops` before writing code. No layout, token, or IA change lands in `/src` without a documented rule.
- ADR cadence: anything that changes IA, tokens, CI, or component sets requires ADR draft + approval.

## 2. One Site, Two Languages
- JA/EN share the same slug IDs per section. Localization is label-only; content parity is the goal even if JA launches first.
- All UI chrome (nav, chips, buttons) must read the current locale from Eleventy data, never hard-coded.

## 3. Tags Drive Everything
- “Page = Tag” is immutable. The tag slug ties nav, cards, workflows, and search facets together.
- Max 5 tags per page; any overflow is a content bug that should block merge.
- Workflows inherit the tag slug from the page displaying them; list all workflows sharing that slug without omission.

## 4. Five Section Contract
- Section keys: `begin-with`, `data-utilities`, `ai-capabilities`, `basic-workflows`, `faq`.
- A slug must be unique inside its section across both languages.
- Sidebar ordering matches this list, and search filters respect the same buckets.

## 5. Experience Guardrails
- Match the provided mock layout (3 columns, tag chips below H1, workflow rail at bottom).
- JS is ESM-only, no frameworks, no global pollution; CSS sticks to vanilla + nesting.
- Performance budget: avoid loading unused workflows/search data (language-scoped fetch only), lazy-load heavy assets.

## 6. Trust & Quality
- CI must enforce slug uniqueness, nav integrity, tag allow-list, and image dimension coverage.
- Accessibility is non-negotiable: keyboard focus, ARIA labels on copy/download buttons, `prefers-reduced-motion` respected.
- No external tracking or heavyweight dependencies; if something feels heavy, propose it here first.

## 7. Delivery Ritual
- 1 PR = 1 intent (e.g., “app shell” or “search”), with mock-compliance screenshots attached.
- Document breaking questions as issues linked from `/ops`; never patch around ambiguity.
- Keep change logs in the PR description; this file should summarize enduring rules, not per-PR notes.
