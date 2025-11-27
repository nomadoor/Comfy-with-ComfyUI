# ADR: Layout & Workflow Presentation Overhaul (2025-11-13)

## Context
- Header/column alignment mismatched the provided mock: sticky header width differed from the three-column shell, causing visual drift and CLS.
- Sidebar/TOC scrolling was jittery; placeholders redirected to unrelated pages; workflow assets mixed JSON download UI with visual cards, conflicting with the true IA.
- Tag rules required chips only on `basic-workflows` pages linking back to `ai-capabilities`.

## Decision
1. Rebuilt header + shell grid so both share `sidebar / content / toc` columns, re-centered logo/search/actions, and constrained search width to 80% (≤520px).
2. Sidebar/TOC now use sticky panels sized to the viewport with scrollable nav wrappers; language chip opens upward; About link gained its own page.
3. Images inside articles are centered, limited to `max-width: 720px` / `max-height: 300px` to avoid layout shifts; hero media uses the shared Gyazo asset per mock.
4. Workflow handling split into:
   - `workflowJson[]`: inline rows showing `filename | Copy | Download` with icon buttons.
   - `relatedWorkflows`: Cosense-style grid showing other `basic-workflows` pages sharing tags.
5. Added Playwright coverage to assert hero/JSON UI and updated `ops/style-design.md` to match the new rules.

## Consequences
- Layout now matches the mock; scrolling feels stable (fixed header + sticky side columns).
- Placeholder pages render in context without redirects; tags behave per IA.
- Workflow JSON and related cards are easier to extend independently, and CI can target these structures.
- Future contributors must follow the documented tokens/layout rules; spec updates go through `/ops` first.
