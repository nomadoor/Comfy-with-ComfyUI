# ADR: Assistant Feedback Pipeline (Cloudflare Worker)

## Status
Accepted — implemented via comfyui-feedback Worker

## Context
- Assistant rail submits feedback as GitHub issues.
- Requirements: low-friction UX, spam/rate limiting, per-environment CORS, Pages preview support, optional Turnstile, URL hygiene, and ability to post via bot account instead of maintainer.

## Decision
- Use a Cloudflare Worker (`comfyui-feedback`) as the single ingestion point.
- Auth: GitHub PAT in `GITHUB_TOKEN` secret (bot account recommended).
- CORS: `ALLOW_ORIGIN` per env — production `https://comfyui.nomadoor.net`; staging `*.comfy-with-comfyui.pages.dev`.
- Pages preview auto-targets staging endpoint when `CF_PAGES_URL` ends with `.pages.dev` and branch != `main`.
- Rate limit: per-IP sliding window; env-configurable `RATE_LIMIT_MAX` (default 3) and `RATE_LIMIT_WINDOW` seconds (default 60), validated with fallbacks.
- Turnstile: optional; enforced only when `TURNSTILE_SECRET` is set. Sitekey supplied via Pages env `ASSISTANT_TURNSTILE_SITEKEY`.
- Payload: message (min 20 chars), lang, URL (validated against allowed origins; otherwise recorded as `N/A`), UA. GitHub issues labeled `assistant-feedback`, `report|request`, `lang:<code>`.
- Error handling: upstream GitHub errors logged server-side; client gets generic 502.

## Consequences
- Preview testing works across changing `*.comfy-with-comfyui.pages.dev` hosts.
- If Turnstile is enabled, allowed domains must include preview hosts; otherwise leave sitekey empty to disable.
- To change the visible GitHub author, rotate `GITHUB_TOKEN` to a bot PAT and redeploy.
- IA/rate-limit changes must be reflected in `/ops` and worker config before deploy.

## Ops / How-to
- Deploy staging: `cd workers/feedback && wrangler deploy --env staging`
- Deploy production: `cd workers/feedback && wrangler deploy --env production`
- Secrets: `wrangler secret put GITHUB_TOKEN [--env production|staging]` (and `TURNSTILE_SECRET` if used)
- Pages env (Preview/Production):
  - `ASSISTANT_FEEDBACK_ENDPOINT` (staging or production worker URL)
  - `ASSISTANT_TURNSTILE_SITEKEY` (empty to disable)

## References
- Code: `workers/feedback/src/index.js`, `workers/feedback/wrangler.toml`, `src/_data/env.js`
- UI: assistant rail in `src/includes/assistant-rail.njk`, `src/includes/toc.njk`, JS in `src/assets/js/assistant-rail.js`
