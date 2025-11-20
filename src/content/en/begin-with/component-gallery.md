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

## Nested Lists

- Capture inputs
  - Gyazo screenshot
    - Confirm alt text
  - Workflow JSON
- Document the workflow
  - Describe goals
  - Provide download + copy actions

## Gyazo Image

![Conditioning reference](https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg){gyazo=image}

## Image Rows

Sometimes we need to present multiple screenshots side-by-side. Wrap standalone images with `.article-media-row` to keep gutters consistent regardless of orientation.

![Rolled cat](https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg){gyazo=image} ![Fluffy creature](https://i.gyazo.com/075ff7bc7a36635d40662b163b5a9cfe.jpg){gyazo=image}

## Gyazo Video (Loop)

![Looping Gyazo demo clip for animation recipes.](https://gyazo.com/d32149b1fc31363100fbc9f009b41add){gyazo=loop}

## Gyazo Video (Player)

![Player with controls + seek bar.](https://gyazo.com/d32149b1fc31363100fbc9f009b41add){gyazo=player}

Use the `gyazoVideoLoop` shortcode for silent loops (muted/autoplay), and `gyazoVideoPlayer` when the author wants the official Gyazo controls, seek bar, and pause/resume behavior.

## Table + Code Combo

| Token | Default | Usage |
| ----- | ------- | ----- |
| `--color-panel` | `#111111` | Article chrome, callouts. |
| `--color-panel-alt` | `#1a1a1a` | Highlight rows, tables, code backgrounds. |

```bash
uvx playwright test component-gallery.spec.ts --headed
```
