---
layout: page.njk
lang: en
section: basic-workflows
slug: model-merge
navId: model-merge
title: "Model Merge & Difference LoRA"
created: 2025-12-11
updated: 2026-08-26
summary: "How to merge checkpoints and LoRAs into new models or difference LoRAs"
seoTitle: "Merge Models in ComfyUI and Make Difference LoRAs"
seoDescription: "Merge checkpoints and LoRAs in ComfyUI: 50:50 merges and their limits, block merging, LoRA merging, and extracting a difference LoRA, with workflows."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: "/media/basic-workflows/model-merge/legacy_gyazo_60a8e4bd6e8b13d321cab6372e363baa.png"
tags: []
---

## What is Model Merging?

There are roughly three ways to prepare a new checkpoint model:

- Train from scratch
- Fine-tune an existing model (Fine-tuning / LoRA, etc.)
- **Mix existing models (Merge)**

The first two take specialized knowledge and a lot of dataset preparation, but the third, merging, is easy to do in ComfyUI.

---

## Mixing Checkpoints 50:50

First, let's simply mix two models half and half.

![](/media/basic-workflows/model-merge/modelmergesimple_0_5.png){media=image}

[](/workflows/basic-workflows/model-merge/modelmergesimple_0_5.json)

In this workflow, we use the `ModelMergeSimple` node to merge two checkpoints at a 1:1 ratio.

- 🟩 `ModelMergeSimple` takes two `MODEL` inputs and outputs a new model with weights linearly interpolated by the specified ratio.
  - With `ratio=0.5`, you can think of it as "half Model A, half Model B."
- If you connect the output `MODEL` directly to `KSampler`, you can easily try out the intermediate model.
  - This is just a rough mix of an anime model and a realistic model, but it's surprising how well it pulls off a 2.5D look.

![](/media/basic-workflows/model-merge/legacy_gyazo_89e876767a48d9acd6c6bb684e6b2495.png){media=image}

- If you like the merge result, connect it to the `CheckpointSave` node to save it as a checkpoint. (It is bypassed in the workflow above.)
  - The default save location is `ComfyUI/output/checkpoints/` (the standard setting for the Windows portable version).

---

## The Weakness of Model Merging

Even when you mix two models, the parameter count stays at "one model's worth."
You can think of it this way: whatever new ability you add, the model loses that much expressiveness in what it was originally good at.

If you mix a model that is good at drawing characters and a model that is good at drawing landscapes half and half, you end up with a model that's mediocre at both characters and backgrounds.

That doesn't sound very useful...
Is there a better way?

---

## Block Merge (Layer Merge)

In Stable Diffusion, the "core that restores images from noise" is a U-shaped network called "U-Net".
The U-Net is divided into many layers, and each appears to play a different role. Its outer layers tend to affect texture and color, while the layers near the center tend to affect shape and composition. (cf. [P+](https://prompt-plus.github.io/))

Block Merge uses these differences to mix only the features you want.

![](/media/basic-workflows/model-merge/legacy_gyazo_380e98b86fa2205099cf6f231fc32ac8.png){media=image}

[](/workflows/basic-workflows/model-merge/modelmergeblocks_out_0_5.json)

ComfyUI's standard `ModelMergeBlocks` node divides the U-Net into `IN`, from the input toward the center; `MID`, at the center; and `OUT`, from the center toward the output. You can set a separate ratio for each.

ComfyUI also has nodes like `ModelMergeSD1` / `ModelMergeSDXL` that can adjust the ratio layer by layer. But mastering those is a craft in itself...

---

## Merging LoRAs

Since a LoRA is like a "difference patch you can add to the original model later," LoRAs can be added together and merged, just like checkpoints.

In fact, even loading a single LoRA behaves, behind the scenes, like "adding the LoRA's difference to the base checkpoint and building a merged model on the spot."

In other words, every time we applied a LoRA to a checkpoint, we were already doing something "merge-like" in the broad sense all along (*ﾟ∀ﾟ)

---

## Difference LoRA

So far we've been going in the direction of "mixing models to make a new checkpoint," but you can also go the other way: **extract "just the difference" from a checkpoint as a LoRA**.

- Base model `Base` (e.g. `v1-5-pruned`)
- Custom checkpoint `Base+X` (e.g. a model that has learned specific characters or styles)

Here, `Base+X` can roughly be seen as "Base + extra style X."
Pulling out "just the X part" and turning it into a LoRA is a **difference LoRA**.

- 1. `Base+X - Base = X (← Difference to be LoRA)`
- 2. Compress that difference into LoRA format

### Workflow

![](/media/basic-workflows/model-merge/legacy_gyazo_0b5930d9de58a61acd5bf63da5927634.png){media=image}

[](/workflows/basic-workflows/model-merge/modelmergesubtract_save_lora.json)

- 🟩 Feed the models you want the difference between into the `ModelMergeSubtract` node.
  - It computes `model1 - model2`.
- 🟨 It isn't used above, but there's also a `CLIPMergeSubtract` node that takes the difference between text encoders.
  - Text encoders are quite sensitive, so this may make things worse.
- Save it as a LoRA with the `Extract and Save Lora` node.
  - The higher the `rank`, the more faithfully the difference is kept, but the bigger the model file gets.
  - As a rough guide, my impression is that people often use around 8–32 for style differences, and 64 or more when they want to pull a big difference out of a very different model.
  - The extracted LoRA model is saved in `\ComfyUI\output\loras`.

### Testing Difference LoRA

![](/media/basic-workflows/model-merge/legacy_gyazo_c499e4f0a683dc0ddd573312f6897dc8.png){media=image}

[](/workflows/basic-workflows/model-merge/sd1_5_text2image_with_lora.json)

- The difference was large this time, so applying the LoRA alone doesn't reproduce it perfectly, but even on SD1.5 it now generates images that look the part.

---

## Reference Links

- [ComfyUI Wiki/Model Merging Examples](https://comfyui-wiki.com/en/workflows/model-merging)
