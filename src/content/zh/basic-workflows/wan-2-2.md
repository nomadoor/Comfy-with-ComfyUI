---
layout: page.njk
lang: zh
section: basic-workflows
slug: wan-2-2
navId: wan-2-2
title: "Wan2.2"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Wan2.2 进行 text2video / image2video / FLF2V 视频生成"
seoTitle: "在 ComfyUI 中使用 Wan2.2：14B 与 5B 视频工作流"
seoDescription: "在 ComfyUI 中使用 Wan2.2：切换 high_noise / low_noise 的 14B 与单模型 TI2V-5B 各自的推荐设置，以及 text2video、image2video、FLF2V，附整理清晰易读的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## 什么是 Wan2.2？

Wan2.2 是 [Wan-2.1](/zh/basic-workflows/wan-2-1/) 的正统后继，是一个视频生成模型家族。
主要由 2 种模型组成。

- 14B：在 `high_noise` / `low_noise` 两个模型之间切换的两段式结构
- 5B：用单个模型同时处理 text2video 和 image2video 的 TI2V 模型 + Wan2.2 VAE

---

## Wan2.2 14B 模型

Wan2.2-A14B 是两段式管线：采样前半段由 `high_noise` 模型负责，后半段由 `low_noise` 模型负责。

通过拆成 2 个模型，它在 VRAM 占用不比 Wan2.1 多的前提下，把模型规模翻了一倍，以此提升性能。

### 推荐设置

- 推荐分辨率
  - 480p（854×480）〜 720p（1280×720）
- 最大帧数
  - 81 帧
- FPS
  - 多数情况下以 16fps 左右输出
  - 不过 16fps 的视频往往看起来像慢动作，可以用 24fps 保存，或者通过抽帧来调整。

### 下载模型

- diffusion_models
  - [wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors)
  - [wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors)
  - [wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors)
  - [wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors)
- text_encoders
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)（与 Wan2.1 通用）
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)（与 Wan2.1 通用）
- gguf（可选）
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
    │   ├── wan2.2_t2v_high_noise_14B-XXXX.gguf    ← 仅在使用 gguf 时
    │   ├── wan2.2_t2v_low_noise_14B-XXXX.gguf     ← 仅在使用 gguf 时
    │   ├── wan2.2_i2v_high_noise_14B-XXXX.gguf    ← 仅在使用 gguf 时
    │   └── wan2.2_i2v_low_noise_14B-XXXX.gguf     ← 仅在使用 gguf 时
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

### text2video（14B）

用 KSampler Advanced，前半段交给 `high_noise` 模型，后半段交给 `low_noise` 模型处理。

![](/media/basic-workflows/wan-2-2/legacy_gyazo_3c0c65842b078922808c740ff797917d.png){media=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_text2video_14b.json)

- 🟩 指定在总共 20 steps 中的第几 step 从 `high_noise` 切换到 `low_noise`
  - 关于切换时机，官方推荐在 **“非噪声部分”与“噪声部分”的比例** 达到 `1 : 1` 时切换。
  - 这个时机可以计算出来，但 Sampler / Scheduler / sigma_shift / step 数相互牵扯，算起来很麻烦。
  - 而且，完全对准这个比例也不一定就是最佳。
  - 这个工作流在第 4 step 切换，可以先以此为基准多试试。
- 🟨🟥 文本编码器和 VAE 与 Wan2.1 相同。

---

### image2video（14B）

![](/media/basic-workflows/wan-2-2/legacy_gyazo_83c1b3885e887ed2a170ce853b61691f.png){media=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_image2video_14b.json)

- 🟦 起始图像输入到 `WanImageToVideo` 系列节点。
- 和 Wan2.1 不同，Wan2.2 **不使用** `clip_vision`。

---

### FLF2V（14B / First–Last Frame to Video）

Wan2.1 的 FLF2V 需要专用模型，而 Wan2.2 的 image2video 模型本身就支持 FLF2V。

在 ComfyUI 中，只要向 `WanFirstLastFrameToVideo` 节点输入 Start / End 两张图像，就能生成在两者之间补间的视频。

![](/media/basic-workflows/wan-2-2/legacy_gyazo_2e2630bf85cd858b53dba10a0cdddba1.png){media=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_image2video_flf2v_14b.json)

- 🟦 和 Wan2.1 一样，向 `WanFirstLastFrameToVideo` 节点输入 Start / End 图像。

---

## Wan2.2 5B 模型（TI2V-5B）

Wan2.2-TI2V-5B 是用 1 个模型同时处理 text2video / image2video 的 TI2V 模型。
它结合了压缩率更高的 VAE 和 patch 化处理，能以 **比 14B 更低的计算成本** 生成 **720p、24fps、5 秒左右的视频**。

与其把它看作类似 1.3B 那样的 14B 缩小版，不如看作一条从设计根本上就不太一样的产品线。

设计很有意思，可惜性能上果然还是比不过 14B，实际上几乎没人用。

### 推荐设置

- 推荐分辨率
  - 720p（1280×720）
- 最大帧数
  - 121 帧
- FPS
  - 24fps

### 下载模型

- diffusion_models
  - [wan2.2_ti2v_5B_fp16.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/diffusion_models/wan2.2_ti2v_5B_fp16.safetensors)
- vae
  - [wan2.2_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/blob/main/split_files/vae/wan2.2_vae.safetensors)
- gguf（可选）
  - [Wan2.2-TI2V-5B-GGUF](https://huggingface.co/QuantStack/Wan2.2-TI2V-5B-GGUF/tree/main)

放置示例如下。

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── wan2.2_ti2v_5B_fp16.safetensors
    ├── 📂unet/
    │   └── Wan2.2-TI2V-5B-XXXX.gguf     ← 仅在使用 gguf 时
    └── 📂vae/
        └── wan2.2_vae.safetensors
```

### text2video（5B）

![](https://gyazo.com/167e6339de10602a8d3c5af9dc4c752e){gyazo=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_text2video_5b.json)

5B 的 text2video 在内部会先经过“第一帧的 latent”再生成视频。

- 🟥 VAE 使用 `wan2.2_vae`
  它和 Wan2.1 的 VAE 压缩结构不同，忘了替换的话，画质和动作都会严重崩坏。
- 🟩 即使是 text2video，也要插入 TI2V 用的 latent 节点（例：`Wan22ImageToVideoLatent`）
  5B 是以“1 帧 latent → 视频”的管线为前提设计的，跳过这一步的结构并不在设计考虑之内。

把它理解成“名义上是 text2video，实际上是 image2video 的一种特例”，和其他 TI2V 系模型放在一起时也更容易理清。

### image2video（5B）

![](/media/basic-workflows/wan-2-2/legacy_gyazo_79c9d851847801e276073863d349b43a.png){media=image}

[](/workflows/basic-workflows/wan-2-2/wan2_2_image2video_5b.json)

image2video 也使用和 text2video 相同的 TI2V 模型。
只是多了一个输入，KSampler 之后的部分基本相同。

- 🟦 把 start 图像输入到 TI2V 用的 latent 节点，生成压缩后的 latent。
- 🟩 text2video / image2video 都能用同一个模型完成，所以
  可以先用 5B 把工作流定下来，再根据需要加上 14B，这样用起来比较方便。

---

## 参考链接

- [Comfy.Org](https://docs.comfy.org/tutorials/video/wan/wan2_2)
- [Wan 官方提示词指南](https://alidocs.dingtalk.com/i/nodes/EpGBa2Lm8aZxe5myC99MelA2WgN7R35y)
