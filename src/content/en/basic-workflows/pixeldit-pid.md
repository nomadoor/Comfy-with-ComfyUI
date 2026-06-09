---
layout: page.njk
lang: en
section: basic-workflows
slug: pixeldit-pid
navId: pixeldit-pid
title: "PixelDiT / PiD"
created: 2026-06-09
updated: 2026-06-09
summary: "Image generation and high-resolution decoding with PixelDiT and PiD"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/31ea733be7d13db9616875f7c59e3f40.png"
tags: [upscale-restoration]
---

## PixelDiT

**[PixelDiT](https://pixeldit.github.io/)** is a **pixel diffusion model** released by NVIDIA.

Many image generation models after Stable Diffusion use a mechanism called a [Latent Diffusion Model](/en/ai-capabilities/latent-diffusion-vae/).

Calculating an image pixel by pixel is expensive, so these models first compress the image into a smaller representation called a latent. This reduces computation while making it easier to handle features like shape, color, and composition.

However, when the latent is converted back into pixels, fine details such as small text and patterns can degrade.

A **pixel diffusion model** works directly with the image in pixel space instead of going through a latent. Because of that, VAE reconstruction loss does not occur in the same way.

That raises the obvious question: wasn't the latent there to reduce computation? PixelDiT handles this by splitting the image into patches, looking at the whole image roughly while drawing details on the pixel side.

### Model Download

- diffusion_models
  - [pixeldit_1300m_1024px_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pixeldit_1300m_1024px_bf16.safetensors) (2.6 GB)
- text_encoders
  - [gemma_2_2b_it_elm_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/text_encoders/gemma_2_2b_it_elm_bf16.safetensors) (5.23 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── pixeldit_1300m_1024px_bf16.safetensors
    └── 📂text_encoders/
        └── gemma_2_2b_it_elm_bf16.safetensors
```

### text2image

![](https://gyazo.com/bdac1169d8ee0d91f6eed7b485ffa914){gyazo=image}

[](/workflows/basic-workflows/pixeldit-pid/PixelDiT_text2image.json)

Because this is a pixel diffusion model, it does not inherently need `Load VAE` or `VAE Decode`.

In ComfyUI, however, the workflow still follows the existing format: select `pixel_space` in `Load VAE`, then connect it to `VAE Decode`.

It may look as if the image is being decoded with a VAE called `pixel_space`, but think of it as the step that gets an `IMAGE` output from `KSampler`.

---

## PiD

**PiD** is PixelDiT used in place of VAE Decode.

Normally, the generated latent is passed through VAE Decode to become an image.
With PiD, that latent is passed to PixelDiT instead, so restoration into an image and upscaling are handled together.

For example, Z-Image-Turbo can generate a 1024×1024 latent, then send it to PiD before VAE Decode.
With a `1024_to_4096` PiD model, the result is output as a 4096×4096 image.

In short, you can use the generation ability of an existing model while avoiding fine-detail degradation from VAE Decode.

### Model Download

- For SDXL

  - [pid_sdxl_1024_to_4096_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_sdxl_1024_to_4096_4step_bf16.safetensors) (2.72 GB)

- For Qwen-Image

  - [pid_qwenimage_1024_to_4096_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_qwenimage_1024_to_4096_4step_bf16.safetensors) (2.72 GB)

- For Flux.1 / Z-Image

  - [pid_flux1_512_to_2048_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_flux1_512_to_2048_4step_bf16.safetensors) (2.72 GB)
  - [pid_flux1_1024_to_4096_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_flux1_1024_to_4096_4step_bf16.safetensors) (2.72 GB)

- For Flux.2

  - [pid_flux2_512_to_2048_4step_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_flux2_512_to_2048_4step_bf16.safetensors) (2.73 GB)
  - [pid_flux2_1024_to_4096_4step_2606_bf16.safetensors](https://huggingface.co/Comfy-Org/PixelDiT/blob/main/diffusion_models/pid_flux2_1024_to_4096_4step_2606_bf16.safetensors) (2.73 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        ├── pid_sdxl_1024_to_4096_4step_bf16.safetensors
        ├── pid_qwenimage_1024_to_4096_4step_bf16.safetensors
        ├── pid_flux1_512_to_2048_4step_bf16.safetensors
        ├── pid_flux1_1024_to_4096_4step_bf16.safetensors
        ├── pid_flux2_512_to_2048_4step_bf16.safetensors
        └── pid_flux2_1024_to_4096_4step_2606_bf16.safetensors
```

You do not need to install all of them. Place only the PiD model that matches the base model you use.

### Choosing a Model

There are two points to watch when choosing a PiD model.

- Base model type
  - It needs to match the latent type used by the original model.
  - Use the SDXL version for SDXL, and the **Flux.1 version** for Z-Image.

- Scale
  - Model names include strings such as `1024_to_4096`; this indicates the scale.
  - It does not upscale automatically just because you choose the model. For `1024_to_4096`, pass a latent / output around 1024px to PiD, then set the parameters so that PiD outputs a 4096px image.
  - The aspect ratio is flexible as long as the rough resolution matches.

### Z-Image-Turbo → PiD

Let's decode a Z-Image-Turbo latent with PiD.

![](https://gyazo.com/ffadadaad0731fe65418fde91d8214e0){gyazo=image}

[](/workflows/basic-workflows/pixeldit-pid/Z-Image-Turbo_to_PiD_4k.json)

- 🟦 The upper-left part is a normal [Z-Image-Turbo](/en/basic-workflows/z-image-turbo/) workflow.
  - 🟩 Instead of sending the output latent to VAE Decode, connect it to PixelDiT's `PiD Conditioning`.
- This example uses the `1024_to_4096` model.
  - Z-Image-Turbo generates at around 1M pixels, and PiD is set to output at 4× that resolution.
- PiD is a 4-step distilled model, so this workflow uses `steps` 4 and `cfg` 1.0.
- The `Context Windows (Manual)` node is for tiling.
  Use it when you run into OOM, or when tall / wide images come out rough.

### Upscaling Any Image

What gets passed to `PiD Conditioning` is just a latent.

So the previous step does not need to be text2image. You can VAE Encode any image you like, pass it to PiD, and use it like an upscaler.

![](https://gyazo.com/1d83eec4daa183467327ed1d3a5b3461){gyazo=image}

[](/workflows/basic-workflows/pixeldit-pid/PiD_flux1_4x_enhance.json)

- Resize the input image to around 1M pixels, with dimensions that are multiples of 16
- Get the resized height and width, multiply them by 4, and use those values as the PiD output size

Each PiD model expects a matching VAE, so you need to Encode with the VAE that matches the PiD model.

It is tempting to use the newer Flux.2 VAE, but it changes the colors quite a lot. Here, the more stable `Flux.1 PiD` + `ae.safetensors` combination is used.

- [ae.safetensors](https://huggingface.co/Comfy-Org/z_image_turbo/blob/main/split_files/vae/ae.safetensors) (335 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂vae/
        └── ae.safetensors
```

> What this does is essentially redrawing, so it is more of an enhance step than a normal upscaler.<br>
> It is not well suited when faithful reproduction is required.

---

## References

- [PixelDiT](https://pixeldit.github.io/)
- [PiD: Fast and High-Resolution Latent Decoding with Pixel Diffusion](https://research.nvidia.com/labs/sil/projects/pid/)
- [ComfyUI Pull Request: Support NVIDIA PixelDiT and PiD](https://github.com/Comfy-Org/ComfyUI/pull/14103)
