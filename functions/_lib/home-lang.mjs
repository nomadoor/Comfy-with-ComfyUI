// Which language home `/` sends a visitor to, from the Accept-Language header.
// Kept free of Pages types so `node --test` can run it.
export const HOME_LANGS = ["ja", "en", "zh"];
// Visitors who list none of these (other languages, crawlers) read English best.
export const DEFAULT_HOME_LANG = "en";

export function pickHomeLang(acceptLanguage = "") {
  const ranked = String(acceptLanguage)
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q ? Number(q.slice(2)) : 1;
      return { tag, weight: Number.isFinite(weight) ? weight : 0, index };
    })
    .filter((entry) => entry.tag && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (HOME_LANGS.includes(primary)) return primary;
  }
  return DEFAULT_HOME_LANG;
}
