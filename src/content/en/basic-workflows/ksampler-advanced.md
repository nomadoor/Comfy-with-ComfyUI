---
layout: page.njk
lang: en
section: basic-workflows
slug: ksampler-advanced
navId: ksampler-advanced
title: "KSampler (Advanced) Node"
created: 2025-12-06
updated: 2026-03-02
summary: "A step up from KSampler that lets you split sampling and switch things midway"
seoTitle: "How to Use KSampler (Advanced) in ComfyUI"
seoDescription: "KSampler (Advanced) explained: add_noise, start_at_step, and end_at_step, and how to split sampling to switch prompts or LoRAs midway."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is KSampler (Advanced)?

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_6f12a584833996a7a4800a13bb59cc23.png){media=image}

The `KSampler (Advanced)` node is a superset of the plain `KSampler` node.
It drops the `denoise` parameter and adds these four:
  - `add_noise`
  - `start_at_step`
  - `end_at_step`
  - `return_with_leftsover_noise`

I think this is one of the most interesting features in ComfyUI, so let's go through it slowly.

---

## Review of Diffusion Models and Sampling

![](/media/ai-capabilities/sampling/legacy_gyazo_bf9d6d2e5b528f0b82f9d13e3c18c5fa.png){media=image}

[Diffusion models](/en/ai-capabilities/diffusion-models/) generate an image by starting from pure noise and gradually removing it.

In the image above, full noise is added at step 0, and by step 20 all of it has been removed and the image is complete.

---

## Parameters

### `start_at_step` and `end_at_step`

In KSampler (Advanced), by setting `start_at_step` and `end_at_step`, you can control where sampling starts and how far it goes.

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_e73ba8cf96fd09b8c5335844858a6c86.png){media=image}

For example, if you set `start_at_step` to **4** / `end_at_step` to **11**, only the white part of the image gets sampled.

### `add_noise`

I keep saying this, but diffusion models work by making a noise image and gradually removing the noise.

So, where does that noise come from?
That's right: KSampler is also the one adding it.

In KSampler (Advanced), the `add_noise` parameter lets you choose whether to add noise or not.

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_64cca8d8e53b01d4315b4aec434dd5ec.png){media=image}

[](/workflows/basic-workflows/ksampler-advanced/sd1_5_ksampler_advanced_add_noise.json)

🟫 If you sample with `add_noise` set to disable, nothing gets generated, because it just keeps removing noise from an image that has none.

---

## Splitting Sampling

Sampling only intermediate steps, not adding noise... where exactly is this useful?

One thing only KSampler (Advanced) can do is split a single sampling run across two or more KSamplers.

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_27eed74329f52442a046e59245ee9b14.png){media=image}

As in the figure, let's run the first half, steps 0–10, with 🟪 KSampler (Advanced) and steps 11–20 with 🟨 KSampler (Advanced).

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_d57cb22d3d85f90010815d19d45bb638.png){media=image}

[](/workflows/basic-workflows/ksampler-advanced/sd1_5_ksampler_advanced_divide.json)

You can see that the image comes out exactly the same even when split in two.
The parameters are a bit confusing, so let's look at them carefully.

{% mediaRow img="/media/basic-workflows/ksampler-advanced/legacy_gyazo_05f6a71f5fe47d5c2257bce31a015d2b.png{media=image}", width=33, align="left" %}
**🟪KSampler (Advanced)**
- `add_noise` : `enable`
- `start_at_step` : `0`
- `end_at_step` : `10`
- `return_with_leftover_noise` : `enable`
  - Returns the latent with noise remaining.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ksampler-advanced/ksampler_advanced_2nd.png{media=image}", width=33, align="left" %}
**🟨KSampler (Advanced)**
- `add_noise` : `disable`
  - It receives a latent that still has noise in it, so no noise is added here.
- `start_at_step` : `10`
  - Set it to the same value as 🟪's `end_at_step`.
- `end_at_step` : `20`
  - If you set it higher than the total step count, it's treated internally as equal to `steps`.
- `return_with_leftover_noise` : `disable`
{% endmediaRow %}

Splitting it doesn't seem to accomplish anything, but this is where it gets interesting.

---

## What Only KSampler (Advanced) Can Do

### Switching Prompts

You can start with prompt "A" and switch to prompt "B" partway through sampling.

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_6fd6725df9ce2fd370f7561927bafd4e.png){media=image}

[](/workflows/basic-workflows/ksampler-advanced/sd1_5_ksampler_advanced_prompt_editing.json)

In this workflow, the image is generated with the prompt `red apple` for the first 10 steps and `red rabbit` for the rest. Can you see that an image that somehow mixes "apple" and "rabbit" is generated?

{% outputs %}
![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_b9db108769cb804df9df3fe8212e7707.mp4){media=loop}
{% endoutputs %}

To make it clearer, I made a video of the results as the switching step moves one step at a time. What starts as 100% apple gradually turns into a rabbit.

> [!NOTE]
> Stable Diffusion web UI users might remember [Prompt Editing](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing). It really is a similar idea.
> It could also alternate prompts every step, but unfortunately ComfyUI can't do that without custom nodes.
> You could do it by lining up 20 KSampler (Advanced) nodes, but well... nobody's going to do that...

### Switching Models (LoRA)

In the same way, you can switch models or LoRAs partway through.

![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_f85b62fe88508687bf562fd162fcc569.png){media=image}

[](/workflows/basic-workflows/ksampler-advanced/sd1_5_ksampler_advanced_lora.json)

There are more nodes now, and it's getting a bit complicated.
But if you look closely, it's just two text2image workflows side by side, switching partway through.

The first 6 steps are generated **without LoRA**, and the rest **with LoRA**.

{% outputs %}
![](/media/basic-workflows/ksampler-advanced/legacy_gyazo_ca0b90aaa5297a515c7bfe8f94e55684.png){media=image}
{% endoutputs %}


This is a pixel-art LoRA, but besides the concept of "make it pixel art," a LoRA also ends up remembering the images it was trained on.

So the image you'd get without the LoRA doesn't simply turn into pixel art.
Compare no LoRA with LoRA on every step: it's not just in pixel-art style now, even the apple's shape has changed.

**Diffusion models create the shape in the early steps and draw the details in the latter half.**
By leaving the LoRA off for the early steps that build the shape and applying it only in the second half, you can change the style with the LoRA while still making use of what the base model can do.

---

## image2image

Adding noise partway through leads straight into how image2image works.
So let's go on and look at image2image next.

→ [image2image](/en/basic-workflows/sd15-image2image/)
