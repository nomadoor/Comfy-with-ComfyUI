---
layout: page.njk
lang: zh
section: basic-workflows
slug: pika-h3-flex
navId: pika-h3-flex
title: "Pika H3 Flex"
created: 2026-11-02
updated: 2026-11-02
summary: "使用 Pika H3 Flex 以 6 步生成视频和音频"
seoTitle: "在 ComfyUI 中使用 Pika H3 Flex：6 步运行 MiniMax H3"
seoDescription: "Pika 在 MiniMax H3 基础上追加训练的 Pika H3 Flex 在 ComfyUI 中的用法。以 6 步生成视频和音频。讲解所需模型、推荐设置，以及 text2video、image2video、首尾帧、Reference Generation、Video Editing、空间 Inpainting 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/pika-h3-flex/pika_h3_flex_hero.mp4"
tags: []
---
## 什么是 Pika H3 Flex？

[Pika H3 Flex](https://pika.art/blog/pika-h3-flex-research) 是 Pika 在 MiniMax H3 基础上追加训练的模型。

Pika 自己也在开发视频生成模型，训练时用的就是他们自己的数据集。

画质有所提升，又通过步数蒸馏缩减到 6 步，生成起来非常顺畅。

> [!NOTE]
> 基本用法与 [MiniMax H3](/zh/basic-workflows/minimax-h3/) 相同。提示词的写法和用到的节点，请参考那一页。

{% runpod %}

---

## 推荐设置

- 分辨率
  - 768p、约 1 MP
  - 宽度和高度应为 32 的倍数
- FPS
  - 24 FPS
- 帧数
  - `17n + 5`
- 视频长度
  - 5～15 秒

---

## 下载模型

### LoRA

- loras
  - [pika_h3_flex_fl2va_v1_bf16.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/loras/pika_h3_flex_fl2va_v1_bf16.safetensors) (1.96 GB)
  - [pika_h3_flex_ref2va_v1_bf16.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/loras/pika_h3_flex_ref2va_v1_bf16.safetensors) (1.96 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── pika_h3_flex_fl2va_v1_bf16.safetensors
        └── pika_h3_flex_ref2va_v1_bf16.safetensors
```

### 基础模型

- checkpoints
  - [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors) (1.75 GB)
- diffusion_models
  - [minimax_h3_fl2va_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_fl2va_pruned_int8_convrot.safetensors) (21 GB)
  - [minimax_h3_ref2va_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_ref2va_pruned_int8_convrot.safetensors) (21 GB)
- text_encoders
  - [qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/text_encoders/qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors) (15.7 GB)
- vae
  - [minimax_h3_audio_vae_fp32.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_audio_vae_fp32.safetensors) (605 MB)
  - [minimax_h3_video_vae_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_video_vae_int8_convrot.safetensors) (2.81 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── sam3.1_multiplex_fp16.safetensors
    ├── 📂diffusion_models/
    │   ├── minimax_h3_fl2va_pruned_int8_convrot.safetensors
    │   └── minimax_h3_ref2va_pruned_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors
    └── 📂vae/
        ├── minimax_h3_audio_vae_fp32.safetensors
        └── minimax_h3_video_vae_int8_convrot.safetensors
```

---

## text2video / T2VA

使用模型：`fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_t2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_t2va.json)

- `Load LoRA`
  - 以 strength `1.0` 应用 `pika_h3_flex_fl2va_v1_bf16.safetensors`
- `SamplerCustomAdvanced` + `ManualSigmas`
  - 使用 Pika 指定的 6 步 sigma
  - `1.0, 0.972973, 0.923077, 0.8, 0.571429, 0.333333, 0.0`
  - sampler 为 `lcm`

{% outputs %}
![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_t2va_output.mp4){media=player}
{% endoutputs %}

---

## image2video / I2VA

使用模型：`fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_i2va.json)

{% outputs %}
![input](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va_input.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va_output.mp4){media=loop}
{% endoutputs %}

---

## First / Last Frame to Video

使用模型：`fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va.json)

{% outputs %}
![first](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_input1.png){media=image} ![last](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_input2.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_output.mp4){media=loop}
{% endoutputs %}

---

## Reference Generation

使用模型：`ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation.json)

- `Load LoRA`
  - 以 strength `1.0` 应用 `pika_h3_flex_ref2va_v1_bf16.safetensors`

{% outputs %}
![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation_output.mp4){media=player}
{% endoutputs %}

---

## Video Editing

使用模型：`ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing.json)

{% outputs %}
![input video](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing_input.mp4){media=loop} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing_output.mp4){media=loop}
{% endoutputs %}

---

## 空间 Inpainting

使用模型：`ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting.json)

{% outputs %}
![input](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_input_video.mp4){media=loop} ![ref](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_input_image.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_output.mp4){media=loop}
{% endoutputs %}

---

## 参考资料

- [Pika H3 Flex](https://github.com/Pika-Labs/Pika-H3-Flex)
- [Pika H3 Flex ComfyUI Workflows](https://docs.comfy.org/tutorials/video/pika/pika-h3-flex)
