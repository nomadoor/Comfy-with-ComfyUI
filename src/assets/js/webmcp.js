const siteOrigin = "https://comfyui.nomadoor.net";
const supportedLangs = new Set(["ja", "en", "zh"]);

const getLang = (value) => {
  const lang = String(value || document.documentElement.lang || "ja").toLowerCase();
  return supportedLangs.has(lang) ? lang : "ja";
};

const scoreResult = (item, query) => {
  const q = query.toLowerCase();
  const title = String(item.title || "").toLowerCase();
  const slug = String(item.slug || "").toLowerCase();
  const tags = Array.isArray(item.tags)
    ? item.tags.map((tag) => String(tag || "").toLowerCase())
    : [];
  const summary = String(item.summary || "").toLowerCase();
  const content = String(item.content || "").toLowerCase();
  if (title === q) return 100;
  if (title.includes(q)) return 80;
  if (slug === q) return 90;
  if (tags.some((tag) => tag === q)) return 85;
  if (slug.includes(q)) return 70;
  if (tags.some((tag) => tag.includes(q))) return 65;
  if (summary.includes(q)) return 50;
  if (content.includes(q)) return 20;
  return 0;
};

const searchDocs = async ({ query, lang = "ja", limit = 5 } = {}) => {
  const normalizedQuery = String(query || "").trim();
  if (!normalizedQuery) {
    return { results: [] };
  }
  const normalizedLang = getLang(lang);
  const cappedLimit = Math.max(1, Math.min(Number(limit) || 5, 10));
  const response = await fetch(`/search/index-${normalizedLang}.json`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`Search index request failed: ${response.status}`);
  }
  const index = await response.json();
  const results = (Array.isArray(index) ? index : [])
    .map((item) => ({ item, score: scoreResult(item, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, cappedLimit)
    .map(({ item }) => ({
      title: item.title,
      url: new URL(item.url, siteOrigin).href,
      summary: item.summary || "",
      section: item.section || "",
      slug: item.slug || ""
    }));
  return { results };
};

const getCurrentPage = () => ({
  title: document.title,
  url: window.location.href,
  lang: document.documentElement.lang || "",
  canonical:
    document.querySelector('link[rel="canonical"]')?.href || window.location.href,
  description:
    document.querySelector('meta[name="description"]')?.content || ""
});

const registerTool = (modelContext, definition, options) => {
  if (typeof modelContext.registerTool !== "function") return null;
  try {
    return modelContext.registerTool(definition, options);
  } catch {
    try {
      return modelContext.registerTool(definition.name, definition, options);
    } catch (error) {
      console.warn("[webmcp] tool registration failed", definition.name, error);
      return null;
    }
  }
};

export default function initWebMcp() {
  const modelContext = navigator.modelContext;
  if (!modelContext || typeof modelContext.registerTool !== "function") {
    return;
  }

  const controller = new AbortController();
  const options = { signal: controller.signal };

  registerTool(
    modelContext,
    {
      name: "search_comfyui_docs",
      description: "Search Comfy with ComfyUI documentation and return canonical page URLs.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query."
          },
          lang: {
            type: "string",
            enum: ["ja", "en", "zh"],
            description: "Search language."
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 10,
            description: "Maximum number of results."
          }
        },
        required: ["query"]
      },
      execute: searchDocs
    },
    options
  );

  registerTool(
    modelContext,
    {
      name: "get_current_comfyui_doc",
      description: "Return metadata for the currently open Comfy with ComfyUI page.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: getCurrentPage
    },
    options
  );

  window.addEventListener("pagehide", () => controller.abort(), { once: true });
}
