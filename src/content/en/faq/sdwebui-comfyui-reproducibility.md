---
layout: page.njk
lang: en
section: faq
slug: sdwebui-comfyui-reproducibility
navId: sdwebui-comfyui-reproducibility
title: "Can't generate the same image with Stable Diffusion web UI and ComfyUI?"
summary: "Reasons why images do not match even with the same model and same seed"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Can't generate the same image with Stable Diffusion web UI and ComfyUI?

In conclusion, **it is almost impossible to output exactly the same image**.

Two of the biggest factors are:

- Difference in noise generation method
- Difference in prompt weighting calculation method

---

## 1. Noise generation method is different

Diffusion models are technology to create images from noise.
In other words, if the shape (pattern) of the noise is different, the generated image will naturally be different.

This noise generation is quite severe, and even if **where the noise is created** is different, it becomes a different pattern from the same seed value.

- **ComfyUI**
  - Generates noise on **CPU side**
  - Designed so that "same seed produces same noise" easily even on different GPUs or environments

- **Stable Diffusion web UI**
  - Generates noise on **GPU side**

Because of this difference, **the pattern of noise used first becomes completely different even with the same seed value**.
If the initial noise is different, the final image will not match even if the diffusion process is traced.

---

## 2. Calculation method of prompt weighting is different

The behavior of **"weight"** written with parentheses or colons is also different between the two.

- **ComfyUI**
  - If you write `(masterpiece:1.2)`, it treats it **as 1.2 as is**
  - Even if you write multiple words, basically **does not normalize**

- **Stable Diffusion web UI**
  - **Normalizes (smooths)** multiple weights together
  - If you raise the weight of a certain word, the weights of other words drop evenly

In the official FAQ example:

**Input Prompt**  
> `(masterpiece:1.2) (best:1.3) (quality:1.4) girl`

**In Stable Diffusion web UI, it is normalized**  
> `(masterpiece:0.98) (best:1.06) (quality:1.14) (girl:0.81)`

**In ComfyUI, it is not normalized**  
> `masterpiece = 1.2 / best = 1.3 / quality = 1.4 / girl = 1.0` as is

As a result, even if you type exactly the same text and numbers, **the "actual weight" passed to the text encoder is different**, so it does not become the same picture.

---

## Then how to output "exactly the same image"?

There are approaches to imitate the same weighting logic as Stable Diffusion web UI using custom nodes, but since differences such as noise generation remain, **aiming for a perfect match is quite difficult**.

Personally, I think it is better to consider them as "different things" with different design philosophies.
