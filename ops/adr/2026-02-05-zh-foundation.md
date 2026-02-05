# ADR: ZH Foundation (Language + SEO Baseline)

Date: 2026-02-05

## Context

We want to start a Chinese (zh) track without heavy China-specific
optimizations yet. The first step is to establish language scaffolding and
SEO correctness (canonical + hreflang) while keeping JA/EN behavior unchanged.

## Decision

- Add `zh` as a supported language with `/zh/` routes.
- Introduce `nav.zh.yml` that mirrors JA/EN slug IDs (titles may be placeholders).
- Emit canonical and hreflang tags (`ja/en/zh` + `x-default`).
- Extend sitemap to include alternate language references.
- Establish translation rules for zh in `/ops/style-writing.md`.

## Consequences

ZH pages can be generated via placeholders until translation content is added.
SEO foundations are aligned before translation work proceeds.
