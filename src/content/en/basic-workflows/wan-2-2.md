---
layout: page.njk
lang: en
section: basic-workflows
slug: wan-2-2
navId: wan-2-2
title: "Wan 2.2"
created: 2025-12-12
updated: 2026-03-02
summary: "Video generation using text2video / image2video / FLF2V with Wan 2.2"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## What is Wan 2.2?

Wan 2.2 is a family of video generation models that are the legitimate successors to [Wan 2.1](/en/basic-workflows/wan-2-1/).
It consists largely of two models:

- 14B: A two-stage architecture that switches between `high_noise` and `low_noise` models.
- 5B: A TI2V model that handles text2video and image2video with a single model + Wan 2.2 VAE.

---

## Wan 2.2 14B Model

Wan 2.2-A14B has a two-stage pipeline where the `high_noise` model handles the first half of sampling and the `low_noise` model handles the second half.

By dividing it into two models, the model size is doubled to improve performance without increasing VRAM usage compared to Wan 2.1.

### Recommended Settings

- Recommended Resolution
  - 480p (854×480) - 720p (1280×720)
- Maximum Number of Frames
  - 81 frames
- FPS
  - Often output around 16fps
  - However, since 16fps often results in slow-motion video, adjust it by saving at 24fps or dropping frames.

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

![](https://gyazo.com/3c0c65842b078922808c740ff797917d){gyazo=image}

[](/workflows/basic-workflows/wan-2-2/Wan2.2_text2video_14B.json)

- 🟩 Specify at which step out of the total 20 steps to switch from `high_noise` -> `low_noise`.
  - As for the timing of this switch, it is recommended that the **ratio of "non-noise parts" to "noise parts"** be `1 : 1`.
  - Although it is possible to calculate this, it is difficult because Sampler / Scheduler / sigma_shift / number of steps are all intertwined.
  - Also, perfectly matching this does not necessarily mean it is optimal.
  - In this workflow, we switch at 4 steps, but please try experimenting with this as a baseline.
- 🟨🟥 The text encoder and VAE are the same as Wan 2.1.

---

### image2video (14B)

![](https://gyazo.com/83c1b3885e887ed2a170ce853b61691f){gyazo=image}

[](/workflows/basic-workflows/wan-2-2/Wan2.2_image2video_14B.json)

- 🟦 Input the start image into the `WanImageToVideo` node.
- Unlike Wan 2.1, Wan 2.2 **does not use** `clip_vision`.

---

### FLF2V (14B / First–Last Frame to Video)

Wan 2.1 had a dedicated model for FLF2V, but Wan 2.2's image2video model also supports FLF2V.

In ComfyUI, you can generate a video that interpolates between two images simply by inputting the Start / End images into the `WanFirstLastFrameToVideo` node.

![](https://gyazo.com/2e2630bf85cd858b53dba10a0cdddba1){gyazo=image}

[](/workflows/basic-workflows/wan-2-2/Wan2.2_image2video_FLF2V_14B.json)

- 🟦 As with Wan 2.1, input the Start / End images into the `WanFirstLastFrameToVideo` node.

---

## Wan 2.2 5B Model (TI2V-5B)

Wan 2.2-TI2V-5B is a TI2V model that handles both text2video and image2video with a single model.
By combining a higher compression VAE and patchification processing, it can generate **720p, 24fps, ~5 second videos with lighter computational cost than 14B**.

Rather than being a 1.3B-like scaled-down version of 14B, it is better to think of it as a line with a fundamentally different design.

The design is interesting, but unfortunately, it cannot beat 14B in performance, and in reality, it is rarely used.

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

[](/workflows/basic-workflows/wan-2-2/Wan2.2_text2video_5B.json)

In 5B text2video, the video is generated internally via the "first frame latent".

- 🟥 Use `wan2.2_vae` for VAE.
  Since the compression structure is different from Wan 2.1 VAE, failing to replace it will cause significant degradation in image quality and movement.
- 🟩 Even for text2video, insert a latent node for TI2V (e.g., `Wan22ImageToVideoLatent`).
  Since 5B is designed based on the "1 frame latent -> video" pipeline, a configuration that skips this step is not envisaged.

If you understand it as "text2video, but essentially a special case of image2video", it will be easier to organize along with other TI2V models.

### image2video (5B)

![](https://gyazo.com/79c9d851847801e276073863d349b43a){gyazo=image}

[](/workflows/basic-workflows/wan-2-2/Wan2.2_image2video_5B.json)

image2video also uses the same TI2V model as text2video.
Only the input increases, and the subsequent steps from KSampler onwards are almost common.

- 🟦 Input the start image into the latent node for TI2V to create a compressed latent.
- 🟩 Since both text2video / image2video can be done with the same model, it is easy to solidify the workflow with 5B first and then add 14B as needed.

---

## Reference Links

- [Comfy.Org](https://docs.comfy.org/tutorials/video/wan/wan2_2)
- [Wan Official Prompt Guide](https://alidocs.dingtalk.com/i/nodes/EpGBa2Lm8aZxe5myC99MelA2WgN7R35y)
