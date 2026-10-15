# ADR: Assistant Feedback Pipeline (Cloudflare Worker)

## Status
Accepted — implemented via comfyui-feedback Worker

## Context
- Assistant rail submits feedback as GitHub issues.
- Requirements: low-friction UX, spam/rate limiting, per-environment CORS, Pages preview support, Turnstile, URL hygiene, and ability to post via bot account instead of maintainer.

## Decision
- Use a Cloudflare Worker (`comfyui-feedback`) as the single ingestion point.
- Auth: GitHub token in the `GITHUB_TOKEN` secret, owned by the bot account `vivi-assistant-bot` (a collaborator with write access on `nomadoor/Comfy-with-ComfyUI`), so issues are opened under its name. The token is a classic PAT with only the `public_repo` scope. A fine-grained token cannot do this: its resource owner must be the bot itself or an organization the bot belongs to, and GitHub's documentation lists contributing to public repositories the user does not own as something only classic tokens can do. `nomadoor/Comfy-with-ComfyUI` belongs to another personal account. It has an expiry date; note it in a calendar, and replace it before then with `wrangler secret put GITHUB_TOKEN --env=""`. An expired token makes every submission fail with 502 (GitHub answers 401 "Bad credentials"; visible in `wrangler tail --env=""`).
- CORS: `ALLOW_ORIGIN` per environment — production (top level) `https://comfyui.nomadoor.net`; staging `*.comfy-with-comfyui.pages.dev`. Since 2026-10-15 a POST whose `Origin` does not match is refused with 403 (unset or `*` allows any origin).
- Pages preview auto-targets staging endpoint when `CF_PAGES_URL` ends with `.pages.dev` and branch != `main`.
- Rate limit: per-IP sliding window; env-configurable `RATE_LIMIT_MAX` (default 3) and `RATE_LIMIT_WINDOW` seconds (default 60), validated with fallbacks.
- Turnstile: required (changed 2026-10-15; it used to be enforced only when `TURNSTILE_SECRET` was set). It is the only gate against scripted posts: the rate limit is per isolate and `Origin` can be forged outside a browser, so a missing secret must not silently open the endpoint. Without `TURNSTILE_SECRET` the worker answers 500 and logs the missing secret. An environment that deliberately runs without it sets `TURNSTILE_DISABLED = "true"`. Sitekey supplied via Pages env `ASSISTANT_TURNSTILE_SITEKEY`.
- Payload: message (min 20 chars), lang (`ja`, `en` or `zh`; anything else is recorded as `ja`, because GitHub would create the unknown `lang:` label), URL (validated against allowed origins; otherwise recorded as `N/A`), UA. GitHub issues labeled `assistant-feedback`, `report|request`, `lang:<code>`.
- Error handling: upstream GitHub errors logged server-side; client gets generic 502.

## Consequences
- Preview testing works across changing `*.comfy-with-comfyui.pages.dev` hosts.
- Turnstile's allowed domains must include the preview hosts. To run an environment without it, leave the sitekey empty in Pages and set `TURNSTILE_DISABLED = "true"` on that worker environment.
- To change the visible GitHub author, rotate `GITHUB_TOKEN` to a bot PAT and redeploy.
- IA/rate-limit changes must be reflected in `/ops` and worker config before deploy.

## Ops / How-to
- Production is the top level of `wrangler.toml` (worker `comfyui-feedback`), not an `[env.production]` section (corrected 2026-10-15 to match the live worker; `--env production` would create a separate worker without secrets).
- Deploy production: `cd workers/feedback && wrangler deploy --env=""`
- Deploy staging: `cd workers/feedback && wrangler deploy --env staging` (worker `comfyui-feedback-staging`)
- Secrets: `wrangler secret put GITHUB_TOKEN --env=""` and `wrangler secret put TURNSTILE_SECRET --env=""` (`--env staging` for staging). Check with `wrangler secret list --env=""` (or `--env staging`) before deploying: since 2026-10-15 a missing `TURNSTILE_SECRET` stops the endpoint. Always name the environment: with `CLOUDFLARE_ENV` set, a command without `--env` targets that environment instead of production.
- `wrangler deploy` prints a diff when the local configuration differs from the live worker's; with `wrangler.toml` matching production, a deploy only changes the code.
- Pages env (Preview/Production):
  - `ASSISTANT_FEEDBACK_ENDPOINT` (staging or production worker URL)
  - `ASSISTANT_TURNSTILE_SITEKEY` (empty only together with `TURNSTILE_DISABLED` on the worker)

## References
- Code: `workers/feedback/src/index.js`, `workers/feedback/wrangler.toml`, `src/_data/env.js`
- UI: assistant rail in `src/includes/toc.njk`, JS in `src/assets/js/assistant-rail.js`
