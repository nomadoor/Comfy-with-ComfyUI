---
layout: page.njk
lang: zh
section: basic-workflows
slug: flux-1-tools
navId: flux-1-tools
title: "Flux.1 Tools"
summary: "Flux.1 Tools 的使用方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/204fbd9af3c371511c01a0c97cac40e8.png"
tags: ["controlnet"]
---

## 什么是 Flux.1 Tools？

在 Flux.1 中，除了基础模型以外，Flux 官方还推出了相当于 [ControlNet](/zh/basic-workflows/sd15-controlnet/) 和 [IP-Adapter](/zh/basic-workflows/sd15-ip-adapter/) 的派生模型。

- `FLUX.1 Fill` … inpainting / outpainting 用模型
- `FLUX.1 Depth` / `FLUX.1 Canny` … 用构造基础的引导（Depth / Canny）保持形状原样重绘的模型
- `FLUX.1 Redux` … 量产与参考图像一模一样的变体，面向 Flux 的 IP-Adapter 式模型

---

## FLUX.1 Fill

可以和 inpainting 模型完全一样地使用。

### 模型的下载

- [FLUX.1-Fill-dev_fp8.safetensors](https://huggingface.co/1038lab/FLUX.1-Fill-dev_fp8/blob/main/FLUX.1-Fill-dev_fp8.safetensors)  
```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        └── FLUX.1-Fill-dev_fp8.safetensors
```

### 工作流

![](https://gyazo.com/ab4e4b0f5c9fe2030ebd637b15ac144d){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Fill.json)

* 🟪 在 `Load Diffusion Model` 节点读取 `flux1-fill-dev.safetensors`。
* 🟩 在 Flux.1 的工作流中，也和 Stable Diffusion 1.5 的 [inpainting](/zh/basic-workflows/sd15-inpainting/) 一样添加 `InpaintModelConditioning` 节点。

  * 输入图像和掩膜。

---

## FLUX.1 Depth / FLUX.1 Canny

可以用和 ControlNet Depth / Canny 相同的感觉使用。

### 模型的下载

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

![](https://gyazo.com/8b4d310e8b9228e6e2be3b422150e01c){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Depth.json)

* 🟩 向 `InstructPixToPixConditioning` 节点输入控制用图像。
* 🟦 这次是 Depth，所以用 Depth Anything V2 制作深度图。

  * 因为这个深度图的图像尺寸会直接变成输出的图像尺寸，所以调整为适当的尺寸。

> Canny 版中，以相同的构成输入 Canny 边缘图像。

---

## FLUX.1 Redux

`FLUX.1 Redux` 是传递一张以上的参考图像，生成强烈贴近那个图像的变体的模型。  
虽然接近 IP-Adapter，但 Redux 提示词相当难生效，参考图像的外观几乎原样出来。

### 模型的下载

Redux 作为与 Flux 本体不同的“风格模型”读取。  
而且，也需要用于编码参考图像的 CLIP-ViT。

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

![](https://gyazo.com/90588b4c7bc62bf7218901c901f31b8f){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Redux.json)

* 🟩 添加 `Apply Style Model` 节点，连接 Style 模型和 `CLIP Vision Encode`。

  * 在 `CLIP Vision Encode` 节点，连接 `sigclip_vision_patch14_384.safetensors` 和参考图像。

### 混合多张

如果横向排列 `Apply Style Model` 块，也可以参照多张图像进行混合。

![](https://gyazo.com/cd6233194a56e2ceeb597c8877d645ef){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Redux_multi.json)

### Redux 的问题

重申一下，Redux 几乎会无视提示词和 LoRA 等其他参数。

我认为干脆认为它是“量产与参考图像一模一样的变体的工具”来使用是最好的，
但也有能让提示词在某种程度上也能控制的自定义节点。仅供参考。

* [kaibioinfo/ComfyUI_AdvancedRefluxControl](https://github.com/kaibioinfo/ComfyUI_AdvancedRefluxControl)
