---
layout: page.njk
lang: en
section: basic-workflows
slug: moss-image
navId: moss-image
title: "MOSS-Image"
created: 2026-10-17
updated: 2026-10-17
summary: "Image generation with MOSS-Image"
seoTitle: "MOSS-Image in ComfyUI: An Image Model with Wide Expressive Range"
seoDescription: "Use MOSS-Image, a 5B image model trained from scratch on about 3.2 billion images, in ComfyUI: model download, prompting, text2image, and a BBOX layout workflow."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/moss-image/moss_image_hero.png"
tags: []
---

## What is MOSS-Image?

[MOSS-Image](https://openmoss.ai/MOSS-Image/) is a 5B image generation model pretrained from scratch on about 3.2 billion images.

What makes it interesting is that its training data was barely filtered for quality. Images with watermarks or blur weren't thrown away; they were captioned and kept in the training set.  
Perhaps thanks to that, it has a very wide expressive range. Anime-style images in particular hold together so well that it's hard to find another model like it, even among the cutting-edge ones.

It also comes with a permissive license that allows commercial use, so I'm looking forward to seeing how the community grows it from here.

{% runpod %}

---

## Recommended settings

- Resolution
  - 1MP to 2MP (up to 4MP)
  - Width and height must both be multiples of 16

---

## Downloading the models

- diffusion_models
  - [moss_image_sft_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/diffusion_models/moss_image_sft_int8_convrot.safetensors) (5.41 GB)
- text_encoders
  - [qwen3.5_9b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/text_encoders/qwen3.5_9b_int8_convrot.safetensors) (9.75 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── moss_image_sft_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3.5_9b_int8_convrot.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```


---

## Prompt

Besides natural language, it also supports tag-style prompts. If you use tags, write them in the following order. It's similar to [Anima](/en/basic-workflows/anima/).

```text
Quality -> Score -> Meta -> Year -> Character -> Series -> Artist -> General
```

---

## text2image

![](/media/basic-workflows/moss-image/moss_image_text2image.png){media=image}

[](/workflows/basic-workflows/moss-image/moss_image_text2image.json)

- `steps`: 25
- `cfg`: 3.0
- `SkipLayerGuidanceDiTSimple`
  - `single_layers`: 22
  - `end_percent`: 0.5
  - Turning this off makes images very realistic at the cost of breaking down more easily... or so I hear. It does break down a lot when off, so here I went with 0.5 as a middle ground.

{% outputs %}
![output](/media/basic-workflows/moss-image/moss_image_text2image_output.png){media=image}
{% endoutputs %}

### text2image with BBOX

With BBOX, you can specify what goes where.

![](/media/basic-workflows/moss-image/moss_image_text2image_bbox.png){media=image}

[](/workflows/basic-workflows/moss-image/moss_image_text2image_bbox.json)

- `Create Bounding Boxes`
  - A core node for drawing BBOXes. Drag to add a box, then describe what you want to place there.
  - `width` / `height` should match the output size (the value from `Resolution Selector`).
- `MOSS-Image Layout Prompt`
  - Write the prompt for the whole image here.
  - It combines the box information and the prompt into the JSON format MOSS-Image was trained on.

{% outputs %}
![output](/media/basic-workflows/moss-image/moss_image_text2image_bbox_output.png){media=image}
{% endoutputs %}
