---
layout: page.njk
lang: en
section: basic-workflows
slug: flux-1-tools
navId: flux-1-tools
title: "Flux.1 Tools"
created: 2025-12-10
updated: 2026-08-26
summary: "How to use Flux.1 Tools"
seoTitle: "Flux.1 Tools in ComfyUI: Fill, Depth, Canny, Redux"
seoDescription: "Use Flux.1 Tools in ComfyUI: Fill for inpainting and outpainting, Depth and Canny for structure, and Redux for image references, with workflows."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
tags: ["controlnet"]
---

## What are Flux.1 Tools?

Besides the base model, the Flux team has officially released derivative models for Flux.1 that do the job of [ControlNet](/en/basic-workflows/sd15-controlnet/) and [IP-Adapter](/en/basic-workflows/sd15-ip-adapter/).

- `FLUX.1 Fill` ... A model for inpainting / outpainting
- `FLUX.1 Depth` / `FLUX.1 Canny` ... Models that redraw an image while keeping its shape, using a structural guide (Depth / Canny)
- `FLUX.1 Redux` ... An IP-Adapter-style model for Flux that churns out variations closely matching the reference image

---

## FLUX.1 Fill

You can use it just like an inpainting model.

### Model Download

- [FLUX.1-Fill-dev_fp8.safetensors](https://huggingface.co/1038lab/FLUX.1-Fill-dev_fp8/blob/main/FLUX.1-Fill-dev_fp8.safetensors)
```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        └── FLUX.1-Fill-dev_fp8.safetensors
```

### Workflow

![](/media/basic-workflows/flux-1-tools/legacy_gyazo_ab4e4b0f5c9fe2030ebd637b15ac144d.png){media=image}

[](/workflows/basic-workflows/flux-1-tools/flux_1_fill.json)

* 🟪 Load `flux1-fill-dev.safetensors` with the `Load Diffusion Model` node.
* 🟩 In the Flux.1 workflow too, add the `InpaintModelConditioning` node, just as in Stable Diffusion 1.5 [inpainting](/en/basic-workflows/sd15-inpainting/).

  * Feed it the image and the mask.

---

## FLUX.1 Depth / FLUX.1 Canny

They work much like ControlNet Depth / Canny.

### Model Download

* [flux1-depth-dev-fp8.safetensors](https://huggingface.co/boricuapab/flux1-depth-dev-fp8/blob/main/flux1-depth-dev-fp8.safetensors)
* [flux1-canny-dev-fp8.safetensors](https://huggingface.co/boricuapab/flux1-canny-dev-fp8/blob/main/flux1-canny-dev-fp8.safetensors)
```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        ├── flux1-depth-dev-fp8.safetensors
        └── flux1-canny-dev-fp8.safetensors
```

### Workflow

![](/media/basic-workflows/flux-1-tools/legacy_gyazo_8b4d310e8b9228e6e2be3b422150e01c.png){media=image}

[](/workflows/basic-workflows/flux-1-tools/flux_1_depth.json)

* 🟩 Feed the control image into the `InstructPixToPixConditioning` node.
* 🟦 This example uses Depth, so we create a depth map with Depth Anything V2.

  * The depth map's size becomes the output image size as is, so resize it to something reasonable.

> [!TIP]
> For the Canny version, use the same setup and feed in a Canny edge image instead.

---

## FLUX.1 Redux

`FLUX.1 Redux` is a model that takes one or more reference images and generates variations that stick very closely to them.
It's similar to IP-Adapter, but prompts have very little effect on Redux, and the reference image's look comes through almost unchanged.

### Model Download

Redux is loaded as a "style model," separate from the main Flux model.
You also need a CLIP-ViT model to encode the reference images.

* [FLUX.1-Redux-dev](https://huggingface.co/black-forest-labs/FLUX.1-Redux-dev/tree/main)
* [sigclip_vision_patch14_384](https://huggingface.co/Comfy-Org/sigclip_vision_384/tree/main)
```text
📂ComfyUI/
└── 📂models/
    ├── 📂style_models/
    │   └── flux1-redux-dev.safetensors
    └── 📂clip_vision/
        └── sigclip_vision_patch14_384.safetensors
```

### Workflow

![](/media/basic-workflows/flux-1-tools/legacy_gyazo_90588b4c7bc62bf7218901c901f31b8f.png){media=image}

[](/workflows/basic-workflows/flux-1-tools/flux_1_redux.json)

* 🟩 Add the `Apply Style Model` node and connect the style model and `CLIP Vision Encode` to it.

  * Connect `sigclip_vision_patch14_384.safetensors` and the reference image to the `CLIP Vision Encode` node.

### Mixing Multiple Images

Line up several `Apply Style Model` groups side by side, and you can reference and blend multiple images.

![](/media/basic-workflows/flux-1-tools/legacy_gyazo_cd6233194a56e2ceeb597c8877d645ef.png){media=image}

[](/workflows/basic-workflows/flux-1-tools/flux_1_redux_multi.json)

### Problem with Redux

To repeat, Redux pretty much ignores other inputs like prompts and LoRAs.

I think it's best to accept that and use it as "a tool for churning out variations that closely match the reference image,"
but there are also custom nodes that let prompts have some control. Just for reference.

* [kaibioinfo/ComfyUI_AdvancedRefluxControl](https://github.com/kaibioinfo/ComfyUI_AdvancedRefluxControl)
