---
layout: page.njk
lang: zh
section: basic-workflows
slug: flux-1-tools
navId: flux-1-tools
title: "Flux.1 Tools"
created: 2025-12-10
updated: 2026-08-26
summary: "Flux.1 Tools 的用法"
seoTitle: "在 ComfyUI 中使用 Flux.1 Tools：Fill、Depth、Canny、Redux"
seoDescription: "Flux.1 官方衍生模型 Flux.1 Tools 的用法：用于 inpaint / outpaint 的 Fill、以结构为引导的 Depth 与 Canny、参考图像的 Redux，附模型下载与工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
tags: ["controlnet"]
---

## 什么是 Flux.1 Tools？

除了基础模型之外，Flux 官方还为 Flux.1 推出了一些派生模型，作用相当于 [ControlNet](/zh/basic-workflows/sd15-controlnet/) 和 [IP-Adapter](/zh/basic-workflows/sd15-ip-adapter/)。

- `FLUX.1 Fill` … inpainting / outpainting 用模型
- `FLUX.1 Depth` / `FLUX.1 Canny` … 以结构引导（Depth / Canny）保持形状不变、重新绘制的模型
- `FLUX.1 Redux` … 批量生成与参考图像极为相似的变体，相当于 Flux 版的 IP-Adapter

---

## FLUX.1 Fill

用法和 inpainting 模型一样。

### 下载模型

- [FLUX.1-Fill-dev_fp8.safetensors](https://huggingface.co/1038lab/FLUX.1-Fill-dev_fp8/blob/main/FLUX.1-Fill-dev_fp8.safetensors)  
```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        └── FLUX.1-Fill-dev_fp8.safetensors
```

### 工作流

![](/media/basic-workflows/flux-1-tools/legacy_gyazo_ab4e4b0f5c9fe2030ebd637b15ac144d.png){media=image}

[](/workflows/basic-workflows/flux-1-tools/flux_1_fill.json)

* 🟪 用 `Load Diffusion Model` 节点加载 `flux1-fill-dev.safetensors`。
* 🟩 Flux.1 的工作流也和 Stable Diffusion 1.5 的 [inpainting](/zh/basic-workflows/sd15-inpainting/) 一样添加 `InpaintModelConditioning` 节点。

  * 输入图像和蒙版。

---

## FLUX.1 Depth / FLUX.1 Canny

用起来的感觉和 ControlNet Depth / Canny 差不多。

### 下载模型

* [flux1-depth-dev-fp8.safetensors](https://huggingface.co/boricuapab/flux1-depth-dev-fp8/blob/main/flux1-depth-dev-fp8.safetensors)
* [flux1-canny-dev-fp8.safetensors](https://huggingface.co/boricuapab/flux1-canny-dev-fp8/blob/main/flux1-canny-dev-fp8.safetensors)
```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        ├── flux1-depth-dev-fp8.safetensors
        └── flux1-canny-dev-fp8.safetensors
```

### 工作流

![](/media/basic-workflows/flux-1-tools/legacy_gyazo_8b4d310e8b9228e6e2be3b422150e01c.png){media=image}

[](/workflows/basic-workflows/flux-1-tools/flux_1_depth.json)

* 🟩 把控制图像输入到 `InstructPixToPixConditioning` 节点。
* 🟦 这次是 Depth，所以用 Depth Anything V2 制作深度图。

  * 深度图的尺寸会直接成为输出图像的尺寸，所以要先把它缩放到合适的大小。

> [!TIP]
> Canny 版用同样的结构，输入 Canny 边缘图像即可。

---

## FLUX.1 Redux

`FLUX.1 Redux` 是一种传入一张或多张参考图像，生成与之高度相似的变体的模型。  
它和 IP-Adapter 很像，但 Redux 中提示词很难起作用，参考图像的外观几乎会原样出现。

### 下载模型

Redux 要作为独立于 Flux 本体的“风格模型”来加载。  
另外，还需要一个用来编码参考图像的 CLIP-ViT。

* [FLUX.1-Redux-dev](https://huggingface.co/black-forest-labs/FLUX.1-Redux-dev/tree/main)
* [sigclip_vision_patch14_384](https://huggingface.co/Comfy-Org/sigclip_vision_384/tree/main)
```text
📂ComfyUI/
└── 📂models/
    ├── 📂style_models/
    │   └── flux1-redux-dev.safetensors
    └── 📂clip_vision/
        └── sigclip_vision_patch14_384.safetensors
```

### 工作流

![](/media/basic-workflows/flux-1-tools/legacy_gyazo_90588b4c7bc62bf7218901c901f31b8f.png){media=image}

[](/workflows/basic-workflows/flux-1-tools/flux_1_redux.json)

* 🟩 添加 `Apply Style Model` 节点，连接 Style 模型和 `CLIP Vision Encode`。

  * 把 `sigclip_vision_patch14_384.safetensors` 和参考图像连接到 `CLIP Vision Encode` 节点。

### 混合多张图像

把 `Apply Style Model` 这一组节点横向并排，就能参考多张图像并把它们混合起来。

![](/media/basic-workflows/flux-1-tools/legacy_gyazo_cd6233194a56e2ceeb597c8877d645ef.png){media=image}

[](/workflows/basic-workflows/flux-1-tools/flux_1_redux_multi.json)

### Redux 的问题

再强调一次，Redux 几乎会无视提示词、LoRA 等其他参数。

我觉得最好还是干脆把它当成“批量生成与参考图像极为相似的变体的工具”来用，
不过也有自定义节点能让提示词在一定程度上发挥控制作用。仅供参考。

* [kaibioinfo/ComfyUI_AdvancedRefluxControl](https://github.com/kaibioinfo/ComfyUI_AdvancedRefluxControl)
