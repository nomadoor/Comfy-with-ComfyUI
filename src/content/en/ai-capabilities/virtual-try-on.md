---
layout: page.njk
lang: en
section: ai-capabilities
slug: virtual-try-on
navId: virtual-try-on
title: "Virtual Try-On"
summary: "The task of replacing only the clothes with a different design or variation."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Virtual Try-On?

If ID Transfer is "Subject Transfer specialized for people," then Virtual Try-On (VTON) can be said to be **"Subject Transfer specialized for clothes."**

It is also called **Virtual Try-On (VTON)**.

Especially when used for product images, **consistency** such as:

- Patterns and details do not change
- Naturally fitting the body shape and pose

becomes important.

---

## LoRA

As with anything, the most reliable and flexible method is to create a LoRA of the clothes.

By combining it with inpainting, you can dress a specific person in the clothes.

---

## catvton-flux

There are many models specialized for VTON tasks (changing clothes), but **catvton-flux** is a representative example.

The basic idea is the same as IC-LoRA / ACE++, using a **side-by-side layout**.

![](https://gyazo.com/e06c4fb2aca261c0d37b792bea9dcc80){gyazo=image}

[](/workflows/ai-capabilities/virtual-try-on/catvton-flux-LoRA.json)

- **Left side**: Person image
- **Right side**: Image of clothes you want them to wear + mask

The model generates an "image of the person on the left wearing the clothes on the right" while looking at both.

---

## Instruction-Based Image Editing (Side-by-Side)

[Instruction-Based Image Editing](/en/ai-capabilities/instruction-based-image-editing/) models that do not support multi-reference cannot originally do things like "bring elements of image A to image B."

However, just like with IC-LoRA / ACE++, if you use the **side-by-side technique** and a LoRA trained for this purpose, you can do something similar.

![](https://gyazo.com/30a82ecdd7a8cff9483a162decf7c31d){gyazo=image}

[](/workflows/ai-capabilities/virtual-try-on/Flux_Kontext_LoRA_v0.2.json.json)

- [nomadoor/crossimage-tryon-fluxkontext](https://huggingface.co/nomadoor/crossimage-tryon-fluxkontext)
- **Left side**: Person image
- **Right side**: Image of clothes you want them to wear + mask

The model generates an "image of the person on the left wearing the clothes on the right" while looking at both.

> I brought up the LoRA I made as a reference because I wanted to brag, but a day later, a much higher performance LoRA for Qwen-Image-Edit was announced ☹️
> [Clothes Try On (Clothing Transfer) - Qwen Edit](https://civitai.com/models/1940532?modelVersionId=2196278)

The biggest advantage of using instruction-based image editing is that **masks become unnecessary**.

For example, if you want to dress a person in a mini skirt in jeans, with normal VTON, you have to mask not only the mini skirt part but also the leg part that will become jeans.
It is very difficult to automatically generate a mask for the area combining these two.

In contrast, instruction-based image editing does not require masks, so you can change clothes without worrying about such troublesome things.

---

## Instruction-Based Image Editing (Multi-Reference)

If it is an instruction-based image editing model that supports multi-reference, it is easy.

Just pass the person you want to change clothes and the clothes to separate slots and give instructions like "dress this person in these clothes," and you can change clothes.
