---
layout: page.njk
lang: zh
section: basic-workflows
slug: moss-image
navId: moss-image
title: "MOSS-Image"
created: 2026-10-17
updated: 2026-10-17
summary: "用 MOSS-Image 生成图像"
seoTitle: "在 ComfyUI 中使用 MOSS-Image：表现自由度很高的图像生成模型"
seoDescription: "MOSS-Image 是用约 32 亿张图像从零预训练的 5B 图像生成模型，表现自由度很高。本文介绍它在 ComfyUI 中的用法，包括模型下载、提示词写法、text2image 以及用 BBOX 指定布局的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/moss-image/moss_image_hero.png"
tags: []
---

## MOSS-Image 是什么？

[MOSS-Image](https://openmoss.ai/MOSS-Image/) 是用约 32 亿张图像从零开始预训练的 5B 图像生成模型。

有意思的是，它的训练数据几乎没有做质量过滤。带水印或模糊的图像也没有丢掉，而是加上描述后一起拿来训练。  
也许正因为如此，它的表现自由度非常高。尤其是动漫风格的画面能稳定到这种程度，放眼最前沿的模型也很少见。

它采用允许商用的宽松许可证，很期待它接下来会在社区里怎样发展。

{% runpod %}

---

## 推荐设置

- 分辨率
  - 1MP ～ 2MP（最大 4MP）
  - 宽和高都要是 16 的倍数

---

## 下载模型

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

## 提示词

除了自然语言，也支持标签格式。使用标签时，请按下面的顺序书写，和 [Anima](/zh/basic-workflows/anima/) 有点像。

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
  - 据说把它关掉后，画面会变得非常写实，代价是更容易崩坏……关掉时确实经常崩，所以这里折中设成了 0.5。

{% outputs %}
![output](/media/basic-workflows/moss-image/moss_image_text2image_output.png){media=image}
{% endoutputs %}

### text2image with BBOX

用 BBOX 可以指定什么东西放在哪里。

![](/media/basic-workflows/moss-image/moss_image_text2image_bbox.png){media=image}

[](/workflows/basic-workflows/moss-image/moss_image_text2image_bbox.json)

- `Create Bounding Boxes`
  - 用来绘制 BBOX 的核心节点。拖动即可添加方框，然后写下想放在那里的内容。
  - `width` / `height` 要和输出尺寸（`Resolution Selector` 的值）一致。
- `MOSS-Image Layout Prompt`
  - 在这里写整张图像的提示词。
  - 它会把方框的信息和提示词整理成 MOSS-Image 训练时使用的 JSON 格式。

{% outputs %}
![output](/media/basic-workflows/moss-image/moss_image_text2image_bbox_output.png){media=image}
{% endoutputs %}
