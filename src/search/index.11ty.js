function stripHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Drafts never reach collections (the "drafts" preprocessor drops them), so only
// opt-outs remain: searchExclude, and pages that ask search engines not to index
// them (404, retired About, coming-soon stubs, placeholders).
function isExcludedFromSearch(entry) {
  const data = entry?.data || {};
  return Boolean(data.searchExclude) || /\bnoindex\b/.test(data.robots || "");
}

export default class SearchIndex {
  data() {
    return {
      pagination: {
        data: "site.languages",
        size: 1,
        alias: "locale"
      },
      permalink: (data) => `/search/index-${data.locale.code}.json`,
      eleventyExcludeFromCollections: true
    };
  }

  render({ collections, locale }) {
    const items = (collections.all || [])
      .filter(
        (entry) =>
          entry.data &&
          entry.data.lang === locale.code &&
          !isExcludedFromSearch(entry),
      )
      .map((entry) => ({
        url: entry.url,
        lang: entry.data.lang,
        section: entry.data.section,
        slug: entry.data.slug,
        title: entry.data.title,
        summary: entry.data.summary || "",
        tags: entry.data.tags || [],
        content: stripHtml(entry.templateContent || "")
      }));

    return `${JSON.stringify(items, null, 2)}\n`;
  }
}
