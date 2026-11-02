---
layout: page.njk
lang: ja
section: basic-workflows
slug: pika-h3-flex
navId: pika-h3-flex
title: "Pika H3 Flex"
created: 2026-11-02
summary: "Pika H3 Flexで映像と音声を6ステップで生成する"
seoTitle: "ComfyUIでPika H3 Flexを使う：MiniMax H3を6ステップで"
seoDescription: "PikaがMiniMax H3を追加学習したPika H3 FlexのComfyUIでの使い方。6ステップで映像と音声を生成します。必要なモデル、推奨設定、text2video、image2video、First / Last Frame、Reference Generation、Video Editing、空間Inpaintingのworkflowを解説します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/pika-h3-flex/pika_h3_flex_hero.mp4"
tags: []
---

## Pika H3 Flexとは？

[Pika H3 Flex](https://pika.art/blog/pika-h3-flex-research) は、Pika が MiniMax H3 を追加学習したモデルです。

Pika は自社でも動画生成モデルを作っている会社で、学習にはそのデータセットが使われています。

品質が上がっているのに加え、ステップ蒸留で 6 ステップになっており、非常に快適に生成できます。

> [!NOTE]
> 基本的な使い方は [MiniMax H3](/ja/basic-workflows/minimax-h3/) と同じです。プロンプトの書き方や使用するノードは、そちらを見てください。

{% runpod %}

---

## 推奨設定値

- 解像度
  - 768p、約 1MP
  - 幅と高さは 32 の倍数にします
- FPS
  - 24 FPS
- フレーム数
  - `17n + 5`
- 動画の長さ
  - 5〜15 秒

---

## モデルのダウンロード

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

### ベースモデル

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

使用モデル：`fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_t2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_t2va.json)

- `Load LoRA`
  - `pika_h3_flex_fl2va_v1_bf16.safetensors` を strength `1.0` で適用します
- `SamplerCustomAdvanced` + `ManualSigmas`
  - Pika が指定している 6 ステップの sigma を使います
  - `1.0, 0.972973, 0.923077, 0.8, 0.571429, 0.333333, 0.0`
  - sampler は `lcm` です

{% outputs %}
![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_t2va_output.mp4){media=player}
{% endoutputs %}

---

## image2video / I2VA

使用モデル：`fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_i2va.json)

{% outputs %}
![input](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va_input.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va_output.mp4){media=loop}
{% endoutputs %}

---

## First / Last Frame to Video

使用モデル：`fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va.json)

{% outputs %}
![first](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_input1.png){media=image} ![last](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_input2.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_output.mp4){media=loop}
{% endoutputs %}

---

## Reference Generation

使用モデル：`ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation.json)

- `Load LoRA`
  - `pika_h3_flex_ref2va_v1_bf16.safetensors` を strength `1.0` で適用します

{% outputs %}
![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation_output.mp4){media=player}
{% endoutputs %}

---

## Video Editing

使用モデル：`ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing.json)

{% outputs %}
![input video](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing_input.mp4){media=loop} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing_output.mp4){media=loop}
{% endoutputs %}

---

## 空間 Inpainting

使用モデル：`ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting.json)

{% outputs %}
![input](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_input_video.mp4){media=loop} ![ref](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_input_image.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_output.mp4){media=loop}
{% endoutputs %}

---

## 参考

- [Pika H3 Flex](https://github.com/Pika-Labs/Pika-H3-Flex)
- [Pika H3 Flex ComfyUI Workflows](https://docs.comfy.org/tutorials/video/pika/pika-h3-flex)
