function stripHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = class SearchIndex {
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
      .filter((entry) => entry.data && entry.data.lang === locale.code && !entry.data.draft)
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
};
