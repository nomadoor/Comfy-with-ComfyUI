---
layout: page.njk
lang: zh
section: basic-workflows
slug: scail-2
navId: scail-2
title: "SCAIL-2"
created: 2026-06-11
updated: 2026-06-18
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
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
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
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

---

## Animation 模式

用动作视频来驱动 **参考图像**。

![](https://gyazo.com/3f28188680b010f2bce1a13858ccaf9f){gyazo=image}

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

因为只是转移动作，所以不需要很详细的 prompt。

- 但是，如果 prompt 太短，尤其是在 [Replacement 模式](#replacement-模式) 中会更容易失败。
- 这次的话，可以像 `穿着衬衫的男性一只手扶着腰，另一只手摸着头发` 这样，写到足够说明想生成什么样的视频。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a632cf95fdb6fb5997e6fff4b71218fb {gyazo=image}", width=33, align="left" %}
**分辨率・帧数**

生成尺寸和帧数输入到 `WanSCAILToVideo`。

- 推荐分辨率为 480p（864×480）到接近 720p（1280×704），并且是 32 的倍数
- 最大帧数为 81
- 这个 workflow 会 resize 参考图像，并把那个尺寸作为生成分辨率。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/74c8fc85eb5026b42cbb8f5d6255ba9b {gyazo=image}", width=33, align="left" %}
**使用 SAM3.1 生成 Mask**

使用 [SAM 3 / 3.1](/zh/data-utilities/sam3/) 对参考图像和动作视频中的人物生成 mask。

- 这不是 inpainting 用的严格 mask，而是告诉 SCAIL-2 人物对应关系的辅助信息，所以稍微有点偏差也没问题。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/608eb36831300427187be280cf45c420 {gyazo=image}", width=33, align="left" %}
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

![](https://gyazo.com/6ade374ea0cbcb2175889cdc0be0bc46){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Replacement.json)

基本上只要把 `Create SCAIL-2 Colored Mask` 和 `WanSCAILToVideo` 的 `replacement_mode` 设为 `true`。

{% mediaRow img="https://gyazo.com/5862792bc1510147b0cc73b260624a11 {gyazo=image}", width=33, align="left" %}
**分辨率**

Replacement 会以视频尺寸为基准。

- 这个 workflow 会 resize 视频的第 1 帧，取得那个尺寸并进行设置。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/cfdb30273c14347f30aad0d2c9987f8c {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask 与 WanSCAILToVideo**

将 `replacement_mode` 设为 `true`。

- 顺便一提，`Create SCAIL-2 Colored Mask` 的输出只是让 pose_video 侧的背景变白。

{% endmediaRow %}

**输出例**

![动作视频](https://gyazo.com/395fd549274fb126d836ac0a9414d07d){gyazo=loop} ![参考图像](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![output](https://gyazo.com/1a7caa57ded15aee5700bed072a4a0a7){gyazo=loop}

---

## Animation 模式（多人）

SCAIL-2 也支持多人视频和图像。

不需要特别操作。和前面一样，输入视频和参考图像即可。

![](https://gyazo.com/a04e322f84ca4377479a7760a60436cd){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation_multi-char.json)

{% mediaRow img="https://gyazo.com/86e8ccd07a045bb039e2e69b81b2781b {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

多人时，哪个人物对应哪段动作会变得重要。SCAIL-2 使用彩色 mask 来控制这一点。

- 当 SAM3.1 分割出多个目标时，`Create SCAIL-2 Colored Mask` 会按顺序把它们涂成不同颜色。
- 基本上同色之间会被关联起来，所以请使用 `sort_by` 等方式对齐颜色。

> 不过，如下面的输出例所示，颜色对应和动作并不一定总能对上。它只是一个较弱的条件，模型也可能单纯选择构图上更接近的一方。

{% endmediaRow %}

**输出例**

![参考图像](https://gyazo.com/567acaf722ca9e839ec7cb834c1ed344){gyazo=image} ![动作视频](https://gyazo.com/53461ca17746349fbd11e69798460ea6){gyazo=loop} ![output](https://gyazo.com/913ff446dd39fa33f56ba9ed07ce6e16){gyazo=loop}

---

## Animation 模式（多参考图像）

也可以一次参考多张图像，例如参考人物的其他角度图，或单独准备的背景图。

![](https://gyazo.com/a135dfdaef80d8d16acd904f3d26a12a){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation_multi-ref.json)

基本流程和普通的 Animation 模式相同。区别在于，这里不是输入 1 张参考图像，而是以 batch 的形式输入多张参考图像。

{% mediaRow img="https://gyazo.com/23f0af93cd4027f7a8366c16b62181e0 {gyazo=image}", width=33, align="left" %}
**Batch 输入**

将想要参考的图像输入到 `Batch Images`。

- 形成 batch 后，所有图像都会被裁剪成和第 1 张相同的尺寸。
  - 第 2 张之后通常不需要重新 resize，但超出这个尺寸的部分不会被反映出来。
  - 在这个 workflow 中，会用 padding 让后面的图像匹配第 1 张的尺寸。
- **最后** 输入的图像会被反映得最强。
  - 比起背景，最好把想要动起来的人物放在更后面。

{% endmediaRow %}

虽然可以使用多张参考图像，但它并不会根据人物大小自动调整背景，也不会把整体自然地重新改写成一张图。

老实说，很多情况下不如先用图像编辑做出 1 张完整的参考图像。

**输出例**

![参考图像 1](https://gyazo.com/d2935f1c3b0ff3016616c54d88d6be56){gyazo=image} ![参考图像 2](https://gyazo.com/7819645aea776b0aa5e24e8d9f642487){gyazo=image} ![参考图像 3](https://gyazo.com/4617d933cec4a3431d36af11c65180e3){gyazo=image} ![动作视频](https://gyazo.com/5491ba090036cbac5d76abd293d842ef){gyazo=loop} ![output](https://gyazo.com/50154740248550b3ffa1dfee024da941){gyazo=loop}

---

## Animation 模式（81 帧以上）

SCAIL-2 基本上生成到 81 帧为止，但使用 `WAN Context Windows (Manual)`，就可以沿时间方向分段生成更长的视频。

![](https://gyazo.com/43b5c2e2684957795ab7d80f8ce9976a){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation_WAN-Context-Windows.json)

{% mediaRow img="https://gyazo.com/55aa8d3ccee17c3a43f87f17895ebfb1 {gyazo=image}", width=33, align="left" %}
**WAN Context Windows (Manual)**

可以理解为时间轴方向的 tiling，或者 context sliding。

- 将 `context_length` 设为 81 时，内部会按 81 帧为一段进行生成。
- 如果直接这样分段，接缝会很明显，所以用 `context_overlap` 设置适当的重叠帧数。

{% endmediaRow %}

**输出例**

![参考图像](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![动作视频](https://gyazo.com/5491ba090036cbac5d76abd293d842ef){gyazo=loop} ![output](https://gyazo.com/ae5729a3c9c70711f767364534ccedf9){gyazo=loop}
