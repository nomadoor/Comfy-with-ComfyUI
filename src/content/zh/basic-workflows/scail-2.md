---
layout: page.njk
lang: zh
section: basic-workflows
slug: scail-2
navId: scail-2
title: "SCAIL-2"
created: 2026-06-11
updated: 2026-06-18
summary: "用 SCAIL-2 把视频中的动作迁移到参考图像的人物上"
seoTitle: "在 ComfyUI 中使用 SCAIL-2：无需火柴人的动作迁移"
seoDescription: "不转换成火柴人等中间表示，直接把视频动作迁移到参考图人物上的 Wan2.1 系模型 SCAIL-2 的用法。介绍 Animation 与 Replacement 模式、多人、多参考以及长视频生成。"
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

## 下载模型

- checkpoints
  - [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors) (1.75 GB)
- clip_vision
  - [clip_vision_h.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/clip_vision/clip_vision_h.safetensors) (1.26 GB)
- diffusion_models
  - [wan2.1_14B_SCAIL_2_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/SCAIL-2/blob/main/diffusion_models/wan2.1_14B_SCAIL_2_fp8_scaled.safetensors) (17.7 GB)
- loras
  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors) (739 MB)
- text_encoders
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors) (6.74 GB)
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors) (254 MB)

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

![](/media/basic-workflows/scail-2/legacy_gyazo_3f28188680b010f2bce1a13858ccaf9f.png){media=image}

[](/workflows/basic-workflows/scail-2/scail_2_animation.json)

基础工作流和 [Wan-Animate](/zh/basic-workflows/wan-animate/) 相同，但简单了很多，放轻松往下看吧。

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_0846209526768f5c450c700d1a153dad.png {media=image}", width=33, align="left" %}
**参考图像与动作视频**

参考图像和动作视频会在内部缩放，所以不需要统一成相同尺寸。

- 长宽比相近会更好处理。
- 图像和视频中的姿势不需要完全一致。
- 不过差得太多就会失败。
- 参考图像最好选择接近动作视频第 1 帧的图像。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_ce84cc6fe405261d50b5a6a3cfd8bf91.png {media=image}", width=33, align="left" %}
**提示词**

只是迁移动作而已，所以不需要很详细的提示词。

