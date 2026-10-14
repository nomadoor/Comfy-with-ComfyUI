// The Markdown library: markdown-it plus the site's rules. Rules added with
// `core.ruler.after("inline", …)` run in reverse order of registration, so the order of the
// calls in createMarkdown() is part of the behavior: keep it.
import MarkdownIt from "markdown-it";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";
import { getPreviewDimensions, renderVideoFigure, resolveMedia } from "./media.mjs";
import { escapeHTML } from "./site.mjs";
import { extractInlineJsonLink, renderJsonLinkRow } from "./workflow-json.mjs";

loadLanguages(["bash", "shell", "json", "yaml", "javascript", "typescript", "css", "markup", "powershell", "python"]);

function enhanceStandaloneImages(markdownLib) {
  markdownLib.core.ruler.after("inline", "mark-standalone-images", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      const open = tokens[i];
      const inlineToken = tokens[i + 1];
      const close = tokens[i + 2];
      if (
        open.type !== "paragraph_open" ||
        inlineToken.type !== "inline" ||
        close.type !== "paragraph_close" ||
        !inlineToken.children
      ) {
        continue;
      }

      const meaningfulChildren = inlineToken.children.filter((child) => {
        if (child.type === "text") {
          return child.content.trim().length > 0;
        }
        return child.type !== "softbreak" && child.type !== "hardbreak";
      });

      if (meaningfulChildren.length === 1 && meaningfulChildren[0].type === "image") {
        const imageToken = meaningfulChildren[0];
        imageToken.meta = imageToken.meta || {};
        imageToken.meta.isStandalone = true;
        open.meta = { ...(open.meta || {}), wrapsStandaloneImage: true };
        close.meta = { ...(close.meta || {}), wrapsStandaloneImage: true };
      }
    }
  });

  const defaultParagraphOpen =
    markdownLib.renderer.rules.paragraph_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownLib.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
    if (tokens[idx]?.meta?.wrapsStandaloneImage) {
      return "";
    }
    return defaultParagraphOpen(tokens, idx, options, env, self);
  };

  const defaultParagraphClose =
    markdownLib.renderer.rules.paragraph_close ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownLib.renderer.rules.paragraph_close = function (tokens, idx, options, env, self) {
    if (tokens[idx]?.meta?.wrapsStandaloneImage) {
      return "";
    }
    return defaultParagraphClose(tokens, idx, options, env, self);
  };
}

function preserveManualNumberedBullets(markdownLib) {
  const findParentListOpen = (tokens, index, itemLevel) => {
    for (let cursor = index - 1; cursor >= 0; cursor--) {
      const token = tokens[cursor];
      if (token.level === itemLevel - 1 && token.nesting === 1 && token.type.endsWith("_list_open")) {
        return token;
      }
    }
    return null;
  };

  markdownLib.core.ruler.after("block", "preserve-manual-numbered-bullets", (state) => {
    const tokens = state.tokens;
    for (let i = tokens.length - 8; i >= 0; i--) {
      const bulletItemOpen = tokens[i];
      const outerListOpen = findParentListOpen(tokens, i, bulletItemOpen?.level);
      const orderedListOpen = tokens[i + 1];
      const orderedItemOpen = tokens[i + 2];
      const paragraphOpen = tokens[i + 3];
      const inlineToken = tokens[i + 4];
      const paragraphClose = tokens[i + 5];
      const orderedItemClose = tokens[i + 6];
      const orderedListClose = tokens[i + 7];

      if (
        outerListOpen?.type !== "bullet_list_open" ||
        bulletItemOpen?.type !== "list_item_open" ||
        orderedListOpen?.type !== "ordered_list_open" ||
        orderedItemOpen?.type !== "list_item_open" ||
        paragraphOpen?.type !== "paragraph_open" ||
        inlineToken?.type !== "inline" ||
        paragraphClose?.type !== "paragraph_close" ||
        orderedItemClose?.type !== "list_item_close" ||
        orderedListClose?.type !== "ordered_list_close" ||
        orderedListOpen.level !== bulletItemOpen.level + 1 ||
        orderedItemOpen.level !== orderedListOpen.level + 1
      ) {
        continue;
      }

      const startAttr = orderedListOpen.attrGet("start");
      const parsedNumber = startAttr == null ? 1 : Number(startAttr);
      const number = Number.isFinite(parsedNumber) ? parsedNumber : 1;
      paragraphOpen.level = bulletItemOpen.level + 1;
      inlineToken.level = paragraphOpen.level + 1;
      paragraphClose.level = paragraphOpen.level;
      const manualNumberPrefix = `${number}. `;
      if (Array.isArray(inlineToken.children)) {
        const firstTextChild = inlineToken.children[0]?.type === "text" ? inlineToken.children[0] : null;
        if (firstTextChild) {
          firstTextChild.content = `${manualNumberPrefix}${firstTextChild.content}`;
        } else {
          const numberTextToken = new inlineToken.constructor("text", "", 0);
          numberTextToken.content = manualNumberPrefix;
          numberTextToken.level = inlineToken.level + 1;
          inlineToken.children.unshift(numberTextToken);
        }
      } else {
        inlineToken.content = `${manualNumberPrefix}${inlineToken.content}`;
      }
      tokens.splice(i + 1, 7, paragraphOpen, inlineToken, paragraphClose);
    }
  });
}

