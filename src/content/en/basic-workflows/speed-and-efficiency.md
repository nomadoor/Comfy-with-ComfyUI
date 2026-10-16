---
layout: page.njk
lang: en
section: basic-workflows
slug: speed-and-efficiency
navId: speed-and-efficiency
title: "Speed and Efficiency"
created: 2025-12-11
updated: 2026-03-02
summary: "An overview of techniques for making diffusion models faster and lighter, and which to use for what"
seoTitle: "Speed Up ComfyUI and Reduce VRAM: Techniques Compared"
seoDescription: "Speed and memory techniques for diffusion models by goal: 8-bit and 4-bit quantization, GGUF, distillation, attention optimization, and sampling caches."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## What are Speed and Efficiency?

When Stable Diffusion 1.5 first came out, the recommended VRAM was around 10GB, and many benchmarks reported about 5 seconds per image on an RTX 3080-class GPU.
That's ancient history now. Thanks to technical progress, you can run inference on a CPU alone in anywhere from a few seconds to a dozen or so, or generate dozens of images per second.

In a sense, you could say the history of diffusion models is a **"history of getting faster and lighter"**.

One thing to keep in mind: these two sound similar, but they're different things.

- **Speed-up: shorter generation time per image on the same hardware**
- **Memory savings: running the same model with less VRAM / memory**

Memory-saving techniques (quantization / GGUF, etc.) can cut VRAM, but in some cases they actually make inference slower.

> [!NOTE]
> On this page, "memory savings" mainly means reducing a model's VRAM usage.

---

## A Rough Map of This Page

First, a rough breakdown of which techniques come into play for each common goal.

- Just want it faster

  - Distillation (Lightning / schnell / various one-step models)
  - Small VAE (TAE, etc.)
  - Attention optimization (FlashAttention family, etc.)
  - Sampling cache (TeaCache family, etc.)

- Want to cut VRAM / just want it to run

  - Quantization (8bit / 4bit)
  - GGUF
  - CPU Offload / Block Swap
  - VAE Tiling (Tiled VAE / Temporal Tiling)

> [!NOTE]
> SageAttention and Nunchaku are also well known, but they're hard to set up, so this site doesn't cover them. Choose stability over struggle.

---

## Main Speed-up and Memory-Saving Methods

- Speed-up / Memory savings show roughly how effective each method is (◎ > ○ > △ > ―)
- Setup difficulty is "Easy / Medium / Hard": a rough guide to the setup effort and how easily it fits into existing workflows.

| Method | Type | Speed-up | Memory savings | Setup difficulty |
| --- | --- | --- | --- | --- |
| 8bit Quantization | Model quantization | △~○ | ○ (Roughly halves VRAM) | Easy |
| 4bit Quantization | Model quantization | △ | ◎ (Cuts VRAM a lot) | Hard |
| GGUF | Dedicated format + quantization | △ | ◎ (Smaller model files / less VRAM) | Medium |
| Distilled Model | Model distillation (Lightning / schnell) | ◎ | ― (Model size stays about the same) | Medium |
| Attention Optimization | Swapping the Attention implementation | ○ | ― | Medium~Hard |
| Sampling Cache | Caching during sampling | ○ | ― | Hard |
| Small VAE | Distilled VAE | ○~◎ | △ (Only the VAE part gets lighter) | Medium |
| CPU Offload | Moves part of the model to CPU/RAM | ✕ | ◎ (Can bring VRAM down to a few GB) | Easy |
| Block Swap | Moves Transformer blocks out one at a time | ✕ | ◎ | Easy |
| VAE Tiling | Processes images/videos in tiles | ― | ○ (Saves VRAM at high resolutions) | Medium |

---

## Quantization

### 8bit Quantization

8-bit quantization reduces model weights to 8 bits (INT8 or FP8 variants), cutting VRAM usage roughly in half.
In most setups, the quality loss is barely noticeable, and speed stays about the same or improves slightly.

You can think of checkpoints with `fp8` in the model name as 8-bit lightweight versions like this.

### 4bit Quantization

4-bit quantization cuts the bit count even further to save a lot of VRAM.
The trade-off is that weight reconstruction and numerical error have a bigger effect, so breakdowns in color and detail become easy to spot. For now, it's safest to treat it as experimental territory.

There are also stacks like SVDQuant, and Nunchaku, which runs those 4-bit models fast, but they come with a lot of setup and configuration choices, so I won't go into detail here.

### GGUF

GGUF is a dedicated format for storing quantized weights. (As a side note) It was designed mainly for efficient inference from CPU memory (RAM), and a big advantage is that it runs easily even when VRAM is short.

In ComfyUI, once you install [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF), you can use it just by swapping the `Load Diffusion Model` node for the GGUF node and selecting a GGUF model.

---

## Distillation

Distillation teaches a teacher model's behavior to another model (or a LoRA). In diffusion models, it's mainly used to "produce equivalent images in fewer steps".

Examples

- "Fast version" checkpoints like [FLUX.1-schnell](/en/basic-workflows/flux-1/#text2image-flux-1-schnell)
- Fast-generation LoRAs like [Qwen-Image-Lightning](/en/basic-workflows/qwen-image/#lightning-high-speed-generation-lora)

It can sometimes cut the step count to around 1–4 steps, which makes it the first thing to try when you just want speed.

---

## Attention Optimization

Self-Attention is a heavy operation in diffusion models, so several implementations have been proposed to speed it up.

- PyTorch 2's `scaled_dot_product_attention` (FlashAttention family)
- Optimized Attention kernels provided by various libraries

Using these can sometimes get you a speed-up of tens of percent without changing the model itself.
On the other hand, some implementations, such as SageAttention, need a build step or dedicated nodes and are hard to set up, so this site doesn't cover them.

---

## Sampling Cache

Sampling cache is an umbrella term for speed-up methods that "cache and reuse the results of some steps during sampling to skip computation".
Methods like TeaCache and MagCache are implemented in ComfyUI.

It speeds things up without any extra training, but compared with other methods, it's more prone to visible quality loss.

---

## Small VAE

A small VAE is a distilled, smaller version of the original VAE that speeds up decoding.
A typical example is TAE (the Tiny AutoEncoder family), used for real-time previews and checking intermediate results.

---

## CPU Offload and Block Swap

CPU offload moves part of the model or intermediate tensors to the CPU side (RAM) when VRAM runs short.
It makes CUDA OOM easier to avoid, but the extra transfers over PCIe make generation time shoot up.

In ComfyUI, offloading can happen automatically under the hood depending on your settings and nodes, so it may be running without you noticing.
If each image feels like it's taking oddly long, it might be worth suspecting that CPU offload or Block Swap is at work behind the scenes.

Block Swap splits a Transformer into blocks and moves them in and out so that "only the blocks needed right now are on the GPU".
Both move things out to RAM, but Block Swap aims to keep peak VRAM down at a finer level, and it's used for large video models and the like.

---

## VAE Tiling

VAE tiling splits an image or video into tiles to encode / decode it, so each pass handles a smaller area.
For example, if you split an image into 4, the VRAM and compute needed for each tile drop to roughly 1/4.

This lets you get through images at sizes that would normally be impossible memory-wise, and even ultra-high-resolution decodes.
Try it when VAE decode takes abnormally long, or when you want to work with images at 4K or above.
