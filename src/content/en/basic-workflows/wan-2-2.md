---
layout: page.njk
lang: en
section: basic-workflows
slug: wan-2-2
navId: wan-2-2
title: "Wan 2.2"
created: 2025-12-12
updated: 2026-03-02
summary: "Video generation with text2video / image2video / FLF2V in Wan 2.2"
seoTitle: "Wan 2.2 in ComfyUI: 14B and 5B Video Workflows"
seoDescription: "Use Wan 2.2 in ComfyUI: the 14B high/low-noise pair and TI2V-5B, with text2video, image2video, and FLF2V in easy-to-read workflows."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## What is Wan 2.2?

Wan 2.2 is a family of video generation models and the true successor to [Wan 2.1](/en/basic-workflows/wan-2-1/).
It comes in two main models:

- 14B: A two-stage architecture that switches between `high_noise` and `low_noise` models.
- 5B: A TI2V model that handles text2video and image2video with a single model + Wan 2.2 VAE.

---

## Wan 2.2 14B Model

Wan 2.2-A14B has a two-stage pipeline where the `high_noise` model handles the first half of sampling and the `low_noise` model handles the second half.

Splitting it into two models lets them double the model size for better performance without using more VRAM than Wan 2.1.

### Recommended Settings

- Recommended Resolution
  - 480p (854×480) - 720p (1280×720)
- Maximum Number of Frames
  - 81 frames
- FPS
  - Output is usually around 16fps
  - At 16fps, though, the video often looks like slow motion, so save it at 24fps or drop frames to adjust.

### Model Download

- diffusion_models
  - [wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors)
  - [wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors)
  - [wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors)
  - [wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors)
- text_encoders
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors) (Same as Wan2.1)
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors) (Same as Wan2.1)
- gguf (Optional)
  - [Wan2.2-T2V-A14B-GGUF](https://huggingface.co/bullerwins/Wan2.2-T2V-A14B-GGUF/tree/main)
  - [Wan2.2-I2V-A14B-GGUF](https://huggingface.co/bullerwins/Wan2.2-I2V-A14B-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors
    │   ├── wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors
    │   ├── wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors
    │   └── wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   ├── wan2.2_t2v_high_noise_14B-XXXX.gguf    ← Only when using gguf
    │   ├── wan2.2_t2v_low_noise_14B-XXXX.gguf     ← Only when using gguf
    │   ├── wan2.2_i2v_high_noise_14B-XXXX.gguf    ← Only when using gguf
    │   └── wan2.2_i2v_low_noise_14B-XXXX.gguf     ← Only when using gguf
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

### text2video (14B)

Use KSampler Advanced to process the first half with the `high_noise` model and the second half with the `low_noise` model.

![](/media/basic-workflows/wan-2-2/legacy_gyazo_3c0c65842b078922808c740ff797917d.png){media=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_text2video_14b.json)

- 🟩 Set the step, out of 20 in total, at which to switch from `high_noise` -> `low_noise`.
  - The official recommendation is to switch when the **ratio of "non-noise" to "noise"** is `1 : 1`.
  - You can calculate this, but it's tricky because the Sampler / Scheduler / sigma_shift / step count all affect each other.
  - And hitting it exactly isn't guaranteed to give the best result anyway.
  - This workflow switches at step 4. Start from there and try different values.
- 🟨🟥 The text encoder and VAE are the same as Wan 2.1.

---

### image2video (14B)

![](/media/basic-workflows/wan-2-2/legacy_gyazo_83c1b3885e887ed2a170ce853b61691f.png){media=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_image2video_14b.json)

- 🟦 Input the start image into a `WanImageToVideo`-type node.
- Unlike Wan 2.1, Wan 2.2 **does not use** `clip_vision`.

---

### FLF2V (14B / First–Last Frame to Video)

Wan 2.1 had a dedicated model for FLF2V, but Wan 2.2's image2video model also supports FLF2V.

In ComfyUI, you can generate a video that interpolates between two images simply by inputting the Start / End images into the `WanFirstLastFrameToVideo` node.

![](/media/basic-workflows/wan-2-2/legacy_gyazo_2e2630bf85cd858b53dba10a0cdddba1.png){media=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_image2video_flf2v_14b.json)

- 🟦 As with Wan 2.1, input the Start / End images into the `WanFirstLastFrameToVideo` node.

---

## Wan 2.2 5B Model (TI2V-5B)

Wan 2.2-TI2V-5B is a TI2V model that handles both text2video and image2video in one model.
By combining a more highly compressed VAE with patchification, it can generate **~5 second, 720p, 24fps videos at a lower compute cost than 14B**.

Rather than a scaled-down version of 14B, like 1.3B was, it's better to think of it as a separate line with a more fundamentally different design.

The design is interesting, but unfortunately it still can't beat 14B on quality, and in practice hardly anyone uses it.

### Recommended Settings

- Recommended Resolution
  - 720p (1280×720)
- Maximum Number of Frames
  - 121 frames
- FPS
  - 24fps

### Model Download

- diffusion_models
  - [wan2.2_ti2v_5B_fp16.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_ti2v_5B_fp16.safetensors)
- vae
  - [wan2.2_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/vae/wan2.2_vae.safetensors)
- gguf (Optional)
  - [Wan2.2-TI2V-5B-GGUF](https://huggingface.co/QuantStack/Wan2.2-TI2V-5B-GGUF/tree/main)

Placement example:

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── wan2.2_ti2v_5B_fp16.safetensors
    ├── 📂unet/
    │   └── Wan2.2-TI2V-5B-XXXX.gguf     ← Only when using gguf
    └── 📂vae/
        └── wan2.2_vae.safetensors
```

### text2video (5B)

![](https://gyazo.com/167e6339de10602a8d3c5af9dc4c752e){gyazo=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_text2video_5b.json)

In 5B text2video, the video is generated internally by way of a "first frame latent".

- 🟥 Use `wan2.2_vae` for the VAE.
  Its compression scheme is different from the Wan 2.1 VAE, so if you forget to swap it, image quality and motion fall apart badly.
- 🟩 Even for text2video, insert a latent node for TI2V (e.g., `Wan22ImageToVideoLatent`).
  5B is designed around a "1 frame latent -> video" pipeline, so setups that skip this step aren't expected to work.

Thinking of it as "text2video, but really a special case of image2video" should make it easier to fit together with other TI2V models.

### image2video (5B)

![](/media/basic-workflows/wan-2-2/legacy_gyazo_79c9d851847801e276073863d349b43a.png){media=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_image2video_5b.json)

image2video also uses the same TI2V model as text2video.
There's just one more input; everything from the KSampler onward is almost the same.

- 🟦 Input the start image into the latent node for TI2V to create a compressed latent.
- 🟩 Since text2video and image2video both run on the same model, it's easy to settle your workflow with 5B first and then add 14B as needed.

---

## Reference Links

- [Comfy.Org](https://docs.comfy.org/tutorials/video/wan/wan2_2)
- [Wan Official Prompt Guide](https://alidocs.dingtalk.com/i/nodes/EpGBa2Lm8aZxe5myC99MelA2WgN7R35y)
