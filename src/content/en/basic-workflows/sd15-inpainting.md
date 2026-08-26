---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-inpainting
navId: sd15-inpainting
title: "inpainting"
created: 2025-12-07
updated: 2026-08-26
summary: "Editing only part of an image with inpainting"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: ["controlnet", "region-limited-generation"]
hero:
  image: ""
---

## What is inpainting?

Inpainting is a technique for **redrawing only part of an image**.

Removing an unwanted object, redrawing one area, replacing something with something else... These are just some of the many things it can do, and there is more than one way to do them.

- [Apply image2image to only part of an image](#applying-image2image-to-only-part-of-an-image)
- [Use a dedicated inpainting model](#inpainting-models)
- [Use ControlNet](#controlnet-inpaint)
- [Use an image editing model](#image-editing-models)
- etc.

---

## Applying image2image to only part of an image

Standard image2image regenerates the entire image. If you limit the generation area to the mask, you can regenerate only part of it.

### workflow

The base is the usual [image2image](/en/basic-workflows/sd15-image2image/) workflow. Add a mask to decide where to redraw.

![](https://gyazo.com/4fc7e54c5ac44fb4c09fc9911f6be06a){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_inpainting_SetLatentNoiseMask.json)

- 🟥 Convert the original image to latent with the `VAE Encode` node
- 🟩 Combine the latent and mask with the `Set Latent Noise Mask` node

`Set Latent Noise Mask` tells KSampler which area it is allowed to redraw.

Internally, each step applies image2image to the entire image, then restores the area outside the mask to the original image (latent).

As a result, it looks as if image2image was applied only inside the mask.

> For details on creating and editing masks, see [Mask Operations](/en/data-utilities/mask-ops/) and [AI Mask Generation](/en/data-utilities/ai-mask-generation/).

### The problem: Higher denoise stops matching the surroundings

Its basic behavior is the same as standard image2image.

The higher the `denoise`, the more freedom the model has, but the more it forgets the original image.

Try setting `denoise` to `1.00` in the workflow above.

![Whoa, a horror image... (；・∀・)](https://gyazo.com/b18eb39eee9f53b669edb098a219bd24){gyazo=image}

With image2image over the whole image, even a large change can be fun in its own way.

With image2image applied to only one part, however, the area outside the mask stays unchanged. The inside and outside of the mask can lose consistency.

This method is fine for a small change to the shape of a flower. A major change is more difficult.

Turning a red flower blue or replacing it with a musical instrument requires a higher `denoise`. But then the edited area may no longer blend with its surroundings...

So, what can we do in a case like this? 🤔

---

## Inpainting models

One answer is a dedicated inpainting model.

In the previous method, the mask was used only to apply image2image to one part of the image. **The model itself was not told which area was masked.**

An inpainting model is also told "where to redraw" and "what is visible outside that area."

It creates an image with the masked area covered in gray and passes that image to the model. The old contents are hidden, so the model fills the area using only the surroundings as its guide.

### Downloading the model

- [stable-diffusion-v1-5/sd-v1-5-inpainting.ckpt](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-inpainting/blob/main/sd-v1-5-inpainting.ckpt)
```
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

`InpaintModelConditioning` has two roles.

1. Apply image2image to only one part, just like `Set Latent Noise Mask`
2. Pass the model the mask and the original image with the masked area covered in gray

`noise_mask` determines whether the first role is used.

- `true`
  - Apply image2image only inside the mask, just like `Set Latent Noise Mask`.
  - This normally works fine.
- `false`
  - The model still receives the mask and the original image with the masked area covered in gray, but image2image redraws the entire image rather than only the mask.
  - On very rare occasions, a model may behave incorrectly with `true`. Try this setting when that happens.

The workflow above uses `denoise: 1.00`, but it does not produce a different woman. It redraws her hair to match the surroundings.

This shows that the model understands both where to edit and what it should use as a reference.

---

## ControlNet inpaint

A dedicated inpainting model is not the only way to tell a model which area is masked.

Another option is **ControlNet inpaint**.

> [ControlNet](/en/basic-workflows/sd15-controlnet) is explained on another page.

### Custom node

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

### Downloading the ControlNet model

- [comfyanonymous/control_v11p_sd15_inpaint_fp16.safetensors](https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/blob/main/control_v11p_sd15_inpaint_fp16.safetensors)
- ```
  📂ComfyUI/
    └── 📂models/
        └── 📂controlnet/
            └── control_v11p_sd15_inpaint_fp16.safetensors
  ```

### workflow

![](https://gyazo.com/ae3fe8d999343135c6ac995b67a165e7){gyazo=image}

[](/workflows/basic-workflows/sd15-inpainting/SD1.5_ControlNet_inpaint.json)

- Load any SD1.5 checkpoint (+ LoRA)
- 🟨 Pass the image and mask to `Inpaint Preprocessor` to create an image for ControlNet
  - Visually, the masked area is painted black.
- 🟩 Pass the ControlNet model, image, and VAE to the `Apply ControlNet` node
- 🟥 Use `Set Latent Noise Mask` to limit the redrawn area to the mask

The technology is different, but the action is the same as with an inpainting model: pass the model "where to fill" and "what is visible around it."

---

## Other inpainting methods

They are not covered here, but model families released after Stable Diffusion 1.5 offer various other methods.

- Fooocus Inpaint
- FLUX.1 Fill
- etc.

---

## Image editing models

Today, we cannot discuss this subject without mentioning image editing models.

An image editing model can follow a prompt such as "remove the man's hat," or take an image with an area circled in red together with an instruction such as "add a cat here." It does not even need a dedicated mask.

Strictly speaking, these models are not normally discussed in the context of inpainting. But in the sense that they can **change only part of an image**, they can accomplish the same thing.

### FLUX.2 [klein]

As a representative image editing model, let's look at [FLUX.2 \[klein\]](/en/basic-workflows/flux-2-klein/).

![](https://gyazo.com/e55ff686078115488cef6406f60b9370){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit.json)

In this workflow, the input image and the prompt `remove the man` are all that is needed to remove the man from the image.
