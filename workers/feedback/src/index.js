const ipHits = new Map();
const MAX_IP_ENTRIES = 1000;
const LANGS = new Set(["ja", "en", "zh"]);
const ALLOWED_ISSUE_LABELS = new Set([
  "report",
  "request",
  "feedback"
]);

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return cors(new Response("", { status: 204 }), env, request);
    }

    if (request.method !== "POST") {
      return cors(new Response("Method Not Allowed", { status: 405 }), env, request);
    }

    // With an origin allowlist configured, only those pages may post. (A non-browser client can
    // fake the header; this stops other sites from using the endpoint through visitors' browsers.)
    if (!isAllowedOrigin(request.headers.get("Origin"), env)) {
      return cors(new Response("Forbidden", { status: 403 }), env, request);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return cors(new Response("Invalid JSON", { status: 400 }), env, request);
    }

    const {
      type = "report",
      message = "",
      url = "",
      lang: rawLang = "ja",
      turnstileToken = "",
      labels = []
    } = body;
    // The language becomes an issue label (`lang:…`), and GitHub creates unknown labels on the fly.
    const lang = LANGS.has(String(rawLang).toLowerCase()) ? String(rawLang).toLowerCase() : "ja";
    const text = String(message || "").trim();
    if (text.length < 20) return cors(new Response("Message too short", { status: 400 }), env, request);
    if (text.length > 1200) return cors(new Response("Message too long", { status: 400 }), env, request);

    // Turnstile is required. Without a secret the worker refuses instead of accepting unverified
    // posts; an environment that deliberately skips it sets TURNSTILE_DISABLED = "true".
    if (env.TURNSTILE_DISABLED !== "true") {
      if (!env.TURNSTILE_SECRET) {
        console.error("Missing TURNSTILE_SECRET in environment");
        return cors(new Response("Server configuration error", { status: 500 }), env, request);
      }
      const ok = await verifyTurnstile(turnstileToken, request, env);
      if (!ok) return cors(new Response("Turnstile verification failed", { status: 403 }), env, request);
    }

    // Simple rate-limit
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    // Per isolate: a burst from one visitor is caught, a distributed one is not (Turnstile is the
    // real gate).
    if (!rateLimit(ip, env)) {
      return cors(new Response("Too Many Requests", { status: 429 }), env, request);
    }

    const kind = normalizeType(type);
    const pageUrl = url && isValidOriginUrl(url, env) ? url : "N/A";
    const title = `[${kind}] ${titleFromUrl(pageUrl)}`;
    const userAgent = request.headers.get("user-agent") || "";
    const requestedLabels = sanitizeRequestedLabels(labels);

    const issueBody = [
      text,
      "",
      `---`,
      `Source: ${pageUrl}`,
      `Lang: ${lang}`,
      `UA: ${userAgent}`,
      `Timestamp: ${new Date().toISOString()}`
    ].join("\n");

    if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
      if (!env.GITHUB_TOKEN) console.error("Missing GITHUB_TOKEN in environment");
      if (!env.GITHUB_OWNER) console.error("Missing GITHUB_OWNER in environment");
      if (!env.GITHUB_REPO) console.error("Missing GITHUB_REPO in environment");
      return cors(new Response("Server configuration error", { status: 500 }), env, request);
    }

    const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/issues`;
    const ghResp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "comfyui-feedback-worker"
      },
      body: JSON.stringify({
        title,
        body: issueBody,
        labels: buildIssueLabels(kind, lang, requestedLabels)
      })
    });

    if (!ghResp.ok) {
      const text = await ghResp.text();
      console.error("GitHub error", ghResp.status, text);
      return cors(new Response("Upstream service error", { status: 502 }), env, request);
    }

    const issue = await ghResp.json();
    const resp = new Response(JSON.stringify({ ok: true, issueUrl: issue.html_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    return cors(resp, env, request);
  }
};

async function verifyTurnstile(token, request, env) {
  if (!token) return false;
  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET);
  formData.append("response", token);
  formData.append("remoteip", request.headers.get("cf-connecting-ip") || "");
  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData
  });
  if (!resp.ok) return false;
  const data = await resp.json();
  return !!data.success;
}

function rateLimit(ip, env) {
  const { max, windowSec } = getRateLimitConfig(env);
  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  const arr = ipHits.get(ip) || [];
  const recent = arr.filter((ts) => ts >= windowStart);
  recent.push(now);
  ipHits.set(ip, recent);

  // Periodic sweep to avoid unbounded growth
  if (ipHits.size > MAX_IP_ENTRIES) {
    for (const [key, timestamps] of ipHits.entries()) {
      if (!timestamps.length || timestamps[timestamps.length - 1] < windowStart) {
        ipHits.delete(key);
      }
      if (ipHits.size <= MAX_IP_ENTRIES) break;
    }
  }

  return recent.length <= max;
}

function getRateLimitConfig(env) {
  const fallbackMax = 3;
  const fallbackWindow = 60;
  const parsedMax = Number(env.RATE_LIMIT_MAX);
  const parsedWindow = Number(env.RATE_LIMIT_WINDOW);
  const max = Number.isFinite(parsedMax) && parsedMax >= 1 ? parsedMax : fallbackMax;
  const windowSec =
    Number.isFinite(parsedWindow) && parsedWindow > 0 ? parsedWindow : fallbackWindow;

  if (max !== parsedMax || windowSec !== parsedWindow) {
    console.warn(
      "Invalid RATE_LIMIT_MAX or RATE_LIMIT_WINDOW; falling back to defaults",
      { max, windowSec }
    );
  }
  return { max, windowSec };
}

function isValidOriginUrl(raw, env) {
  if (!raw) return false;
  try {
    const u = new URL(raw);
    const allowOrigin = env.ALLOW_ORIGIN || "*";
    if (allowOrigin === "*") return true;
    const origins = allowOrigin.split(",").map((o) => o.trim()).filter(Boolean);
    return origins.some((rule) => {
      try {
        // rule may be hostname or full origin
        if (rule.startsWith("*.")) {
          const suffix = rule.slice(1); // keep leading dot
          return u.hostname.endsWith(suffix);
        }
        const ruleUrl = rule.startsWith("http") ? new URL(rule) : new URL(`https://${rule}`);
        return u.origin === ruleUrl.origin;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

