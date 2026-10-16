---
layout: page.njk
lang: en
section: basic-workflows
slug: wan-2-1
navId: wan-2-1
title: "Wan 2.1"
created: 2025-12-12
updated: 2026-03-02
summary: "Basic workflows for text2video, image2video, and FLF2V with Wan2.1"
seoTitle: "Wan 2.1 in ComfyUI: text2video, image2video, FLF2V"
seoDescription: "Use Alibaba's Wan 2.1 in ComfyUI: settings, model downloads, text2video, image2video, FLF2V (first and last frame), and fast Self Forcing."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/wan-2-1/legacy_gyazo_f952fb311ffdb409a173641f61dd3b67.png"
tags: []
---

## What is Wan2.1?

**Wan2.1** is an open-source video generation model developed by Alibaba.

It's a memorable model: you could say it's the one that got serious video generation going in the open-source world.

It supports three modes: text2video, image2video, and FLF2V.
It can also be used as an image generation model by generating only 1 frame.

This is a fine point, but it's not that "video generation happens to include image generation". It's **a video generation model designed from the start to do image generation too**.

It comes in two sizes, 1.3B and 14B. The 1.3B model just isn't capable enough and hardly anyone uses it, so this page only uses 14B.

---

## Recommended Settings

- Recommended Resolution
  - 480p (854×480) - 720p (1280×720)
- Maximum Number of Frames
  - 81 frames
- FPS
  - Output is usually around 16fps

At 16fps the video often looks like slow motion, so save it at 24fps or drop frames to adjust.

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

> [!TIP]
> If you want the fp16 / bf16 versions, swap in those file names for the fp8 ones above. They go in the same folders.

---

## text2video

This is the basic text2video workflow for Wan2.1.

![](/media/basic-workflows/wan-2-1/legacy_gyazo_58d4a88ecb1e1e2887c830c371236b40.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_text2video_14b.json)

- 🟦 `Shift` in the `ModelSamplingSD3` node controls how much movement you get.

  - Higher values mean bigger camera moves and more change in the subject, but too high and things start to break down. Leaving it at `8` should be fine for now.
  - cf. [Wan2.1 parameter sweep](https://replicate.com/blog/wan-21-parameter-sweep#what-is-shift)

---

### Quality Improvement Techniques

The difference isn't something you'd really notice, but these techniques improve quality with almost no downside and are available as core nodes, so you might as well use them.

![](/media/basic-workflows/wan-2-1/legacy_gyazo_02c625103e8076b8a1f14046839e1ff9.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_text2video_14b_imp.json)

- 🟦 **UNetTemporalAttentionMultiply**

  - Reinforces consistency between frames and suppresses flickering.
- 🟦 **CFG-Zero**

  - Prevents breakdown due to excessive correction by weakening CFG early in sampling.

---

## image2video

When given an image, it generates a continuation from that image.

![](/media/basic-workflows/wan-2-1/legacy_gyazo_2cbaf276cd5e4f6751826c34efb6c743.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_image2video_14b.json)

- 🟩 Input an appropriately resized image into both `CLIP Vision Encode` and `WanImageToVideo`.

---

## FLF2V (First–Last Frame to Video)

Give two images and generate a video so that the gap between them is filled naturally.

![](/media/basic-workflows/wan-2-1/legacy_gyazo_44220286b8ce6e0e70db622132527c02.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_flf2v_14b.json)

- 🟩 Batch two images and input them into the `WanFirstLastFrameToVideo` node.

---

## Self Forcing (Fast Generation)

It was originally a technique for real-time video generation, but in ComfyUI we just use it as a speed-up: generating in a few steps.

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

![](/media/basic-workflows/wan-2-1/legacy_gyazo_6e4854ea69598ba4b9c3d8bc259f4b57.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_text2video_14b_self_forcing.json)

- Load the LoRA with the `LoraLoaderModelOnly` node.
- Set `steps` in `KSampler` to 4 - 8 and `CFG` to 1.0.

> [!NOTE]
> Self Forcing is the option for when you just want it fast.
> The quality loss is significant, though not to the point of being unacceptable.

---

## Image Generation

Just use the text2video workflow and **generate a 1-frame video**.

![](/media/basic-workflows/wan-2-1/legacy_gyazo_edf26ea1ef891b721579af1dc5aa6bd1.png){media=image}

[](/workflows/basic-workflows/wan-2-1/wan2_1_text2image_14b.json)
