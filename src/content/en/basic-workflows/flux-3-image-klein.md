---
layout: page.njk
lang: en
section: basic-workflows
slug: flux-3-image-klein
navId: flux-3-image-klein
title: "FLUX 3 Image Klein"
created: 2026-10-16
updated: 2026-10-16
summary: "FLUX 3 Image Klein generation and image editing workflows"
seoTitle: "FLUX 3 Image Klein in ComfyUI: Image Generation and Editing"
seoDescription: "FLUX 3 Image Klein in ComfyUI: generation, editing, and BBOX layout in one model. Model downloads, Prompt Upsampler, and text2image, Ref2Image, and editing workflows."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_hero.png"
tags: [instruction-based-image-editing]
---

## What is FLUX 3 Image Klein?

**FLUX 3 Image Klein** is an image generation model from Black Forest Labs.

It's the next generation after [FLUX.2 [klein]](/en/basic-workflows/flux-2-klein/), and a single model handles image generation, image editing, and Ref2Image.  
Another fun part is that you can use BBOX to set where things go, or which area to edit. It works much like [Ideogram 4.0](/en/basic-workflows/ideogram-4/).

It isn't a model with exceptional expressive power, but it's fast, and it feels great to casually churn out image after image.

---

## Recommended settings

- Resolution
  - Up to 4K
  - Width and height must be multiples of 16
- Reference images
  - Up to 10

---

## Downloading the models

> [!WARNING]
> FLUX 3 Image Klein models cannot be downloaded without authentication. Log in with your Hugging Face account and accept the terms on the [flux-3-image-klein-comfy page](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy).
>
> ![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_huggingface_gated.png){media=image}

- diffusion_models
  - [flux3_image_klein_sd_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/diffusion_models/flux3_image_klein_sd_int8_convrot.safetensors) (5.83 GB)
- text_encoders
  - [qwen3vl_4b_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/text_encoders/qwen3vl_4b_int8_convrot.safetensors) (4.86 GB)
  - [qwen3.5_9b_flux3_prompt_upsampler_int8_convrot.safetensors](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/text_encoders/qwen3.5_9b_flux3_prompt_upsampler_int8_convrot.safetensors) (9.75 GB)
    - Prompt Upsampler. Used for Ref2Image / image editing
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

FLUX 3 Image Klein comes with a Prompt Upsampler (a so-called prompt enhancer).  
It's an LLM based on Qwen3.5-9B that rewrites a short instruction into a detailed prompt.

That said, it isn't very expressive, so I don't recommend it for text2image.  
Even when you use BBOX, you're better off handing the job to ChatGPT or similar and having it write the prompt.

For Ref2Image / image editing, on the other hand, results are not stable at all without it, so I use it by default.

The Prompt Upsampler itself is 9B, but the diffusion model is light, so it shouldn't be much of a burden… probably…

> [!NOTE]
> Ref2Image and image editing, each with and without BBOX, need different instructions, so each one uses its own system prompt (this part differs from the official workflow).

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

By including coordinates in the prompt, you can intuitively tell the model what goes where.

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_bbox.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_bbox.json)

- `Create Bounding Boxes`
  - A core node for drawing BBOXes. Drag to add a box, then describe what you want to place there.

  > [!NOTE]
  > You can also set colors with `color_palette`, but FLUX 3 Image Klein doesn't understand it, so there's no point in using it.

- `FLUX 3 Image Layout Prompt`
  - Write a prompt for the whole image here.
  - It pulls out only what FLUX 3 needs from the box data (ID, coordinates, description) and outputs it together with the prompt.
  - You could also hand roughly filled-in BBOX `elements` to an AI and have it write the prompt.

{% outputs %}
![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_text2image_bbox_output.png){media=image}
{% endoutputs %}

---

## Ref2Image

Generates a new image based on reference images.

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image.json)

Write your instruction in the Prompt Upsampler (`Generate Text`).

If you use the `empty_latent` output of `Set Reference Multi Latent`, the output has the same size as the first image.  
For Ref2Image I want to choose the output size freely, so I connect a separate `Empty Flux 2 Latent`.

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_input.png){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_output.png){media=image}
{% endoutputs %}

### Ref2Image with BBOX

You can place things from the reference images wherever you mark with a BBOX.

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_bbox.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_bbox.json)

> [!NOTE]
> If you use the Prompt Upsampler, it just ends up ignoring the BBOX coordinates entirely, so I don't use it here.

- `Create Bounding Boxes`
  - `width` / `height` should match the output size (the value from `Resolution Selector`).
- `FLUX 3 Image Layout Prompt`
  - Write boxes as `<obj_1>` and reference images as `<ref_image_0>`, and specify what from which image goes where. Reference image numbers start at 0.

    ```text
    Create a cinematic film still of the monkey <obj_2> from <ref_image_0> riding the motorcycle <obj_1> from <ref_image_1> ...
    ```

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_bbox_input1.jpg){media=image} ![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_bbox_input2.png){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_ref2image_bbox_output.png){media=image}
{% endoutputs %}

---

## Image editing

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit.json)

Almost the same as Ref2Image, but the output size follows the input image, so this one uses the `empty_latent` of `Set Reference Multi Latent`.

The Prompt Upsampler looks at the input image and your edit instruction, and rewrites them into a suitable form.

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_input.png){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_output.png){media=image}
{% endoutputs %}

### Image editing with BBOX

With BBOX, you can specify where to edit.  
You can use it like "add ○○ here", or even "move the thing at A to B".

![](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox.png){media=image}

[](/workflows/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox.json)

- `Create Bounding Boxes`
  - Connect the input image to `background`, and the resolution automatically matches that image.
  - This time I want to move the bird, so the source box is labeled `src` and the destination box `tgt`.
- `FLUX 3 Image Layout Prompt`
  - Write your edit instruction here. You can use the labels you gave the boxes directly in the instruction.

    ```text
    Move the bird from src to tgt.
    ```

{% outputs %}
![input](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox_input.jpg){media=image} ![output](/media/basic-workflows/flux-3-image-klein/flux_3_image_klein_image_edit_bbox_output.png){media=image}
{% endoutputs %}

---

## References

- [FLUX 3 Image Klein](https://bfl.ai/models/flux-3-image-klein)
- [Blog](https://bfl.ai/blog/flux-3-image-klein)
- [Official docs](https://docs.bfl.ml/flux_3/flux3_image_klein)
