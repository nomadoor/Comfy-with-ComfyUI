---

layout: page.njk
lang: zh
section: basic-workflows
slug: flux-2-klein
navId: flux-2-klein
title: "FLUX.2 [klein]"
created: 2026-01-22
updated: 2026-03-02
summary: "FLUX.2 [klein] 图像生成与图像编辑工作流"
seoTitle: "在 ComfyUI 中使用 FLUX.2 [klein]：图像生成与编辑"
seoDescription: "一个模型兼顾图像生成与基于指令编辑的小型高速 FLUX.2 [klein] 用法。介绍推荐设置、9B / 4B 与 Base / Distilled 的区别、text2image、图像编辑和多参考工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-2-klein/legacy_gyazo_46ebf7545e89db8df26b83a992e4c728.png"
tags: [instruction-based-image-editing]
---

## 什么是 FLUX.2 [klein]？

**FLUX.2 [klein]** 是 Flux.2 系列中小巧、快速的模型，一个模型就能兼顾 **图像生成** 和 **基于指令的图像编辑**。

型号

* **9B** / **9B Base**（FLUX Non-Commercial License，非商用）
* **4B** / **4B Base**（Apache 2.0）

有点容易混淆：不带后缀的版本才是蒸馏（Distilled）模型。
Base 需要 20 steps，而 Distilled 只要 4 steps 就能生成。

两者性能差距不大，所以生成时基本上都用 Distilled 模型。

---

## 推荐设置

- 分辨率
  - 最小 64×64
  - 最大 4MP (2048×2048)
  - 宽和高都必须是 16 的倍数
- 参考图像数量
  - 最大 4

---

## Flux.2 [klein] 9B

### 下载模型（9B）

* diffusion_models

  * [flux-2-klein-9b-fp8.safetensors（distilled）](https://huggingface.co/black-forest-labs/FLUX.2-klein-9b-fp8/blob/main/flux-2-klein-9b-fp8.safetensors)
  * [flux-2-klein-base-9b-fp8.safetensors](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9b-fp8/blob/main/flux-2-klein-base-9b-fp8.safetensors)
* text_encoders

  * [qwen_3_8b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/text_encoders/qwen_3_8b.safetensors)
* vae

  * [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)


```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-9b-fp8.safetensors
    │   └── flux-2-klein-base-9b-fp8.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_8b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### text2image Base

![](/media/basic-workflows/flux-2-klein/legacy_gyazo_0936f046def982bdf00c697bb1740bfa.png){media=image}

[](/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_base_9b_text2image.json)

> [!NOTE]
> 官方工作流用的是 `Flux2Scheduler`，不过效果差别不大，为了简化工作流，这里用的是 `Simple`。

### text2image Distilled

![](/media/basic-workflows/flux-2-klein/legacy_gyazo_ba71c46ad1a5880a40a4897992777050.png){media=image}

[](/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_9b_text2image.json)

只需修改以下参数。
- `CFG` : 1.0
- `steps` : 4

### 图像编辑 Base

![](/media/basic-workflows/flux-2-klein/legacy_gyazo_74b3fe065e88c1a48210c04b0e9c0766.png){media=image}

[](/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_base_9b_image_edit.json)

基本形式是“输入图像 + 指令提示词”。
- 把输入图像经过 VAE Encode 后传给 `ReferenceLatent`。


### 图像编辑 Distilled

![](/media/basic-workflows/flux-2-klein/legacy_gyazo_e55ff686078115488cef6406f60b9370.png){media=image}

[](/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_9b_image_edit.json)

### 图像编辑（多参考）Base

也可以输入多张图像作为参考。

![](/media/basic-workflows/flux-2-klein/legacy_gyazo_d5d524090b273847fbc4a45cf52284b4.png){media=image}

[](/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_base_9b_image_edit_multi.json)

- 只要把 `参考图像 → VAE Encode → ReferenceLatent` 这一组串联起来就行。
- 2 张、3 张都可以。（但上限是 4 张）

### 图像编辑（多参考）Distilled

![](/media/basic-workflows/flux-2-klein/legacy_gyazo_8d4bcf62e22ccaf6e91c3b2de20a417b.png){media=image}

[](/workflows/basic-workflows/flux-2-klein/9b/flux_2_klein_9b_image_edit_multi.json)

---

## Flux.2 [klein] 4B

### 下载模型（4B）

* diffusion_models

  * [flux-2-klein-4b.safetensors（distilled）](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-4b.safetensors)
  * [flux-2-klein-base-4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-base-4b.safetensors)
* text_encoders

  * [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/text_encoders/qwen_3_4b.safetensors)
* vae

  * [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-4b.safetensors
    │   └── flux-2-klein-base-4b.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### 工作流

基本和 9B 完全一样。  
只要把模型和文本编码器换成 4B 版即可。

**text2image**
- [](/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_base_4b_text2image.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_4b_text2image.json)

**图像编辑**
- [](/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_base_4b_image_edit.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_4b_image_edit.json)

**图像编辑（多参考)**
- [](/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_base_4b_image_edit_multi.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/flux_2_klein_4b_image_edit_multi.json)

---

## 可以做什么

这里列出的只是一些例子。

改变画风、去除物体，只是图像编辑的一小部分。把什么看作“图像编辑”，决定了它能做的事情可以无限扩展。欢迎去发掘各种各样的用法。

### 单张图像

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_9739688bffdd08a9c5b3db5fa1dd8119.png {media=image}", width=45, align="left" %}

**风格转换**

```text
Reskin this into a watercolor illustration on textured paper.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_style_transfer.json)
{% endmediaFooter %}

