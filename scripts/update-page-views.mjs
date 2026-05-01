import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_RANGE_DAYS = 90;
const DEFAULT_LIMIT = 10000;
const DEFAULT_OUTPUT = "src/_data/pageViews.json";
const DEFAULT_TIME_ZONE = "Asia/Tokyo";
const GRAPHQL_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";
const RUM_SITE_LIST_ENDPOINT = "https://api.cloudflare.com/client/v4/accounts/{accountId}/rum/site_info/list";

function parseArgs(argv) {
  const options = {
    rangeDays: DEFAULT_RANGE_DAYS,
    limit: DEFAULT_LIMIT,
    output: DEFAULT_OUTPUT,
    dryRun: false,
    includeBots: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--include-bots") {
      options.includeBots = true;
    } else if (arg === "--range-days" && next) {
      options.rangeDays = Number(next);
      index += 1;
    } else if (arg === "--limit" && next) {
      options.limit = Number(next);
      index += 1;
    } else if (arg === "--output" && next) {
      options.output = next;
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  if (!Number.isInteger(options.rangeDays) || options.rangeDays < 1) {
    throw new Error("--range-days must be a positive integer.");
  }
  if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 10000) {
    throw new Error("--limit must be an integer from 1 to 10000.");
  }

  return options;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseEnvText(text) {
  const env = {};
  for (const line of text.split(/\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].replace(/\r$/, "").trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
  return env;
}

async function loadLocalEnv() {
  const envPath = path.resolve(".env.local");
  if (!(await fileExists(envPath))) return {};
  return parseEnvText(await fs.readFile(envPath, "utf8"));
}

function requireEnv(env, key) {
  const value = env[key] || process.env[key] || "";
  if (!value) {
    throw new Error(`Missing ${key}. Add it to .env.local or the process environment.`);
  }
  return value;
}

function toDateKey(date, timeZone = DEFAULT_TIME_ZONE) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function normalizeSitePath(value = "") {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const parsed = new URL(value, "https://example.invalid");
    return parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    const pathOnly = value.split(/[?#]/)[0];
    const withLeadingSlash = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
    return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
  }
}

async function cloudflareFetch(url, token, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers || {})
    }
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.errors?.map((error) => error.message).join("; ") || response.statusText;
    throw new Error(`Cloudflare API HTTP ${response.status}: ${message}`);
  }
  if (data?.success === false) {
    const message = data.errors?.map((error) => error.message).join("; ") || "unknown error";
    throw new Error(`Cloudflare API error: ${message}`);
  }
  return data;
}

async function discoverSiteTag({ accountId, token }) {
  const url = RUM_SITE_LIST_ENDPOINT.replace("{accountId}", accountId);
  const data = await cloudflareFetch(url, token);
  const sites = Array.isArray(data.result) ? data.result : [];
  if (sites.length === 1 && sites[0].site_tag) {
    return sites[0].site_tag;
  }

  const labels = sites
    .map((site) => `${site.site_tag || "(missing site_tag)"} ${site.host || site.hostname || site.name || ""}`.trim())
    .join("\n");
  throw new Error(
    `Missing CLOUDFLARE_RUM_SITE_TAG. Add the matching site tag to .env.local.\nAvailable sites:\n${labels || "(none)"}`
  );
}

function buildQuery({ limit, includeBots }) {
  const filters = [
    "{ datetime_geq: $start }",
    "{ datetime_leq: $end }",
    "{ siteTag: $siteTag }"
  ];
  if (!includeBots) {
    filters.push("{ bot: 0 }");
  }

  return `query PageViewsByPath($accountTag: string!, $siteTag: string!, $start: Time!, $end: Time!) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      rumPageloadEventsAdaptiveGroups(
        limit: ${limit}
        filter: { AND: [${filters.join(" ")}] }
        orderBy: [count_DESC]
      ) {
        count
        dimensions {
          requestPath
        }
      }
    }
  }
}`;
}

async function fetchPageViews({ accountId, token, siteTag, start, end, limit, includeBots }) {
  const data = await cloudflareFetch(GRAPHQL_ENDPOINT, token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: buildQuery({ limit, includeBots }),
      variables: {
        accountTag: accountId,
        siteTag,
        start: start.toISOString(),
        end: end.toISOString()
      }
    })
  });

  if (data.errors?.length) {
    throw new Error(data.errors.map((error) => error.message).join("\n"));
  }

  return data.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups || [];
}

function buildPageViewsJson({ rows, rangeDays, start, end, siteTag, timeZone }) {
  const counts = new Map();
  for (const row of rows) {
    const key = normalizeSitePath(row?.dimensions?.requestPath || "");
    const count = Number(row?.count || 0);
    if (!key || !Number.isFinite(count) || count <= 0) continue;
    counts.set(key, (counts.get(key) || 0) + count);
  }

  const pages = Object.fromEntries([...counts.entries()].sort(([left], [right]) => left.localeCompare(right)));

  return {
    source: "cloudflare-web-analytics",
    metric: "pageload-count",
    updated: toDateKey(new Date(), timeZone),
    rangeDays,
    start: toDateKey(start, timeZone),
    end: toDateKey(end, timeZone),
    siteTag,
    pages
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const localEnv = await loadLocalEnv();
  const accountId = requireEnv(localEnv, "CLOUDFLARE_ACCOUNT_ID");
  const token = requireEnv(localEnv, "CLOUDFLARE_API_TOKEN");
  const siteTag = localEnv.CLOUDFLARE_RUM_SITE_TAG || process.env.CLOUDFLARE_RUM_SITE_TAG || await discoverSiteTag({ accountId, token });
  const timeZone = localEnv.PAGE_VIEWS_TIME_ZONE || process.env.PAGE_VIEWS_TIME_ZONE || DEFAULT_TIME_ZONE;
  const end = new Date();
  const start = new Date(end.getTime() - options.rangeDays * 24 * 60 * 60 * 1000);
  const rows = await fetchPageViews({
    accountId,
    token,
    siteTag,
    start,
    end,
    limit: options.limit,
    includeBots: options.includeBots
  });
  const output = buildPageViewsJson({
    rows,
    rangeDays: options.rangeDays,
    start,
    end,
    siteTag,
    timeZone
  });
  const json = `${JSON.stringify(output, null, 2)}\n`;

  if (options.dryRun) {
    const topPages = Object.entries(output.pages)
      .sort(([, left], [, right]) => right - left)
      .slice(0, 10);
    console.log(`rows=${rows.length}`);
    console.log(`pages=${Object.keys(output.pages).length}`);
    for (const [pagePath, count] of topPages) {
      console.log(`${count}\t${pagePath}`);
    }
    return;
  }

  await fs.mkdir(path.dirname(options.output), { recursive: true });
  await fs.writeFile(options.output, json, "utf8");
  console.log(`Wrote ${options.output}`);
  console.log(`pages=${Object.keys(output.pages).length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
