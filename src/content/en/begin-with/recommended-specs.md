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
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

When incorporating image generation into illustration production or design work, local execution is overwhelmingly more stable and practical than a cloud environment. Here, we summarize the recommended specs for comfortably handling ComfyUI based on actual usage.

---

## CPU

Since most processing is done by the GPU, there is no need to be particular about the CPU.

Some things are processed by the CPU, but with modern CPUs, this will not be a bottleneck.

---

## GPU

Anyway, VRAM amount is important. No matter how fast you can calculate, if you don't have enough VRAM, you can't run the model in the first place. This is a point where you shouldn't compromise.

- 8GB: Minimum. It works with some ingenuity, but there are many restrictions.
- 12-16GB: Can handle most latest technologies (or rather, models are optimized aiming for this range)
  - e.g., RTX 5060 (16GB)
- 24GB or more: Aim for this if you want to do heavy work such as using LLM together or long videos.
  - e.g., RTX 5090


Also, don't forget to choose an Nvidia GPU.

AMD and Intel can be purchased cheaper for the same VRAM amount, but most AI models are optimized for Nvidia. Even if the specs look similar, you will regret it as processing takes many times longer when you actually run it.

---

## Memory (RAM)

We will talk about the detailed mechanism elsewhere, but by utilizing RAM, you can run models of sizes that do not fit in VRAM. And ComfyUI is very good at that processing.

Increasing VRAM by 12GB costs a ridiculous amount of money, but increasing RAM can be done relatively cheaply (though prices have soared recently...), so load as much as you can. At least 32GB is required.

---

## Storage

Loading is overwhelmingly faster with SSD, so we recommend SSD rather than HDD for placing models.

However, AI models are quite large one by one, and even if you carefully select frequently used ones, it will soon exceed 1TB. The more SSD capacity, the better, but consult your wallet.

There is no problem with HDD for the destination of output images and videos.
