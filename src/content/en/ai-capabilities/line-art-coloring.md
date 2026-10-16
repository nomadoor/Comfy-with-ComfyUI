---
layout: page.njk
lang: en
section: ai-capabilities
slug: line-art-coloring
navId: line-art-coloring
title: Line Art Coloring
created: 2025-12-01
updated: 2026-03-02
summary: Coloring line art with AI
seoTitle: "Color Line Art with AI: ControlNet and Image Editing"
seoDescription: "Color your own line art with AI: ControlNet coloring, instruction-based image editing, and reference coloring with line art plus a color image."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is Line Art Coloring?

It's the task of adding color to line art.

If you can already draw your own line art, "how do I get AI to color *my* line art?" often matters more than text2image from scratch.

---

## Line Art Coloring with ControlNet

With ControlNet Canny (edge), you can add color while keeping the input line art mostly intact.

![](/media/ai-capabilities/line-art-coloring/legacy_gyazo_7e1ed10e17831b224bc547a8d6b3deea.png){media=image}

[](/workflows/ai-capabilities/line-art-coloring/flux_controlnet_union.json)

Pass the line art (or an edge-detection result) to ControlNet, and describe the clothes, colors, and mood in the text prompt.

---

## Line Art Coloring with Instruction-Based Image Editing

You can also hand line art straight to an [instruction-based image editing](/en/ai-capabilities/instruction-based-image-editing/) model and have it do the coloring.

![](/media/ai-capabilities/line-art-coloring/qwen_image_edit_2509.png){media=image}

[](/workflows/ai-capabilities/line-art-coloring/qwen_image_edit_2509.json)

Just use the line art as the input image and give a text instruction like "color this line art in full color" or "color it in anime cel shading."

---

## Reference-Based Coloring (Line Art + Color Image)

When you want to "color this line art with the same palette as this character" or "borrow the colors from this illustration," you can use reference-based coloring.

ControlNet (lineart / anime, etc.) locks in the shape and composition of the line art, while a reference image adapter like IP-Adapter takes a color illustration or photo and pulls the palette, texture, and art style toward it.

Some instruction-based image editing models that support multiple references also let you ask for things like "color the line art in image 1 using image 2 as reference."

---

## Aside

Real artists work in a few more stages, like "base colors → shading → finishing."

And this goes beyond coloring: AI is good at producing a finished piece in one go, but not so good at building up a picture gradually the way humans do.

I'm Japanese, so I'm a little biased, but this kind of research and development is very active in Japan, from commercial services like [Copainter](https://www.copainter.ai/ja) to community LoRAs.
