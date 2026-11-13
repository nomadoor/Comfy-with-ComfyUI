---
layout: page.njk
lang: zh
section: basic-workflows
slug: idol
navId: idol
title: "Idol"
created: 2026-11-12
summary: "用一张图像生成 3D Gaussian Splat"
seoTitle: "在 ComfyUI 中使用 Idol：用一张图像生成 3D Gaussian Splat"
seoDescription: "介绍如何在 ComfyUI 中使用 Idol，从一张图像生成 3D Gaussian Splat（3DGS）。Idol 与 TripoSplat 结构相同，可以直接用 ComfyUI 自带的 TripoSplat 节点运行。本文介绍所需模型和工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/idol/idol_hero.mp4"
tags: []
---

## Idol 是什么？

[Idol](https://huggingface.co/speridlabs/idol) 是 speridlabs 发布的模型，可以从一张图像生成 3D Gaussian Splat（3DGS）。

Idol 与 TripoSplat 的结构相同，所以在 ComfyUI 中使用 TripoSplat 的节点。

---

## 下载模型

- background_removal
  - [birefnet.safetensors](https://huggingface.co/Comfy-Org/BiRefNet/blob/main/background_removal/birefnet.safetensors) (444 MB)
- diffusion_models
  - [idol_fp16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/diffusion_models/idol_fp16.safetensors) (741 MB)
- clip_vision
  - [dino_v3_vit_h_bf16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/clip_vision/dino_v3_vit_h_bf16.safetensors) (1.68 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/vae/flux2-vae.safetensors) (336 MB)
  - [idol_decoder_fp16.safetensors](https://huggingface.co/Comfy-Org/Idol/blob/main/vae/idol_decoder_fp16.safetensors) (576 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂background_removal/
    │   └── birefnet.safetensors
    ├── 📂clip_vision/
    │   └── dino_v3_vit_h_bf16.safetensors
    ├── 📂diffusion_models/
    │   └── idol_fp16.safetensors
    └── 📂vae/
        ├── flux2-vae.safetensors
        └── idol_decoder_fp16.safetensors
```

---

## image to 3DGS

![](/media/basic-workflows/idol/idol_image_to_gaussian_splat.png){media=image}

[](/workflows/basic-workflows/idol/idol_image_to_gaussian_splat.json)

- `Remove Background`
  - 用 BiRefNet 去除背景。
- `TripoSplat Preprocess Image`
  - 把用遮罩抠出的对象重新放到黑色背景的正方形中央。
- `TripoSplat Decode`
  - `num_gaussians` 是要生成的 Gaussian 数量。
  - 超过 262144 只会让点更密，不会增加细节。
- `Create 3D File (from Splat)` → `Save 3D Model`
  - 把 Splat 保存为 `.ply`，并可以直接在 3D 视图中查看。

{% outputs %}
![](/media/basic-workflows/idol/idol_turntable.mp4){media=loop}
{% endoutputs %}
