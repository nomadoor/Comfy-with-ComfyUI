---
layout: page.njk
lang: en
section: data-utilities
slug: data-types
navId: data-types
title: "Data Types"
summary: "About the main data types handled in ComfyUI"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What are Types?

It refers to the "kind of data".

For images, it's "image data", for text, it's "text data", and for numbers, it's "numerical data".

It is important in programming studies, but in ComfyUI, since "things only connect where they can connect", you honestly don't need to think about it that deeply.

Therefore, it is rare to get an error because you connected the wrong data type, but it is not zero, so let's lightly understand the concept of this "type".

---

## Basic Data Types

If you study the mechanism of image generation AI, you will naturally understand it.

![](https://gyazo.com/6cc70d5d04c3daec2682adf3bc41c77f){gyazo=image}

- MODEL
- CLIP (Conditioning)
- VAE (Latent Space)
- CONDITIONING
- LATENT (Latent Space)
- IMAGE
- MASK

### Primitive (Basic) Data Types

These are numbers and characters themselves.

- **INT** (Integer)
  - Integers such as `1`, `20`, `1024`.
- **FLOAT** (Floating Point Number)
  - Decimals such as `1.5`, `0.75`.
- **STRING** (Text)
  - Character strings. Prompt input fields fall into this category.

---

## Custom Defined Types

Since ComfyUI is highly extensible, custom nodes may add their own "types".

![](https://gyazo.com/d5368ee02f84395613526515c34c458d){gyazo=image}

For example, in the famous **Impact Pack**, a unique type called `SEGS` appears.

This is a collection of several data, but even so, these also only connect where they can connect.

If you get lost, just try pulling the wire. **If it connects, it's good!**


## Preview as Text Node

This is a node for previewing arbitrary data as text.

![](https://gyazo.com/423eaa0eac26fefe67f5d212a1ab2ad1){gyazo=image}

[](/workflows/begin-with/data-types/Preview_as_Text.json)


As debugging, there are many opportunities to display numbers and text.

I don't know if you will use it, but you can also check images and latent representations as text.
