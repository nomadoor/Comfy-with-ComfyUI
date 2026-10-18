# ADR: Agent discovery and AI crawl policy

Date: 2026-05-01

## Status

Accepted

## Context

The site is CC0 documentation intended to be widely reused. An agent-readiness review reported missing or incomplete agent discovery signals such as `robots.txt`, Link headers, Markdown negotiation, API catalog, and Agent Skills discovery.

The site is an Eleventy documentation site, not an authenticated API product or hosted MCP server. Discovery artifacts should therefore advertise real public capabilities without implying protected APIs, OAuth issuers, or MCP transports that do not exist.

## Decision

- Allow broad crawling and reuse for search, AI input, AI answers, and AI training.
- Publish explicit `robots.txt` crawler groups and `Content-Signal: ai-train=yes, search=yes, ai-input=yes`.
- Publish `llms.txt` as a low-maintenance agent entry point.
- Publish Link response headers from the homepage pointing to `/.well-known/api-catalog`, `/llms.txt`, and `/sitemap.xml`.
- Publish an API catalog and OpenAPI document only for real public surfaces: static search indexes and the contact endpoint.
- Publish an Agent Skills discovery index for source-use guidance.
- Add progressive-enhancement WebMCP tools for site search and current-page metadata when `navigator.modelContext` is available.
- Do not publish OAuth/OIDC metadata, OAuth protected resource metadata, or an MCP server card until those services exist.
- Treat Cloudflare Markdown for Agents as an operational setting. If enabled in Cloudflare, the intended policy is already documented in `/ops`.

## Consequences

- Agents and crawlers get a clear permissive policy instead of inferring behavior from missing metadata.
- Discovery metadata stays honest about the site's actual capabilities.
- WebMCP-capable browsers can use structured search without affecting normal browsers.
- Cloudflare settings still need to be checked after deploy because managed robots features can override the origin `robots.txt`.

## 2026-08-24 Amendment: Readiness signal corrections

An external agent-readiness scan exposed several places where the site's existing public surfaces were difficult to identify from the root URL. The following corrections improve machine-readable access without changing the site's purpose:

- Redirect `/` to the canonical Japanese entry page with a real HTTP 302 instead of relying on meta refresh or JavaScript.
- Add explicit "when to use" guidance to `llms.txt`.
- Publish `WebSite` and `WebPage` JSON-LD on normal content pages.
- Give the 404 page recovery links to `sitemap.xml` and `llms.txt` while retaining a real HTTP 404 response.
- Give every operation in the existing OpenAPI description a stable `operationId`.
- Return a structured JSON 405 response, including `Allow: POST`, when `/api/contact` receives a non-POST request.

These changes describe capabilities that already exist. The site will not add a developer portal, invented API versioning or rate-limit policies, or organization address/telephone data solely to satisfy a generic readiness score.

## 2026-10-11 Amendment: Workflow catalog

Agents that need a workflow, rather than an article, had to open articles one by one to find the JSON. The site should be a dependable place for basic ComfyUI workflows, so it now publishes what it already knows about them in one file:

- Publish `/workflows/index.json`, rebuilt on every build from the published (not `noindex`) articles and the workflow files (`scripts/lib/workflow-catalog.mjs`). Each entry gives the workflow URL, the articles that link it with the heading it sits under, the measured performance from the article's `{% workflow %}` shortcode, the custom nodes from the nodes' `cnr_id` / `aux_id`, and the models: the loaders' `properties.models` where present, else the links in the workflow's `## models` note, else only the file names its loaders ask for. `models_source` says which, so an entry never claims more than the files say.
- Point to it from `llms.txt`, the API catalog, the OpenAPI document (`getWorkflowCatalog`), and the Agent Skill.
- `llms.txt` is rendered without the blank lines its template used to leave between list items.
- `scripts/lib/workflow-catalog.test.mjs` (`npm run test:unit`, part of `npm run check`) covers how articles and workflow files are read; Playwright checks that `llms.txt` links the catalog and the catalog is served. Files written after the build (the catalog and the Runpod profiles) go to Eleventy's actual output directory, so the Playwright server's `--output` gets them too.
- Not included for now: API-format workflow JSON (needs ComfyUI's node definitions to convert), the date and ComfyUI version a workflow was last verified with, and model licenses. Revisit once the catalog shows use.

## 2026-10-18 Amendment: Workflow update dates

An agent that takes a workflow from the catalog as a model to imitate (readable-node, a skill that rebuilds ComfyUI workflows for readability) needs to prefer the newer of two workflows for the same task, so it does not copy an outdated build.

- Each catalog entry gains `updated` (`YYYY-MM-DD`): the last day the workflow's build changed. `schema_version` stays 1, since the field is only added.
- The date is recorded when the workflow is committed, not computed at build time: `.githooks/pre-commit` runs `scripts/workflow-dates.mjs --staged`, which writes `src/_data/workflowDates.json` and stages it. The build only reads that file, so the date does not depend on the build host's git history (Cloudflare Pages clones shallowly).
- A commit that only fills metadata on the nodes (`properties.models`, `cnr_id`, `ver`, `aux_id`) does not move the date. Filling those in bulk must not make old workflows look new.
- `scripts/workflow-dates.mjs --backfill` fills the file from the git history once, under the same rule; `--check` (part of `npm run check:workflows`) fails when a workflow has no date or a date names a file that no longer exists.
