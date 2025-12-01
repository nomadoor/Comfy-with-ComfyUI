---
layout: page.njk
lang: en
section: ai-capabilities
slug: line-art-coloring
navId: line-art-coloring
title: Line Art Coloring
summary: Technology to color line art.
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is Line Art Coloring?

It is the task of adding color to line art.

For those who can already draw line art themselves, "how to make AI color my line art" is often more important than text2image from scratch.

---

## Line Art Coloring with ControlNet

By using ControlNet Canny (edge), you can add color while generally retaining the input line art.

![](https://gyazo.com/7e1ed10e17831b224bc547a8d6b3deea){gyazo=image}

[](/workflows/ai-capabilities/line-art-coloring/Flux_ControlNet-Union.json)

Pass the line art (or edge extraction result) to ControlNet and specify the clothes, colors, and atmosphere with text prompts.

---

## Line Art Coloring with Instruction-Based Image Editing

You can also pass line art directly to [Instruction-Based Image Editing](/en/ai-capabilities/instruction-based-image-editing/) models and have them color it.

![](https://gyazo.com/18b33d684675ffa56b3b805a9f56791a){gyazo=image}

[](/workflows/ai-capabilities/line-art-coloring/Qwen-Image-Edit-2509.json)

Just give the line art to the input image and instruct with text like "color this line art in full color" or "color in anime style."

---

## Reference-Based Coloring (Line Art + Color Image)

If you want to "color this line art with the same color scheme as this character" or "borrow the color usage of this single picture," you can use reference-based coloring.

Fix the shape and composition of the line art with ControlNet (lineart / anime, etc.), and pass a color illustration or photo with a reference image adapter like IP-Adapter to match the color scheme, texture, and art style.

Even with instruction-based image editing models, those that support multi-reference can specify things like "I want you to color the line art of image 1 referring to image 2."

---

## Aside

The actual workflow of a painter involves a few more steps, such as "underpainting → shading → finishing."

Not limited to coloring, AI is good at creating finished products at once, but not very good at drawing pictures gradually like humans.

I'm a bit biased because I'm Japanese, but research and implementation of this kind are quite active in Japan, from commercial services like [Copainter](https://www.copainter.ai/ja) to community LoRAs.
