---
layout: page.njk
lang: en
section: begin-with
slug: recommended-specs
navId: recommended-specs
title: "Recommended Specs"
created: 2025-11-24
updated: 2026-03-02
summary: "PC specs required to run ComfyUI"
seoTitle: "ComfyUI Recommended Specs: VRAM, RAM, GPU"
seoDescription: "PC specs for running ComfyUI comfortably, based on real use: GPU VRAM matters most, then CPU, system memory (RAM), and storage."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

If you want to build image generation into illustration or design work, running locally is far more stable and practical than using the cloud. Here are the specs I recommend for using ComfyUI comfortably, based on real use.

---

## CPU

Most of the work runs on the GPU, so you don't need to be picky about the CPU.

Some things do run on the CPU, but any modern CPU won't be the bottleneck.

---

## GPU

VRAM is what matters above all. No matter how fast the GPU computes, if you don't have enough VRAM, you can't run the model in the first place. This is the one place you shouldn't compromise.

- 8GB: The bare minimum. Things run with some workarounds, but with a lot of limits.
- 12-16GB: Handles most of the latest tech (or rather, new models get slimmed down to fit this range)
  - e.g., RTX 5060 (16GB)
- 24GB or more: Aim for this if you also want heavy work, like running LLMs alongside or making long videos.
  - e.g., RTX 5090


Also, don't forget to choose an Nvidia GPU.

AMD and Intel cards are cheaper for the same amount of VRAM, but most AI models are optimized for Nvidia. The specs may look about the same on paper, but once you actually run things, they can take several times longer, and you'll regret it.

---

## Memory (RAM)

I'll go into how it works elsewhere, but by using RAM, you can run models too big to fit in VRAM. And ComfyUI is very good at this.

Adding 12GB of VRAM costs a ridiculous amount of money, but RAM is relatively cheap to add (though prices have shot up lately...), so get as much as you can. You need at least 32GB.

---

## Storage

SSDs load files far faster, so I recommend keeping your models on an SSD rather than an HDD.

That said, each AI model is quite large, and even if you keep only the ones you use often, you'll pass 1TB in no time. The more SSD space the better, but that's between you and your wallet.

An HDD is fine for saving output images and videos.
