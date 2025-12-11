---
layout: page.njk
lang: en
section: basic-workflows
slug: speed-and-efficiency
navId: speed-and-efficiency
title: "Speed and Efficiency"
summary: "Organizing speed-up and lightweighting techniques for diffusion models and using them according to purpose"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## What are Speed and Efficiency?

When Stable Diffusion 1.5 first appeared, the recommended VRAM was about 10GB, and benchmark results were reported that it took about 5 seconds to generate one image with the RTX 3080 class.
That is now a thing of the past. Thanks to technological advances, it is now possible to infer in a few seconds to a dozen seconds with only CPU, and to generate dozens of images per second.

The history of diffusion models can be said to be the **"history of speed-up and lightweighting"** in a sense.

Note that the following two are similar but different.

- **Speed-up: Shorten the generation time per image with the same hardware**
- **Lightweighting: Enable the same model to run with less VRAM / memory**

Using lightweighting techniques (Quantization / GGUF, etc.) can reduce VRAM, but in some cases, inference speed may actually decrease.

> In this page, "Lightweighting" is treated mainly as VRAM usage reduction of models.

---

## Rough Map of This Page

First, let's roughly organize which technologies are relevant for each common purpose.

- Want to make it faster anyway

  - Distillation (Lightning / schnell / various one-step systems)
  - Small VAE (TAE, etc.)
  - Attention Optimization (FlashAttention systems, etc.)
  - Sampling Cache (TeaCache systems, etc.)

- Want to cut VRAM / Want to run it anyway

  - Quantization (8bit / 4bit)
  - GGUF
  - CPU Offload / Block Swap
  - VAE Tiling (Tiled VAE / Temporal Tiling)

> Things like SageAttention and Nunchaku are also famous, but the introduction difficulty is high, so we do not handle them on this site. Let's take stability over hardship.

---

## List of Main Speed-up / Lightweighting Methods

- Speed-up / Lightweighting is roughly effective (◎ > ○ > △ > ―)
- Introduction Difficulty is "Easy / Normal / Hard", which is a guideline for setup effort and ease of incorporation into existing workflows.

| Method Name | Type | Speed-up | Lightweighting | Introduction Difficulty |
| --- | --- | --- | --- | --- |
| 8bit Quantization | Model Quantization | △~○ | ○ (Roughly halve VRAM) | Easy |
| 4bit Quantization | Model Quantization | △ | ◎ (Significantly reduce VRAM) | Hard |
| GGUF | Dedicated Format + Quantization | △ | ◎ (Model capacity / VRAM reduction) | Normal |
| Distilled Model | Model Distillation (Lightning / schnell) | ◎ | ― (Model size is almost the same) | Normal |
| Attention Optimization | Attention Implementation Replacement | ○ | ― | Normal~Hard |
| Sampling Cache | Sampling Cache | ○ | ― | Hard |
| Small VAE | Distilled VAE | ○~◎ | △ (Only VAE part becomes lighter) | Normal |
| CPU Offload | Evacuate part of the model to CPU/RAM | ✕ | ◎ (VRAM can be reduced to a few GB) | Easy |
| Block Swap | Evacuation per Transformer Block | ✕ | ◎ | Easy |
| VAE Tiling | Process image/video by tile division | ― | ○ (VRAM saving at high resolution) | Normal |

---

## Quantization

### 8bit Quantization

8bit quantization is a method to suppress VRAM usage to about half roughly by dropping model weights to 8bit (INT8 or FP8 systems).
In many environments, deterioration of image quality is hardly noticeable, and speed remains almost unchanged or improves slightly.

Checkpoints with `fp8` in the model name can also be considered as lightweight versions of this 8bit system.

### 4bit Quantization

4bit quantization is a method to save VRAM significantly by further reducing the number of bits.
In return, reconstruction of weights and numerical errors have a larger impact, and breakdown of colors and details is easy to notice, so it is safe to view it as an "experimental area" at present.

There are stacks like SVDQuant and Nunchaku that runs its 4bit model at high speed, but the degree of freedom of introduction and setting is high, so we will not cover them in detail here.

### GGUF

GGUF is a dedicated format for storing quantized weights. (As a supplement) This is designed with a focus on efficient inference from CPU memory (RAM), and a major feature is that it is easy to operate even in environments where VRAM is insufficient.

In ComfyUI, if you introduce [city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF), you can use it just by replacing the `Load Diffusion Model` node with a node for GGUF and specifying the GGUF model.

---

## Distillation

Distillation is a method of teaching the behavior of a teacher model to another model (or LoRA), and in diffusion models, it is mainly used for the purpose of "enabling output of equivalent images with fewer steps".

Representative Examples

- "High-speed version" checkpoints like [FLUX.1-schnell](/en/basic-workflows/flux1/#text2image-flux-1-schnell)
- High-speed generation LoRA like [Qwen-Image-Lightning](/en/basic-workflows/qwen-image/#lightning-high-speed-generation-lora)

Since the number of steps can be reduced to about 1 to 4 steps, it is the first candidate when you want to make it faster anyway.

---

## Attention Optimization

Since Self-Attention is a heavy process in diffusion models, several implementations have been proposed to speed this up.

- `scaled_dot_product_attention` of PyTorch 2 systems (FlashAttention systems)
- Speeded-up Attention kernels provided by various libraries

Using such implementations may expect a speed improvement of several tens of percent without changing the model itself.
On the other hand, there are implementations that require build or dedicated nodes like SageAttention, and the introduction difficulty is high, so we do not handle them on this site.

---

## Sampling Cache

Sampling cache is a general term for speed-up methods like "teaching calculation by caching and reusing results of some steps during sampling".
Things like TeaCache and MagCache are implemented in ComfyUI.

While it can speed up without additional training, obvious deterioration is more likely to appear compared to other methods.

---

## Small VAE

Small VAE is a distilled and smaller version of the original VAE to speed up decode.
Representative examples include TAE (Tiny AutoEncoder system), which is used for real-time preview and intermediate confirmation.

---

## CPU Offload and Block Swap

CPU offload is a mechanism to evacuate a part of the model or intermediate tensors to the CPU side (RAM) when VRAM is insufficient.
Instead of making it easier to avoid CUDA OOM, generation time extends at once because transfer via PCIe increases.

In ComfyUI, depending on settings and nodes, offload is automatically performed internally, and it may move on its own without the user being aware of it.
If you feel "the time per image is unusually long", you might suspect that CPU offload or Block Swap is working behind the scenes.

Block Swap is a mechanism that divides Transformer into block units and controls input/output so that "only currently necessary blocks are put on GPU".
Both are the same in that they escape to RAM, but Block Swap is a method aiming to suppress the peak of VRAM more finely, and is used in large video models etc.

---

## VAE Tiling

VAE tiling is a method to reduce the area processed per time by dividing image or video into tiles and encoding / decoding it.
For example, if you process by dividing the image into 4, the necessary VRAM and calculation amount for each tile will be roughly 1/4.

Thanks to this, even images of sizes that are originally impossible in terms of memory or ultra-high resolution decode can be managed somehow.
Please try it when VAE decode takes an abnormally long time or when you want to handle images of 4K or more.
