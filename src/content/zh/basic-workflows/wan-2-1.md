---
layout: page.njk
lang: zh
section: basic-workflows
slug: wan-2-1
navId: wan-2-1
title: "Wan2.1"
created: 2025-12-12
updated: 2026-03-02
summary: "用 Wan2.1 实现 text2video、image2video 和 FLF2V 的基本工作流"
seoTitle: "在 ComfyUI 中使用 Wan2.1：text2video、image2video、FLF2V"
seoDescription: "在 ComfyUI 中使用阿里巴巴视频生成模型 Wan2.1。介绍推荐设置、模型下载、text2video、image2video、FLF2V（首尾帧）以及高速生成的 Self Forcing 工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/wan-2-1/legacy_gyazo_f952fb311ffdb409a173641f61dd3b67.png"
tags: []
---

## 什么是 Wan2.1？

**Wan2.1** 是阿里巴巴开发的开源视频生成模型。

它可以说是让开源圈真正玩起视频生成的引爆点，是一个令人印象深刻的模型。

它支持 text2video、image2video、FLF2V 这 3 种模式。  
另外，只生成 1 帧的话，也可以当作图像生成模型来用。

说得细一点，这并不是“视频生成本身就包含了图像生成”，而是它 **从一开始就被设计成了也能生成图像的视频生成模型**。

模型有 1.3B 和 14B 两种尺寸，不过 1.3B 的性能实在不够，几乎没人用，所以这里只使用 14B。

---

## 推荐设置

- 推荐分辨率
  - 480p（854×480）〜 720p（1280×720）
- 最大帧数
  - 81 帧
- FPS
  - 多数情况下以 16fps 左右输出

16fps 的视频往往看起来像慢动作，可以用 24fps 保存，或者通过抽帧来调整。

---

## 下载模型

- diffusion models
  - [wan2.1_t2v_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_t2v_14B_fp8_e4m3fn.safetensors)
  - [wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors)
  - [wan2.1_flf2v_720p_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_flf2v_720p_14B_fp8_e4m3fn.safetensors)
- text encoder
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf (可选)
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
    │   ├── wan2.1-t2v-14b-XXXX.gguf          ← 仅在使用 gguf 时
    │   ├── wan2.1-i2v-14b-720p-XXXX.gguf     ← 仅在使用 gguf 时
    │   └── wan2.1-flf2v-14b-720p-XXXX.gguf   ← 仅在使用 gguf 时
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

> [!TIP]
> 如果想用 fp16 / bf16 版，把上面 fp8 的文件名换成对应的文件即可。放置路径基本相同。

---

## text2video

这是 Wan2.1 最基础的 text2video 工作流。

![](/media/basic-workflows/wan-2-1/legacy_gyazo_58d4a88ecb1e1e2887c830c371236b40.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_text2video_14b.json)

- 🟦 `ModelSamplingSD3` 节点的 `Shift` 是影响动作幅度的参数。

  - 调得越高，运镜和主体的变化就越大，但太大的话画面容易崩坏。暂时保持 `8` 应该就没问题。
  - cf. [Wan2.1 parameter sweep](https://replicate.com/blog/wan-21-parameter-sweep#what-is-shift)

---

### 可能会提高品质的技术

效果没有明显到能直观感受到，但这些几乎没有副作用的提质技术已经作为核心节点实现了，不妨用上。

![](/media/basic-workflows/wan-2-1/legacy_gyazo_02c625103e8076b8a1f14046839e1ff9.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_text2video_14b_imp.json)

- 🟦 **UNetTemporalAttentionMultiply**

  - 增强帧与帧之间的一致性，抑制闪烁。
- 🟦 **CFG-Zero**

  - 通过减弱采样初期的 CFG，防止过度修正导致画面崩坏。

---

## image2video

输入一张图像，就会从这张图像开始生成后续内容。

![](/media/basic-workflows/wan-2-1/legacy_gyazo_2cbaf276cd5e4f6751826c34efb6c743.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_image2video_14b.json)

- 🟩 把调整到合适尺寸的图像同时输入到 `CLIP Vision Encode` 和 `WanImageToVideo`。

---

## FLF2V（First–Last Frame to Video）

输入 2 张图像，生成一段视频，把两张图之间自然地衔接起来。

![](/media/basic-workflows/wan-2-1/legacy_gyazo_44220286b8ce6e0e70db622132527c02.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_flf2v_14b.json)

- 🟩 把 2 张图像合成一个批次，输入到 `WanFirstLastFrameToVideo` 节点。

---

## Self Forcing（高速生成）

它本来是用于实时视频生成的技术，不过在 ComfyUI 里只是把它当作用几步就能生成的加速手段来用。

### 下载模型

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

### 工作流

![](/media/basic-workflows/wan-2-1/legacy_gyazo_6e4854ea69598ba4b9c3d8bc259f4b57.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1/wan2_1_text2video_14b_self_forcing.json)

- 用 `LoraLoaderModelOnly` 节点加载 LoRA。
- 将 `KSampler` 的 `steps` 设为 4 ～ 8，`CFG` 设为 1.0。

> [!NOTE]
> Self Forcing 适合“总之就想跑得快”的时候。  
> 虽然还没到无法接受的地步，但画质下降很明显。

---

## 图像生成

只需在 text2video 的工作流里 **生成 1 帧的视频** 即可。

![](/media/basic-workflows/wan-2-1/legacy_gyazo_edf26ea1ef891b721579af1dc5aa6bd1.png){media=image}

[](/workflows/basic-workflows/wan-2-1/wan2_1_text2image_14b.json)
