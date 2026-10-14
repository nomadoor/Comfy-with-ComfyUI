// Paired and single shortcodes used in articles (outputs trays, the Runpod card, media steps,
// Markdown inside Nunjucks pages).
import { renderMediaStep } from "../scripts/lib/media-steps.mjs";
import { listProfileIds as listRunpodProfiles, readProfileSource as readRunpodProfile } from "../runpod/tools/profiles.mjs";
import { normalizeMediaMode, renderVideoFigure, resolveMedia } from "./media.mjs";
import { DEFAULT_LANG, escapeHTML, iconSvg, siteData } from "./site.mjs";

export function registerShortcodes(eleventyConfig, markdownLib) {
  // Media trays with a small labelled header. `{% outputs %}` holds output examples under a workflow;
  // `{% outputs "samples" %}` holds input images readers can use with the article's workflows.
  // Usage (in Markdown): {% outputs %} ![](...){media=loop} ![](...){media=loop} {% endoutputs %}
  const OUTPUTS_KINDS = {
    outputs: { label: "Outputs", icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="icon__fill" stroke="none" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2z"></path><path d="M4.02693 18.329C4.18385 19.277 5.0075 20 6 20H18C19.1046 20 20 19.1046 20 18V14.1901M4.02693 18.329C4.00922 18.222 4 18.1121 4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V14.1901M4.02693 18.329L7.84762 14.5083C8.52765 13.9133 9.52219 13.8482 10.274 14.3494L10.7832 14.6888C11.5078 15.1719 12.4619 15.1305 13.142 14.5865L15.7901 12.4679C16.4651 11.9279 17.4053 11.8856 18.1228 12.3484C18.2023 12.3997 18.2731 12.4632 18.34 12.5302L20 14.1901M11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9Z"></path></svg>' },
    samples: {
      label: "Samples",
      icon: iconSvg('<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>')
    }
  };
  eleventyConfig.addPairedShortcode("outputs", function (content = "", requested = "outputs") {
    const kind = OUTPUTS_KINDS[requested] ? requested : "outputs";
    const tray = OUTPUTS_KINDS[kind];
    // No blank lines inside: the block must stay one HTML block for the Markdown around it.
    const body = markdownLib.render(content, { page: this.page }).trim().replace(/\n\s*\n/g, "\n");
    return `<div class="outputs outputs--${kind}"><div class="outputs__header"><span class="outputs__icon">${tray.icon}</span><span class="outputs__label">${tray.label}</span></div>\n${body}\n</div>`;
  });

  // `{% runpod %}`: a card that deploys this article's Runpod template (one Pod with every workflow,
  // its models and sample images). Reads the profile whose `article` is this page, so the GPU guidance
  // and the template stay in one place (runpod/profiles/<id>.yaml). Kept to one row: it sits near the
  // top of every article that has a profile. The referral, when there is one, is disclosed in a line under the card.
  // The logo is Runpod's cube icon as its brand kit shows it (white cube on the official purple; the
  // kit allows the icon for compact placements and forbids recolouring), so it is not a currentColor icon.
  const RUNPOD_LOGO =
    '<svg class="runpod-launch__logo" viewBox="0 0 256 256" aria-hidden="true"><rect width="256" height="256" rx="48" fill="#5d29f0"></rect>' +
    '<g transform="translate(58 54) scale(0.72)"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M170.04 163.76C180.216 157.899 186.485 147.067 186.485 135.344L186.485 70.656C186.485 58.9334 180.216 48.1013 170.04 42.24L113.887 9.89597C103.71 4.03467 91.1731 4.03468 80.997 9.89598L24.8432 42.24C14.6671 48.1013 8.39844 58.9334 8.39844 70.656L8.39844 135.344C8.39844 147.067 14.6672 157.899 24.8432 163.76L80.997 196.104C91.1731 201.965 103.711 201.965 113.887 196.104L170.04 163.76ZM170.04 135.344C170.04 141.205 166.906 146.621 161.818 149.552L132.428 166.48C129.838 167.972 128.543 168.718 127.48 168.607C126.553 168.51 125.711 168.025 125.163 167.272C124.535 166.41 124.535 164.918 124.535 161.934L124.535 128.078C124.535 122.217 127.669 116.801 132.757 113.87L148.493 104.806C150.654 103.562 151.734 102.939 152.52 102.068C153.214 101.298 153.739 100.39 154.058 99.404C154.42 98.2895 154.418 97.0449 154.413 94.5556L154.412 93.8078C154.405 90.0844 154.402 88.2227 153.616 87.1465C152.931 86.2077 151.879 85.6029 150.721 85.4821C149.393 85.3436 147.777 86.2745 144.545 88.1362L124.535 99.662C114.359 105.523 108.09 116.355 108.09 128.078V177.704C108.09 179.434 107.165 181.031 105.664 181.896C100.576 184.827 94.3074 184.827 89.2194 181.896L33.0656 149.552C27.9776 146.621 24.8432 141.205 24.8432 135.344L24.8432 102.001C24.8432 99.0167 24.8432 97.5248 25.4713 96.6622C26.0192 95.9099 26.8613 95.4249 27.7883 95.3277C28.8511 95.2162 30.1462 95.9621 32.7366 97.454L61.518 114.031C66.6059 116.961 69.7403 122.378 69.7403 128.239L69.7403 145.503C69.7403 147.992 69.7403 149.237 70.1037 150.35C70.4253 151.336 70.9512 152.243 71.6472 153.012C72.4339 153.881 73.5155 154.502 75.6786 155.743L76.3283 156.115C79.5638 157.971 81.1816 158.9 82.5087 158.759C83.6663 158.636 84.7175 158.029 85.4012 157.089C86.1851 156.012 86.1851 154.15 86.1851 150.426L86.1851 128.239C86.1851 116.516 79.9164 105.684 69.7403 99.8227L27.7149 75.6181C25.9379 74.5947 24.8432 72.7031 24.8432 70.656C24.8432 64.7947 27.9775 59.3786 33.0656 56.448L89.2194 24.104C94.3074 21.1733 100.576 21.1733 105.664 24.104L134.734 40.8481C137.325 42.3402 138.62 43.0862 139.055 44.0601C139.434 44.9096 139.434 45.8798 139.055 46.7293C138.62 47.7032 137.325 48.4492 134.734 49.9413L105.21 66.9473C100.121 69.8779 93.8528 69.8779 88.7647 66.9473L72.2226 57.4192C70.576 56.4708 69.7527 55.9965 68.8765 55.8061C68.1011 55.6376 67.2992 55.6309 66.5211 55.7864C65.6419 55.962 64.8107 56.4224 63.1483 57.343L61.0974 58.4789C57.7726 60.3202 56.1103 61.2409 55.5478 62.4623C55.0574 63.5273 55.0471 64.7507 55.5195 65.8238C56.0613 67.0545 57.7079 68.0029 61.0011 69.8997L80.5424 81.1553C90.7184 87.0166 103.256 87.0166 113.432 81.1553L156.327 56.448C158.026 55.4695 160.119 55.4695 161.818 56.448C166.906 59.3786 170.04 64.7947 170.04 70.656V135.344Z"></path></g></svg>';
  const RUNPOD_ARROW = iconSvg('<path d="M7 17L17 7"></path><path d="M8 7h9v9"></path>');
  const RUNPOD_HELP = iconSvg('<circle class="icon__fill" cx="12" cy="12" r="9"></circle><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"></path><path d="M12 17h.01"></path>');
  const runpodSources = () =>
    Object.fromEntries(listRunpodProfiles().map((id) => readRunpodProfile(id)).map((source) => [source.article, source]));
  eleventyConfig.addShortcode("runpod", function () {
    const [, lang = DEFAULT_LANG, section = "", slug = ""] = (this.page.url || "").split("/");
    const source = runpodSources()[`${section}/${slug}`];
    if (!source?.template) throw new Error(`[runpod] no Runpod profile with a template for ${section}/${slug}`);
    const t = (key, vars = {}) =>
      escapeHTML(String(siteData.i18n?.runpod?.[key]?.[lang] ?? siteData.i18n?.runpod?.[key]?.en ?? "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ""));
    const url = new URL(siteData.runpod.deployUrl);
    url.searchParams.set("template", source.template);
    // A profile whose models forbid commercial use sets `referral: false`: no code, no disclosure line.
    const referral = source.referral !== false && siteData.runpod.referral;
    if (referral) url.searchParams.set("ref", referral);
    // Second line: each recommended GPU as its own rounded tag.
    const tag = (text) => `<span class="runpod-launch__tag">${escapeHTML(String(text))}</span>`;
    const recommended = source.gpu?.recommended ?? [];
    const specs = [
      recommended.length ? `<span class="runpod-launch__spec">${t("recLabel")} : ${recommended.map(tag).join("")}</span>` : ""
    ].filter(Boolean).join("");
    const help = t("help");
    return (
      `<div class="runpod-launch-wrap"><div class="runpod-launch">` +
      `<a class="runpod-launch__main" href="${escapeHTML(url.href)}" target="_blank" rel="noopener sponsored" data-no-link-icon>` +
      RUNPOD_LOGO +
      `<span class="runpod-launch__text"><b>${t("title")}</b>${specs ? `<span class="runpod-launch__specs">${specs}</span>` : ""}</span>${RUNPOD_ARROW}</a>` +
      `<a class="runpod-launch__help" href="/${lang}/notes/runpod-card/" aria-label="${help}">${RUNPOD_HELP}<span class="workflow-performance__popup runpod-launch__tip" role="tooltip">${help}</span></a>` +
      `</div>${referral ? `<p class="runpod-launch__ref">${t("referral")}</p>` : ""}</div>`
    );
  });

  // Render a Markdown block inside a Nunjucks page (the language home mixes prose with generated parts).
  eleventyConfig.addPairedShortcode("markdown", function (content = "") {
    return markdownLib.render(content, { page: this.page });
  });

  // Paired shortcode: one media step (image or video with an explanation). Adjacent steps are
  // gathered into a step card by the media-steps transform.
  // Usage (in Markdown):
  // {% mediaRow img="https://... {media=image}", alt="説明" %}
  // 任意のMarkdown（箇条書きなど）
  // {% mediaFooter %}workflow ファイルなど、解説の頭に置くもの{% endmediaFooter %}
  // {% endmediaRow %}
  // `align` and `width` from the old side-by-side layout are accepted and ignored.
  eleventyConfig.addPairedShortcode("mediaFooter", function (content = "") {
    return `@@MEDIA_FOOTER_START@@${content}@@MEDIA_FOOTER_END@@`;
  });

  eleventyConfig.addPairedShortcode("mediaRow", function (content = "", opts = {}) {
    let { img = "", alt = "", gyazo = "", media = "", mode = "" } = opts;
    const safeAlt = String(alt).replace(/"/g, "&quot;");
    const footerRegex = /@@MEDIA_FOOTER_START@@([\s\S]*?)@@MEDIA_FOOTER_END@@/g;
    const footerContent = Array.from(String(content).matchAll(footerRegex), (match) => match[1]).join("\n");
    const bodyContent = String(content).replace(footerRegex, "");

    // Allow braces style in img param: "https://... {media=loop}" (compatible: {gyazo=loop})
    let modeFromBrace = "";
    if (typeof img === "string") {
      const m = img.match(/\{(?:media|gyazo)=([^}]+)\}/i);
      if (m) {
        modeFromBrace = m[1];
        img = img.replace(/\s*\{(?:media|gyazo)=[^}]+\}\s*/i, "");
      }
    }
    const mediaMode = normalizeMediaMode(mode || modeFromBrace || media || gyazo) || "image";

    let mediaMarkup = "";
    if (img) {
      const resolved = resolveMedia(img, { mode: mediaMode, size: 1000 });
      if (resolved.kind === "video") {
        mediaMarkup = renderVideoFigure(resolved, { caption: safeAlt, maxHeight: 360 });
      } else {
        const attrs = [
          `src="${escapeHTML(resolved.src)}"`,
          `alt="${safeAlt}"`,
          `loading="lazy"`,
          `decoding="async"`,
          `data-full-src="${escapeHTML(resolved.fullSrc)}"`
        ];
        if (resolved.srcset) {
          attrs.push(`srcset="${escapeHTML(resolved.srcset)}"`);
          // Step cards show the image in a column beside its text.
          attrs.push(`sizes="(min-width: 900px) 360px, 100vw"`);
        }
        if (resolved.width && resolved.height) {
          attrs.push(`width="${resolved.width}"`);
          attrs.push(`height="${resolved.height}"`);
        }
        mediaMarkup = `<img ${attrs.join(" ")}>`;
      }
    }

    return renderMediaStep({
      media: mediaMarkup,
      files: footerContent.trim() ? markdownLib.render(footerContent) : "",
      body: markdownLib.render(bodyContent)
    });
  });
}