- 不过太短的话容易失败，尤其是在 [Replacement 模式](#replacement-模式) 下。
- 以这次为例，可以像 `穿着衬衫的男性一只手扶着腰，另一只手摸着头发` 这样，写出足以说明想要什么样视频的提示词。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_a632cf95fdb6fb5997e6fff4b71218fb.png {media=image}", width=33, align="left" %}
**分辨率与帧数**

生成尺寸和帧数在 `WanSCAILToVideo` 中设置。

- 推荐分辨率为 480p（864×480）到接近 720p（1280×704），并且是 32 的倍数
- 最大帧数为 81
- 这次把参考图像缩放后，用它的尺寸作为生成分辨率。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_74c8fc85eb5026b42cbb8f5d6255ba9b.png {media=image}", width=33, align="left" %}
**用 SAM3.1 生成遮罩**

用 [SAM 3 / 3.1](/zh/data-utilities/sam3/) 给参考图像和动作视频中的人物生成遮罩。

- 这不是 inpainting 用的那种精确遮罩，只是用来告诉 SCAIL-2 人物对应关系的辅助信息，所以稍微有点偏差也没问题。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_608eb36831300427187be280cf45c420.png {media=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

会给生成的遮罩涂上合适的颜色。

- 多人时这一步会稍微重要一些，详见后文。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_25a3907c1246d3513e3bb109997579ab.png {media=image}", width=33, align="left" %}
**6 steps 生成**

SCAIL-2 同样可以使用 [Wan2.1 高速生成](/zh/basic-workflows/wan-2-1/#self-forcing高速生成) 用的 Lightx2v LoRA。

- `cfg` 为 1.0
- `steps` 为 6

{% endmediaRow %}

{% outputs %}
![参考图像](/media/basic-workflows/scail-2/legacy_gyazo_ce9827f452cdc3cf7d47de8b12996f28.png){media=image} ![动作视频](/media/basic-workflows/scail-2/legacy_gyazo_f14aef04ac197a4b92680e05c4fbd178.mp4){media=loop} ![output](/media/basic-workflows/scail-2/legacy_gyazo_d87b2644f8f71218ebe678736479959e.mp4){media=loop}
{% endoutputs %}

---

## Replacement 模式

将 **视频中的人物** 替换为 **参考图像中的人物**。

![](/media/basic-workflows/scail-2/legacy_gyazo_6ade374ea0cbcb2175889cdc0be0bc46.png){media=image}

[](/workflows/basic-workflows/scail-2/scail_2_replacement.json)

基本上只要把 `Create SCAIL-2 Colored Mask` 和 `WanSCAILToVideo` 的 `replacement_mode` 设为 `true` 就行。

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_5862792bc1510147b0cc73b260624a11.png {media=image}", width=33, align="left" %}
**分辨率**

Replacement 以视频的尺寸为基准。

- 这个工作流会取缩放后的视频第 1 帧的尺寸来设置。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_cfdb30273c14347f30aad0d2c9987f8c.png {media=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask 与 WanSCAILToVideo**

将 `replacement_mode` 设为 `true`。

- 顺便一提，`Create SCAIL-2 Colored Mask` 的输出只是把 pose_video 那边的背景变成白色而已。

{% endmediaRow %}

{% outputs %}
![动作视频](/media/basic-workflows/scail-2/legacy_gyazo_395fd549274fb126d836ac0a9414d07d.mp4){media=loop} ![参考图像](/media/basic-workflows/scail-2/legacy_gyazo_ce9827f452cdc3cf7d47de8b12996f28.png){media=image} ![output](/media/basic-workflows/scail-2/legacy_gyazo_1a7caa57ded15aee5700bed072a4a0a7.mp4){media=loop}
{% endoutputs %}

---

> [!NOTE]
> 从这里开始的示例使用 Animation 模式，但这些内容也都可以用于 Replacement 模式。

## Animation 模式（多人）

SCAIL-2 也支持多人视频和图像。

不需要什么特别的操作，和前面一样输入视频和参考图像就行。

![](/media/basic-workflows/scail-2/legacy_gyazo_a04e322f84ca4377479a7760a60436cd.png){media=image}

[](/workflows/basic-workflows/scail-2/scail_2_animation_multi_char.json)

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_86e8ccd07a045bb039e2e69b81b2781b.png {media=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

多人时，哪个人物对应哪段动作就变得很重要，SCAIL-2 用彩色遮罩来控制这一点。

- 当 SAM3.1 分割出多个目标时，`Create SCAIL-2 Colored Mask` 会按顺序把它们涂成不同颜色。
- 基本上颜色相同的会被对应起来，所以请用 `sort_by` 等参数把颜色对齐。

> [!NOTE]
> 不过，就像下面的输出示例那样，颜色的对应和动作有时会对不上。这终究只是一个较弱的条件，模型有时也会单纯选择构图上更接近的一方。

{% endmediaRow %}

{% outputs %}
![参考图像](/media/basic-workflows/scail-2/legacy_gyazo_567acaf722ca9e839ec7cb834c1ed344.png){media=image} ![动作视频](/media/basic-workflows/scail-2/legacy_gyazo_53461ca17746349fbd11e69798460ea6.mp4){media=loop} ![output](/media/basic-workflows/scail-2/legacy_gyazo_913ff446dd39fa33f56ba9ed07ce6e16.mp4){media=loop}
{% endoutputs %}

---

## Animation 模式（多参考图像）

也可以把参考人物其他角度的图像、背景用的图像一起作为参考。

![](/media/basic-workflows/scail-2/legacy_gyazo_a135dfdaef80d8d16acd904f3d26a12a.png){media=image}

[](/workflows/basic-workflows/scail-2/scail_2_animation_multi_ref.json)

基本流程和普通的 Animation 模式相同，区别在于参考图像不是 1 张，而是以 batch 的形式输入。

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_23f0af93cd4027f7a8366c16b62181e0.png {media=image}", width=33, align="left" %}
**Batch 输入**

把想作为参考的图像输入到 `Batch Images`。

- 组成 batch 时，所有图像都会被裁剪成和第 1 张相同的尺寸。
  - 第 2 张及之后的图像基本上不缩放也可以，但超出的部分不会被反映。
  - 这个工作流用 padding 把它们补成和第 1 张相同的尺寸。
- **最后** 输入的图像会被反映得最强。
  - 相比背景，把想要驱动的人物放在后面似乎更好。

{% endmediaRow %}

虽然可以使用多张参考图像，但它不会根据人物大小调整背景，也不会对整体做自然的重新打光（relight）。

它适合用来补充人物其他角度的信息，但如果想合成背景，与其用这个功能，不如先用图像编辑把 1 张图做好。

{% outputs %}
![参考图像 1](/media/basic-workflows/scail-2/legacy_gyazo_d2935f1c3b0ff3016616c54d88d6be56.png){media=image} ![参考图像 2](/media/basic-workflows/scail-2/legacy_gyazo_7819645aea776b0aa5e24e8d9f642487.png){media=image} ![参考图像 3](/media/basic-workflows/scail-2/legacy_gyazo_4617d933cec4a3431d36af11c65180e3.png){media=image} ![动作视频](/media/basic-workflows/scail-2/legacy_gyazo_f14aef04ac197a4b92680e05c4fbd178.mp4){media=loop} ![output](/media/basic-workflows/scail-2/legacy_gyazo_50154740248550b3ffa1dfee024da941.mp4){media=loop}
{% endoutputs %}

---

## Animation 模式（81 帧以上）

SCAIL-2 基本上最多生成 81 帧，但使用 `WAN Context Windows (Manual)`，就能沿时间方向分段，生成更长的视频。

![](/media/basic-workflows/scail-2/legacy_gyazo_43b5c2e2684957795ab7d80f8ce9976a.png){media=image}

[](/workflows/basic-workflows/scail-2/scail_2_animation_wan_context_windows.json)

{% mediaRow img="/media/basic-workflows/scail-2/legacy_gyazo_55aa8d3ccee17c3a43f87f17895ebfb1.png {media=image}", width=33, align="left" %}
**WAN Context Windows (Manual)**

可以理解为时间轴方向的 tiling，或者 context sliding。

- 把 `context_length` 设为 81，内部就会每 81 帧切成一段来生成。
- 直接这样的话接缝会很明显，所以要在 `context_overlap` 里设置适当的帧数作为重叠部分。

{% endmediaRow %}

{% outputs %}
![参考图像](/media/basic-workflows/scail-2/legacy_gyazo_ce9827f452cdc3cf7d47de8b12996f28.png){media=image} ![动作视频](/media/basic-workflows/scail-2/legacy_gyazo_5491ba090036cbac5d76abd293d842ef.mp4){media=loop} ![output](/media/basic-workflows/scail-2/legacy_gyazo_ae5729a3c9c70711f767364534ccedf9.mp4){media=loop}
{% endoutputs %}
