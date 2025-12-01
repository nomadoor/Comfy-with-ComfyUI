---
layout: page.njk
lang: en
section: ai-capabilities
slug: collage-refine
navId: collage-refine
title: "Refining Rough Collages"
summary: "A technique to finish rough collage images into natural single pictures using instruction-based image editing."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/967bb07db193bdc681c1f5528f99d537.png"
---

## What is Refining Rough Collages?

Refining rough collages is, as the name suggests, a technique where you create a "rough collage image" and pass it to an instruction-based image editing model to finish it into a natural single picture.

By placing objects yourself first and then leaving the finishing touches like "clean it up" or "make it a natural photo" to the model, you can use the power of AI while **keeping the layout initiative on the human side**.

---

## Why "Image Editing" Instead of Subject Transfer?

Flux Kontext, a representative instruction-based image editing model, was originally designed to input "one image + text prompt" and edit it.
In short, there was no function to "look at a reference image and make the same Subject appear in another image" in the first place.

On the other hand, the ability to "edit and redraw input images" is extremely high, and it can do much more complex things than simply changing colors or removing objects.

So I thought:

If I make a rough collage and instruct it to "make it a natural photo" or "make it look seamless as a single picture," **couldn't I handle Subject Transfer as an image editing task?**

In fact, this worked well and is being enjoyed by the community.

---

## Advantages of Refining Rough Collages

Although the latest instruction-based image editing models support multiple image inputs, there are still several advantages to refining rough collages.

![](https://gyazo.com/be997efbbc0c0802513bfab1e8ebe585){gyazo=image}

### Positional Information Can Be Retained As Is

Instead of writing "place image 1 here" in text, you input "an image where image 1 is already placed there," so the model only needs to "arrange it to look natural" assuming that placement.

Instructing layout with text is quite difficult, so this can be said to be a clear strength.

### No Limit on the Number of References

In Subject Transfer methods, there are often constraints on the "number of reference images that can be input" due to architectural reasons. Even if many images can be input, inference time increases.

With rough collages, in extreme cases, you can paste as many objects as fit on the canvas. You can treat all of them as an editing task to "arrange them all together."

---

## About Dedicated LoRAs

To make refining rough collages more stable, several dedicated LoRAs have been developed. I'll introduce them here.

- [Place it Flux Kontext LoRA](https://civitai.com/models/1780962/place-it-flux-kontext-lora)
- [Collage [QwenEdit]](https://civitai.com/models/2024275/collage-qwenedit)
