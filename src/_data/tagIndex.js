import nav from "./nav.js";

function register(entryMap, lang, sectionKey, page) {
  if (!page || !page.id) return;
  if (!entryMap[lang]) entryMap[lang] = {};
  entryMap[lang][page.id] = {
    section: sectionKey,
    title: page.title || page.id
  };
  if (page.children) {
    page.children.forEach((child) => register(entryMap, lang, sectionKey, child));
  }
}

const tagIndex = {};
for (const [lang, data] of Object.entries(nav)) {
  (data.sections || []).forEach((section) => {
    (section.pages || []).forEach((page) => register(tagIndex, lang, section.key, page));
  });
}

export default tagIndex;
