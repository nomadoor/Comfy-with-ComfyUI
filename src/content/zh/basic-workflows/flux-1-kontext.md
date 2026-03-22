---
layout: page.njk
lang: zh
section: basic-workflows
slug: flux-1-kontext
navId: flux-1-kontext
title: "Flux.1 Kontext"
summary: "在 Flux.1 Kontext 中进行指令基础的图像编辑。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/79c075e47d999e282c8a2cd3c05f10ef.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## 什么是 Flux.1 Kontext？

Flux.1 Kontext 是以 [Flux.1](/zh/basic-workflows/flux-1/) 为基础的指令基础图像编辑模型。

点燃以 nano banana 为首的 AI 图像编辑这个任务流行的导火索的，毫无疑问就是这个模型吧。

和 Flux.1 一样有 `pro`/`max`/`dev` 3 个变体，但能在本地使用的只有 `dev`。


---

## 什么是指令基础图像编辑？

输入图像和文本指令，就会遵从那个指令编辑图像的模型，本站称之为 **指令基础图像编辑模型**。

例如，想把照片里写着的女性的头发变成红色。  
至今为止，是掩盖头发，为了不想改变发型而添加 ControlNet Canny，在此之上用“红发的女性照片”等提示词进行 inpainting。

如果是指令基础图像编辑就很简单。将图像交给模型，像制作人拜托设计师那样 **指示** “把女性的头发变红”就行了。

改变表情，删除碍事的对象，转换画风。

全部，仅靠一个模型和提示词就能实现。

---

## 模型的下载

Kontext 也是，基本构成和通常的 Flux.1 一样。

* diffusion_models

  * [flux1-dev-kontext_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/flux1-kontext-dev_ComfyUI/blob/main/split_files/diffusion_models/flux1-dev-kontext_fp8_scaled.safetensors)

* clip / T5 / VAE

  * [clip_l.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
  * [t5xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp8_e4m3fn_scaled.safetensors)
  * [ae.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)

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

Kontext 的工作流本身，是在通常的 Flux.1 中只添加了 `ReferenceLatent` 的简单构成。

![](https://gyazo.com/b872b5de146a585c0c9745168d5f1dae){gyazo=image}

[](/workflows/basic-workflows/flux-1-kontext/Flux.1-Kontext.json)

* 🟪 读取 `flux1-dev-kontext_fp8_scaled.safetensors`。
* 🟩 在 `FluxKontextImageScale` 节点，将输入图像调整为面向 Kontext 的分辨率。
  - 虽然有 Flux 推荐的分辨率，但会从中 **自动选择纵横比相近的分辨率**。
* 🟩 将调整后的图像转换为 latent，连接到 `ReferenceLatent`。

---

## 提示词的写法

基本上遵从官方的提示词指南。
- [FLUX.1 Kontext Prompting Guide](https://docs.bfl.ai/guides/prompting_guide_kontext_i2i)

话虽如此，并没有什么特别的记法。
以 **“把〇〇做成△△”** 的形式，用英语原样写想做的事情大体就能动。

如果连不想改变的地方都变了的时候（例：只想改变发型但连背景都变了），像下面这样明示“不希望改变的条件”。

- e.g. `Keep the person's pose, position, and size the same.`

> 话虽如此，作为模型的性能，经常也有不怎么听从指令的情况。  
> 还不可以要求太多。

---

## 能做的事

{% mediaRow img="https://gyazo.com/79c075e47d999e282c8a2cd3c05f10ef {gyazo=image}", width=50, align="left" %}
### 图像编辑

```text
Change the hair to a messy blonde bob.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/677d45b54c4f1c9c278ae230e7b000b9 {gyazo=image}", width=50, align="left" %}
### 画风转换

```text
This character is made out of Lego blocks.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/7a409e39ee00b1766ee164df76b0ac7c {gyazo=image}", width=50, align="left" %}
### 对象除去

```text
Remove the woman
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/49bb5579217513e0b774d0952579bd4f {gyazo=image}", width=50, align="left" %}
### 文本置换

```text
Replace [OPEN] with [FLUX]
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/6abbbb3aacaddf5df09d459f29466e93 {gyazo=image}", width=50, align="left" %}
### Subject 转印

```text
A photo of a girl who received a stuffed elephant as a Christmas present.
```

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/84db6461613ef8253aa130778cdb4305 {gyazo=image}", width=50, align="left" %}
### 根据向导的位置指定

```text
Add a sailing ship to the box position.
```

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/dae38a4ef8ee07c4a5922992c585578a {gyazo=image}", width=50, align="left" %}
### 杂乱 Collage 的 Refine

进行将手动制作的拼贴图像 **溶入** 的编辑。


```text
Transform the flat duck sticker into a realistic plush duck toy with the same blue hat and place it in the woman’s arms so she is naturally hugging it. Also turn the outlined pendant lamp into a realistic lamp, removing the white sticker edges and matching the scene’s lighting, color, and perspective.
```

也有以此能力为基础的 LoRA。

- [Place it Flux Kontext LoRA](https://civitai.com/models/1780962/place-it-flux-kontext-lora)

{% endmediaRow %}
