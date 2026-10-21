---
layout: page.njk
lang: en
section: basic-workflows
slug: fibo-2
navId: fibo-2
title: "Fibo 2.0"
created: 2026-10-21
updated: 2026-10-21
summary: "Image generation and editing with Fibo 2.0"
seoTitle: "Fibo 2.0 in ComfyUI: Structured-Prompt Generation and Editing"
seoDescription: "Bria AI's 8B Fibo 2.0 in ComfyUI: text2image, image editing, multi-reference (plus 4-step Edit Turbo versions), and building VGL structured prompts with an MLLM."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/fibo-2/fibo_2_hero.png"
tags: []
---

## What is Fibo 2.0?

[Fibo 2.0](https://huggingface.co/briaai/Fibo-2.0-dev) is an 8B image generation and editing model from Bria AI.

Its predecessor, [FIBO](https://github.com/Bria-AI/FIBO), was built around structured JSON prompts even before [Ideogram 4.0](/en/basic-workflows/ideogram-4/) came along.

Fibo 2.0 is its successor. It keeps that approach and can now edit images as well.

These structured prompts are called VGL (Visual GenAI Language), but luckily Fibo 2.0 also does reasonably well with plain sentences.  
You can also hand a short instruction to an MLLM and have it rewrite it as VGL.

There are two models: **Dev**, which handles both generation and editing, and **Edit Turbo**, an editing-only model that runs in 4 steps.

> [!NOTE]
> This page has a Dev workflow for every task. For image editing, the Edit Turbo workflow is placed right alongside it.

{% runpod %}

---

## Recommended settings

- Resolution
  - About 1MP
  - Width and height must both be multiples of 16
- Number of reference images
  - Up to 4

---

## Downloading the models

- diffusion_models
  - [fibo2_dev_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/diffusion_models/fibo2_dev_int8_convrot.safetensors) (8.41 GB)
  - [fibo2_edit_turbo_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/diffusion_models/fibo2_edit_turbo_int8_convrot.safetensors) (8.41 GB)
- text_encoders
  - [qwen3vl_4b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/text_encoders/qwen3vl_4b_int8_convrot.safetensors) (4.86 GB)
  - [qwen3.5_9b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/text_encoders/qwen3.5_9b_int8_convrot.safetensors) (9.75 GB)
    - 🚨 Used to create VGL prompts (optional)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── fibo2_dev_int8_convrot.safetensors
    │   └── fibo2_edit_turbo_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   ├── qwen3vl_4b_int8_convrot.safetensors
    │   └── qwen3.5_9b_int8_convrot.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

---

## Basic workflows

### Image generation

![](/media/basic-workflows/fibo-2/fibo_2_dev_text2image.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_text2image.json)

- `steps`: 30
- `cfg`: 5.0

{% outputs %}
![output](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_output.png){media=image}
{% endoutputs %}

### Image editing

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit.json)

- `TextEncodeFibo2`
  - With `width` / `height` set to 0, the input image's size is used as is

For Edit Turbo, change only the following parameters:
- `steps`: 4
- `cfg`: 1.0

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_input.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_output.png){media=image}
{% endoutputs %}

### Image editing (multi-reference)

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi.json)

In the prompt, refer to each image as `<image_1>`, `<image_2>`, and so on, in the order they're connected to `TextEncodeFibo2`.

```text
Replace the pink-haired girl on the right of <image_1> with the mechanic woman from <image_2>.
```

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_input1.png){media=image} ![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_input2.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_output.png){media=image}
{% endoutputs %}

---

## With VGL (building structured prompts with an MLLM)

Structured prompts are where FIBO really shines.  
That said, writing JSON from scratch by hand is a lot of work, so let's have an MLLM rewrite plain sentences into VGL JSON.

For the system prompts, I took the Gemini ones in Bria's [bria-vgl](https://github.com/Bria-AI/vgl/tree/dev/src/bria_vgl/dialects/thales/prompts) and adjusted them slightly for Qwen3.5.  
Image generation, image editing, and multi-reference each use a different one, so don't reuse one for another task.

> [!NOTE]
> I use Qwen3.5 9B as the MLLM. You could reuse Qwen3-VL 4B, which is already loaded as the text encoder, but it isn't capable enough for this job, so I don't recommend it.

### Image generation

![](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl.json)

What sets structured prompts apart is that you can change just one part of them, like tweaking a parameter.  
Take the finished JSON prompt, change only something like the camera angle, and generate again.

{% outputs %}
![Original JSON](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl_output.png){media=image} ![Only camera_angle changed to Low angle](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl_output2.png){media=image}
{% endoutputs %}

### Image editing

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_vgl.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl.json)

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_vgl_input.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_vgl_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl_output.png){media=image}
{% endoutputs %}

### Image editing (multi-reference)

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_vgl.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl.json)

To feed several images into `Generate Text`, combine them into a batch with `Batch Images` first.

Note, though, that `Batch Images` crops the second and later images to the same resolution as the first.  
If the images are oriented differently, say the first is portrait and the second is landscape, add padding so nothing gets cut off.

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_vgl_input1.png){media=image} ![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_vgl_input2.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_vgl_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl_output.png){media=image}
{% endoutputs %}
