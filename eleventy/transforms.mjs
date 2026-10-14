// Output transforms on rendered HTML pages.
import { groupMediaSteps } from "../scripts/lib/media-steps.mjs";
import navData from "../src/_data/nav.js";
import { DEFAULT_LANG, escapeHTML } from "./site.mjs";

export function registerTransforms(eleventyConfig) {
  // News rows are authored with an internal section key (`<span class="news-row__tag">notes</span>`).
  // Show the reader-facing section name from the nav instead, next to the date. `faq` is the old name
  // of Notes; `none` and unknown keys show no section.
  const newsSectionLabel = (lang, key) => {
    const sectionKey = key === "faq" ? "notes" : key;
    const section = (navData[lang] || navData[DEFAULT_LANG])?.sections?.find((item) => item.key === sectionKey);
    return section ? String(section.label).replace(/^[^\p{L}\p{N}]+/u, "").trim() : "";
  };
  // Adjacent media steps (see the mediaRow shortcode) become step cards.
  eleventyConfig.addTransform("media-steps", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const section = (this.page.url || "").split("/")[2];
    return groupMediaSteps(content, { section });
  });

  eleventyConfig.addTransform("news-section-labels", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html") || !content.includes("news-row__tag")) return content;
    const lang = (this.page.url || "").split("/")[1] || DEFAULT_LANG;
    return content.replace(/<span class="news-row__tag">([^<]*)<\/span>/g, (match, key) => {
      const label = newsSectionLabel(lang, key.trim());
      // Keep an empty cell when there is no section so the title stays in its column.
      const sectionKey = key.trim() === "faq" ? "notes" : key.trim();
      return label
        ? `<span class="news-row__section" data-section="${escapeHTML(sectionKey)}">${escapeHTML(label)}</span>`
        : `<span class="news-row__section" aria-hidden="true"></span>`;
    });
  });
}
