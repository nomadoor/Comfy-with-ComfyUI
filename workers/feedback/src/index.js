const ipHits = new Map();
const MAX_IP_ENTRIES = 1000;

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return cors(new Response("", { status: 204 }), env, request);
    }

    if (request.method !== "POST") {
      return cors(new Response("Method Not Allowed", { status: 405 }), env, request);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return cors(new Response("Invalid JSON", { status: 400 }), env, request);
    }

    const { type = "report", message = "", url = "", lang = "ja", turnstileToken = "" } = body;
    const text = (message || "").trim();
    if (text.length < 20) return cors(new Response("Message too short", { status: 400 }), env, request);
    if (text.length > 1200) return cors(new Response("Message too long", { status: 400 }), env, request);

    // Optional Turnstile
    if (env.TURNSTILE_SECRET) {
      const ok = await verifyTurnstile(turnstileToken, request, env);
      if (!ok) return cors(new Response("Turnstile verification failed", { status: 403 }), env, request);
    }

    // Simple rate-limit
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    if (!rateLimit(ip, env)) {
      return cors(new Response("Too Many Requests", { status: 429 }), env, request);
    }

    const kind = type === "request" ? "request" : "report";
    const pageUrl = url || "N/A";
    const title = `[${kind}] ${titleFromUrl(pageUrl)}`;
    const userAgent = request.headers.get("user-agent") || "";

    const issueBody = [
      text,
      "",
      `---`,
      `Source: ${pageUrl}`,
      `Lang: ${lang}`,
      `UA: ${userAgent}`,
      `Timestamp: ${new Date().toISOString()}`
    ].join("\n");

    if (!env.GITHUB_TOKEN) {
      console.error("Missing GITHUB_TOKEN in environment");
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
        labels: ["assistant-feedback", kind, `lang:${lang}`].filter(Boolean)
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
  const max = Number(env.RATE_LIMIT_MAX || 3);
  const windowSec = Number(env.RATE_LIMIT_WINDOW || 60);
  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  const arr = ipHits.get(ip) || [];
  const recent = arr.filter((ts) => ts >= windowStart);
  recent.push(now);

  // Save or prune this IP
  if (recent.length === 0) {
    ipHits.delete(ip);
  } else {
    ipHits.set(ip, recent);
  }

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

function titleFromUrl(raw) {
  try {
    const u = new URL(raw);
    return u.pathname || "feedback";
  } catch {
    return "feedback";
  }
}

function cors(response, env, request) {
  const origin = request.headers.get("Origin");
  const allowOrigin = env.ALLOW_ORIGIN || "*";
  const headers = new Headers(response.headers);
  if (origin && (allowOrigin === "*" || origin === allowOrigin)) {
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
