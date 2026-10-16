---
layout: page.njk
lang: zh
section: basic-workflows
slug: wan-2-1-vace
navId: wan-2-1-vace
title: "Wan2.1 VACE"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Wan2.1 VACE 实现 ControlNet 式控制、in/outpainting、reference2video 和 Extension"
seoTitle: "在 ComfyUI 中使用 Wan2.1 VACE：视频版 ControlNet 与编辑"
seoDescription: "Wan2.1 VACE 把视频版 ControlNet、inpainting / outpainting 和 reference2video 集于一身。本文介绍它的用法：用姿势或深度控制动作、延长视频（Extension）以及制作循环视频，附工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/wan-2-1-vace/legacy_gyazo_7e8deb0b28623921172baeeb26cf9de1.mp4"
tags: []
---
## 什么是 Wan2.1 VACE？

**Wan2.1 VACE** 是 Wan2.1 视频生成的编辑用模型。

它就像是把视频版的 ControlNet 和 inpainting / outpainting / reference2video 都塞进了 1 个节点（`WanVaceToVideo`）里。

- 对现有视频用姿势或深度图“只控制动作”
- 参考 reference 图像替换角色，或让风格向它靠拢
- 只对特定区域做 inpainting / outpainting
- 生成视频的后续（Extension），或者制作循环、补间帧

这些操作都能保持 Wan2.1 的生成质量。

---

## 推荐设置

- 推荐分辨率
  - 720p 左右，并且是 **16 的倍数**
- 最大帧数
  - 81 帧

---

## 下载模型

Wan2.1 VACE 使用的不是普通的 T2V 模型，而是 VACE 专用的 diffusion model。
这里只介绍 14B。

- diffusion_models
  - [wan2.1_vace_14B_fp16.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_vace_14B_fp16.safetensors)
