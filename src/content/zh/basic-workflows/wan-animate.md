---
layout: page.njk
lang: zh
section: basic-workflows
slug: wan-animate
navId: wan-animate
title: "Wan-Animate"
created: 2026-02-06
updated: 2026-03-02
summary: "在 Wan-Animate 中进行向人物・角色的动作传送"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["human-motion-transfer","talking-head"]
---

## 什么是 Wan-Animate？

[Wan-Animate](https://humanaigc.github.io/wan-animate/) 是专注于向人・角色传送动作的 **Wan2.1-14B-I2V 基础** 的模型。

> ![](https://gyazo.com/20a7f10f302751293cda0e0ed353d25a){gyazo=image}

- 配合参照视频的人物的动作，让输入的图像动起来的 **Animation 模式**
- 将输入视频的人物，替换为参照图像的人物的 **Replacement 模式**

有 2 种生成模式，如果将 Replacement 模式认为是向 Animation 模式添加了“适应背景那样的处理”的东西，我想比较容易理解。

因为是 Wan2.1 基础，所以只能生成到 77 帧，但也和 [Wan2.1 VACE](/zh/basic-workflows/wan-2-1-vace/) 的 Extension 一样，通过抽出最后的数帧并重复生成那个后续的处理，也可以实质上处理长视频。

---

## 必要的自定义节点

作为事前处理进行人脸检测和姿势推断。有以下的自定义节点非常方便。

- [ComfyUI-WanAnimatePreprocess](https://github.com/kijai/ComfyUI-WanAnimatePreprocess)
  - 通过 YOLO 的人脸检测
  - 通过 ViTPose 的姿势（火柴人）抽出
- [ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)
  - 使用 SAM2 的人物掩膜的生成（在 Replacement 模式使用）

---

## 模型的下载

凑齐 Wan-Animate 本体和 Wan2.1 系共通的模型。

- diffusion_models
  - [Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors](https://huggingface.co/Kijai/WanVideo_comfy_fp8_scaled/blob/main/Wan22Animate/Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors)
- loras
  - [WanAnimate_relight_lora_fp16.safetensors](https://huggingface.co/Kijai/WanVideo_comfy/blob/main/LoRAs/Wan22_relight/WanAnimate_relight_lora_fp16.safetensors)
- clip_vision
  - [clip_vision_h.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/clip_vision/clip_vision_h.safetensors)
- text_encoders
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf（任意）
  - [Wan2.2-Animate-14B-GGUF](https://huggingface.co/QuantStack/Wan2.2-Animate-14B-GGUF/tree/main)

配置例。

```text
📂ComfyUI/
└── 📂models/
    ├── 📂clip_vision/
    │   └── clip_vision_h.safetensors
    ├── 📂diffusion_models/
    │   └── Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors
    ├── 📂loras/
    │   └── WanAnimate_relight_lora_fp16.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   └── Wan2.2-Animate-14B-XXXX.gguf      ← 仅在使用 gguf 时
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

---

## Animation 模式

是配合参照视频的人物的动作，让输入的静止画动起来的模式。

因为相当巨大所以心跳加速，但基础原样是 [Wan2.1 image2video](/zh/basic-workflows/wan-2-1/#image2video) 的形式。不要畏惧前进吧。

![](https://gyazo.com/d25335c059e8117f9e617de4ffffefca){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Animation.json)

{% mediaRow img="https://gyazo.com/77b9c908b9e96505678ccaa0bde8055b{gyazo=image}", width=33, align="left" %}

**1. 读取 Wan-Animate 模型**

- 在 `Load Diffusion Model` 读取 `Wan2_2-Animate`。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/1516ab2c0949d0df3261a26e46815d08{gyazo=image}", width=33, align="left" %}

**2. 决定生成分辨率**

- 配合输入图像在 `Scale Image to Total Pixels` 调整总像素数。
- 请配合 PC 的规格改变数值。
- 最后将分辨率 **裁剪为 16 的倍数**。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/c76608836777ce6a604372c2d9cc9c43{gyazo=image}", width=33, align="left" %}

**3. 向 WanAnimateToVideo 节点输入追加信息**

- `reference_image`
  想动的静止画。
- `face_video`
  从参照视频裁剪颜部分的视频。
  `Pose and Face Detection` 自动通过 YOLO 进行人脸检测 → 裁剪。
- `pose_video`
  从参照视频通过 ViTPose 生成火柴人（关键点）的视频。
  因为驱动视频和想动的图像骨骼和位置不同，所以在 retarget 处理进行调整。

{% endmediaRow %}

**生成例**

![reference_image](https://gyazo.com/9f0e0e20d750b2e207b01adc56858202){gyazo=image} ![pose_video(处理前)](https://gyazo.com/d7f66b4153473136c37e48c7066709a1){gyazo=loop} ![output](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop}

---

## Replacement 模式

将输入视频的人物，替换为参照图像的人物的模式。

变成向 Animation 模式添加了，为了 inpainting 人物的掩膜，和为了适应背景のリライト処理的东西。

![](https://gyazo.com/ab3d36d1e2ddfd5d7e452778dbab411c){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Replacement.json)

{% mediaRow img="https://gyazo.com/a26743871782e80338ed0d920ef6b786{gyazo=image}", width=33, align="left" %}

**1. リライト LoRA 的追加**

- 为了让替换后的人物溶入背景，添加 રિライト LoRA。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/bc59ff33c803effd0e772879857e8a3a{gyazo=image}", width=33, align="left" %}

**2. 参照图像的 padding**

- 因为这次基准是视频，所以配合视频的分辨率 padding 参照图像。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a6c53693b87e1cebda390d6b7dca306a{gyazo=image}", width=33, align="left" %}

**3. 人物掩膜生成**

- 将 `Pose and Face Detection` 取得的人物坐标传递给 SAM2.1 生成掩膜。
- 将掩膜稍稍膨胀，在 `Blockify` 节点转换为像点绘那样锯齿状的掩膜作为 `character_mask`。
  不这样做的话不知为何生成的视频的轮廓会残留细边。
- 将在 `ImageCompositeMasked` 将掩膜的部分涂黑的视频作为 `background_video` 使用。

{% endmediaRow %}

**生成例**

![background-pose_video](https://gyazo.com/f14909bbf4415e5477b67870379c6719){gyazo=loop} ![reference_image](https://gyazo.com/59dda8074526ca42245b1220bbb4420f){gyazo=image} ![output](https://gyazo.com/280c5916091919526db60ea0625d441a){gyazo=loop}

---

## 6 步推论（Lightx2v LoRA）

使用蒸馏 LoRA，可以减少采样步数到 4〜6 steps。

在 text2video 使用的话会介意劣化，但在 Wan-Animate 因为不是从 0 制作视频，所以不怎么介意。想积极地活用。

### 模型的下载

- loras

  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
```

### Animation 模式（高速版）

![](https://gyazo.com/c8ff6a05cd057198146cd2cffb16d733){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Animation_lightx2v.json)

{% mediaRow img="https://gyazo.com/3808ae94efd870f0ff0ce1d77595ea36{gyazo=image}", width=33, align="left" %}

**LoRA 的适用**

- 🟪 在 `LoraLoaderModelOnly` 读取 Lightx2v LoRA。
- KSampler 的设定

  - `steps` … 4〜6
  - `cfg` … 1.0

{% endmediaRow %}

**比较**

![20steps](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop} ![6steps](https://gyazo.com/67326f2a1a4d803ab4c6a40799aef8a7){gyazo=loop}

### Replacement 模式（高速版）

![](https://gyazo.com/6e70b69630dea6bcf813917d8eb2c18a){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Replacement_lightx2v.json)

---

## 为了长视频重复处理

Wan-Animate 的基础和 Wan2.1 I2V 同样，**1 次推论能生成的上限是 77 帧**。
制作超过这个的长视频的情况下，要构成“一边继承最后的数帧，一边重复好几次生成”。

在 ComfyUI 无法进行循环处理，所以变成向后向后串联连接几乎相同的工作流的形式。

这里老实说称不上 SMART 的处理，是向 Kijai 先生的 [ComfyUI-WanVideoWrapper](https://github.com/kijai/ComfyUI-WanVideoWrapper) 的实现退让一步的部分。

### Animation 模式（Repeat）

![](https://gyazo.com/a489fad9b07fb1f1745d556fa130c731){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Animation_lightx2v_repeat.json)

乍一看是巨大的工作流，但与至今的东西不同的点只有以下 2 点。

![](https://gyazo.com/5db9830b2a2db2dd24ad1543906f49da){gyazo=image}

- `video_frame_offset`

  - 第 1 次生成了 77 帧的情况下，第 2 次必须从第 78 帧以后使用 `face_video` 和 `pose_video`。
  - 向 `video_frame_offset` 输入偏移帧数的话，会自动错开 `face_video` / `pose_video` 的参照开始位置。
- `continue_motion_max_frames`

  - 设定作为重叠部分的帧数。
  - 例如将 `length` 设为 77，`continue_motion_max_frames` 设为 5 的话，使用上次的最后 5 帧，新生成剩余的 72 帧。

如果重复连接这个组，理论上可以制作无限长的视频。
但是和复印机一样，误差会一点点积累下去。

### Replacement 模式（Repeat）

![](https://gyazo.com/5efe20ed9671e3eb4960fd5ddc70cb46){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Replacement_lightx2v_repeat.json)
