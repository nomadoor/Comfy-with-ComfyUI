# ADR: ZH translation must preserve JA source tone by default

Date: 2026-02-06
Status: Accepted

## Context
- ZH pages are translated from JA source articles.
- Review and cleanup work can unintentionally rewrite tone, soften/normalize expressions, or rephrase source-origin wording.
- The owner requested explicit protection for source-authored phrasing to avoid over-translation and authorship drift.

## Decision
1. JA source wording/tone is preserved by default in ZH translations when meaning is clear.
2. Agents must not perform unsolicited "normalization" rewrites for style alone.
3. Edits are limited to objective fixes:
   - factual errors
   - dead links
   - clear typos
   - build-breaking issues
4. This rule is recorded in `ops/style-writing.md` under the ZH translation section.

## Consequences
- Translation reviews focus on correctness and operability, not stylistic flattening.
- Source voice remains stable across languages.
- Minor wording roughness is acceptable when it reflects source intent.
