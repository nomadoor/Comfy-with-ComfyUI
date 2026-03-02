---

layout: page.njk
lang: zh
section: basic-workflows
slug: flux-2-klein
navId: flux-2-klein
title: "FLUX.2 [klein]"
summary: "FLUX.2 [klein] 生成・图像编辑工作流"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/46ebf7545e89db8df26b83a992e4c728.png"
tags: [instruction-based-image-editing]
---

## 什么是 FLUX.2 [klein]？

**FLUX.2 [klein]** 是可以用 1 个模型处理 **图像生成** 和 **指令基础图像编辑** 的，小型・高速的 Flux.2 系模型。

产品线

* **9B** / **9B Base**（FLUX Non-Commercial License。非商用）
* **4B** / **4B Base**（Apache 2.0）

虽然很难懂，无印的是蒸馏（Distilled）模型。
相当于 Base（20 steps），Distilled 可以用 4 steps 生成。

因为没有大的性能差，所以生成基本上使用 Distilled 模型。

---

## 推荐设定值

- 分辨率
  - 最小 64×64
  - 最大 4MP (2048×2048)
  - 纵横均为 16 的倍数
- 参考图像张数
  - 最大 4

---

## Flux.2 [klein] 9B

### 模型的下载（9B）

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

![](https://gyazo.com/0936f046def982bdf00c697bb1740bfa){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_text2image.json)

> 虽然在官方工作流中，使用叫 `Flux2Scheduler` 的东西，但因为没有大区别，为了简化工作流使用了 `Simple`。

### text2image Distilled

![](https://gyazo.com/ba71c46ad1a5880a40a4897992777050){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_text2image.json)

只变更以下的参数。
- `CFG` : 1.0
- `steps` : 4

### 图像编辑 Base

![](https://gyazo.com/74b3fe065e88c1a48210c04b0e9c0766){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_image-edit.json)

“输入图像 + 指令提示词” 是基本。
- VAE Encode 输入图像，传递给 `ReferenceLatent`。


### 图像编辑 Distilled

![](https://gyazo.com/e55ff686078115488cef6406f60b9370){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit.json)

### 图像编辑（Multi-Reference）Base

也可以输入多张图像让其参考。

![](https://gyazo.com/d5d524090b273847fbc4a45cf52284b4){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_image-edit-multi.json)

- 只要串联连接 `参考图像 → VAE Encode → ReferenceLatent` 这个块就行。
- 2 张或 3 张都 OK。（但是上限是 4）

### 图像编辑（Multi-Reference）Distilled

![](https://gyazo.com/8d4bcf62e22ccaf6e91c3b2de20a417b){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit-multi.json)

---

## Flux.2 [klein] 4B

### 模型的下载（4B）

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
只是根据将模型和文本编码器替换为 4B 的东西。

**text2image**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_text2image.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_text2image.json)

**图像编辑**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_image-edit.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_image-edit.json)

**图像编辑（Multi-Reference)**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_image-edit-multi.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_image-edit-multi.json)

---

## 能做的事

这儿的终究只是一个例子。

改变画风，消除对象不过是图像编辑的一小部分。将什么视为“图像编辑”？能做的事无限宽广。请开发各种各样的使用方法。

### 单一图像

{% mediaRow img="https://gyazo.com/9739688bffdd08a9c5b3db5fa1dd8119 {gyazo=image}", width=45, align="left" %}

**风格转换**

```text
Reskin this into a watercolor illustration on textured paper.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Style-transfer.json)
{% endmediaFooter %}

{% endmediaRow %}



{% mediaRow img="https://gyazo.com/1fc2e71374a7d109c7f4d008973b4693 {gyazo=image}", width=45, align="left" %}

**环境・状态变更**

```text
Change the time to bright midday.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Environmental-change.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/13aca28a7b3b85966d2831ccd99ba2f4 {gyazo=image}", width=45, align="left" %}

**对象替换 / 追加**

```text
Replace the ice bear with an ice duck. Add a hat on the duck with light blue, red, and white colors. Add sneakers on the duck.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-swap.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/f7552667da5fcfa8ce3a4e4b49cf5cdd {gyazo=image}", width=45, align="left" %}

**文本编辑**

```text
Edit the text "WELCOME" to "Flux.2".
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Text-edit.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d1e84e57e066c8e30868ac97fbc5512b {gyazo=image}", width=45, align="left" %}

**图像修复**

```text
Restore and colorize this black-and-white photo.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Restore.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/ef668f3e2ef9f7598ec410bcbbd30960 {gyazo=image}", width=45, align="left" %}


**ControlNet-like（Pose）**

并不是以 ControlNet 的机制在动。  
通过给予火柴人或深度图，让其以之为基础生成真实的图像，作为图像编辑可以进行 **ControlNet 式** 的任务。

```text
A office lady sitting on outdoor stairs at dusk, matching the pose from the reference image. Evening ambient light, calm urban atmosphere. She wears a long skirt and a black camisole with frills. Natural, realistic photo
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Pose.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/090e1bccb68070e4a22c7315d1bdc2ce {gyazo=image}", width=45, align="left" %}

**inpainting / outpainting**

并非给予掩膜填补那里，而是只发出了“请自然地填补灰色区域”的指令。

```text
Outpaint the gray areas to extend the scene naturally
```
{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_outpainting.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/4a562fb90e23c8695ebe7c13b0db223e {gyazo=image}", width=45, align="left" %}

**杂乱 Collage 的 Refine**

```text
Turn this into a single realistic underwater ruins scene with two robots: a sleek white mecha and a large rusty moss-covered robot.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Collage-refinement.json)
{% endmediaFooter %}

{% endmediaRow %}

### Multi-Reference 图像编辑

{% mediaRow img="https://gyazo.com/fabad47684ddbc15657d34973511a405 {gyazo=image}", width=45, align="left" %}

**风格转印**

```text
Change image 1 to match the style of image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Style-transfer-multi.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d673551f6b212c41c35c0cfd2e729e8f {gyazo=image}", width=45, align="left" %}

**对象・人物替换**

```text
Replace the person in image 1 with the person from image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-swap-multi.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/6360d713f4bee61dd3c844d4336eebcd {gyazo=image}", width=45, align="left" %}

**对象追加**

```text
Place the airship from image 2 in the sky of image 1,Make the airship prominent (closer to camera)
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-add-multi.json)
{% endmediaFooter %}

{% endmediaRow %}


## 参考

- [Prompting Guide - FLUX.2 [klein]](https://docs.bfl.ai/guides/prompting_guide_flux2_klein)
- [FLUX.2 [klein] 官方 Doc](https://docs.bfl.ai/flux_2/flux2_overview#flux-2-[klein]-models)
- [Comfy.Org blog](https://blog.comfy.org/p/flux2-klein-4b-fast-local-image-editing)
