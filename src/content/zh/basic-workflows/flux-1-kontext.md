---
layout: page.njk
lang: zh
section: basic-workflows
slug: flux-1-kontext
navId: flux-1-kontext
title: "Flux.1 Kontext"
created: 2025-12-11
updated: 2026-03-02
summary: "用 Flux.1 Kontext 进行基于指令的图像编辑。"
seoTitle: "在 ComfyUI 中使用 Flux.1 Kontext：基于指令的图像编辑"
seoDescription: "用文字指令编辑图像的 Flux.1 Kontext [dev] 在 ComfyUI 中的用法。介绍模型下载、基本工作流、提示词写法，以及画风转换、物体去除、文字替换等示例。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-1-kontext/legacy_gyazo_79c075e47d999e282c8a2cd3c05f10ef.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## 什么是 Flux.1 Kontext？

Flux.1 Kontext 是以 [Flux.1](/zh/basic-workflows/flux-1/) 为基础的基于指令的图像编辑模型。

以 nano banana 为代表的 AI 图像编辑能火起来，点燃这把火的毫无疑问就是这个模型吧。

和 Flux.1 一样，它有 `pro`/`max`/`dev` 3 个版本，但能在本地使用的只有 `dev`。


---

## 什么是基于指令的图像编辑？

输入图像和文字指令后，按照指令来编辑图像的模型，本站称为 **基于指令的图像编辑模型**。

比如，你想把照片里那位女性的头发改成红色。  
以前的做法是：给头发加蒙版，又因为不想改变发型而加上 ControlNet Canny，然后再用“红发女性的照片”之类的提示词进行 inpainting。

用基于指令的图像编辑就简单了。把图像交给模型，然后像制作人拜托设计师那样 **指示** 一句“把她的头发改成红色”就行。

改表情、删掉碍事的物体、转换画风……

这些全都只靠一个模型和提示词就能做到。

---

## 下载模型

Kontext 的基本构成也和普通的 Flux.1 一样。

* diffusion_models

  * [flux1-dev-kontext_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/flux1-kontext-dev_ComfyUI/blob/main/split_files/diffusion_models/flux1-dev-kontext_fp8_scaled.safetensors)

* clip / T5 / VAE

  * [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
  * [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
  * [ae.safetensors](https://huggingface.co/Comfy-Org/z_image/blob/main/split_files/vae/ae.safetensors)

* gguf（任意）

  * [flux1-kontext-dev.gguf](https://huggingface.co/QuantStack/FLUX.1-Kontext-dev-GGUF/blob/main/flux1-kontext-dev.gguf)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── flux1-dev-kontext_fp8_scaled.safetensors
    ├── 📂clip/
    │   ├── clip_l.safetensors
    │   └── t5xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂vae/
    │   └── ae.safetensors
    └── 📂unet/
        └── flux1-kontext-dev.gguf      ← 仅在使用 gguf 时
```

---

## 工作流（基本形）

Kontext 的工作流本身很简单，只是在普通的 Flux.1 上加了一个 `ReferenceLatent`。

![](/media/basic-workflows/flux-1-kontext/legacy_gyazo_b872b5de146a585c0c9745168d5f1dae.png){media=image}

[](/workflows/basic-workflows/flux-1-kontext/flux_1_kontext.json)

* 🟪 加载 `flux1-dev-kontext_fp8_scaled.safetensors`。
* 🟩 用 `FluxKontextImageScale` 节点，把输入图像缩放到适合 Kontext 的分辨率。
  - Flux 有一组推荐分辨率，它会从中 **自动选出宽高比最接近的那个**。
* 🟩 把缩放后的图像转换成 latent，连接到 `ReferenceLatent`。

---

## 提示词写法

基本上按照官方的提示词指南来写。
- [FLUX.1 Kontext Prompting Guide](https://docs.bfl.ai/guides/prompting_guide_kontext_i2i)

话虽如此，也没有什么特别的写法。
用 **“把〇〇改成△△”** 的形式，直接用英语写出想做的事，大体上就能生效。

如果连不想改的地方也变了（例如只想改发型，结果背景也变了），就像下面这样明确写出“不希望改变的条件”。

- e.g. `Keep the person's pose, position, and size the same.`

> [!NOTE]
> 不过，受限于模型的性能，它也经常不太听指令。  
> 现阶段还是别要求太多为好。

---

## 能做的事

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_79c075e47d999e282c8a2cd3c05f10ef.png {media=image}", width=50, align="left" %}
### 图像编辑

```text
Change the hair to a messy blonde bob.
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_677d45b54c4f1c9c278ae230e7b000b9.png {media=image}", width=50, align="left" %}
### 画风转换

```text
This character is made out of Lego blocks.
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_7a409e39ee00b1766ee164df76b0ac7c.png {media=image}", width=50, align="left" %}
### 物体去除

```text
Remove the woman
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_49bb5579217513e0b774d0952579bd4f.png {media=image}", width=50, align="left" %}
### 文字替换

```text
Replace [OPEN] with [FLUX]
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_6abbbb3aacaddf5df09d459f29466e93.png {media=image}", width=50, align="left" %}
### Subject 转移

```text
A photo of a girl who received a stuffed elephant as a Christmas present.
```

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_84db6461613ef8253aa130778cdb4305.png {media=image}", width=50, align="left" %}
### 用参考框指定位置

```text
Add a sailing ship to the box position.
```

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-1-kontext/legacy_gyazo_dae38a4ef8ee07c4a5922992c585578a.png {media=image}", width=50, align="left" %}
### 粗糙拼贴的精修

这种编辑会把手工制作的拼贴图像 **融为一体**。


```text
Transform the flat duck sticker into a realistic plush duck toy with the same blue hat and place it in the woman’s arms so she is naturally hugging it. Also turn the outlined pendant lamp into a realistic lamp, removing the white sticker edges and matching the scene’s lighting, color, and perspective.
```

也有能增强这项能力的 LoRA。

- [Place it Flux Kontext LoRA](https://civitai.com/models/1780962/place-it-flux-kontext-lora)

{% endmediaRow %}
