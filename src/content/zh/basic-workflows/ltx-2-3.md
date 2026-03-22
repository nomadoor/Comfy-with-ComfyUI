---
layout: page.njk
lang: zh
section: basic-workflows
slug: ltx-2-3
navId: ltx-2-3
title: "LTX 2.3"
summary: "在 LTX 2.3 中处理 text2video、image2video、audio2video 和 audio-image2video"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f3f8635fb9056670204fe9bdac577b39.mp4"
tags: []
---

## 什么是 LTX 2.3？

`LTX 2.3` 是 Lightricks 视频生成模型 `LTX-2` 的改良版。

基本思路和节点结构与 [LTX-2](/zh/basic-workflows/ltx-2/) 相同。  
所以这一页只看 **和 LTX-2 相比有什么变化**。

---

## 推荐设定值

- 分辨率
  - 最终输出建议在 1.5M 像素左右
  - ※必须是 32 的倍数
- FPS
  - 24 / 25 / 48 / 50
- 帧数
  - 65 / 97 / 121 / 161 / 257
  - 必须是 `8n + 1`

---

## 模型下载

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

## 基本处理流程

![](https://gyazo.com/7ace8e776133d570e2d42b1a27435189){gyazo=image}

架构和 [LTX-2](/zh/basic-workflows/ltx-2/) 一样，所以 workflow 本身也可以直接沿用。  
不过，如果原样照搬，结果通常不会太好。

所以这里采用社区总结出来的 **[3stage workflow](https://www.reddit.com/r/StableDiffusion/comments/1rn3fjv/for_ltx2_use_triple_stage_sampling/)**。

原本 LTX-2 是先在低分辨率生成，再用 Hires.fix 放大到 1.5MP 的 2stage 方案。  
而在 2.3 里，会再多加一段：先在非常小的分辨率生成，做一次 2 倍 Hires.fix，再做一次 2 倍 Hires.fix。

这不是官方推荐的方法，但结果明显更好，所以这里采用它。

> 这里全部使用 `distilled-lora` 的 8 步生成。

---

## text2video

![](https://gyazo.com/7477c07351d62edda93ae50270bbbaf5){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_text2video_distilled_3stage.json)

{% mediaRow img="https://gyazo.com/6e9e9474d28ef76af5053fb0be5e6290 {gyazo=image}", width=40, align="left" %}

**设置视频分辨率、时长和 FPS**

这里决定你要生成的视频和音频参数。

- 在 `EmptyLTXVLatentVideo` / `LTXV Empty Latent Audio` 中输入分辨率、帧数和 FPS
- 🚨这里和 LTX-2 不同
  - 因为要做两次 2 倍放大，最终宽高会变成 4 倍，所以这里要按这个前提，把初始值设在 0.1MP 左右

{% endmediaRow %}

**输出例**

![](https://gyazo.com/2cd2d6eb51760a4928ba476bf2c0878b){gyazo=loop}

---

## image2video

![](https://gyazo.com/0bb56ddc29aa5c644460f5eb6a2c7443){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_image2video_distilled_3stage.json)

**输出例**

![输入](https://gyazo.com/bf4c40372ce923fb53f2867c33c27bc6){gyazo=image} ![输出](https://gyazo.com/cb1a91ed174f29d4441ae1332590f3a0){gyazo=loop}

---

## audio2video

![](https://gyazo.com/0d62ef375ff30b08ea96c40b5105c94c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_audio2video_distilled_3stage.json)

**输出例**

![](https://gyazo.com/4e0ce0ea62fc7138ffe7ea1892ec21b8){gyazo=player}

---

## audio-image2video

![](https://gyazo.com/443cbbeacab7a63e85641c0b209ab5da){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_audio-image2video_distilled_3stage.json)

**输出例**

![](https://gyazo.com/dc3fb2e0b92432ca2651ca121aea7205){gyazo=image} ![](https://gyazo.com/69ebdac3cc6a3badd9452f0cbb345167){gyazo=player}

---

## IC-LoRA

`LTX-2.3` 也可以像 `LTX-2` 一样使用 IC-LoRA 系扩展。

### 模型下载

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

- 🚨IC-LoRA 时使用的不是 **3 stage**，而是 **2 stage** workflow
- IC-LoRA Union 有一个特殊点：它使用的是“生成视频一半分辨率”的控制视频
  - 所以如果用 3 stage，控制图像的分辨率会变成“二分之一的二分之一的二分之一的二分之一”，大约只剩 100px
  - 小到这个程度后，已经无法作为有效的控制图像保留足够信息
  - 所以 IC-LoRA 在这里停在 2 stage

**输出例**

![输入](https://gyazo.com/9aea1871cc24b0c98931d55bebb1c19c){gyazo=loop} ![输出](https://gyazo.com/25f44e7a08247ae96a2ebcc3cb901d56){gyazo=loop}
