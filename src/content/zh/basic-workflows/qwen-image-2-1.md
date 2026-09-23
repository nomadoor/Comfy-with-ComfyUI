---
layout: page.njk
lang: zh
section: basic-workflows
slug: qwen-image-2-1
navId: qwen-image-2-1
title: "Qwen-Image-2.1"
created: 2026-09-21
updated: 2026-09-23
summary: "使用 Qwen-Image-2.1 生成和编辑图像"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_hero.png"
tags: []
---

## 什么是 Qwen-Image-2.1？

[Qwen-Image-2.1](https://qwen.ai/blog?id=qwen-image-2.1) 是一个将图像生成和图像编辑整合到同一模型中的 open weight 图像生成模型。

闭源的 Qwen-Image 2.0 已经先行发布，而在 open weight 的 Qwen-Image 系列中，它是 `Qwen-Image-2512` 和 `Qwen-Image-Edit-2511` 的后继模型。

以往的 Qwen-Image 会将生成与编辑分成不同模型。2.x 则与 [MiniMax H3](/zh/basic-workflows/minimax-h3/) 类似，将文本和参考图像一并送入同一个 DiT，因此图像生成、编辑和 Ref2Image 都可以使用同一个模型完成。

它还原生支持 RGBA，也就是可以生成透明图像。

图像生成部分只有 7B，却可以同时处理生成、编辑、参考和透明图像，确实是一个相当灵活的模型。

---

## 推荐设置

- 分辨率
  - 推荐 2K（约 4 MP）
    - 1:1 时为 2048 × 2048 px
  - 宽度和高度使用 32 的倍数

---

## 模型的下载

- diffusion_models
  - [qwen_image_2.1_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/diffusion_models/qwen_image_2.1_int8_convrot.safetensors) (7.26 GB)
- text_encoders
  - [qwen3vl_8b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/text_encoders/qwen3vl_8b_int8_convrot.safetensors) (9.35 GB)
- vae
  - [qwen_image_2.1_vae_bf16.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/vae/qwen_image_2.1_vae_bf16.safetensors) (676 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_2.1_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_8b_int8_convrot.safetensors
    └── 📂vae/
        └── qwen_image_2.1_vae_bf16.safetensors
```

---

## text2image

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="121s", tags=["4MP"], samplers=[{ speed: "3.45 s/it" }] %}

- `CFG`: 1.0
  - 官方工作流没有使用 CFG，不过稍微提高一点并尝试 Negative Prompt，或许也值得一试

Seed 带来的差异非常大，可以说有好有坏。改变分辨率也会让图像产生明显变化，请尝试不同的分辨率和 Seed。

**输出示例**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_output.png){media=image}

---

## Ref2Image

组合多张参考图像，生成一张新图像。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="108s", tags=["2MP"], samplers=[{ speed: "1.95 s/it" }] %}

- 最多可以输入 10 张参考图像
- 在提示词中用“`<image1>` 中的女性坐在 `<image2>` 中的地点”这种方式，指定要使用的图像

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image_text_encode.png", width=40, align="left" %}
**Text Encode Qwen Image 2.1**

在这里输入参考图像和提示词。

- `resolution`
  - 参考图像会保持宽高比，缩放到约 1 MP 后再传给模型
- `latent` 输出
  - 这个 latent 是按照第 1 张图像尺寸创建的空 latent，但尺寸会在内部取整。我的工作流希望输出与输入图像的尺寸完全一致，因此没有使用它

{% endmediaRow %}

**输出示例**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image_output.png){media=image}

---

## 图像编辑

工作流与 Ref2Image 几乎相同，区别只是生成图像的尺寸会与第 1 张图像保持一致。

既然是编辑，如果返回的图像尺寸发生变化就会很麻烦。因此，这个工作流使用 `Get Image Size` 读取第 1 张图像的尺寸，再传给 `Empty Latent Image`。

第 2 张及之后的图像与 Ref2Image 相同，可以作为参考图像使用。

### 基本图像编辑

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit.json", level=1, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="57s", tags=["1MP"], samplers=[{ speed: "1.72 it/s" }] %}

和以往的图像编辑一样，只要直接输入“删除男性”“把衣服变成红色”“改成水彩画”等指示即可。

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_text_encode.png", width=40, align="left" %}
**Text Encode Qwen Image 2.1**

- `resolution`
  - 与 Ref2Image 不同，这里设置为 `0`。图像不会缩放，只会将尺寸取整为 32 的倍数（因为事先已经调整过尺寸，实际不会发生变化）
  - 最好还是让模型看到的图像尺寸与输出尺寸保持一致

{% endmediaRow %}

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_output.png){media=image}

### 用彩色圆圈指定位置

用彩色笔圈出想要编辑的位置。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local.json", level=1, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="64s", tags=["1MP"], samplers=[{ speed: "1.72 it/s" }] %}

直接在图像上圈出要编辑的对象。

- 也可以使用 `Load Image` 节点附带的 `Mask Editor`

然后输入“删除红圈里的手表”这样的指示即可。

还可以使用多种颜色分别给出不同的指示，遇到难以用语言准确说明位置的情况时很方便。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_output.png){media=image}

### 用蒙版指定位置

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="117s", tags=["2MP"], samplers=[{ speed: "2.27 s/it" }] %}

思路与彩色圆圈相同，不过这里会将表示位置的黑白图像，**与原图分开** 输入。

优点是不需要直接在原图上涂画，不会弄脏原图。

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert.png", width=40, align="left" %}
**将蒙版转换为图像**

使用 `Convert Mask to Image` 将 `Load Image` 的 MASK 输出转换为黑白图像，再输入到 `image_2`。

实际上，模型接收到的只是一张普通的黑白图像。也可以不从蒙版转换，直接准备一张在黑色背景上用白色涂出范围的图像。

{% endmediaRow %}

> 这与通常所说的 [inpainting](/zh/basic-workflows/sd15-inpainting/) 完全不同。\
> inpainting 有防止蒙版外区域被编辑的机制，而这里的图像只是用来提示位置。\
> 因此，编辑也可能超出指定范围。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_input.png){media=image} ![mask](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_mask.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_output.png){media=image}

### Outpainting

这与添加 Padding 后再进行 inpainting 的普通 [Outpainting](/zh/basic-workflows/sd15-outpainting/) 完全不同。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="93s", tags=["2MP"], samplers=[{ speed: "1.67 s/it" }] %}

将横向图像作为参考图像输入，却把生成尺寸设成纵向，会怎么样呢？

Qwen-Image-2.1 会生成一张补全上下空间的新图像。

它不是只绘制空白部分，而是重新绘制整张图像，因此原图部分也会发生一些变化。

这并不是严格固定原图的方法，不过确实非常简单。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting_output.png){media=image}

### 根据引导图像生成

虽然它本身并不是 ControlNet，但可以把姿势图、深度图等作为图像编辑的参考，让模型根据这些图像进行生成。

**所需自定义节点**

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="82s", tags=["2MP"], samplers=[{ speed: "1.38 s/it" }] %}

再输入一张参考图像，让其中的人物摆出指定姿势。

可能会觉得，真的有必要特意把姿势转换成火柴人吗？不过，即使只想让模型参考姿势，它有时也会把服装、背景等无关信息一并带进去。

与其说是因为 ControlNet 才使用 Pose，不如说重点在于从参考图像中剔除多余信息，只提取姿势或形状交给模型。

![reference](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose_ref.png){media=image} ![pose](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose_pose.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose_output.png){media=image}

### Upscale

既然能生成到 4 MP，不妨让它把画质较差的图像处理得更清晰。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_upscale.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_upscale.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="212s", tags=["4MP"], samplers=[{ speed: "5.28 s/it" }] %}

先将图像放大到 4 MP，作为参考图像输入，再让模型以此为基础进行细化。

这个模型保持参考图像的能力很强，因此 Upscale 可能也是它非常擅长的任务之一。

另一方面，如果想像通常所说的增强处理那样进行较大幅度的重绘，可能还需要一些调整。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_upscale_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_upscale_output.png){media=image}

---

## 透明图像

Qwen-Image-2.1 只需稍微修改提示词，就可以生成透明图像。

不需要添加特殊节点，从一开始就能输出带有 Alpha Channel 的 RGBA 图像。

### 生成透明图像

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba.json", level=1, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="65s", tags=["2MP"], samplers=[{ speed: "1.11 s/it" }] %}

按下面的格式编写提示词。

```text
This is an RGBA image with transparency. <在这里填写要生成的内容>. The image has alpha channel and the background is transparent.
```

前后是固定句式，直接复制，只替换中间部分即可。

为了保留透明信息，请将输出保存为 PNG。保存为 JPEG 会丢失 Alpha Channel。

**输出示例**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba_output.png){media=image}

### 抠图

将透明图像生成与图像编辑组合起来……没错，也可以用来抠图。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="90s", tags=["2MP"], samplers=[{ speed: "1.67 s/it" }] %}

使用刚才的格式，并用 `Extract 〇〇` 指定要提取的内容即可。

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction_output.png){media=image}

---

## 应用

### 全景图生成

输入一张喜欢的参考图，并要求以 2:1 分辨率生成 ERP，仅此而已，就能得到一张 360 度全景图。简单得有点过分……

**自定义节点**

- [nomadoor/ComfyUI-Panorama-Stickers](https://github.com/nomadoor/ComfyUI-Panorama-Stickers)
  - 顺便宣传一下，这是我制作的节点，可以预览全景图，也可以在全景空间中拍摄。如果感兴趣，可以试试看。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_panorama.mp4){media=loop}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_panorama.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="159s", tags=["4MP"], samplers=[{ speed: "4.29 s/it" }] %}

这个工作流会参考原图，生成一张横向的 2:1 图像。

它并不是严格地对左右两侧进行 Outpainting，而是重新绘制整个 ERP，使内容自然地落在全景空间中。

### 图层分解

在上面的[抠图](#抠图)中，可以从图像里单独提取任意内容，得到透明图像。

那么，把抠出的物体从图像中移除，再继续抠出下一个位于前方的内容。重复这个过程，就能把一张图像从前到后分成多个图层。

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition.json)

这里使用[循环处理](/zh/data-utilities/loop/)，重复以下步骤：

1. 让 MLLM 选择看起来位于最前方的内容
2. 只把选中的内容提取为透明图像
3. 反过来，从当前图像中移除选中的内容
4. 把移除后的图像传给下一次 iteration

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_number.png", width=40, align="left" %}

**设置图层数量**

首先输入图像，以及想要分成的图层数量。

设为 `5` 时，会从前到后依次抠出 4 个图层，再加上最后剩下的背景，共 5 个图层。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_mllm.png", width=40, align="left" %}

**决定下一步抠出什么**

让 `Generate Text` 查看当前图像，并用一段简短文本回答下一步要抠出的内容。

剩余图层数量不同，适合作为一个图层提取的范围也会变化。因此，提示词中还会加入 `图层数 - iteration_index`，告诉 MLLM 接下来还要分成多少层。

返回的物体名称会通过 `Format Text` 整理成给 Qwen-Image-2.1 的指令。

> 将 RGBA 图像传给 `Generate Text` 节点会报错，因此先用 `Split Image with Alpha` 去掉 Alpha 信息。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_object_extraction.png", width=40, align="left" %}

**抠出最前方的物体**

只将 MLLM 选中的物体提取为透明图像。

这里做的事情与上面的[抠图](#抠图)相同。

这张图像会作为一个图层传给 `End Loop`。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_object_removal.png", width=40, align="left" %}

**移除最前方的物体**

图层分解不只需要抠出的物体，还需要一张移除该物体后的图像。

直接输入原图和抠图，再要求“把这个去掉”没有取得理想效果。因此，这里把抠出的区域涂成绿色，并要求模型自然地填补绿色部分。

移除物体后的图像，会成为下一次抠图使用的原图。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_switch.png", width=40, align="left" %}

**最后直接输出背景**

重复这个过程后，最后只会剩下背景。

不需要再从背景中抠出或移除任何内容。

因此，使用 `is_last` 和 `If/Else Switch`，让最后一次 iteration 绕过抠图和移除，直接输出当前图像。

{% endmediaRow %}

> 你可能会想，为什么不固定 seed，反而特意使用 `iteration_index`。  
> 不知道这是 bug 还是预期行为，但用相同的 seed 再次编辑一张已经编辑过的图像时，输出会出现严重劣化。  
> 只要 seed 发生变化就没有问题，所以作为临时处理，这里直接输入每次循环都会变化的 `iteration_index`。

**输出示例**

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_input.png){media=image} ![output 1](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output1.png){media=image} ![output 2](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output2.png){media=image} ![output 3](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output3.png){media=image} ![output 4](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output4.png){media=image} ![output 5](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output5.png){media=image}