- text encoder
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf（可选）
  - [Wan2.1-VACE-14B-GGUF](https://huggingface.co/QuantStack/Wan2.1-VACE-14B-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── wan2.1_vace_14B_fp16.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   └── Wan2.1_14B_VACE-XXXX.gguf   ← 仅在使用 gguf 时
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

## 基本结构

无论哪种用法，基本都是在 [Wan2.1 text2video](/zh/basic-workflows/wan-2-1/#可能会提高品质的技术) 的基础上加一个 `WanVaceToVideo` 节点。

![](/media/basic-workflows/wan-2-1-vace/legacy_gyazo_15272b819b453d21ec3707c059831edc.png){media=image}

- `control_video`
  - 姿势、深度图、scribble、optical_flow、layout 等“引导视频”
- `control_masks`
  - inpainting 用的遮罩
- `reference_image`
  - 想迁移其角色或风格的参考图像

---

## ControlNet 式用法

用姿势、深度图等来控制视频的动作。

![](/media/basic-workflows/wan-2-1-vace/legacy_gyazo_58c1530fbeeb7aa1004120b2db2ddff9.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1-vace/wan2_1_vace_control_pose.json)

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_6aca797b02070eb54bef2d7c9b2599ee.png {media=image}", width=33, align="left" %}

**1. 加载 Wan2.1 VACE 模型**

- 用 `Load Diffusion Model` 加载 `wan2.1_vace_14B_fp16.safetensors`。
- 直接加载会占用相当多的 VRAM，所以把 `dtype` 切换成 `fp8_e4m3fn` 来减少 VRAM 占用。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_cbf721a8d70bd43d48b1fde5771b48ab.png {media=image}", width=33, align="left" %}

**2. 调整视频尺寸**

- 用 `ImageScaleToTotalPixels` 缩小到合适的尺寸。
  - Wan 最高可以生成 720p（1MP），但我的电脑 VRAM 不够，所以设成了 0.5MP。
- 用 `Resize Image v2` 裁剪成 16 的倍数。
  - 其实只用这个节点也能缩放到 0.5MP，不过为了把两步处理的意图分开，这里分成了两段。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_f6cfc10cb0f532e1e7c9d55acf412aee.png {media=image}", width=33, align="left" %}

**3. 制作并输入 control_video**

- 用 `OpenPose Pose` 从视频生成火柴人姿势视频。
- 把它输入到 `WanVaceToVideo` 的 `control_video`。

{% endmediaRow %}


## reference2video

把 reference 图像中的角色或风格迁移到视频里。

![](/media/basic-workflows/wan-2-1-vace/legacy_gyazo_b9a184b4ffcad5f4a16b056df24818ed.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1-vace/wan2_1_vace_reference.json)

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_235ae5ef44d4fb1518128c0ac099f601.png {media=image}", width=33, align="left" %}

**1. 预处理并输入参考图像**

- 把角色图或插画输入到 `WanVaceToVideo` 的 `reference_image`。
  - 使用抠掉背景、用白色填充的图像，结果会比较稳定。
  - 虽然叫 reference2video，但由于其机制，参考图像中的位置关系会被原样继承下来。
  - 因此生成视频和参考图像的尺寸最好一致，并且要做好预处理，比如把角色的位置和大小调整到接近最终想放的位置。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_289292215d191fbf7e114ff0ec2dcd77.mp4 {media=loop}", width=33, align="left" %}

**2. 裁掉开头的帧**

- 在 reference2video 中，开头几帧会输出“参考图像和生成结果叠在一起的帧”。
  - 这正是 VACE 能够利用参考图像的机制本身，但这部分我们并不需要。
  - 🟥 用 `TrimVideoLatent` 在 latent 阶段裁掉开头的帧，再导出视频。

{% endmediaRow %}


## 空间 inpainting

只替换视频中的一部分。

![](/media/basic-workflows/wan-2-1-vace/legacy_gyazo_b146e11b6fab1d3e23cdcc30f8fe73c9.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1-vace/wan2_1_vace_inpainting.json)

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_eb65c46a68797753df091e4d28456929.png {media=image}", width=33, align="left" %}

**1. 生成遮罩**

- 用你喜欢的方法制作遮罩即可。
- 这个工作流用 `Florence-2` 检测汽车，直接把检测到的 BBOX 当作遮罩使用。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_ff3fe037d3699cda4c1939cfe30922c0.png {media=image}", width=33, align="left" %}

**2. 制作 control_video**

- `control_video` 使用 **把遮罩区域填成灰色（RGB 127,127,127）的视频**。
- 用 `ImageCompositeMasked` 把遮罩区域涂成灰色。
- 把做好的 `control_video` 和遮罩输入到 `WanVaceToVideo` 节点。

{% endmediaRow %}



## 时间 outpainting（Extension）

Extension 就是在“时间方向”上延长视频。
只使用输入视频的一部分帧，后面的内容交给 VACE 来补全。

![](/media/basic-workflows/wan-2-1-vace/legacy_gyazo_6bb7dd561151e0a93367fec89d90db26.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1-vace/wan2_1_vace_extension.json)

- 这个工作流以输入视频的最后 5 帧为基础，生成之后的 72 帧（81 - 5）。

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_97d42cdc7d3a1c5b9777336efb5dd905.png {media=image}", width=33, align="left" %}

**1. 取出最后 5 帧**

- 先把输入视频倒放，从开头只取出 5 帧。
- 再把这 5 帧的批次倒回来，作为“原视频的最后 5 帧”使用。
- 很想要一个更聪明的节点，但目前只能这么做。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_9b449f71d2dad381d37e4f3e363159cf.png {media=image}", width=33, align="left" %}

**2. 制作 control_video 和遮罩**

- 前面把 Extension 称作 **时间上的 in/outpainting**，实际上它和刚才的空间 inpainting 工作流很像。
- 制作与想生成的帧数（这里是 72 帧）相同数量的灰色图像，以及覆盖整个画面的遮罩。
  - 可以理解为把这一整段都做 inpainting。
- 这些用 `WanVideo VACE Start To End Frame`（[kijai/ComfyUI-WanVideoWrapper](https://github.com/kijai/ComfyUI-WanVideoWrapper)) 来制作，然后传给 WanVaceToVideo。
  - 只用核心节点也能搭出来，但节点数量会暴增，所以我觉得这里老老实实用 Wrapper 节点比较好。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-2-1-vace/legacy_gyazo_9886bf3bcd6bdbaed2aeadd2d6cb810b.png {media=image}", width=33, align="left" %}

**3. 把生成视频接到原视频后面**

- 生成的视频是“原视频的 5 帧 + 新生成的 72 帧”。
- 直接和原视频拼接的话，会有 5 帧重复。
- 所以先用 `ImageFromBatch` 节点去掉开头的 5 帧，再接到原视频后面。

{% endmediaRow %}


## 制作循环视频

取出视频最后几帧和最开始几帧，让它从 **最后 → 最初** 衔接起来，就能做出循环视频。
以前用 FLF2V 也能做，但 VACE 可以把多帧作为输入，生成的动作能延续原视频的流动感，这一点很有意思。

![](/media/basic-workflows/wan-2-1-vace/legacy_gyazo_14d264b55e73ace3c1e07aa9ecc24515.mp4){media=loop}

[](/workflows/basic-workflows/wan-2-1-vace/wan2_1_vace_extension_loop.json)

- 在上面 Extension 的基础上，再取出 **开头的 5 帧**。
- 把它输入到 `WanVideo VACE Start To End Frame` 的 `end_image`。
- 效果因情况而异，不过我还取出了第 1 帧，也作为 `reference_image` 使用。
