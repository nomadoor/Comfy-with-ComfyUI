---
layout: page.njk
lang: en
section: basic-workflows
slug: wan-2-1
navId: wan-2-1
title: "Wan 2.1"
summary: "Basic workflow for handling text2video, image2video, and FLF2V with Wan2.1"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f952fb311ffdb409a173641f61dd3b67.png"
tags: []
---

## What is Wan2.1?

**Wan2.1** is an open-source video generation model developed by Alibaba.

It is an impressive model that can be said to be the catalyst for full-scale video generation in the open-source community.

It supports three modes: text2video, image2video, and FLF2V.
It can also be used as an image generation model by generating only 1 frame.

Although it is a minor detail, this does not mean that "video generation includes image generation", but rather that it is **a video generation model designed from the start to be capable of image generation as well**.

Two model sizes, 1.3B and 14B, are available, but since 1.3B lacks performance and is rarely used, we will only use 14B here.

---

## Recommended Settings

- Recommended Resolution
  - 480p (854×480) - 720p (1280×720)
- Maximum Number of Frames
  - 81 frames
- FPS
  - Often output around 16fps

Since 16fps often results in slow-motion video, adjust it by saving at 24fps or dropping frames.

---

## Model Download

- diffusion models
  - [wan2.1_t2v_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_t2v_14B_fp8_e4m3fn.safetensors)
  - [wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors)
  - [wan2.1_flf2v_720p_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_flf2v_720p_14B_fp8_e4m3fn.safetensors)
- text encoder
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf (Optional)
  - [Wan2.1-T2V-14B-gguf](https://huggingface.co/city96/Wan2.1-T2V-14B-gguf/tree/main)
  - [Wan2.1-I2V-14B-720P-gguf](https://huggingface.co/city96/Wan2.1-I2V-14B-720P-gguf/tree/main)
  - [Wan2.1-FLF2V-14B-720P-gguf](https://huggingface.co/city96/Wan2.1-FLF2V-14B-720P-gguf/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── wan2.1_t2v_14B_fp8_e4m3fn.safetensors
    │   ├── wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors
    │   └── wan2.1_flf2v_720p_14B_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   ├── wan2.1-t2v-14b-XXXX.gguf          ← Only when using gguf
    │   ├── wan2.1-i2v-14b-720p-XXXX.gguf     ← Only when using gguf
    │   └── wan2.1-flf2v-14b-720p-XXXX.gguf   ← Only when using gguf
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

> If you want to use the fp16 / bf16 version, please read the file names above as needed. The basic placement path is the same.

---

## text2video

This is the basic text2video workflow for Wan2.1.

![](https://gyazo.com/58d4a88ecb1e1e2887c830c371236b40){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_text2video_14B.json)

- 🟦 `Shift` in the `ModelSamplingSD3` node is a parameter that affects the magnitude of movement.

  - Moving it up increases the camera work and changes in the subject, but if it is too high, it causes collapse. For now, leaving it at `8` should be fine.
  - cf. [Wan2.1 parameter sweep](https://replicate.com/blog/wan-21-parameter-sweep#what-is-shift)

---

### Quality Improvement Techniques

Although it is not noticeably different, a technology that improves quality with almost no downside is implemented as a core node, so let's use it.

![](https://gyazo.com/02c625103e8076b8a1f14046839e1ff9){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_text2video_14B_imp.json)

- 🟦 **UNetTemporalAttentionMultiply**

  - Reinforces consistency between frames and suppresses flickering.
- 🟦 **CFG-Zero**

  - Prevents breakdown due to excessive correction by weakening CFG early in sampling.

---

## image2video

When given an image, it generates a continuation from that image.

![](https://gyazo.com/2cbaf276cd5e4f6751826c34efb6c743){gyazo=image}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_image2video_14B.json)

- 🟩 Input an appropriately resized image into both `CLIP Vision Encode` and `WanImageToVideo`.

---

## FLF2V (First–Last Frame to Video)

Give two images and generate a video so that the gap between them is filled naturally.

![](https://gyazo.com/44220286b8ce6e0e70db622132527c02){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_FLF2V_14B.json)

- 🟩 Batch two images and input them into the `WanFirstLastFrameToVideo` node.

---

## Self Forcing (Fast Generation)

This is originally a technique for real-time video generation, but in ComfyUI, we use it as a speed-up method by simply generating a few steps.

### Model Download

- loras

  - [Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-T2V-14B-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)
  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
        └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
```

### workflow

![](https://gyazo.com/6e4854ea69598ba4b9c3d8bc259f4b57){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_text2video_14B_Self-Forcing.json)

- Load LoRA with the `LoraLoaderModelOnly` node.
- Set `steps` in `KSampler` to 4 - 8 and `CFG` to 1.0.

> Self Forcing is an option for "when you want to run it fast anyway".
> Degradation is large, although not unacceptable.

---

## Image Generation

Simply generate a video with **1 frame** using the text2video workflow.

![](https://gyazo.com/edf26ea1ef891b721579af1dc5aa6bd1){gyazo=image}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_text2image_14B.json)