function titleFromUrl(raw) {
  try {
    const u = new URL(raw);
    return u.pathname || "feedback";
  } catch {
    return "feedback";
  }
}

function normalizeType(type) {
  const value = typeof type === "string" ? type.trim().toLowerCase() : "";
  if (value === "request" || value === "form-request") return "request";
  if (value === "feedback" || value === "form-feedback") return "feedback";
  if (value === "report" || value === "form-correction") return "report";
  return "report";
}

function normalizeLabel(label) {
  return typeof label === "string" ? label.trim().toLowerCase() : "";
}

function sanitizeRequestedLabels(labels) {
  if (!Array.isArray(labels)) return [];
  return labels
    .map(normalizeLabel)
    .filter((label) => label && ALLOWED_ISSUE_LABELS.has(label));
}

function buildIssueLabels(kind, lang, requestedLabels = []) {
  const labelSet = new Set(["assistant-feedback", `lang:${lang}`]);
  if (kind === "report") {
    labelSet.add("report");
  } else {
    labelSet.add(kind);
  }
  sanitizeRequestedLabels(requestedLabels).forEach((label) => labelSet.add(label));
  return Array.from(labelSet);
}

// Whether a request's Origin may use the endpoint. ALLOW_ORIGIN "*" (or unset) allows any origin;
// otherwise a comma-separated list of origins, hostnames or "*.suffix" rules must match.
function originMatches(origin, env) {
  if (!origin) return false;
  const allowOrigin = env.ALLOW_ORIGIN || "*";
  if (allowOrigin === "*") return true;
  const origins = allowOrigin.split(",").map((o) => o.trim()).filter(Boolean);
  try {
    const { hostname } = new URL(origin);
    return origins.some((rule) => {
      if (rule === origin) return true;
      if (rule === hostname) return true;
      if (rule.startsWith("*.")) {
        const suffix = rule.slice(1); // keep leading dot
        return hostname.endsWith(suffix);
      }
      return false;
    });
  } catch {
    return false;
  }
}

function isAllowedOrigin(origin, env) {
  if ((env.ALLOW_ORIGIN || "*") === "*") return true;
  return originMatches(origin, env);
}

function cors(response, env, request) {
  const origin = request.headers.get("Origin");
  const allowOrigin = env.ALLOW_ORIGIN || "*";
  const headers = new Headers(response.headers);
  const allowed = originMatches(origin, env);

  if (allowed) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  } else if (allowOrigin === "*") {
    headers.set("Access-Control-Allow-Origin", "*");
  }
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");
  const init = {
    status: response.status,
    statusText: response.statusText,
    headers
  };
  return new Response(response.body, init);
}
