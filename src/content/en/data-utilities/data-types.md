---
layout: page.njk
lang: en
section: data-utilities
slug: data-types
navId: data-types
title: "Data Types"
created: 2025-11-25
updated: 2026-03-02
summary: "The main data types used in ComfyUI"
seoTitle: "ComfyUI Data Types: IMAGE, LATENT, MASK, and More"
seoDescription: "ComfyUI data types: basics like INT and STRING, ComfyUI types such as IMAGE, LATENT, MASK, and CONDITIONING, and the Preview as Text node."

permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is a Type?

It means **"the kind of data."**

An image is "image data," text is "text data," a number is "numeric data," and so on.

Types matter a lot when you're learning programming, but ComfyUI is built so that **"things only connect where they can connect,"** so honestly, you don't need to think too hard about them.

Because of that, you'll almost never get an error from connecting the wrong data type, but it's not zero either, so let's get a rough idea of what a "type" is.

---

## Basic Data Types

You'll pick these up naturally as you learn how AI image generation works. No need to work hard to memorize them here.

![](/media/data-utilities/data-types/legacy_gyazo_6cc70d5d04c3daec2682adf3bc41c77f.png){media=image}

- MODEL
- CLIP (Conditioning)
- VAE (Latent Space)
- CONDITIONING
- LATENT (Latent Space)
- IMAGE
- MASK

### Primitive (Basic) Data Types

Plain numbers and text.

- **INT** (Integer)
  - Integers like `1`, `20`, `1024`.
- **FLOAT** (Floating point number)
  - Decimals like `1.5`, `0.75`.
- **STRING** (Text)
  - Strings of text. Things like the prompt input box use this type.

---

## Uniquely Defined Types

ComfyUI is highly extensible, so some custom nodes add their own "types."

![](/media/data-utilities/data-types/legacy_gyazo_d5368ee02f84395613526515c34c458d.png){media=image}

For example, the well-known **Impact Pack** uses its own type called `SEGS`.

It bundles several pieces of data together, but even so, it still only connects where it can connect.

When in doubt, just try dragging a wire. **If it connects, you're good!**

---

## Preview as Text Node

A node for previewing any data as text.

![](/media/data-utilities/data-types/legacy_gyazo_423eaa0eac26fefe67f5d212a1ab2ad1.png){media=image}

[](/workflows/begin-with/data-types/preview_as_text.json)


You'll often want to display numbers or text while debugging.

Not sure you'll ever need it, but you can even view images and latents as text.
