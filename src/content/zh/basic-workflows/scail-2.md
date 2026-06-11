---
layout: page.njk
lang: zh
section: basic-workflows
slug: scail-2
navId: scail-2
title: "SCAIL-2"
created: 2026-06-11
updated: 2026-06-11
summary: "使用 SCAIL-2 将视频动作转移到参考图像中的人物"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["human-motion-transfer","video-generation"]
---

## 什么是 SCAIL-2？

[SCAIL-2](https://teal024.github.io/SCAIL-2/) 是一个基于 Wan2.1 的模型，专门用于人物和角色的动作迁移。

它和 [Wan-Animate](/zh/basic-workflows/wan-animate/) 以及前作 SCAIL-1 最大的区别是，**不会**先转换成火柴人之类的中间表示。

用 ViTPose 或 OpenPose 做出火柴人，再把它作为条件来驱动人物。过去这算是很自然的想法，但一旦转换成火柴人，很多信息都会丢失。

深度、接触、多人之间的交错动作、非人类角色的动作等等……

所以 SCAIL-2 会把参考图像和动作视频几乎原样传给 DiT。

与其由人来手搓复杂的处理流水线，不如准备合适的数据集，让 AI 理解这个任务。这样得到的东西往往更灵活，也更好用。这种思路今后应该会越来越常见。

---

## 模型下载

- checkpoints
  - [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors)
- clip_vision
  - [clip_vision_h.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/clip_vision/clip_vision_h.safetensors)
- diffusion_models
  - [wan2.1_14B_SCAIL_2_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/SCAIL-2/blob/main/diffusion_models/wan2.1_14B_SCAIL_2_fp8_scaled.safetensors)
- loras
  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)
- text_encoders
  - [umt5_xxl (fp16 or fp8).safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/tree/main/split_files/text_encoders)
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── sam3.1_multiplex_fp16.safetensors
    ├── 📂clip_vision/
    │   └── clip_vision_h.safetensors
    ├── 📂diffusion_models/
    │   └── wan2.1_14B_SCAIL_2_fp8_scaled.safetensors
    ├── 📂loras/
    │   └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl (fp16 or fp8).safetensors
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

---

## Animation 模式

用动作视频来驱动 **参考图像**。

![](https://gyazo.com/a7c76588147896b9357481a741f1b071){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation.json)

基础 workflow 和 [Wan-Animate](/zh/basic-workflows/wan-animate/) 很接近，但这里简单很多，所以轻松看下去就好。

{% mediaRow img="https://gyazo.com/0846209526768f5c450c700d1a153dad {gyazo=image}", width=33, align="left" %}
**参考图像・动作视频**

参考图像和动作视频会在内部 resize，所以一开始不需要做成相同尺寸。

- 长宽比接近会更容易处理。
- 图像和视频中的姿势不需要完全一致。
- 但是差得太多会失败。
- 参考图像最好选择接近动作视频第 1 帧的图像。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ce84cc6fe405261d50b5a6a3cfd8bf91 {gyazo=image}", width=33, align="left" %}
**Prompt**

Prompt 不太适合细致指定人物或动作本身，更适合轻轻补充整体画质和氛围。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a632cf95fdb6fb5997e6fff4b71218fb {gyazo=image}", width=33, align="left" %}
**分辨率・帧数**

生成尺寸和帧数输入到 `WanSCAILToVideo`。

- 推荐分辨率为 480p（854×480）到 720p（1280×720），并且是 32 的倍数
- 最大帧数为 81
- 这个 workflow 会 resize 参考图像，并把那个尺寸作为生成分辨率。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/74c8fc85eb5026b42cbb8f5d6255ba9b {gyazo=image}", width=33, align="left" %}
**使用 SAM3.1 生成 Mask**

使用 [SAM 3 / 3.1](/zh/data-utilities/sam3/) 对参考图像和动作视频中的人物生成 mask。

- 这不是 inpainting 用的严格 mask，而是告诉 SCAIL-2 人物对应关系的辅助信息，所以稍微有点偏差也没问题。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2ed39327ee5ef67944b787be81605b08 {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

生成的 mask 会被适当地着色。

- 多人场景下这里会稍微重要一些。后面会说明。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/25a3907c1246d3513e3bb109997579ab {gyazo=image}", width=33, align="left" %}
**6 steps 生成**

SCAIL-2 也可以使用 [Wan2.1 高速生成](/zh/basic-workflows/wan-2-1/#self-forcing高速生成) 用的 Lightx2v LoRA。

- `cfg` 为 1.0
- `steps` 为 6

{% endmediaRow %}

**输出例**

![参考图像](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![动作视频](https://gyazo.com/f14aef04ac197a4b92680e05c4fbd178){gyazo=loop} ![output](https://gyazo.com/d87b2644f8f71218ebe678736479959e){gyazo=loop}

---

## Replacement 模式

将 **视频中的人物** 替换为 **参考图像中的人物**。

![](https://gyazo.com/0996965c611a4b4ad46f3490b27ad1d6){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Replacement.json)

基本上只要把 `Create SCAIL-2 Colored Mask` 和 `WanSCAILToVideo` 的 `replacement_mode` 设为 `true`。

{% mediaRow img="https://gyazo.com/5862792bc1510147b0cc73b260624a11 {gyazo=image}", width=33, align="left" %}
**分辨率**

Replacement 会以视频尺寸为基准。

- 这个 workflow 会 resize 视频的第 1 帧，取得那个尺寸并进行设置。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/48e4ebae5076eba223dda97a3853dc67 {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask 与 WanSCAILToVideo**

将 `replacement_mode` 设为 `true`。

- 顺便一提，`Create SCAIL-2 Colored Mask` 的输出只是让 pose_video 侧的背景变白。

{% endmediaRow %}

**输出例**

![动作视频](https://gyazo.com/f14aef04ac197a4b92680e05c4fbd178){gyazo=loop} ![参考图像](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![output](https://gyazo.com/65599272e59ffa6edd7571f1b87db822){gyazo=loop}

---

## Animation 模式（多人）

SCAIL-2 也支持多人视频和图像。

不需要特别操作。和前面一样，输入视频和参考图像即可。

![](https://gyazo.com/86b498dff06f09754116fc3cce4d3dbd){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation_multi-char.json)

{% mediaRow img="https://gyazo.com/28c7b669ac66155518bbce22130e623b {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

多人时，哪个人物对应哪段动作会变得重要。SCAIL-2 使用彩色 mask 来控制这一点。

- 当 SAM3.1 分割出多个目标时，`Create SCAIL-2 Colored Mask` 会按顺序把它们涂成不同颜色。
- 基本上同色之间会被关联起来，所以请使用 `sort_by` 等方式对齐颜色。

> 不过，如下面的输出例所示，颜色对应和动作并不一定总能对上。它只是一个较弱的条件，模型也可能单纯选择构图上更接近的一方。

{% endmediaRow %}

**输出例**

![参考图像](https://gyazo.com/567acaf722ca9e839ec7cb834c1ed344){gyazo=image} ![动作视频](https://gyazo.com/53461ca17746349fbd11e69798460ea6){gyazo=loop} ![output](https://gyazo.com/913ff446dd39fa33f56ba9ed07ce6e16){gyazo=loop}
