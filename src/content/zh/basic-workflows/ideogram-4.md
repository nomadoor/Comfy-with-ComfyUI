---
layout: page.njk
lang: zh
section: basic-workflows
slug: ideogram-4
navId: ideogram-4
title: "Ideogram 4.0"
created: 2026-06-10
updated: 2026-06-18
summary: "使用 Ideogram 4.0 进行图像生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/cb9116562b7693e120aa63eafef11769.png"
tags: []
---

## Ideogram 4.0 是什么？

[Ideogram 4.0](https://ideogram.ai/models/4.0/) 是一个 9.3B 的 DiT 系模型。

它最大的特点是使用 JSON 形式的 caption，可以比较细地指定图像里的各个元素。

以前也有类似思路的 [FIBO](https://github.com/Bria-AI/FIBO)，但 Ideogram 4.0 更擅长用 BBOX 指定坐标，也更擅长颜色指定。海报、Logo、UI、包装这类偏 DTP 的设计任务，会比较适合它。

作为交换，它可能不是那种随手就很好用的模型。提示词必须按既定格式写，才能发挥出本来的效果。

---

## 模型下载

- diffusion_models
  - [ideogram4_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_fp8_scaled.safetensors) (9.28 GB)
  - [ideogram4_nvfp4_mixed.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_nvfp4_mixed.safetensors) (5.49 GB)
  - [ideogram4_unconditional_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_unconditional_fp8_scaled.safetensors) (9.28 GB)
  - [ideogram4_unconditional_nvfp4_mixed.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_unconditional_nvfp4_mixed.safetensors) (5.49 GB)
- text_encoders
  - [qwen3vl_8b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/text_encoders/qwen3vl_8b_fp8_scaled.safetensors) (10.6 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── ideogram4_fp8_scaled.safetensors
    │   ├── ideogram4_nvfp4_mixed.safetensors
    │   ├── ideogram4_unconditional_fp8_scaled.safetensors
    │   └── ideogram4_unconditional_nvfp4_mixed.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_8b_fp8_scaled.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

细节后面再说，因为它会读取两个 Diffusion model，所以相当重。

ComfyUI 内部会处理显存，所以 VRAM 不够也不一定完全不能生成，但可能会非常慢。

想减轻负担，可以使用 `nvfp4`，不过画质会下降。

`unconditional` 侧对质量的影响相对小一些，所以普通侧用 `fp8`，`unconditional` 侧用 `nvfp4`，可能是比较合适的平衡。

---

## 提示词

只用普通自然语言也能生成，但如果不按既定的 JSON schema 来写，质量很难出来。

基本形式如下。

```json
{
  "high_level_description": "图像整体的 1～2 句说明。",
  "style_description": {
    "aesthetics": "氛围、审美方向。",
    "lighting": "光照。",
    "medium": "illustration / photograph / graphic_design 等。",
    "art_style": "非照片时的画风。",
    "color_palette": ["#FFFFFF", "#000000"]
  },
  "compositional_deconstruction": {
    "background": "背景、环境说明。",
    "elements": [
      {
        "type": "obj",
        "bbox": [100, 200, 800, 700],
        "desc": "物体、人物、元素说明。",
        "color_palette": ["#FFFFFF", "#000000"]
      },
      {
        "type": "text",
        "bbox": [820, 200, 920, 800],
        "text": "HELLO",
        "desc": "文字外观说明。",
        "color_palette": ["#000000"]
      }
    ]
  }
}
```

整体说明、风格、背景、各元素说明，结构本身并不复杂。但每次都手写这种东西，还是不太现实。

尤其是坐标指定很麻烦。每个元素要放在图像的哪里，都要用 BBOX 指定，光靠脑子想象基本不可能。

所以这里介绍几种生成提示词的方法。

### 交给 LLM

最轻松的方法，是把官方的 [Prompting Guide](https://github.com/ideogram-oss/ideogram4/blob/main/docs/prompting.md) 和想做的图像说明交给 LLM，让它转换成 JSON caption。

也可以把参考图，或者自己画的草图一起丢给它。

能在 ComfyUI 里本地跑的模型，一般能力不太够，所以还是老老实实交给 ChatGPT、Gemini 之类会比较好。

![](https://gyazo.com/b314abc36bec096b81fb3231a2687064){gyazo=image}

- [Sample chat with ChatGPT](https://chatgpt.com/share/6a28f7cc-e934-8320-86d6-f790a5274389)

### 使用专用提示词构建器

也可以使用专用的提示词构建器，视觉化地制作提示词。

例如 [ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes) 里的 `Ideogram 4 Prompt Builder KJ` 节点，就是比较常用的一个。

![](https://gyazo.com/a1c3a269983b478c1f605e2f0a5c6e4f){gyazo=image}

- 设置生成图像的尺寸，然后填写背景、风格等内容。
- 在 region 栏拖动即可创建 BBOX，并为该区域设置想画的内容提示词和颜色代码。

---

## text2image

![](https://gyazo.com/c9a2cf1717e87cd1ba28c5d236a02b4d){gyazo=image}

[](/workflows/basic-workflows/ideogram-4/Ideogram_4.0_text2image.json)

除了提示词以外，它和普通 workflow 相比还有几个稍微特殊的地方，所以这里只看这些部分。

{% mediaRow img="https://gyazo.com/c0d5e9131313e7c3c5255b4f54d55dbb {gyazo=image}", width=33, align="left" %}
**Load Diffusion Model**

Ideogram 4.0 为了稍微特殊的 CFG，会读取两个 diffusion model。

- 普通的 [CFG](/zh/ai-capabilities/cfg/) 是比较有提示词的结果和没有提示词的结果，把生成方向往提示词靠。
- Ideogram 4.0 的 unconditional 侧不是传入空提示词，而是把不使用文本 token 的 image-only 输入送入 unconditional 用模型。
- 乍看可能会觉得这有什么区别，但可以把它理解成一种更细致处理 positive prompt 的办法。

{% endmediaRow %}

---

## Ideogram 4 TurboTime LoRA

这是 Ostris 发布的 LoRA，可以用于 2〜8 step 生成。

### 模型下载

- loras
  - [ideogram_4_turbotime_v1.safetensors](https://huggingface.co/ostris/ideogram_4_turbotime_lora/blob/main/ideogram_4_turbotime_v1.safetensors) (847 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ideogram_4_turbotime_v1.safetensors
```

### text2image (8 step)

![](https://gyazo.com/1bd65d1d1c703d8890df1f68cc424e35){gyazo=image}

[](/workflows/basic-workflows/ideogram-4/Ideogram_4.0_text2image_turbotime.json)

- 由于使用 CFG 1.0 生成，因此不需要 unconditional model。
- 虽然它标注为 2〜8 step 用 LoRA，但 step 数太少时，图像会明显开始崩。
- 目前建议以 8 step 使用。

{% mediaRow img="https://gyazo.com/26ef78ed5bf868ab5ca9a62b643640ff {gyazo=image}", width=33, align="left" %}
**CFG**

这是很早就有的小技巧：采样前半段和后半段使用不同的 CFG 值。

- 这个 workflow 里，前半段是 CFG 7，后半段是 CFG 3。
- 与其从头到尾一直套很高的 CFG，中途降下来通常更稳定。
- 这里使用的是 `CFG Override` 节点。
- 它只会在指定的 step 范围内覆盖 CFG 值。
- 这个 workflow 里，总步数 70% 之后，`cfg` 会变成 3。

{% endmediaRow %}
