---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-inpainting
navId: sd15-inpainting
title: "inpainting"
created: 2025-12-07
updated: 2026-03-02
summary: "Editing only a part of an image with inpainting"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is inpainting?

inpainting is a technique for **"redrawing only a part of an image"**.
However, if you look inside, it can actually be divided into the following two patterns.

- Type A: **image2image only the masked part**
- Type B: **Fill the masked part naturally while looking at the surrounding information**

Generally, these are not distinguished, so I often see beginners who are confused because of that.
Let's consider them separately for now.

> For details on how to create masks and mask editing, please refer to separate pages [Mask Operations](/en/data-utilities/mask-ops/) and [AI Mask Generation](/en/data-utilities/ai-mask-generation/).

---

## Type A: image2image of only the masked part

This is a method of redrawing only the masked part with the same feeling as normal image2image.
It is suitable when you want to change the facial expression a little, change the art style, or correct small details slightly.

### workflow

In this workflow, the `SetLatentNoiseMask` node is used to specify "where to add noise".

![](https://gyazo.com/4fc7e54c5ac44fb4c09fc9911f6be06a){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_inpainting_SetLatentNoiseMask.json)

- The base is an image2image workflow.
- 🟥 Convert the original image to latent with the `VAE Encode` node
- 🟩 Combine latent and mask with the `Set Latent Noise Mask` node

### Problems with this method

Let's try setting `denoise` to `1.00` in the workflow above.

![](https://gyazo.com/b18eb39eee9f53b669edb098a219bd24){gyazo=image}

Wow, a horror image was generated (；・∀・)

This method is strictly "image2image using only the masked part as a canvas".
If you raise `denoise`, it behaves almost **like text2image** in the masked part.

Since I wrote "red punched perm woman" in the prompt, it started drawing a new woman regardless of the original image.

Is there a way to have the masked part drawn while looking at the overall atmosphere?

---

## Type B: Filling the mask while looking at the surroundings

This type looks at the entire image and "redraws the masked part so that it connects naturally with the surroundings".

Previously, it was just "physically cutting out the application range of image2image with a mask".
In this type, the mask area itself is treated as a kind of [Conditioning](/en/ai-capabilities/conditioning/), passing the condition "I want you to redraw only this range" directly to the model.

On top of that, there are various implementation approaches, but for SD1.5, it is enough to keep the following two systems in mind.

- **Use an inpainting-dedicated model**
- **Make a normal model inpaint-compatible with ControlNet inpaint**

---

## inpainting Model

Top-notch checkpoint adjusted for the task of "filling while looking at the surroundings" for SD1.5.

### Downloading the Model

- [stable-diffusion-v1-5/sd-v1-5-inpainting.ckpt](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-inpainting/blob/main/sd-v1-5-inpainting.ckpt)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂checkpoints/
            └── sd-v1-5-inpainting.ckpt
  ```

### workflow

![](https://gyazo.com/1f6954026bfda799259cfd948da779a3){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/sd-v1-5-inpainting.json)

- 🟪 Load the inpainting model.
- 🟩 Replace `VAE Encode` and `Set Latent Noise Mask` with the `InpaintModelConditioning` node.
  - The input parameters are almost the same.

- Only the `noise_mask` parameter needs a little attention.
  * `true`
    - Forces redrawing only inside the mask, same as with `Set Latent Noise Mask`. Usually this setting is fine.
  * `false`
    - With some models, it may break if set to `true`. Try `false` as a workaround in that case.

In the example above, even if `denoise` is set to `1.00`, you can see that the woman's hair is redrawn so that the whole image looks natural.
Unlike Type A, it behaves like "filling the masked part while checking consistency with the surroundings".

---

## ControlNet inpaint

The disadvantage of inpainting models is that you have to use an inpainting model.
There are times when you want to use a model fine-tuned from Stable Diffusion 1.5 for inpainting as is.

At such times, **ControlNet inpaint** is useful.

> [ControlNet](/en/image-generation-applications/controlnet/) is explained on another page.

### Custom Node

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

### Downloading ControlNet Model

* [comfyanonymous/control_v11p_sd15_inpaint_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_inpaint_fp16.safetensors)
* ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_inpaint_fp16.safetensors
  ```

### workflow

![](https://gyazo.com/ae3fe8d999343135c6ac995b67a165e7){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_ControlNet_inpaint.json)

* Load your favorite SD1.5 checkpoint (+ LoRA)
* 🟨 Input image and mask to `Inpaint Preprocessor` and convert to image for ControlNet
  * Actually, it just paints the masked part black.
* 🟩 Input ControlNet model, image, and VAE to the `Apply ControlNet` node
* 🟥 Incorporate the inpainting using `Set Latent Noise Mask` done above

---

## Connecting to SDXL / Flux etc.

This page specializes in SD1.5, but there are several other inpainting methods.

- Fooocus inpaint (Inpaint model for SDXL)
- Flux.fill (Fill function of Flux family)
- LaInpaint (Image editing / inpaint tool)

These are planned to be covered separately.
