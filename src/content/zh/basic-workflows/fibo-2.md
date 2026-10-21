---
layout: page.njk
lang: zh
section: basic-workflows
slug: fibo-2
navId: fibo-2
title: "Fibo 2.0"
created: 2026-10-21
updated: 2026-10-21
summary: "用 Fibo 2.0 生成和编辑图像"
seoTitle: "在 ComfyUI 中使用 Fibo 2.0：用结构化提示词生成和编辑图像"
seoDescription: "Bria AI 的 8B 模型 Fibo 2.0 在 ComfyUI 中的用法。介绍 text2image、图像编辑、多参考编辑（编辑还附带 4 步的 Edit Turbo 版），以及用 MLLM 生成结构化提示词（VGL）的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/fibo-2/fibo_2_hero.png"
tags: []
---

## Fibo 2.0 是什么？

[Fibo 2.0](https://huggingface.co/briaai/Fibo-2.0-dev) 是 Bria AI 推出的 8B 图像生成与编辑模型。

上一代的 [FIBO](https://github.com/Bria-AI/FIBO) 比 [Ideogram 4.0](/zh/basic-workflows/ideogram-4/) 更早就把重点放在了 JSON 格式的结构化提示词上。

Fibo 2.0 是它的后继版本，保留了这个特点，同时也能编辑图像了。

这种结构化提示词叫作 VGL（Visual GenAI Language）。好在 Fibo 2.0 用普通的句子也能有不错的效果。  
也可以把简单的指示交给 MLLM，让它改写成 VGL。

模型有两个：既能生成也能编辑的 **Dev**，以及只用于编辑、4 步就能出图的 **Edit Turbo**。

> [!NOTE]
> 本页每个任务都放了 Dev 的工作流。图像编辑部分还在旁边放了 Edit Turbo 的工作流。

{% runpod %}

---

## 推荐设置

- 分辨率
  - 约 1MP
  - 宽和高都要是 16 的倍数
- 参考图像数量
  - 最多 4 张

---

## 下载模型

- diffusion_models
  - [fibo2_dev_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/diffusion_models/fibo2_dev_int8_convrot.safetensors) (8.41 GB)
  - [fibo2_edit_turbo_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/diffusion_models/fibo2_edit_turbo_int8_convrot.safetensors) (8.41 GB)
- text_encoders
  - [qwen3vl_4b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/text_encoders/qwen3vl_4b_int8_convrot.safetensors) (4.86 GB)
  - [qwen3.5_9b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MOSS-Image/blob/main/text_encoders/qwen3.5_9b_int8_convrot.safetensors) (9.75 GB)
    - 🚨 生成 VGL 时使用（可选）
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Fibo-2.0/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── fibo2_dev_int8_convrot.safetensors
    │   └── fibo2_edit_turbo_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   ├── qwen3vl_4b_int8_convrot.safetensors
    │   └── qwen3.5_9b_int8_convrot.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

---

## 基础工作流

### 图像生成

![](/media/basic-workflows/fibo-2/fibo_2_dev_text2image.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_text2image.json)

- `steps`: 30
- `cfg`: 5.0

{% outputs %}
![output](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_output.png){media=image}
{% endoutputs %}

### 图像编辑

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit.json)

- `TextEncodeFibo2`
  - 把 `width` / `height` 设为 0，就会直接使用输入图像的尺寸

Edit Turbo 只需修改以下参数。
- `steps`: 4
- `cfg`: 1.0

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_input.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_output.png){media=image}
{% endoutputs %}

### 图像编辑（多参考）

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi.json)

在提示词里，请按接入 `TextEncodeFibo2` 的顺序，用 `<image_1>`、`<image_2>` 指明说的是哪张图。

```text
Replace the pink-haired girl on the right of <image_1> with the mechanic woman from <image_2>.
```

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_input1.png){media=image} ![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_input2.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_output.png){media=image}
{% endoutputs %}

---

## 使用 VGL（用 MLLM 生成结构化提示词）

用上结构化提示词，才能真正发挥 FIBO 的看家本领。  
不过从零开始手写 JSON 太费劲，所以就让 MLLM 把自然语言改写成 VGL 的 JSON 吧。

系统提示词用的是 Bria 的 [bria-vgl](https://github.com/Bria-AI/vgl/tree/dev/src/bria_vgl/dialects/thales/prompts) 里为 Gemini 准备的版本，我针对 Qwen3.5 稍微做了调整。  
图像生成、图像编辑和多参考各用一份内容不同的系统提示词，注意不要混用。

> [!NOTE]
> MLLM 用的是 Qwen3.5 9B。也可以直接复用作为文本编码器加载的 Qwen3-VL 4B，但它的能力不足以胜任这项工作，所以不推荐。

### 图像生成

![](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl.json)

结构化提示词的特点，是可以像调参数一样只改其中一部分。  
用生成好的 JSON 提示词，试着只把摄像机角度之类的地方换掉，再生成一次看看。

{% outputs %}
![原始 JSON](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl_output.png){media=image} ![只把 camera_angle 改成 Low angle](/media/basic-workflows/fibo-2/fibo_2_dev_text2image_vgl_output2.png){media=image}
{% endoutputs %}

### 图像编辑

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_vgl.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl.json)

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_vgl_input.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_vgl_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_vgl_output.png){media=image}
{% endoutputs %}

### 图像编辑（多参考）

![](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl.png){media=image}

[](/workflows/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_vgl.json)

[](/workflows/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl.json)

要把多张图像输入 `Generate Text`，需要先用 `Batch Images` 合成一个批次。

不过，`Batch Images` 会把第 2 张及之后的图像裁剪成和第 1 张相同的分辨率。  
如果图像方向不同，比如第 1 张是竖图、第 2 张是横图，请先用 pad 补出留白，免得画面被裁掉。

{% outputs %}
![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_vgl_input1.png){media=image} ![input](/media/basic-workflows/fibo-2/fibo_2_image_edit_multi_vgl_input2.png){media=image} ![Dev](/media/basic-workflows/fibo-2/fibo_2_dev_image_edit_multi_vgl_output.png){media=image} ![Edit Turbo](/media/basic-workflows/fibo-2/fibo_2_edit_turbo_image_edit_multi_vgl_output.png){media=image}
{% endoutputs %}
