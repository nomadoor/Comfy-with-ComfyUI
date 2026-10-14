// Template filters: related pages, Notes lists, navigation, localized URLs, and structured data.
import fsSync from "node:fs";
import path from "node:path";
import missingPages from "../src/_data/missingPages.js";
import { resolveMedia } from "./media.mjs";

function toDateKey(value = "") {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
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

function getPageViewCount(entry, pageViews = {}) {
  if (!entry || !entry.data) return 0;
  const pages = pageViews?.pages && typeof pageViews.pages === "object" ? pageViews.pages : {};
  const candidates = [
    entry.url,
    `/${entry.data.lang || ""}/notes/${entry.data.slug || ""}/`
  ]
    .map(normalizeSitePath)
    .filter(Boolean);

  for (const key of candidates) {
    const value = pages[key];
    const count = Number(value || 0);
    if (Number.isFinite(count) && count > 0) {
      return count;
    }
  }
  return 0;
}

export function registerFilters(eleventyConfig) {
  const TAG_CHANNELS = ["tags", "noteTags"];

  const normalizeTagList = (value) => {
    const values = Array.isArray(value) ? value : [value];
    return [
      ...new Set(
        values
          .filter(Boolean)
          .map((tag) => String(tag).trim().toLowerCase())
          .filter(Boolean)
      )
    ];
  };

  const tagChannelsFor = (data = {}) =>
    TAG_CHANNELS.reduce((channels, channel) => {
      channels[channel] = normalizeTagList(data[channel]);
      return channels;
    }, {});

  const relatedKeysFor = (data = {}) => {
    const channels = tagChannelsFor(data);

    if (data.section === "ai-capabilities" && data.slug) {
      channels.tags = normalizeTagList([...channels.tags, data.slug]);
    }

    return channels;
  };

  const countSharedTags = (left = [], right = []) => left.filter((tag) => right.includes(tag)).length;

  const relatedScoreFor = (currentKeys, entryKeys, sameSection) => {
    const matchScore = TAG_CHANNELS.reduce(
      (score, channel) => score + (countSharedTags(currentKeys[channel], entryKeys[channel]) * 100),
      0
    );

    if (matchScore > 0) {
      return matchScore + (sameSection ? 20 : 0);
    }

    return 0;
  };

  const relatedEntryFor = (entry) => ({
    url: entry.url,
    title: entry.data.title,
    summary: entry.data.summary || "",
    hero: entry.data.hero || {}
  });

  eleventyConfig.addFilter("relatedPages", function (collection = [], currentUrl, currentData = {}, limit = 6) {
    if (!Array.isArray(collection)) {
      return [];
    }

    const currentLang = currentData.lang;
    const currentSection = currentData.section;
    const maxResults = Math.max(1, Math.min(Number(limit) || 6, 12));

    if (!currentUrl || !currentSection) {
      return [];
    }

    const currentKeys = relatedKeysFor(currentData);

    return collection
      .filter((entry) => {
        if (!entry || !entry.data) return false;
        if (entry.url === currentUrl) return false;
        if (!entry.data.section) return false;
        if (entry.data.section === "notes" && entry.data.slug === "find") return false;
        if (currentLang && entry.data.lang && entry.data.lang !== currentLang) return false;
        return true;
      })
      .map((entry, index) => {
        const entryKeys = relatedKeysFor(entry.data);
        const sameSection = entry.data.section === currentSection;
        const score = relatedScoreFor(currentKeys, entryKeys, sameSection);

        return {
          entry,
          index,
          score,
          updated: entry.data.updated || entry.data.date || entry.data.created || ""
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.updated !== a.updated) return String(b.updated).localeCompare(String(a.updated));
        return a.index - b.index;
      })
      .slice(0, maxResults)
      .map((item) => relatedEntryFor(item.entry));
  });

  eleventyConfig.addFilter("notesForLang", function (collection = [], currentLang, includeFinder = false, pageViews = {}) {
    if (!Array.isArray(collection)) {
      return [];
    }

    return collection
      .filter((entry) => {
        if (!entry || !entry.data) return false;
        if (entry.data.section !== "notes") return false;
        if (currentLang && entry.data.lang !== currentLang) return false;
        if (!includeFinder && entry.data.slug === "find") return false;
        return true;
      })
      .map((entry) => ({
        url: entry.url,
        slug: entry.data.slug,
        title: entry.data.title || entry.data.slug,
        summary: entry.data.summary || "",
        noteTags: normalizeTagList(entry.data.noteTags),
        created: toDateKey(entry.data.created),
        updated: toDateKey(entry.data.updated || entry.data.created),
        views: getPageViewCount(entry, pageViews),
        hero: entry.data.hero || {}
      }))
      .sort((a, b) => {
        const updatedCompare = String(b.updated || "").localeCompare(String(a.updated || ""));
        if (updatedCompare !== 0) return updatedCompare;
        return String(a.title || "").localeCompare(String(b.title || ""));
      });
  });

  eleventyConfig.addFilter("notesHaveViews", function (notes = []) {
    if (!Array.isArray(notes)) return false;
    return notes.some((note) => Number(note?.views || 0) > 0);
  });

  eleventyConfig.addFilter("navPrevNext", function (navData, sectionKey, currentId) {
    if (!navData || !currentId) {
      return { prev: null, next: null };
    }

    const sections = navData.sections || [];
    let section = sectionKey
      ? sections.find((entry) => entry.key === sectionKey)
      : null;

    if (!section) {
      const hasId = (pages = []) => pages.some((page) => {
        if (!page) return false;
        if (page.id === currentId) return true;
        if (Array.isArray(page.children) && hasId(page.children)) return true;
        return false;
      });

      section = sections.find((entry) => hasId(entry.pages || [])) || null;
    }

    if (!section || !Array.isArray(section.pages)) {
      return { prev: null, next: null };
    }

    const ordered = [];
    const addPages = (pages = []) => {
      pages.forEach((page) => {
        if (page && page.id && !page.noLink) {
          ordered.push({ id: page.id, title: page.title || page.id });
        }
        if (page && Array.isArray(page.children)) {
          addPages(page.children);
        }
      });
    };

    addPages(section.pages);

    const index = ordered.findIndex((entry) => entry.id === currentId);
    if (index === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: ordered[index - 1] || null,
      next: ordered[index + 1] || null
    };
  });

  eleventyConfig.addFilter("basename", function (value = "") {
    if (typeof value !== "string") return "";
    const segments = value.split("/");
    return segments[segments.length - 1] || "";
  });

  eleventyConfig.addFilter("svgDataUri", function (inputPath = "") {
    if (!inputPath) return "";
    const cleanPath = inputPath.replace(/^[\/]/, "");
    const diskPath = path.join(process.cwd(), cleanPath);
    try {
      const raw = fsSync.readFileSync(diskPath, "utf-8");
      const minified = raw.replace(/\s+/g, " ").trim();
      const encoded = encodeURIComponent(minified)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
      return `url("data:image/svg+xml,${encoded}")`;
    } catch (error) {
      console.warn("svgDataUri failed for", inputPath, error);
      return "";
    }
  });

  eleventyConfig.addFilter("resolveMedia", function (url, options = {}) {
    return resolveMedia(url, options);
  });

  eleventyConfig.addFilter("stripUrlQuery", function (value = "") {
    if (typeof value !== "string") return "";
    return value.split(/[?#]/)[0];
  });

  eleventyConfig.addFilter("urlEncode", function (value = "") {
    return encodeURIComponent(String(value));
  });

  // Frontmatter dates arrive as Date (unquoted YAML) or "YYYY-MM-DD" strings (quoted).
  eleventyConfig.addFilter("isoDate", function (value) {
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10);
    const match = String(value ?? "").match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : "";
  });

  // Swaps the language segment of a localized URL ("/ja/x/y/" -> "/en/x/y/"); "" outside the language tree.
  const localizedPathFor = (url, langCode) => {
    const match = String(url || "").match(/^\/(ja|en|zh)(\/.*)$/);
    return match && langCode ? `/${langCode}${match[2]}` : "";
  };

  // hreflang alternates for a localized URL, limited to translations that were actually built
  // (JA is the source language, so EN/ZH may not exist yet). x-default is the default-language URL.
  // URLs of built pages that are not noindex, cached per collection object.
  const builtUrlSets = new WeakMap();
  const indexableUrls = (collection) => {
    if (!builtUrlSets.has(collection)) {
      const indexable = collection.filter((item) => !String(item.data?.robots || "").includes("noindex"));
      builtUrlSets.set(collection, new Set(indexable.map((item) => item.url)));
    }
    return builtUrlSets.get(collection);
  };
  eleventyConfig.addFilter("hreflangAlternates", function (url = "", languages = [], collection = [], defaultLang = "") {
    const built = indexableUrls(collection);
    const alternates = [];
    for (const { code } of languages) {
      const href = localizedPathFor(url, code);
      if (href && built.has(href)) alternates.push({ hreflang: code, href });
    }
    const defaultHref = localizedPathFor(url, defaultLang);
    if (alternates.length > 1 && built.has(defaultHref)) alternates.push({ hreflang: "x-default", href: defaultHref });
    return alternates.length > 1 ? alternates : [];
  });

  // Every built page URL (noindex included), for navigation that must reach pages search engines skip.
  // Paginated "coming soon" placeholders only surface their first page in collections, so their URLs
  // are added from the same data that generates them.
  const builtUrlLists = new WeakMap();
  const allBuiltUrls = (collection) => {
    if (!builtUrlLists.has(collection)) {
      const urls = new Set(collection.map((item) => item.url));
      missingPages().forEach((stub) => urls.add(`/${stub.lang}/${stub.section}/${stub.id}/`));
      builtUrlLists.set(collection, urls);
    }
    return builtUrlLists.get(collection);
  };

  // Language-menu (and logo) target for the current page: the same page in `langCode` when it was
  // built; otherwise that language's home, or its guide page while that home does not exist yet.
  eleventyConfig.addFilter("langSwitchTarget", function (url = "", langCode = "", collection = []) {
    const built = allBuiltUrls(collection);
    const target = localizedPathFor(url, langCode);
    if (target && built.has(target)) return target;
    if (built.has(`/${langCode}/`)) return `/${langCode}/`;
    return `/${langCode}/begin-with/how-to-use-this-site/`;
  });

  // The newest `limit` rows of a language's news page, reused on the language home.
  // Rows are copied verbatim, so each news row must stay a flat <a class="news-row">…</a> block.
  eleventyConfig.addFilter("newsRows", function (lang = "ja", limit = 5) {
    const newsPath = path.join(process.cwd(), "src", "content", lang, "news.md");
    if (!fsSync.existsSync(newsPath)) return "";
    const rows = fsSync.readFileSync(newsPath, "utf-8").match(/<a class="news-row"[\s\S]*?<\/a>/g) || [];
    return rows.slice(0, limit).join("\n");
  });

  // Look up a built page by its URL (for cards that point at articles).
  eleventyConfig.addFilter("pageByUrl", function (collection = [], url = "") {
    const entry = collection.find((item) => item.url === url);
    return entry ? { url: entry.url, title: entry.data.title, hero: entry.data.hero || {} } : null;
  });

  // URLs of the models the home page recommends (`picks`) for one language; the sidebar marks them.
  eleventyConfig.addFilter("homePickUrls", function (collection = [], lang = "") {
    const home = collection.find((item) => item.url === `/${lang}/`);
    const groups = home?.data?.picks?.groups || [];
    return groups.flatMap((group) => (group.items || []).map((item) => item.page));
  });

  // schema.org graph for a page: WebSite + WebPage, plus Article and its Person author for articles.
  eleventyConfig.addFilter("pageStructuredData", function (input = {}) {
    const { siteUrl, canonicalUrl, lang, siteName, title, description, article, author } = input;
    const websiteId = `${siteUrl}/#website`;
    const webpageId = `${canonicalUrl}#webpage`;
    const graph = [
      { "@type": "WebSite", "@id": websiteId, url: `${siteUrl}/`, name: siteName, inLanguage: lang },
      { "@type": "WebPage", "@id": webpageId, url: canonicalUrl, name: title, ...(description ? { description } : {}), inLanguage: lang, isPartOf: { "@id": websiteId } }
    ];
    if (article && author?.name) {
      const authorId = `${siteUrl}/#author`;
      graph.push({
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: title,
        ...(description ? { description } : {}),
        inLanguage: lang,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        ...(article.image ? { image: [article.image] } : {}),
        author: { "@id": authorId },
        publisher: { "@id": authorId },
        mainEntityOfPage: { "@id": webpageId },
        isPartOf: { "@id": websiteId }
      });
      graph.push({
        "@type": "Person",
        "@id": authorId,
        name: author.name,
        ...(author.url ? { url: author.url } : {}),
        ...(author.sameAs?.length ? { sameAs: author.sameAs } : {})
      });
    }
    return { "@context": "https://schema.org", "@graph": graph };
  });

  eleventyConfig.addFilter("jsonLd", function (value = {}) {
    return JSON.stringify(value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");
  });
}
