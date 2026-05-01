---
layout: page.njk
lang: en
section: data-utilities
slug: data-types
navId: data-types
title: "Data Types"
created: 2025-11-25
updated: 2026-03-02
summary: "About main data types handled in ComfyUI"

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is a Type?

It refers to **"Type of Data"**.

"Image data" for images, "text data" for text, "numerical data" for numbers, and so on.

It is important for programming studies, but in ComfyUI, since it is designed to **"connect only where it connects"**, you honestly don't need to think that deeply.

Therefore, mistakes in the data type to connect almost never cause errors, but since it is not zero, let's lightly know the concept of this "type".

---

## Basic Data Types

If you study the mechanism of image generation AI, you will naturally understand. You don't need to try hard to memorize here.

![](https://gyazo.com/6cc70d5d04c3daec2682adf3bc41c77f){gyazo=image}

- MODEL
- CLIP (Conditioning)
- VAE (Latent Space)
- CONDITIONING
- LATENT (Latent Space)
- IMAGE
- MASK

### Primitive (Basic) Data Types

Numbers and characters themselves.

- **INT** (Integer)
  - Integers like `1`, `20`, `1024`.
- **FLOAT** (Floating point number)
  - Decimals like `1.5`, `0.75`.
- **STRING** (Text)
  - Character strings. Prompt input fields etc. correspond to this.

---

## Uniquely Defined Types

Since ComfyUI has high extensibility, unique "types" may be added depending on the custom node.

![](https://gyazo.com/d5368ee02f84395613526515c34c458d){gyazo=image}

For example, in the famous **Impact Pack**, a unique type called `SEGS` appears.

This is a collection of several data, but even so, these also connect only where they connect.

If you get lost, just try pulling the wire. **If it connects, it's OK!**

---

## Preview as Text Node

Node to preview arbitrary data as text.

![](https://gyazo.com/423eaa0eac26fefe67f5d212a1ab2ad1){gyazo=image}

[](/workflows/begin-with/data-types/Preview_as_Text.json)


As debugging, there are many opportunities to display numbers and text.

I don't know if you will use it, but you can also check images and latent representations as text.
