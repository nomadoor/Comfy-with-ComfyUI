---
layout: page.njk
lang: zh
section: basic-workflows
slug: wan-animate
navId: wan-animate
title: "Wan-Animate"
created: 2026-02-06
updated: 2026-03-02
summary: "用 Wan-Animate 把动作迁移到人物或角色上"
seoTitle: "在 ComfyUI 中使用 Wan-Animate：人物动作迁移"
seoDescription: "Wan-Animate 能把参考视频的动作迁移到图像中的人物上。本文介绍 Animation 与 Replacement 模式、用 Lightx2v LoRA 实现 6 步加速，以及为长视频重复处理的方法。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["human-motion-transfer","talking-head"]
---

## 什么是 Wan-Animate？

[Wan-Animate](https://humanaigc.github.io/wan-animate/) 是一个 **基于 Wan2.1-14B-I2V**、专门用于把动作迁移到人物或角色上的模型。

> ![](/media/basic-workflows/wan-animate/legacy_gyazo_20a7f10f302751293cda0e0ed353d25a.png){media=image}

- **Animation 模式**：让输入的图像按照参考视频中人物的动作动起来
- **Replacement 模式**：把输入视频中的人物替换成参考图像中的人物

它有这 2 种生成模式。可以把 Replacement 模式理解为在 Animation 模式上加了“让人物融入背景的处理”，这样会比较好懂。

由于基于 Wan2.1，它最多只能生成 77 帧；不过和 [Wan2.1 VACE](/zh/basic-workflows/wan-2-1-vace/) 的 Extension 一样，反复“取出最后几帧、再生成后续”，实际上也能做出长视频。

---

## 需要的自定义节点

预处理阶段需要做人脸检测和姿势估计。有下面这些自定义节点会方便很多。

- [ComfyUI-WanAnimatePreprocess](https://github.com/kijai/ComfyUI-WanAnimatePreprocess)
  - 用 YOLO 检测人脸
  - 用 ViTPose 提取姿势（火柴人）
- [ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)
  - 用 SAM2 生成人物遮罩（Replacement 模式中使用）

---

## 下载模型

准备好 Wan-Animate 本身，以及 Wan2.1 系列通用的模型。

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
- gguf（可选）
  - [Wan2.2-Animate-14B-GGUF](https://huggingface.co/QuantStack/Wan2.2-Animate-14B-GGUF/tree/main)

放置示例如下。

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

这个模式会让输入的静态图像按照参考视频中人物的动作动起来。

工作流相当庞大，看着有点心慌，但基础就是 [Wan2.1 image2video](/zh/basic-workflows/wan-2-1/#image2video) 的结构。别怕，往下走吧。

![](/media/basic-workflows/wan-animate/legacy_gyazo_d25335c059e8117f9e617de4ffffefca.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_animation.json)

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_77b9c908b9e96505678ccaa0bde8055b.png{media=image}", width=33, align="left" %}

**1. 加载 Wan-Animate 模型**

- 用 `Load Diffusion Model` 加载 `Wan2_2-Animate`。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_1516ab2c0949d0df3261a26e46815d08.png{media=image}", width=33, align="left" %}

**2. 决定生成分辨率**

- 根据输入图像，用 `Scale Image to Total Pixels` 调整总像素数。
- 请根据电脑配置调整数值。
- 最后将分辨率 **裁剪为 16 的倍数**。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_c76608836777ce6a604372c2d9cc9c43.png{media=image}", width=33, align="left" %}

**3. 向 WanAnimateToVideo 节点输入额外信息**

- `reference_image`
  想让它动起来的静态图像。
- `face_video`
  从参考视频中裁剪出脸部的视频。
  `Pose and Face Detection` 会自动用 YOLO 检测人脸 → 裁剪。
- `pose_video`
  用 ViTPose 从参考视频生成的火柴人（关键点）视频。
  驱动视频和要动起来的图像在骨架和位置上不一样，所以会通过 retarget 处理来调整。

{% endmediaRow %}

{% outputs %}
![reference_image](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_9f0e0e20d750b2e207b01adc56858202.png){media=image} ![pose_video(处理前)](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_d7f66b4153473136c37e48c7066709a1.mp4){media=loop} ![output](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_86ed4c6aa64af79325ce18359a4021bc.mp4){media=loop}
{% endoutputs %}

---

## Replacement 模式

这个模式会把输入视频中的人物替换成参考图像中的人物。

它是在 Animation 模式的基础上，加入了用于 inpainting 人物的遮罩，以及让人物融入背景的重新打光（relight）处理。

![](/media/basic-workflows/wan-animate/legacy_gyazo_ab3d36d1e2ddfd5d7e452778dbab411c.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_replacement.json)

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_a26743871782e80338ed0d920ef6b786.png{media=image}", width=33, align="left" %}

**1. 添加重新打光 LoRA**

- 添加 relight LoRA，让替换后的人物融入背景。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_bc59ff33c803effd0e772879857e8a3a.png{media=image}", width=33, align="left" %}

**2. 对参考图像做 padding**

- 这次以视频为基准，所以按照视频的分辨率对参考图像做 padding。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_a6c53693b87e1cebda390d6b7dca306a.png{media=image}", width=33, align="left" %}

**3. 生成人物遮罩**

- 把 `Pose and Face Detection` 得到的人物坐标传给 SAM2.1，生成遮罩。
- 把遮罩稍微扩大一些，再用 `Blockify` 节点转换成像素画一样棱角分明的遮罩，作为 `character_mask`。
  不这样做的话，不知为何生成视频的轮廓上会残留一圈细边。
- 用 `ImageCompositeMasked` 把遮罩区域涂黑，得到的视频作为 `background_video` 使用。

{% endmediaRow %}

{% outputs %}
![background-pose_video](/media/basic-workflows/wan-animate/legacy_gyazo_f14909bbf4415e5477b67870379c6719.mp4){media=loop} ![reference_image](/media/basic-workflows/wan-animate/legacy_gyazo_59dda8074526ca42245b1220bbb4420f.png){media=image} ![output](/media/basic-workflows/wan-animate/legacy_gyazo_280c5916091919526db60ea0625d441a.mp4){media=loop}
{% endoutputs %}

---

## 6 步推理（Lightx2v LoRA）

使用蒸馏 LoRA，可以把采样步数减少到 4〜6 steps。

用在 text2video 时画质下降比较明显，但 Wan-Animate 并不是从零生成视频，所以不太明显。很值得积极用起来。

### 下载模型

- loras

  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
```

### Animation 模式（高速版）

![](/media/basic-workflows/wan-animate/legacy_gyazo_c8ff6a05cd057198146cd2cffb16d733.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_animation_lightx2v.json)

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_3808ae94efd870f0ff0ce1d77595ea36.png{media=image}", width=33, align="left" %}

**应用 LoRA**

- 🟪 用 `LoraLoaderModelOnly` 加载 Lightx2v LoRA。
- KSampler 的设置

  - `steps` … 4〜6
  - `cfg` … 1.0

{% endmediaRow %}

{% outputs %}
![20steps](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_86ed4c6aa64af79325ce18359a4021bc.mp4){media=loop} ![6steps](/media/basic-workflows/wan-animate/legacy_gyazo_67326f2a1a4d803ab4c6a40799aef8a7.mp4){media=loop}
{% endoutputs %}

### Replacement 模式（高速版）

![](/media/basic-workflows/wan-animate/legacy_gyazo_6e70b69630dea6bcf813917d8eb2c18a.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_replacement_lightx2v.json)

---

## 为长视频重复处理

Wan-Animate 的基础和 Wan2.1 I2V 一样，**1 次推理最多只能生成 77 帧**。
要做更长的视频，就得搭成“一边接过最后几帧，一边反复生成”的结构。

ComfyUI 没法做循环处理，所以只能把几乎相同的工作流一段接一段地往后串联。

老实说这种处理方式算不上聪明，这一点还是 Kijai 的 [ComfyUI-WanVideoWrapper](https://github.com/kijai/ComfyUI-WanVideoWrapper) 的实现更胜一筹。

### Animation 模式（重复）

![](/media/basic-workflows/wan-animate/legacy_gyazo_a489fad9b07fb1f1745d556fa130c731.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_animation_lightx2v_repeat.json)

乍一看是个庞大的工作流，但和前面的相比，不同之处只有下面 2 点。

![](/media/basic-workflows/wan-animate/legacy_gyazo_5db9830b2a2db2dd24ad1543906f49da.png){media=image}

- `video_frame_offset`

  - 如果第 1 次生成了 77 帧，第 2 次就需要从第 78 帧开始使用 `face_video` 和 `pose_video`。
  - 在 `video_frame_offset` 中填入偏移帧数，就会自动把 `face_video` / `pose_video` 的读取起点往后挪。
- `continue_motion_max_frames`

  - 设置用来衔接的重叠帧数。
  - 例如把 `length` 设为 77、`continue_motion_max_frames` 设为 5，就会沿用上一次的最后 5 帧，新生成剩下的 72 帧。

把这个组不断接下去，理论上可以做出任意长度的视频。
不过就像反复复印一样，误差会一点点累积。

### Replacement 模式（重复）

![](/media/basic-workflows/wan-animate/legacy_gyazo_5efe20ed9671e3eb4960fd5ddc70cb46.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_replacement_lightx2v_repeat.json)
