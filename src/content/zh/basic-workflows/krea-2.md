---
layout: page.njk
lang: zh
section: basic-workflows
slug: krea-2
navId: krea-2
title: "Krea 2"
created: 2026-06-24
updated: 2026-06-24
summary: "使用 Krea 2 Turbo 进行图像生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/6ce8c9a2f7042a08efbbcdefc8ab6673.png"
tags: []
---

## 什么是 Krea 2？

[Krea 2 Open-Source](https://www.krea.ai/krea-2-open-source) 是 Krea 发布的 open weight 图像生成模型。

和 Krea 以前做过的 [FLUX.1 Krea](https://www.krea.ai/blog/flux-krea-open-source-release) 类似，它在架构上并没有特别特殊的部分，而是更像是通过认真整理数据集，努力生成不那么有 AI 感、更加漂亮的图像。

公开了 2 种模型，但通常的图像生成会使用 Turbo。

- **Krea 2 Raw**
  - 未蒸馏的基础模型。主要用于 LoRA 训练和 fine-tuning。
- **Krea 2 Turbo**  
  - 可以用 8 steps 生成的蒸馏模型。

> Krea 的 Web / API 版还有 **Krea 2 Medium** 和 **Krea 2 Large**，但作为 open weight 公开的只有 **Raw** 和 **Turbo**。

---

## 模型的下载

- diffusion_models
  - [krea2_turbo_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/diffusion_models/krea2_turbo_fp8_scaled.safetensors) (13.1 GB)
- text_encoders
  - [qwen3vl_4b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/text_encoders/qwen3vl_4b_fp8_scaled.safetensors) (5.24 GB)
- vae
  - [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/vae/qwen_image_vae.safetensors) (254 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── krea2_turbo_fp8_scaled.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_4b_fp8_scaled.safetensors
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## text2image

![](https://gyazo.com/31bce8c4982ff74992c599268d13374d){gyazo=image}

[](/workflows/basic-workflows/krea-2/Krea_2_turbo_text2image.json)

Krea 2 Turbo 是用于 8 steps 生成的模型。

- `steps` : 8
- `cfg` : 1.0
- 推荐分辨率 : 1K 〜 2K

---

## 官方 Style LoRA

Krea 2 的一大卖点，是 Style references 和 Moodboards 这类风格控制功能，但目前还没有作为 OSS 公开。

作为替代，官方公开了一些 Style LoRA，可以先试试看。

- [Krea 2 LoRAs](https://huggingface.co/collections/krea/krea-2-loras)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── *.safetensors
```

每个 LoRA 都有推荐的 trigger word 和强度，使用前请查看对应的模型卡。

### text2image (with LoRA)

![](https://gyazo.com/7a2ec126a289cfa04dd8cb609b6d04e3){gyazo=image}

[](/workflows/basic-workflows/krea-2/Krea_2_turbo_text2image_darkbrush.json)

- 这里使用的是 [Krea-2-LoRA-darkbrush](https://huggingface.co/krea/Krea-2-LoRA-darkbrush)。
- trigger word 是 `monochrome ink wash style`。

很期待社区里出现更多 LoRA。
