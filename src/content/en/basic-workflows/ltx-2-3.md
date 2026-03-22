---
layout: page.njk
lang: en
section: basic-workflows
slug: ltx-2-3
navId: ltx-2-3
title: "LTX 2.3"
summary: "Handle text2video / image2video with LTX 2.3"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f3f8635fb9056670204fe9bdac577b39.mp4"
tags: []
---

## What is LTX 2.3?

`LTX 2.3` is an improved version of Lightricks' video generation model `LTX-2`.

The basic ideas and node structure are the same as [LTX-2](/en/basic-workflows/ltx-2/).  
So on this page, we only look at **what changed from LTX-2**.

---

## Recommended Settings

- Resolution
  - Final output around 1.5M pixels
  - *Must be a multiple of 32*
- FPS
  - 24 / 25 / 48 / 50
- Frames
  - 65 / 97 / 121 / 161 / 257
  - *Must be 8n + 1*

---

## Model Download

- checkpoints
  - [ltx-2.3-22b-dev-fp8.safetensors](https://huggingface.co/Lightricks/LTX-2.3-fp8/blob/main/ltx-2.3-22b-dev-fp8.safetensors) (29.1 GB)
- latent_upscale_models
  - [ltx-2.3-spatial-upscaler-x2-1.1.safetensors](https://huggingface.co/Lightricks/LTX-2.3/blob/main/ltx-2.3-spatial-upscaler-x2-1.1.safetensors) (996 MB)
- loras
  - [ltx-2.3-22b-distilled-lora-384.safetensors](https://huggingface.co/Lightricks/LTX-2.3/blob/main/ltx-2.3-22b-distilled-lora-384.safetensors) (7.61 GB)
- text_encoders
  - [gemma_3_12B_it_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it_fp8_scaled.safetensors) (13.2 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── ltx-2.3-22b-dev-fp8.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2.3-spatial-upscaler-x2-1.1.safetensors
    ├── 📂loras/
    │   └── ltx-2.3-22b-distilled-lora-384.safetensors
    └── 📂text_encoders/
        └── gemma_3_12B_it_fp8_scaled.safetensors
```

---

## Basic Process Flow

![](https://gyazo.com/7ace8e776133d570e2d42b1a27435189){gyazo=image}

The architecture is the same as [LTX-2](/en/basic-workflows/ltx-2/), so the workflow itself can be reused.  
However, the results are not very good if you use it as-is.

So on this page, we use the community-discovered **[3-stage workflow](https://www.reddit.com/r/StableDiffusion/comments/1rn3fjv/for_ltx2_use_triple_stage_sampling/)**.

Originally, LTX-2 used a 2-stage process: generate once at low resolution, then Hires.fix it to 1.5MP.  
In 2.3, you add one more stage: generate at a very small resolution, do 2x Hires.fix, then do another 2x Hires.fix.

This is not the officially recommended method, but the results are clearly better, so this is what we use here.

> Everything here uses `distilled-lora` with 8-step generation.

---

## text2video

![](https://gyazo.com/7477c07351d62edda93ae50270bbbaf5){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_text2video_distilled_3stage.json)

{% mediaRow img="https://gyazo.com/6e9e9474d28ef76af5053fb0be5e6290 {gyazo=image}", width=40, align="left" %}

**Set video resolution, length, and FPS**

This is where you decide the parameters for the video and audio you want to generate.

- Enter resolution, frame count, and FPS in `EmptyLTXVLatentVideo` / `LTXV Empty Latent Audio`
- 🚨This is the part that differs from LTX-2
  - Since it upscales by 2x twice, meaning 4x in width and height overall, set a value around 0.1MP with that in mind

{% endmediaRow %}

**Output example**

![](https://gyazo.com/2cd2d6eb51760a4928ba476bf2c0878b){gyazo=loop}

---

## image2video

![](https://gyazo.com/0bb56ddc29aa5c644460f5eb6a2c7443){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_image2video_distilled_3stage.json)

**Output example**

![Input](https://gyazo.com/bf4c40372ce923fb53f2867c33c27bc6){gyazo=image} ![Output](https://gyazo.com/cb1a91ed174f29d4441ae1332590f3a0){gyazo=loop}

---

## audio2video

![](https://gyazo.com/0d62ef375ff30b08ea96c40b5105c94c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_audio2video_distilled_3stage.json)

**Output example**

![](https://gyazo.com/4e0ce0ea62fc7138ffe7ea1892ec21b8){gyazo=player}

---

## audio-image2video

![](https://gyazo.com/443cbbeacab7a63e85641c0b209ab5da){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_audio-image2video_distilled_3stage.json)

**Output example**

![](https://gyazo.com/dc3fb2e0b92432ca2651ca121aea7205){gyazo=image} ![](https://gyazo.com/69ebdac3cc6a3badd9452f0cbb345167){gyazo=player}

---

## IC-LoRA

`LTX-2.3` can also use IC-LoRA-based extensions, just like `LTX-2`.

### Model Download

- [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) 654 MB

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
```

### IC-LoRA Union (Pose)

![](https://gyazo.com/9432f1cad25a54328ed912bc85af4a2d){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_IC-LoRA(Pose)_distilled_2stage.json)

- 🚨For IC-LoRA, use a **2-stage workflow instead of 3-stage**
- IC-LoRA Union uses a special method where the control video is generated at half the resolution of the final video
  - So if you use 3 stages, the control image resolution drops to "half of half of half of half", roughly around 100px
  - At that point, it no longer keeps enough information to work as a control image
  - That is why IC-LoRA stays at 2 stages

**Output example**

![Input](https://gyazo.com/9aea1871cc24b0c98931d55bebb1c19c){gyazo=loop} ![Output](https://gyazo.com/25f44e7a08247ae96a2ebcc3cb901d56){gyazo=loop}
