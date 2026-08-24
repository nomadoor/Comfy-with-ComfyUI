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
