---
layout: page.njk
lang: en
section: basic-workflows
slug: minimax-h3-image
navId: minimax-h3-image
title: "MiniMax H3 Image"
created: 2026-11-12
summary: "Image generation and editing with MiniMax H3 Image"
seoTitle: "MiniMax H3 Image in ComfyUI: Up to 16 MP Generation and Editing"
seoDescription: "MiniMax H3 Image in ComfyUI, a sibling of MiniMax H3 that generates up to 16 MP in one pass. Settings, models, prompts, and text2image, Ref2Image, and editing workflows."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/minimax-h3-image/minimax_h3_image_hero.png"
tags: []
---

## What is MiniMax H3 Image?

[MiniMax H3 Image](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image) is an image generation model released by MiniMax.

It comes from the same ancestor as the video model [MiniMax H3](/en/basic-workflows/minimax-h3/), and a single model handles both image generation and image editing.

Its standout feature is generating huge 16 MP images in one pass. Combined with its 6-step distillation, it is very fast at 4 MP.

{% runpod %}

---

## Recommended settings

- Resolution
  - 4–16 MP
    - For 1:1, that is 2048 × 2048 to 4096 × 4096 px
  - Width and height must be multiples of 32

> [!WARNING]
> It is not so much that it can generate large images as that it needs large images to work well. Below 4 MP, the output breaks down.

---

## Downloading the models

- diffusion_models
  - [minimax_h3_image_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3-Image/blob/main/diffusion_models/minimax_h3_image_pruned_int8_convrot.safetensors) (21 GB)
- text_encoders
  - [qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3-Image/blob/main/text_encoders/qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors) (15.7 GB)
- vae
  - [minimax_h3_image_vae_fp16.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3-Image/blob/main/vae/minimax_h3_image_vae_fp16.safetensors) (1.17 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── minimax_h3_image_pruned_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors
    └── 📂vae/
        └── minimax_h3_image_vae_fp16.safetensors
```

---

## Prompts

Below is MiniMax's official prompt guide, but compared with the [MiniMax H3](/en/basic-workflows/minimax-h3/) video model, this one does not demand such strict prompts. Just describe what you want in your own words, in detail.

- [h3-image-prompt-writing](https://github.com/MiniMax-AI/MiniMax-H3-Image/tree/main/skills/h3-image-prompt-writing)

### Ref2Image and image editing

The official format asks you to define things first, like `<Subject 1>`, but as far as I have tested, simply writing `Picture 1`, `Picture 2` in the order the reference images are connected works fine.

Also, even for image editing, describing the finished picture seems to be more stable than giving an instruction like "change it to …".

```text
The image shows the man from Picture 1 sitting deep in the chair from Picture 3, wearing the headphones from Picture 2.
```

> [!NOTE]
> I do not use a prompt enhancer here. With Qwen3.5 9B it adds processing time and makes quite a few mistakes, and short prompts were good enough.

---

## text2image

![](/media/basic-workflows/minimax-h3-image/minimax_h3_image_text2image.png){media=image}

[](/workflows/basic-workflows/minimax-h3-image/minimax_h3_image_text2image.json)

{% outputs %}
![](/media/basic-workflows/minimax-h3-image/minimax_h3_image_text2image_output.png){media=image}
{% endoutputs %}

---

## Ref2Image

Generate a new image by combining reference images.

You can use up to 16 reference images.

![](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image.png){media=image}

[](/workflows/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image.json)

{% outputs %}
![Picture 1](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image_input1.png){media=image} ![Picture 2](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image_input2.png){media=image} ![Picture 3](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image_input3.png){media=image} ![output](/media/basic-workflows/minimax-h3-image/minimax_h3_image_ref2image_output.png){media=image}
{% endoutputs %}

---

## Image editing

![](/media/basic-workflows/minimax-h3-image/minimax_h3_image_edit.png){media=image}

[](/workflows/basic-workflows/minimax-h3-image/minimax_h3_image_edit.json)

- `Resize Image/Mask`
  - `MiniMax H3 Image Conditioning` goes ahead and resizes the input image internally so that its short side falls between 1024 and 2048 px.
  - To make the input and output sizes match exactly, the short side is set to 2048 px beforehand.

Sometimes the framing changes on its own, for example a full-body photo turning into a close-up. When that happens, also write what you want to keep in the prompt.

```text
The framing, pose, and background are the same as Picture 1.
```

{% outputs %}
![input](/media/basic-workflows/minimax-h3-image/minimax_h3_image_edit_input1.png){media=image} ![output](/media/basic-workflows/minimax-h3-image/minimax_h3_image_edit_output.png){media=image}
{% endoutputs %}
