// The per-language search index (/search/index-<lang>.json), fetched once per language and shared
// by the header search and the WebMCP tools. A failed request is not cached, so the next call retries.
const requests = new Map();

export function loadSearchIndex(lang) {
  if (!requests.has(lang)) {
    const request = fetch(`/search/index-${lang}.json`, { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json();
      })
      .then((index) => (Array.isArray(index) ? index : []));
    request.catch(() => requests.delete(lang));
    requests.set(lang, request);
  }
  return requests.get(lang);
}
