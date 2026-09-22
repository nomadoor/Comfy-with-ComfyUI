# ADR: Mutable Asset Cache Policy

- Status: Accepted
- Date: 2026-09-22

## Context

- Cloudflare Pages deploys HTML and `/assets/` independently, while the site previously referenced `site.css` and `app.js` with stable URLs.
- After the Workflow Performance deployment, an existing browser combined new HTML with an older cached stylesheet. The changed markup rendered without its matching grid rules until a hard reload.
- Versioning only `app.js` does not version its relative ESM imports, and changing response headers alone does not immediately invalidate responses already cached under the former policy.

## Decision

1. Add the deployment commit identifier as a query parameter to `site.css`. Copy the complete JavaScript module graph beneath `/assets/js/<deployment>/` and load `app.js` from that directory, so every relative ESM import also receives a new URL. Local builds use a stable `dev` fallback.
2. Serve `/assets/css/*` and `/assets/js/*` with `Cache-Control: public, max-age=0, must-revalidate`.
3. Keep versioned URLs and response revalidation together: the versions bypass already-stale responses on the first fixed deployment, while revalidation protects repeated requests within a deployment.
4. Put the same version on the document root. When client-side navigation fetches HTML from a different deployment, or HTML without a deployment version, the router performs a full document navigation instead of combining unverified page markup with the currently loaded CSS and JavaScript.
5. Do not require users to hard reload after a deployment.

## Consequences

- A deployment that changes HTML, CSS, or JavaScript loads the matching asset graph immediately.
- Browsers may retain CSS and JavaScript bytes but must validate them before reuse.
- Tabs opened on one deployment reload once when client-side navigation crosses into another deployment.
- Images, fonts, and external media are outside this decision and retain their existing cache behavior.
