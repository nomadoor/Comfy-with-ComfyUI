---
layout: page.njk
lang: en
section: basic-workflows
slug: pika-h3-flex
navId: pika-h3-flex
title: "Pika H3 Flex"
created: 2026-11-02
updated: 2026-11-02
summary: "Generate video and audio in 6 steps with Pika H3 Flex"
seoTitle: "Pika H3 Flex in ComfyUI: MiniMax H3 in 6 Steps"
seoDescription: "Pika H3 Flex, MiniMax H3 further trained by Pika, generates video with audio in 6 steps. Models, settings, and workflows from text2video to video editing and inpainting."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/pika-h3-flex/pika_h3_flex_hero.mp4"
tags: []
---
## What is Pika H3 Flex?

[Pika H3 Flex](https://pika.art/blog/pika-h3-flex-research) is MiniMax H3 with additional training by Pika.

Pika also builds its own video generation models, and the training used its own dataset.

On top of better quality, step distillation cuts it down to 6 steps, so generation feels very smooth.

> [!NOTE]
> Basic usage is the same as [MiniMax H3](/en/basic-workflows/minimax-h3/). See that page for how to write prompts and which nodes to use.

{% runpod %}

---

## Recommended Settings

- Resolution
  - 768p, about 1 MP
  - Width and height must be multiples of 32
- FPS
  - 24 FPS
- Frames
  - `17n + 5`
- Video length
  - 5–15 seconds

---

## Model Download

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

### Base Models

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

Model: `fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_t2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_t2va.json)

- `Load LoRA`
  - Apply `pika_h3_flex_fl2va_v1_bf16.safetensors` at strength `1.0`
- `SamplerCustomAdvanced` + `ManualSigmas`
  - Use the 6-step sigmas Pika specifies
  - `1.0, 0.972973, 0.923077, 0.8, 0.571429, 0.333333, 0.0`
  - The sampler is `lcm`

{% outputs %}
![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_t2va_output.mp4){media=player}
{% endoutputs %}

---

## image2video / I2VA

Model: `fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_i2va.json)

{% outputs %}
![input](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va_input.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_i2va_output.mp4){media=loop}
{% endoutputs %}

---

## First / Last Frame to Video

Model: `fl2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va.json)

{% outputs %}
![first](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_input1.png){media=image} ![last](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_input2.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_flf2va_output.mp4){media=loop}
{% endoutputs %}

---

## Reference Generation

Model: `ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation.json)

- `Load LoRA`
  - Apply `pika_h3_flex_ref2va_v1_bf16.safetensors` at strength `1.0`

{% outputs %}
![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_reference_generation_output.mp4){media=player}
{% endoutputs %}

---

## Video Editing

Model: `ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing.json)

{% outputs %}
![input video](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing_input.mp4){media=loop} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_video_editing_output.mp4){media=loop}
{% endoutputs %}

---

## Spatial Inpainting

Model: `ref2va`

![](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting.png){media=image}

[](/workflows/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting.json)

{% outputs %}
![input](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_input_video.mp4){media=loop} ![ref](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_input_image.png){media=image} ![output](/media/basic-workflows/pika-h3-flex/pika_h3_flex_spatial_inpainting_output.mp4){media=loop}
{% endoutputs %}

---

## References

- [Pika H3 Flex](https://github.com/Pika-Labs/Pika-H3-Flex)
- [Pika H3 Flex ComfyUI Workflows](https://docs.comfy.org/tutorials/video/pika/pika-h3-flex)
