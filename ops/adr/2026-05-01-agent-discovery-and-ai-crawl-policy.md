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
