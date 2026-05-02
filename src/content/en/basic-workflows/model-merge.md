---
layout: page.njk
lang: en
section: basic-workflows
slug: model-merge
navId: model-merge
title: "Model Merge & Difference LoRA"
created: 2025-12-11
updated: 2026-03-02
summary: "How to merge checkpoints/LoRAs and create difference LoRAs"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: "https://i.gyazo.com/60a8e4bd6e8b13d321cab6372e363baa.png"
tags: []
---

## What is Model Merge?

There are roughly three ways to prepare a new checkpoint model:

- Train from scratch
- Fine-tune an existing model (Fine-tuning / LoRA, etc.)
- **Mix existing models (Merge)**

The first two require specialized knowledge and dataset preparation, but the third one, "Merge", can be easily done on ComfyUI.

---

## Mixing Checkpoints 50:50

First, let's simply mix two models half and half.

![](https://gyazo.com/152fa7235f2878021cd924594b2d2bf1){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeSimple_0.5.json)

In this workflow, we use the `ModelMergeSimple` node to merge two checkpoints at a 1:1 ratio.

- 🟩 `ModelMergeSimple` takes two `MODEL` inputs and outputs a new model with weights linearly interpolated by the specified ratio.
  - When `ratio=0.5`, you can think of it as "something mixed half and half of Model A and Model B".
- If you connect the output `MODEL` directly to `KSampler`, you can easily try out the intermediate model.
  - It just roughly mixes an anime-style model and a realistic model, but it is surprising that it can create expressions like 2.5D.

![](https://gyazo.com/89e876767a48d9acd6c6bb684e6b2495){gyazo=image}

[](/workflows/basic-workflows/model-merge/50-50-save.json)

- If you like the merge result, connect it to the `CheckpointSave` node to save it as a checkpoint. (It is bypassed in the workflow above.)
  - The default save location is `ComfyUI/output/checkpoints/` (standard setting for Windows portable version).

---

## Weakness of Model Merge

Even if you mix two models, the number of parameters itself remains "for one model".
While adding some new power, it can also be thought that the expressive power of the original field of expertise is scraped off by that amount.

If you mix a model that is good at drawing characters and a model that is good at drawing landscapes half and half, you will get a model that is neither good at characters nor backgrounds.

This doesn't seem very useful...
Is there any good way?

---

## Block Merge (Layer Merge)

The "main body that restores images from noise" in Stable Diffusion is a U-shaped network called "U-Net".
This is stepped, and several studies have shown that the role is different for each layer. (cf. [P+](https://prompt-plus.github.io/))

- Shallow layers ... Texture, color, fine patterns
- Deep layers ... Shape, composition, layout

So, when you only want the color of Model B, it seems good to merge only the shallow layers towards Model B.
This is the mechanism of Block Merge (Layer Merge).

![](https://gyazo.com/380e98b86fa2205099cf6f231fc32ac8){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeBlocks_out_0.5.json)

ComfyUI's standard node `ModelMergeBlocks` can roughly divide the entire U-Net into **3 blocks of IN / MID / OUT** and specify ratios.

- `IN` ... Input side block (relatively shallow layers)
- `MID` ... Around the middle bottleneck
- `OUT` ... Output side block (relatively deep layers)

Actually, UNet has dozens of layers, and through community research, it is generally understood which layer is likely to affect what.

ComfyUI also has nodes like `ModelMergeSD1` / `ModelMergeSDXL` that can adjust the ratio layer by layer. However, mastering this would be a craftsmanship...

---

## Merging LoRAs

Since LoRA is like a "difference patch that can be added to the original model later", LoRAs can be added together and merged just like checkpoints.

Before that, even just loading one LoRA, behind the scenes, it behaves like "adding the LoRA difference to the base checkpoint and creating a synthesized model on the spot".

In other words, at the point of applying LoRA to a checkpoint, we have already been doing "something like merging" in a broad sense all along (*ﾟ∀ﾟ)

---

## Difference LoRA

The story so far has been in the direction of "mixing models to create a new checkpoint", but conversely, there is also an idea of **extracting "only the difference" from a checkpoint as a LoRA**.

- Base model `Base` (e.g. `v1-5-pruned`)
- Custom checkpoint `Base+X` (e.g. a model that has learned specific characters or styles)

At this time, `Base+X` can be roughly regarded as "Base + Additional Style X".
Extracting "only the part of X" from this and making it a LoRA is **Difference LoRA**.

- 1. `Base+X - Base = X (← Difference to be LoRA)`
- 2. Compress that difference into LoRA format

### Workflow

![](https://gyazo.com/0b5930d9de58a61acd5bf63da5927634){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeSubtract_Save-LoRA.json)

- 🟩 Input the models you want to take the difference of into the `ModelMergeSubtract` node.
  - It is `model1 - model2`.
- 🟨 Although not used above, there is also a `CLIPMergeSubtract` node that takes the difference of the text encoder.
  - Text encoders are quite severe, so there is a possibility that it gets worse.
- Save as LoRA with `Extract and Save Lora` node.
  - The larger the `rank`, the more faithfully the difference is saved, but the model size increases accordingly.
  - As a guide, if it is a style difference, around 8 to 32, and if you want to extract a solid difference from a completely different model, keep in mind that use cases often distinguish like 64 or more.
  - The extracted LoRA model is saved in `\ComfyUI\output\loras`.

### Testing Difference LoRA

![](https://gyazo.com/c499e4f0a683dc0ddd573312f6897dc8){gyazo=image}

[](/workflows/basic-workflows/model-merge/SD1.5_text2image_with_LoRA.json)

- Since the difference was large this time, it is not possible to reproduce perfectly just by applying LoRA, but even with SD1.5, it has become possible to generate images that look like it.

---

## Reference Links

- [ComfyUI Wiki/Model Merging Examples](https://comfyui-wiki.com/en/workflows/model-merging)
