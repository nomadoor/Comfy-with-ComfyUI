---
layout: page.njk
lang: en
section: basic-workflows
slug: ace-plus-plus
navId: ace-plus-plus
title: "ACE++"
summary: "Extending Flux.1 Fill with ACE++"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/ca2c5be6b2a22cead23cf75a4fc8424f.png"
tags: ["id-transfer","subject-transfer"]
---

## What is ACE++?

![](https://gyazo.com/1ecb26d7a9f2f9f558b02e91114cc692){gyazo=image}

This image is a single image generated with the following prompt:
- Image divided into 2 frames.
- In the first frame, person A is sitting.
- In the second frame, person A is facing here.

As you can see, the people on the left and right look like the same person.
This is called the sprite sheet technique, and it is a trick that has been used since the Stable Diffusion 1.5 era when we wanted to create multiple consistent situations.

![](https://gyazo.com/5b66002abf37e213214611933ac7b833){gyazo=image}

Taking it one step further, if we provide an image like the one above and inpaint only the right half.
Then, **a new image is generated on the right side while referencing the image on the left.**

This is the fundamental principle of IC-LoRA and **[ACE++](https://ali-vilab.github.io/ACE_plus_page/)** dealt with here.
Until now, it was a technique of "sometimes it works well" level, but with the advent of Flux, reasonably stable generation became possible.

To summarize roughly, ACE++ is one that strengthened this principle with LoRA, and 3 LoRAs are prepared for each purpose.

* ID Transfer / Face Swap
* Subject Transfer
* Instruction-based Image Editing (Local Editing)

---

## Required Custom Nodes

* [1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)

Although it is a custom node that contains many matting and segmentation nodes, we use only the `IC LoRA Concat (RMBG) 🖼️` node in this.
There is also an official ACE++ custom node, but we do not adopt it here because the behavior is unstable.

---

## Model Download

* diffusion_models
  * [FLUX.1-Fill-dev_fp8.safetensors](https://huggingface.co/1038lab/FLUX.1-Fill-dev_fp8/blob/main/FLUX.1-Fill-dev_fp8.safetensors)
* loras
  * [comfyui_portrait_lora64.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/portrait/comfyui_portrait_lora64.safetensors)
  * [comfyui_subject_lora16.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/subject/comfyui_subject_lora16.safetensors)
  * [comfyui_local_lora16.safetensors](https://huggingface.co/ali-vilab/ACE_Plus/blob/main/local_editing/comfyui_local_lora16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── FLUX.1-Fill-dev_fp8.safetensors
    └── 📂loras/
        ├── comfyui_portrait_lora64.safetensors
        ├── comfyui_subject_lora16.safetensors
        └── comfyui_local_lora16.safetensors
```

---

## Basic Concept

ACE++ moves while looking at a **single image where "reference image" and "image to edit + mask" are side-by-side**.

* Left side: Reference image (face, character you want to resemble, etc.)
* Right side: Blank or image to edit (+ mask drawn on it)

The image is to attach these two sideways to make one image, and then inpaint as usual.
It is easy to understand if you think that Flux.1 Fill is in charge of "where to redraw" and ACE++ LoRA is in charge of "what kind of appearance to resemble".

---

## ID Transfer

Generates an image resembling the person (face) of the reference image.

![](https://gyazo.com/ebe23ac6ca509cf96538f2a85fcf69c3){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_portrait.json)

* The base is inpainting using Flux.1 Fill.
* 🟪 Load FLUX.1 Fill and `portrait` LoRA.
* 🟩 Use the `IC LoRA Concat (RMBG) 🖼️` node to put "Reference Image" and "Base Image + Mask" side by side.
  * Left: Reference image (portrait photo, etc.)
  * Right: Base image (gray empty image here) + mask
  * If nothing is entered in the mask, the entire right side is treated as a mask.
* 🟨 It is the same `InpaintModelConditioning` node used in normal inpainting.
* 🟦 The output image will naturally be a landscape pair.
  * Since we want to use only the right half, crop only the right side using the position information passed from the `IC LoRA Concat (RMBG) 🖼️` node.

---

## Using as Face Swap

The basics are the same as ID transfer, but it works as Face Swap by changing "Base image to put on the right side" and "How to apply mask".

![](https://gyazo.com/966d3c2bfcbaa5ae054fdd7ec4bb1c96){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_portrait_faceswap.json)

* 🟩 Input the image you want to swap faces (base image) on the right side.
* 🟩 If you want to change only the face, mask only around the face.

Although it is called FaceSwap, it is more flexible, so masking the entire head also works well.

---

## Subject Transfer

If you switch to `comfyui_subject_lora16.safetensors`, you can do Subject transfer.

![](https://gyazo.com/3e84f30e31b23d804ff651a4d29667e9){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_subject.json)

* It is the same workflow as the previous Face Swap.
* 🟪 Change the LoRA to load to `subject`.

You can generate by referring to various things such as logos and items as well as people.
* Transfer only the logo to another package photo
* Make a certain character or mascot stand on a different background
* Transplant only specific accessories (bags, etc.) to another photo

---

## Local Editing

Using `comfyui_local_lora16.safetensors` allows you to bring it closer to **local editing redrawing along instructions** only for the masked area.

![](https://gyazo.com/e93a8e393eca60dbb1832fd314402dec){gyazo=image}

[](/workflows/basic-workflows/ace-plus-plus/ACE_Plus_local.json)

* Use a normal inpainting workflow instead of side-by-side.
* 🟪 Change the LoRA to load to `local`.
* Write a prompt in the form of **instruction** like "Change her clothes to a white shirt".
