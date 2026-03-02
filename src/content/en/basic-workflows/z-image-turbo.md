---
layout: page.njk
lang: en
section: basic-workflows
slug: z-image-turbo
navId: z-image-turbo
title: "Z-Image-Turbo"
summary: "Image generation with Z-Image-Turbo"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/8cb43e18daed0bcb2bf3bf7c794e5360.png"
tags: []
---

## What is Z-Image-Turbo?

Z-Image is a **family of image generation models** by Alibaba / Tongyi-MAI.

![](https://gyazo.com/569a829f2dbd9021bfdecf6d1e3267b9){gyazo=image}

**Z-Image-Turbo** is a high-speed model distilled from [Z-Image (Base)](/en/basic-workflows/z-image/) for generation in few steps (8 steps).
In addition to simply being faster, it has also undergone reinforcement learning to achieve stable image quality.

Therefore, you can quickly generate beautiful images without fine-tuning settings. On the other hand, variation due to seed changes is limited, and its strength is biased towards photorealism.
It is not very good at illustration styles or specific prompt expressions.

As a side note, it is the earliest model released in the Z-Image family.

---

## Model Download

- diffusion_models
  - [z_image_turbo_bf16.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors)
- text_encoders
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/text_encoders/qwen_3_4b.safetensors)
- vae
  - [ae.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/vae/ae.safetensors) (Same as Flux.1)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── z_image_turbo_bf16.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── ae.safetensors
```

---

## text2image

Z-Image-Turbo is a **distilled model** of the same type as Flux.1 dev.

![](https://gyazo.com/7e5d76cec53ee44278c313a30035463f){gyazo=image}

[](/workflows/basic-workflows/z-image-turbo/Z-Image-Turbo.json)

- `steps` ... 6-8
- `cfg` ... 1.0

---

## Z-Image-Turbo Fun ControlNet Union

A ControlNet-style patch for Z-Image-Turbo.

### Model Download

- model_patches

  - [Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors](https://huggingface.co/alibaba-pai/Z-Image-Turbo-Fun-Controlnet-Union-2.0/blob/main/Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── Z-Image-Turbo-Fun-Controlnet-Union-2.1.safetensors
```

### workflow

![](https://gyazo.com/53c91fd9eeb8f94357b20839e5d8c967){gyazo=image}

[](/workflows/basic-workflows/z-image-turbo/Z-Image-Turbo-Fun-Controlnet-Union-2.1.json)

- 🟩 Add model and control image to `QwenImageDiffsynthControlnet`.
- 🟩 In this workflow, Depth Anything V2 is used to create a depth map.
