---
layout: page.njk
lang: en
section: basic-workflows
slug: flux-1-tools
navId: flux-1-tools
title: "Flux.1 Tools"
created: 2025-12-10
updated: 2026-03-02
summary: "How to use Flux.1 Tools"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/204fbd9af3c371511c01a0c97cac40e8.png"
tags: ["controlnet"]
---

## What are Flux.1 Tools?

For Flux.1, derivative models equivalent to [ControlNet](/en/basic-workflows/sd15-controlnet/) and [IP-Adapter](/en/basic-workflows/sd15-ip-adapter/) have been released by Flux officially, separate from the base model.

- `FLUX.1 Fill` ... Model for inpainting / outpainting
- `FLUX.1 Depth` / `FLUX.1 Canny` ... Models that redraw while keeping the shape with structure-based guides (Depth / Canny)
- `FLUX.1 Redux` ... An IP-Adapter-like model for Flux that mass-produces variations that look exactly like the reference image

---

## FLUX.1 Fill

It can be used just like an inpainting model.

### Model Download

- [FLUX.1-Fill-dev_fp8.safetensors](https://huggingface.co/1038lab/FLUX.1-Fill-dev_fp8/blob/main/FLUX.1-Fill-dev_fp8.safetensors)
```text
📂ComfyUI/
└── 📂models/
    └── 📂diffusion_models/
        └── FLUX.1-Fill-dev_fp8.safetensors
```

### Workflow

![](https://gyazo.com/ab4e4b0f5c9fe2030ebd637b15ac144d){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Fill.json)

* 🟪 Load `flux1-fill-dev.safetensors` with the `Load Diffusion Model` node.
* 🟩 Even specifically for Flux.1 workflows, add the `InpaintModelConditioning` node just like in Stable Diffusion 1.5 [inpainting](/en/basic-workflows/sd15-inpainting/).

  * Input the image and mask.

---

## FLUX.1 Depth / FLUX.1 Canny

It can be used with the same feeling as ControlNet Depth / Canny.

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

![](https://gyazo.com/8b4d310e8b9228e6e2be3b422150e01c){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Depth.json)

* 🟩 Input the control image to the `InstructPixToPixConditioning` node.
* 🟦 Since it is Depth this time, create a depth map with Depth Anything V2.

  * Since the image size of this depth map becomes the output image size as is, resize it to an appropriate size.

> For the Canny version, input the Canny edge image with the same configuration.

---

## FLUX.1 Redux

`FLUX.1 Redux` is a model where you pass one or more reference images and generate variations strongly biased towards those images.
It is close to IP-Adapter, but Redux is quite resistant to prompts, and the appearance of the reference image comes out almost as is.

### Model Download

Redux is loaded as a "style model" separate from the Flux body.
Furthermore, CLIP-ViT for encoding reference images is also required.

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

![](https://gyazo.com/90588b4c7bc62bf7218901c901f31b8f){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Redux.json)

* 🟩 Add the `Apply Style Model` node and connect the Style model and `CLIP Vision Encode`.

  * Connect `sigclip_vision_patch14_384.safetensors` and the reference image to the `CLIP Vision Encode` node.

### Mixing Multiple Images

If you line up the chunks of `Apply Style Model` horizontally, you can also reference and mix multiple images.

![](https://gyazo.com/cd6233194a56e2ceeb597c8877d645ef){gyazo=image}

[](/workflows/basic-workflows/flux-1-tools/FLUX.1-Redux_multi.json)

### Problem with Redux

Again, Redux ignores most other parameters such as prompts and LoRA.

I think it is best to use it as a "tool to mass-produce variations that look exactly like the reference image" by cutting it off like that,
but there are also custom nodes that allow some control with prompts. For your reference.

* [kaibioinfo/ComfyUI_AdvancedRefluxControl](https://github.com/kaibioinfo/ComfyUI_AdvancedRefluxControl)