{% endmediaRow %}



{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_1fc2e71374a7d109c7f4d008973b4693.png {media=image}", width=45, align="left" %}

**改变环境与状态**

```text
Change the time to bright midday.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_environmental_change.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_13aca28a7b3b85966d2831ccd99ba2f4.png {media=image}", width=45, align="left" %}

**替换 / 添加物体**

```text
Replace the ice bear with an ice duck. Add a hat on the duck with light blue, red, and white colors. Add sneakers on the duck.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_object_swap.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_f7552667da5fcfa8ce3a4e4b49cf5cdd.png {media=image}", width=45, align="left" %}

**文本编辑**

```text
Edit the text "WELCOME" to "Flux.2".
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_text_edit.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_d1e84e57e066c8e30868ac97fbc5512b.png {media=image}", width=45, align="left" %}

**图像修复**

```text
Restore and colorize this black-and-white photo.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_restore.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_ef668f3e2ef9f7598ec410bcbbd30960.png {media=image}", width=45, align="left" %}


**类 ControlNet（Pose）**

它并不是靠 ControlNet 的机制运作的。  
给它火柴人或深度图，让它据此生成写实图像，就能以图像编辑的方式完成 **类似 ControlNet** 的任务。

```text
A office lady sitting on outdoor stairs at dusk, matching the pose from the reference image. Evening ambient light, calm urban atmosphere. She wears a long skirt and a black camisole with frills. Natural, realistic photo
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_pose.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_090e1bccb68070e4a22c7315d1bdc2ce.png {media=image}", width=45, align="left" %}

**inpainting / outpainting**

这里并不是给出蒙版让它填充，而只是下了一句“把灰色区域自然地补全”的指令。

```text
Outpaint the gray areas to extend the scene naturally
```
{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_outpainting.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_4a562fb90e23c8695ebe7c13b0db223e.png {media=image}", width=45, align="left" %}

**粗糙拼贴的精修**

```text
Turn this into a single realistic underwater ruins scene with two robots: a sleek white mecha and a large rusty moss-covered robot.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_collage_refinement.json)
{% endmediaFooter %}

{% endmediaRow %}

### 多参考图像编辑

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_fabad47684ddbc15657d34973511a405.png {media=image}", width=45, align="left" %}

**风格迁移**

```text
Change image 1 to match the style of image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_style_transfer_multi.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_d673551f6b212c41c35c0cfd2e729e8f.png {media=image}", width=45, align="left" %}

**替换物体或人物**

```text
Replace the person in image 1 with the person from image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_object_swap_multi.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/flux-2-klein/legacy_gyazo_6360d713f4bee61dd3c844d4336eebcd.png {media=image}", width=45, align="left" %}

**添加物体**

```text
Place the airship from image 2 in the sky of image 1,Make the airship prominent (closer to camera)
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/flux_2_klein_9b_object_add_multi.json)
{% endmediaFooter %}

{% endmediaRow %}


## 参考资料

- [Prompting Guide - FLUX.2 [klein]](https://docs.bfl.ai/guides/prompting_guide_flux2_klein)
- [FLUX.2 [klein] 官方 Doc](https://docs.bfl.ai/flux_2/flux2_overview#flux-2-[klein]-models)
- [Comfy.Org blog](https://blog.comfy.org/p/flux2-klein-4b-fast-local-image-editing)
