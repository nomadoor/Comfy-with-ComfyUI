---
layout: page.njk
lang: en
section: begin-with
slug: recommended-specs
navId: recommended-specs
title: "Recommended Specs"
summary: "PC specs required to run ComfyUI"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

When incorporating image generation into illustration production or design work, local execution is overwhelmingly more stable than cloud environments and has advantages in practical use. Here, I will summarize the recommended specs for comfortably using ComfyUI based on actual usage.

## CPU

Since most processing is done by the GPU, there is no need to be particular about the CPU.

Although some things are processed by the CPU, with any modern CPU, this will not become a bottleneck.

## GPU

Anyway, **VRAM amount** is important. No matter how fast it can calculate, if there is not enough VRAM, you cannot run the model in the first place. You should not compromise here.

- 8GB: Minimum. It works if you devise ways, but there are many restrictions.
- 12-16GB: Roughly compatible with the latest technology (or rather, things are optimized aiming for this range).
  - e.g. RTX 5060 (16GB)
- 24GB or more: Aim for this if you want to do heavy work such as using LLMs together or long videos.
  - e.g. RTX 5090


Also, please do not forget to choose an **Nvidia GPU**.

AMD and Intel GPUs can be purchased cheaper for the same amount of VRAM, but most AI models are optimized for Nvidia. Even if the specs look similar, if you actually try to run it, it will take many times longer to process, and you will regret it.


## Memory (RAM)

I will talk about the detailed mechanism elsewhere, but by utilizing RAM, you can run models that do not fit in VRAM. And ComfyUI is very good at this processing.

Increasing VRAM by 12GB costs a ridiculous amount of money, but increasing RAM can be done relatively cheaply (although prices are soaring recently...), so load as much as you can. At least 32GB is required.

## Storage

Since reading is overwhelmingly faster with SSD, I recommend using an SSD instead of an HDD for the place to put models.

However, AI models are quite large individually, and even if you carefully select the ones you use often, it will quickly exceed 1TB. The more SSD capacity the better, but consult your wallet.

There is no problem using an HDD for the destination to save output images and videos.
