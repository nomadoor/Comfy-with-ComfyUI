---
layout: page.njk
lang: en
section: basic-workflows
slug: ace-plus-plus
navId: ace-plus-plus
title: "ACE++"
created: 2025-12-10
updated: 2026-03-02
summary: "Extending Flux.1 Fill with ACE++"
seoTitle: "ACE++ in ComfyUI: ID Transfer, Face Swap, Subject Transfer"
seoDescription: "Use ACE++, an extension of Flux.1 Fill, in ComfyUI for ID transfer, face swap, subject transfer, and local edits, with model downloads and workflows."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/ace-plus-plus/legacy_gyazo_ca2c5be6b2a22cead23cf75a4fc8424f.png"
tags: ["id-transfer","subject-transfer"]
---

## What is ACE++?

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_1ecb26d7a9f2f9f558b02e91114cc692.png){media=image}

This is a single image generated from a prompt like this:
- An image split into 2 frames.
- In the first frame, person A is sitting.
- In the second frame, person A is looking at the viewer.

As you can see, the people on the left and right look like the same person.
This is called the sprite sheet technique, a trick people have used since the Stable Diffusion 1.5 days to make several consistent shots of the same scene.

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_5b66002abf37e213214611933ac7b833.png){media=image}

Now let's go one step further: give the model an image like the one above and have it inpaint only the right half.
Then **a new image is generated on the right, using the left image as a reference.**

This is the core principle behind IC-LoRA and **[ACE++](https://ali-vilab.github.io/ACE_plus_page/)**, which this page covers.
It used to be a "works sometimes" kind of technique, but since Flux came along, it has become reasonably stable.

Put roughly, ACE++ reinforces this principle with LoRAs, and there are 3 LoRAs, one for each use case.

* ID Transfer / Face Swap
* Subject Transfer
* Instruction-based Image Editing (Local Editing)

---

## Required Custom Nodes

* [1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)

This custom node pack includes lots of matting and segmentation nodes, but we only use the `IC LoRA Concat (RMBG) 🖼️` node from it.
There is also an official ACE++ custom node, but its behavior is unstable, so we don't use it here.

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

ACE++ works by looking at **a single image with the "reference image" and the "image to edit + mask" placed side by side**.

* Left side: Reference image (the face, character, etc. you want the result to resemble)
* Right side: A blank image or the image to edit (+ a mask drawn on it)

Think of it as joining these two side by side into one image and then inpainting as usual.
It's easiest to understand if you think of Flux.1 Fill as handling "where to redraw" and the ACE++ LoRA as handling "what it should look like."

---

## ID Transfer

Generates an image that resembles the person (face) in the reference image.

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_ebe23ac6ca509cf96538f2a85fcf69c3.png){media=image}

[](/workflows/basic-workflows/ace-plus-plus/ace_plus_portrait.json)

* The base is inpainting using Flux.1 Fill.
* 🟪 Load FLUX.1 Fill and the `portrait` LoRA.
* 🟩 Use the `IC LoRA Concat (RMBG) 🖼️` node to put the "reference image" and the "base image + mask" side by side.
  * Left: Reference image (portrait photo, etc.)
  * Right: Base image (a blank gray image here) + mask
  * If you don't connect anything to the mask input, the whole right side is treated as masked.
* 🟨 This is the same `InpaintModelConditioning` node used in regular inpainting.
* 🟦 Naturally, the output is a wide image with two panels.
  * We only want the right half, so we crop out just the right side using the position info passed from the `IC LoRA Concat (RMBG) 🖼️` node.

---

## Using as Face Swap

The basics are the same as ID transfer, but by changing "the base image on the right" and "how you mask it," it works as a face swap.

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_966d3c2bfcbaa5ae054fdd7ec4bb1c96.png){media=image}

[](/workflows/basic-workflows/ace-plus-plus/ace_plus_portrait_faceswap.json)

* 🟩 Put the image whose face you want to swap (the base image) on the right side.
* 🟩 If you only want to change the face, mask just the area around the face.

It's called face swap, but it's more flexible than that, so masking the whole head works well too.

---

## Subject Transfer

Switch to `comfyui_subject_lora16.safetensors` and you can do subject transfer.

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_3e84f30e31b23d804ff651a4d29667e9.png){media=image}

[](/workflows/basic-workflows/ace-plus-plus/ace_plus_subject.json)

* It's the same workflow as the Face Swap one above.
* 🟪 Change the loaded LoRA to `subject`.

You can use all kinds of things as references, not just people but also logos and objects.
* Transfer just a logo onto a different package photo
* Place a character or mascot against a different background
* Move one specific item (a bag, etc.) into another photo

---

## Local Editing

With `comfyui_local_lora16.safetensors`, you can steer it toward **local editing that redraws only the masked area to follow the prompt**.

![](/media/basic-workflows/ace-plus-plus/legacy_gyazo_e93a8e393eca60dbb1832fd314402dec.png){media=image}

[](/workflows/basic-workflows/ace-plus-plus/ace_plus_local.json)

* Use a regular inpainting workflow, not the side-by-side one.
* 🟪 Change the loaded LoRA to `local`.
* Write the prompt as an **instruction**, like "Change her clothes to a white shirt."
