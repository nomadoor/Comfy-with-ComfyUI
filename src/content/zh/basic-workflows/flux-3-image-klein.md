---
layout: page.njk
lang: zh
section: basic-workflows
slug: flux-3-image-klein
navId: flux-3-image-klein
title: "FLUX 3 Image Klein"
created: 2026-10-16
updated: 2026-10-16
summary: "FLUX 3 Image Klein 生成与图像编辑工作流"
seoTitle: "在 ComfyUI 中使用 FLUX 3 Image Klein：图像生成与编辑"
seoDescription: "一个模型即可完成图像生成、图像编辑和 BBOX 布局指定的 FLUX 3 Image Klein 在 ComfyUI 中的用法。介绍模型下载、Prompt Upsampler、text2image、Ref2Image 和图像编辑的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_hero.png"
tags: [instruction-based-image-editing]
---

## 什么是 FLUX 3 Image Klein？

**FLUX 3 Image Klein** 是 Black Forest Labs 推出的图像生成模型。

它是 [FLUX.2 [klein]](/zh/basic-workflows/flux-2-klein/) 的下一代，一个模型就能完成图像生成、图像编辑和 Ref2Image。  
还可以用 BBOX 指定元素的位置或要编辑的范围，这一点也很有意思。用法和 [Ideogram 4.0](/zh/basic-workflows/ideogram-4/) 差不多。

它的表现力并不算特别出众，但速度快，可以轻松地一张接一张生成，用起来很爽快。

---

## 推荐设置

- 分辨率
  - 最大 4K
  - 宽度和高度都需要是 16 的倍数
- 参考图像数量
  - 最多 10 张

---

## 模型的下载

> [!WARNING]
> FLUX 3 Image Klein 的模型需要认证才能下载。请用 Hugging Face 账号登录，然后在 [flux-3-image-klein-comfy 的页面](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy) 同意使用条款。
>
> ![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_huggingface_gated.png){media=image}

- diffusion_models
  - [flux3_image_klein_sd_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/diffusion_models/flux3_image_klein_sd_int8_convrot.safetensors) (5.83 GB)
- text_encoders
  - [qwen3vl_4b_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/text_encoders/qwen3vl_4b_int8_convrot.safetensors) (4.86 GB)
  - [qwen3.5_9b_flux3_prompt_upsampler_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/text_encoders/qwen3.5_9b_flux3_prompt_upsampler_int8_convrot.safetensors) (9.75 GB)
    - Prompt Upsampler。用于 Ref2Image / 图像编辑
- vae
  - [flux2-vae.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── flux3_image_klein_sd_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   ├── qwen3vl_4b_int8_convrot.safetensors
    │   └── qwen3.5_9b_flux3_prompt_upsampler_int8_convrot.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```


---

## Prompt Upsampler

![](/media/basic-workflows/flux-3-image-klein/qwen3_5_9b_flux3_prompt_upsampler.png){media=image}

FLUX 3 Image Klein 附带了 Prompt Upsampler（也就是所谓的提示词增强器）。  
它是基于 Qwen3.5-9B 的 LLM，可以把简短的指令改写成详细的提示词。

不过它的表现力不算高，所以不推荐在 text2image 中使用。  
即使要用 BBOX，也最好交给 ChatGPT 之类的工具来写提示词。

反过来，在 Ref2Image / 图像编辑中，没有它结果就完全不稳定，所以我默认都会使用它。

Prompt Upsampler 本身有 9B，但扩散模型主体很轻，所以应该不会带来太大负担……大概吧……

> [!NOTE]
> Ref2Image / 图像编辑，以及有无 BBOX，需要的指令各不相同，所以各自使用了不同的 system prompt（这一点与官方工作流不同）。

---

## text2image

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image.json)

- `steps`: 15
- `CFG`: 1.0

{% outputs %}
![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_output.png){media=image}
{% endoutputs %}

### text2image with BBOX

在提示词中写入坐标，就能直观地指定什么东西放在哪里。

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_bbox_layout_prompt.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_bbox.json)

- `Create Bounding Boxes`
  - 用来绘制 BBOX 的核心节点。拖动即可添加方框，然后写下想放在那里的内容。

  > [!NOTE]
  > 虽然也可以用 `color_palette` 指定颜色，但 FLUX 3 Image Klein 无法理解它，所以用了也没有意义。

- `FLUX 3 Image Layout Prompt`
  - 在这里写关于整张图像的提示词。
  - 它会从方框信息中只提取 FLUX 3 需要的内容（ID、坐标、说明），和提示词合在一起输出。
  - 我会把这里留空，把输出的坐标列表交给 Claude，让它来写提示词。

{% outputs %}
![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_bbox_output.png){media=image}
{% endoutputs %}

---

## Ref2Image

以参考图像为基础，生成新的图像。

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image.json)

指令请写在 Prompt Upsampler（`Generate Text`）中。

如果使用 `Set Reference Multi Latent` 输出的 `empty_latent`，输出尺寸会和第 1 张图像相同。  
在 Ref2Image 中我想自由决定输出尺寸，所以另外接了一个 `Empty Flux 2 Latent`。

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_input.png){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_output.png){media=image}
{% endoutputs %}

---

## 图像编辑

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit.json)

和 Ref2Image 基本相同，不过输出尺寸要和输入图像一致，所以这里使用 `Set Reference Multi Latent` 的 `empty_latent`。

Prompt Upsampler 会查看输入图像和编辑指令，把它们改写成合适的形式。

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_input.png){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_output.png){media=image}
{% endoutputs %}

### 图像编辑 with BBOX

可以用 BBOX 指定要编辑的位置。  
既可以用来“在这里加上○○”，也可以做到“把 A 处的东西移到 B 处”。

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox.json)

- `Create Bounding Boxes`
  - 把输入图像接到 `background` 后，分辨率会自动匹配这张图像。
  - 这次想要移动小鸟，所以给原位置的方框标上 `src`，给目标位置的方框标上 `tgt`。
- `FLUX 3 Image Layout Prompt`
  - 在这里写编辑指令。方框上标的说明可以直接写进指令里。

    ```text
    Move the bird from src to tgt.
    ```

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox_input.jpg){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox_output.png){media=image}
{% endoutputs %}

---

## 参考资料

- [FLUX 3 Image Klein](https://bfl.ai/models/flux-3-image-klein)
- [Blog](https://bfl.ai/blog/flux-3-image-klein)
- [官方文档](https://docs.bfl.ml/flux_3/flux3_image_klein)
