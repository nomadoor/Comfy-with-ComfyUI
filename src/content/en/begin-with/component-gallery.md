---
layout: page.njk
lang: en
section: begin-with
slug: component-gallery
navId: component-gallery
title: "Component Gallery"
summary: "Reference layout that exercises common markdown components."
tags:
  - component-gallery
  - begin-with
  - docs
  - ui
  - design
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
---

## Tables

| Step | Description | Notes |
| ---- | ----------- | ----- |
| 01 | Capture a Gyazo still or video. | Keep the 720px width guideline in mind. |
| 02 | Upload to the docs repo. | Use the `imageVariant` helper for responsive previews. |
| 03 | Reference it in markdown with a clear caption. | Accessibility text is mandatory. |

## Code Blocks

```js
async function loadWorkflow(id) {
  const response = await fetch(`/workflows/${id}.json`);
  if (!response.ok) throw new Error("Workflow fetch failed");
  return response.json();
}
```

Inline `code` snippets inherit the same palette but compress into a pill so the reading rhythm stays intact.

## Blockquotes

> “Small, clear, safe steps” applies to prose, too. Keep guidance scoped to a single action so users can copy it in their own workflows.

## Gyazo Image

![Conditioning reference](https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg)

## Image Rows

Sometimes we need to present multiple screenshots side-by-side. Wrap standalone images with `.article-media-row` to keep gutters consistent regardless of orientation.

<div class="article-media-row">
  <figure class="article-media" style="--article-media-width:225px; --article-media-height:300px; --article-media-aspect:1108 / 1477;">
    <div class="article-media__frame">
      <img src="https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg" alt="Rolled cat" loading="lazy" decoding="async" />
    </div>
  </figure>
  <figure class="article-media" style="--article-media-width:300px; --article-media-height:300px; --article-media-aspect:1212 / 1352;">
    <div class="article-media__frame">
      <img src="https://i.gyazo.com/075ff7bc7a36635d40662b163b5a9cfe.jpg" alt="Fluffy creature" loading="lazy" decoding="async" />
    </div>
  </figure>
</div>

## Gyazo Video (Loop)

{% gyazoVideoLoop "https://gyazo.com/d32149b1fc31363100fbc9f009b41add", "Looping Gyazo demo clip for animation recipes." %}

## Gyazo Video (Player)

{% gyazoVideoPlayer "https://gyazo.com/d32149b1fc31363100fbc9f009b41add", "Player with controls + seek bar." %}

Use the `gyazoVideoLoop` shortcode for silent loops (muted/autoplay), and `gyazoVideoPlayer` when the author wants the official Gyazo controls, seek bar, and pause/resume behavior.

## Table + Code Combo

| Token | Default | Usage |
| ----- | ------- | ----- |
| `--color-panel` | `#111111` | Article chrome, callouts. |
| `--color-panel-alt` | `#1a1a1a` | Highlight rows, tables, code backgrounds. |

```bash
uvx playwright test component-gallery.spec.ts --headed
```
