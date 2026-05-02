---
layout: page.njk
lang: zh
section: basic-workflows
slug: chroma1-hd
navId: chroma1-hd
title: "Chroma1-HD"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Chroma1-HD 扩展 Flux.1-schnell"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/326db88733896540f58ce60e7320824f.png"
tags: []
---

## 什么是 Chroma1-HD？

[Flux.1 [dev]](/zh/basic-workflows/flux-1/) 虽然是极好的模型，但在社区广泛使用上也就有 2 个大的课题。

- 因为被强力蒸留，所以与 LoRA 或全微调的相性不太好
- 非商用许可证

因此，以持有更宽大的许可证的 Flux.1 [schnell] 为出发点，出现了一些试图再构筑“脱蒸留版 Flux”的尝试，其中花费了最大劳力之一的是由 LodestoneRock 开发的 [Chroma1-HD](https://huggingface.co/lodestones/Chroma1-HD)。

因为包含 NSFW 和动漫图像在内进行了再学习，比起原来的 Flux 系风格的自由度更高，比起“脱蒸留版 Flux”，不如理解为 以 Flux 系架构为基础的新的通用模型 更合适。

---

## 模型的下载

Chroma1-HD 与 Flux.1 不同，不使用 CLIP，仅利用 T5。

- diffusion_models  
  - [Chroma1-HD.safetensors](https://huggingface.co/lodestones/Chroma1-HD/blob/main/Chroma1-HD.safetensors)
- text_encoders  
  - [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
- vae  
  - [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── Chroma1-HD.safetensors
    ├── 📂text_encoders/
    │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
    └── 📂vae/
        └── ae.safetensors
```

## text2image

![](https://gyazo.com/319a7dc82aeea486d7f0912c830fb258){gyazo=image}

[](/workflows/basic-workflows/chroma1-hd/Chroma1-HD.json)

- 基本的组建方法与 Flux.1 几乎相同。
- 🟦 T5TokenizerOptions 是当令牌数比设定值少时用 padding 填充的节点。放不放都没有大差别。
- 尽管规定 CFG 为 4.0，但也有 6〜7 比较好的声音。请尝试各种设定。
