---
layout: page.njk
lang: en
section: ai-capabilities
slug: virtual-try-on
navId: virtual-try-on
title: Virtual Try-On
created: 2025-12-01
updated: 2026-03-02
summary: The task of swapping just the clothes for a different design or variation.
seoTitle: "AI Virtual Try-On: Swap Clothes in an Image"
seoDescription: "Swap only the clothes in an image: LoRA, catvton-flux, and instruction-based image editing with side-by-side or multi-reference inputs."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is Virtual Try-On?

If ID transfer is "subject transfer specialized for people," then swapping outfits is fair to call **"subject transfer specialized for clothes."**

It's also called **Virtual Try-On (VTON)**.

Especially for product images, **consistency** like this matters:

- Patterns and details stay the same
- The clothes fit the body shape and pose naturally

---

## LoRA

As with anything, the most reliable and flexible approach is to just train a LoRA of the clothes.

Combine it with inpainting and you can change what a specific person is wearing.

---

## catvton-flux

There are plenty of models specialized for VTON tasks (swapping clothes), but here's **catvton-flux** as a representative example.

The basic idea is the same as IC-LoRA / ACE++: it uses a **side-by-side layout**.

![](/media/ai-capabilities/virtual-try-on/legacy_gyazo_e06c4fb2aca261c0d37b792bea9dcc80.png){media=image}

[](/workflows/ai-capabilities/virtual-try-on/catvton_flux_lora.json)

- **Left side**: Person image
- **Right side**: Image of clothes you want them to wear + mask

The model generates an "image of the person on the left wearing the clothes on the right" while looking at both.

---

## Instruction-Based Image Editing (Side-by-Side)

[Instruction-Based Image Editing](/en/ai-capabilities/instruction-based-image-editing/) models that don't support multi-reference can't, by design, do things like "take an element from image A and put it into image B."

But as with IC-LoRA / ACE++, the **side-by-side technique** plus a LoRA trained for it gets you something close.

![](/media/ai-capabilities/virtual-try-on/legacy_gyazo_30a82ecdd7a8cff9483a162decf7c31d.png){media=image}

[](/workflows/ai-capabilities/virtual-try-on/flux_kontext_lora_v0_2.json)

- [nomadoor/crossimage-tryon-fluxkontext](https://huggingface.co/nomadoor/crossimage-tryon-fluxkontext)
- **Left side**: Person image
- **Right side**: Image of clothes you want them to wear + mask

The model generates an "image of the person on the left wearing the clothes on the right" while looking at both.

> [!NOTE]
> I used my own LoRA as the example because I wanted to show it off, but just one day later a far better LoRA for Qwen-Image-Edit came out ☹️
> [Clothes Try On (Clothing Transfer) - Qwen Edit](https://civitai.com/models/1940532?modelVersionId=2196278)

The biggest advantage of using instruction-based image editing is that **you don't need a mask**.

For example, say you want to put jeans on someone wearing a miniskirt. With regular VTON, you have to mask not just the miniskirt but also the legs that the jeans will cover.
Generating a mask for that combined area automatically is really hard.

Instruction-based image editing needs no mask, so you can swap clothes without worrying about any of that hassle.

---

## Instruction-Based Image Editing (Multi-Reference)

With an instruction-based image editing model that supports multi-reference, it's easy.

Just pass the person and the outfit into separate slots and give an instruction like "dress this person in these clothes," and you're done.