function enhanceJsonLinks(markdownLib) {
  markdownLib.core.ruler.after("inline", "convert-json-links", (state) => {
    state.env = state.env || {};
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      const open = tokens[i];
      const inlineToken = tokens[i + 1];
      const close = tokens[i + 2];
      if (
        !open ||
        !inlineToken ||
        !close ||
        open.type !== "paragraph_open" ||
        inlineToken.type !== "inline" ||
        close.type !== "paragraph_close"
      ) {
        continue;
      }
      const linkInfo = extractInlineJsonLink(inlineToken.children || []);
      if (!linkInfo) continue;
      const html = renderJsonLinkRow(linkInfo, state.env);
      if (!html) continue;
      const htmlToken = new state.Token("html_block", "", 0);
      htmlToken.block = true;
      htmlToken.content = `${html}\n`;
      tokens.splice(i, 3, htmlToken);
      i--;
    }
  });
}

export function createMarkdown() {
  const markdownLib = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false
  });

  markdownLib.set({
    highlight: function (str, lang) {
      const language = lang && Prism.languages[lang];
      if (language) {
        const highlighted = Prism.highlight(str, language, lang);
        return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
      }
      return `<pre class="language-text"><code class="language-text">${escapeHTML(str)}</code></pre>`;
    }
  });

  // --- Media Markdown helper -------------------------------------------------
  function parseBraceAttrs(text = "") {
    const match = text.trim().match(/^\{([^}]*)\}$/);
    if (!match) return null;
    const body = match[1];
    const attrs = {};
    body.split(/\s+/).forEach((chunk) => {
      if (!chunk) return;
      const [k, v] = chunk.split("=");
      if (k) {
        attrs[k] = v || "";
      }
    });
    return Object.keys(attrs).length ? attrs : null;
  }


  // Every item in a media row is drawn at the same height, so a row never has to be evened out after
  // its media arrives. The shared height is the smallest of the items' own heights (capped at
  // MEDIA_ROW_MAX_HEIGHT), which keeps every aspect ratio intact: nothing is stretched or cropped to
  // match a neighbour, the row just ends up as tall as its shortest member.
  const MEDIA_ROW_MAX_HEIGHT = 320;
  
  function rowHeightFor(images) {
    const heights = images.map((token) => {
      const media = resolveMedia(token.attrGet("src") || "", { mode: token.meta?.mediaMode, size: 1200 });
      if (media.kind === "video") return media.height > 0 ? media.height : MEDIA_ROW_MAX_HEIGHT;
      const { height } = getPreviewDimensions(media, 1200);
      return height > 0 ? height : MEDIA_ROW_MAX_HEIGHT;
    });
    return Math.min(MEDIA_ROW_MAX_HEIGHT, ...heights);
  }

  function renderMarkdownMedia(token) {
    const alt = escapeHTML(token.content || token.attrGet("alt") || "");
    const media = resolveMedia(token.attrGet("src") || "", { mode: token.meta.mediaMode, size: 1200 });
    if (media.kind === "video") {
      return renderVideoFigure(media, { caption: alt });
    }
    // Display box is fitted to 1200px on the longest side regardless of the media source.
    const { width, height } = getPreviewDimensions(media, 1200);
    const figureStyle = `--article-media-width:${width}px; --article-media-height:${height}px; --article-media-aspect:${width} / ${height};`;
    const caption = alt ? `<figcaption>${alt}</figcaption>` : "";
    return `<figure class="article-media" style="${figureStyle}"><div class="article-media__frame"><img src="${escapeHTML(media.src)}" data-full-src="${escapeHTML(media.fullSrc)}" alt="${alt}" loading="lazy" decoding="async" width="${width}" height="${height}" /></div>${caption}</figure>`;
  }

  // Detect `{media=...}` (or the compatible `{gyazo=...}`) right after an image and mark the token.
  markdownLib.core.ruler.after("inline", "media_attrs", function (state) {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 1; i++) {
      const tok = tokens[i];
      if (tok.type === "inline" && tok.children) {
        const children = tok.children;
        for (let j = 0; j < children.length - 1; j++) {
          const img = children[j];
          const txt = children[j + 1];
          if (img.type === "image" && txt && txt.type === "text") {
            const attrs = parseBraceAttrs(txt.content || "");
            const mediaMode = attrs && (attrs.media || attrs.gyazo);
            if (mediaMode) {
              img.meta = img.meta || {};
              img.meta.mediaMode = String(mediaMode).toLowerCase();
              // remove the brace text token
              children.splice(j + 1, 1);
            }
          }
        }
      }
    }
  });

  // Rewrap paragraphs that contain only attributed media into a media row.
  markdownLib.core.ruler.after("media_attrs", "media_row", function (state) {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      if (tokens[i].type !== "paragraph_open") continue;
      const inline = tokens[i + 1];
      const close = tokens[i + 2];
      if (!inline || inline.type !== "inline" || close.type !== "paragraph_close") continue;
      const children = inline.children || [];
      if (!children.length) continue;
      const onlyMedia = children.every((c) => (c.type === "image" && c.meta?.mediaMode) || (c.type === "text" && !c.content.trim()));
      if (!onlyMedia) continue;
      tokens[i].type = "media_row_open";
      tokens[i].tag = "div";
      tokens[i].attrSet("class", "article-media-row");
      tokens[i].attrSet("style", `--article-row-height:${rowHeightFor(children.filter((c) => c.type === "image"))}px`);
      tokens[i + 2].type = "media_row_close";
      tokens[i + 2].tag = "div";
    }
  });

  markdownLib.renderer.rules.media_row_open = (tokens, idx) =>
    `<div class="${tokens[idx].attrGet("class")}" style="${tokens[idx].attrGet("style")}">`;
  markdownLib.renderer.rules.media_row_close = () => `</div>`;

  const defaultImageRenderer = markdownLib.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLib.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    if (token.meta?.mediaMode) {
      return renderMarkdownMedia(token);
    }
    const src = token.attrGet("src");
    if (src) {
      const media = resolveMedia(src, { mode: "image", size: 1000 });
      token.attrSet("src", media.src);
      if (!token.attrGet("loading")) {
        token.attrSet("loading", "lazy");
      }
      if (!token.attrGet("decoding")) {
        token.attrSet("decoding", "async");
      }
      token.attrSet("data-full-src", media.fullSrc);
      if (media.srcset) {
        token.attrSet("srcset", media.srcset);
        if (!token.attrGet("sizes")) {
          token.attrSet("sizes", "(min-width: 768px) 720px, 100vw");
        }
      }
      if (media.width && media.height) {
        token.attrSet("width", String(media.width));
        token.attrSet("height", String(media.height));
      }
    }
    if (token.meta?.isStandalone) {
      token.attrJoin("class", "article-media__image");
    }
    const renderedImage = defaultImageRenderer(tokens, idx, options, env, self);
    if (!token.meta?.isStandalone) {
      return renderedImage;
    }
    const widthAttr = Number(token.attrGet("width"));
    const heightAttr = Number(token.attrGet("height"));
    const hasDimensions =
      Number.isFinite(widthAttr) && Number.isFinite(heightAttr) && widthAttr > 0 && heightAttr > 0;
    const styleChunks = [];

    if (hasDimensions) {
      const ratioValue = widthAttr / heightAttr;
      const limitedHeight = Math.min(heightAttr, 320);
      styleChunks.push(`--article-media-aspect:${widthAttr} / ${heightAttr}`);
      styleChunks.push(`--article-media-height:${limitedHeight}px`);
      const constrainedWidth = Math.min(widthAttr, Math.round(ratioValue * limitedHeight));
      styleChunks.push(`--article-media-width:${constrainedWidth}px`);
    } else {
      styleChunks.push(`--article-media-height:320px`);
    }

    const styleAttr = styleChunks.length ? ` style="${styleChunks.join("; ")}"` : "";
    return `<figure class="article-media"${styleAttr}><div class="article-media__frame">${renderedImage}</div></figure>`;
  };


  enhanceStandaloneImages(markdownLib);
  preserveManualNumberedBullets(markdownLib);
  enhanceJsonLinks(markdownLib);

  // Emoji ignore the text colour; wrap them so dark mode can dim them like article images. Only
  // colour emoji: pictographs from U+1F000 up, or older symbols with the emoji selector (U+FE0F);
  // plain text symbols such as "↔" stay text.
  const EMOJI = /(?:[\u{1F000}-\u{1FFFF}]|\p{Extended_Pictographic}\uFE0F)\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*/gu;
  const renderText = markdownLib.renderer.rules.text;
  markdownLib.renderer.rules.text = (tokens, idx, options, env, self) =>
    renderText(tokens, idx, options, env, self).replace(EMOJI, (emoji) => `<span class="emoji">${emoji}</span>`);

  // GitHub-style callouts: a blockquote whose first line is `[!NOTE]`, `[!TIP]` or `[!WARNING]`
  // (IMPORTANT / CAUTION count as WARNING). A blockquote without a marker stays a plain quote.
  const CALLOUT = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\][ \t]*(?:\n|$)/i;
  markdownLib.core.ruler.after("inline", "callouts", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length - 2; i++) {
      if (tokens[i].type !== "blockquote_open" || tokens[i + 1].type !== "paragraph_open") continue;
      const inline = tokens[i + 2];
      const match = inline.type === "inline" && inline.content.match(CALLOUT);
      if (!match) continue;
      const kind = { NOTE: "note", TIP: "tip" }[match[1].toUpperCase()] || "warning";
      tokens[i].attrJoin("class", `callout callout--${kind}`);
      inline.content = inline.content.slice(match[0].length);
      // Drop the marker text and the line break after it from the parsed inline children.
      const children = inline.children || [];
      if (children[0]?.type === "text") children[0].content = children[0].content.replace(/^\[![A-Za-z]+\][ \t]*/, "");
      while (children.length && ((children[0].type === "text" && !children[0].content) || children[0].type === "softbreak" || children[0].type === "hardbreak")) children.shift();
      // A marker on its own line followed by a blank line leaves an empty paragraph behind.
      if (!children.length) tokens.splice(i + 1, 3);
    }
  });

  // Plain links to managed media (`[clip.mp4](/media/...)`) point at the published R2 file, like embeds do.
  markdownLib.core.ruler.after("inline", "resolve-media-links", (state) => {
    state.tokens.forEach((blockToken) => {
      (blockToken.children || []).forEach((token) => {
        if (token.type !== "link_open") return;
        const href = token.attrGet("href") || "";
        if (!href.startsWith("/media/")) return;
        const media = resolveMedia(href);
        const resolved = media.fullSrc || media.src;
        if (resolved) token.attrSet("href", resolved);
      });
    });
  });

  return markdownLib;
}
