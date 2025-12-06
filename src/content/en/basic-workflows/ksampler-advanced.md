---
layout: page.njk
lang: en
section: basic-workflows
slug: ksampler-advanced
navId: ksampler-advanced
title: "KSampler (Advanced) Node"
summary: "Understanding the KSampler (Advanced) Node"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is KSampler (Advanced)?

![](https://gyazo.com/6f12a584833996a7a4800a13bb59cc23){gyazo=image}

The `KSampler (Advanced)` node is a high-level version of the standard `KSampler` node.
The `denoise` parameter is gone, and the following four have been added:
  - `add_noise`
  - `start_at_step`
  - `end_at_step`
  - `return_with_leftsover_noise`

I think this is one of the most interesting features in ComfyUI, so let's take a slow look.

---

## Review of Diffusion Models and Sampling

![](https://gyazo.com/bf9d6d2e5b528f0b82f9d13e3c18c5fa){gyazo=image}

[Diffusion models](/en/ai-capabilities/diffusion-models/) work by creating an image by gradually removing noise from complete noise.

In the image above, full noise is added at step 0, and by step 20, all noise is removed, and the image is complete.

---

## Parameters

### `start_at_step` and `end_at_step`

In KSampler (Advanced), by setting `start_at_step` and `end_at_step`, you can control from where borrowing starts and how far sampling proceeds.

![](https://gyazo.com/e73ba8cf96fd09b8c5335844858a6c86){gyazo=image}

For example, if you set `start_at_step` to **4** / `end_at_step` to **11**, it will only sample the white part of the image.

### `add_noise`

To repeat myself, diffusion models work by making a noise image and gradually removing the noise.

So, where does that noise come from?
That's right, adding noise is also done by KSampler.

In KSampler (Advanced), you can select whether to add noise or not with the `add_noise` parameter.

![](https://gyazo.com/64cca8d8e53b01d4315b4aec434dd5ec){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-add_noise.json)

🟫 If you perform sampling with `add_noise` set to disable, nothing will be generated because it keeps removing noise from an image without noise.

---

## Splitting Sampling

Sampling only intermediate steps, not adding noise... where exactly is this useful?

One thing you can do precisely because it is KSampler (Advanced) is to split one sampling into two or more KSamplers.

![](https://gyazo.com/814b1585c344ea2651ffe3bf16b95a0d){gyazo=image}

As shown in the figure, let's do the first half 0 ~ 10 steps with 🟪 KSampler (Advanced) and 11 ~ 20 steps with 🟨 KSampler (Advanced).

![](https://gyazo.com/d57cb22d3d85f90010815d19d45bb638){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-divide.json)

You can see that the generated image is exactly the same even if you split it into two.
The parameters are a bit confusing, so let's look at them carefully.

{% mediaRow img="https://gyazo.com/05f6a71f5fe47d5c2257bce31a015d2b{gyazo=image}", width=33, align="left" %}
**🟪KSampler (Advanced)**
- `add_noise` : `enable`
- `start_at_step` : `0`
- `end_at_step` : `10`
- `return_with_leftover_noise` : `enable`
  - Returns the latent with noise remaining.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/172843d68f88326455f5d66176286de0 {gyazo=image}", width=33, align="left" %}
**🟨KSampler (Advanced)**
- `add_noise` : `disable`
  - Since a latent with remaining noise is passed, noise is not added here.
- `start_at_step` : `10`
  - Make it the same as the `end_at_step` of 🟪.
- `end_at_step` : `20`
  - If you set a value larger than the total number of steps, internally it becomes the same as `steps`.
- `return_with_leftover_noise` : `disable`
{% endmediaRow %}

It doesn't seem to make sense to split it, but this is where it gets interesting.

---

## What You Can Do Because It's KSampler (Advanced)

### Switching Prompts

You can use prompt "A" at first and switch to prompt "B" halfway through sampling.

![](https://gyazo.com/6fd6725df9ce2fd370f7561927bafd4e){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-Prompt_Editing.json)

In this workflow, the image is generated with the prompt `red apple` for the first 10 steps and `red rabbit` for the rest. Can you see that an image that somehow mixes "apple" and "rabbit" is generated?

![](https://gyazo.com/b9db108769cb804df9df3fe8212e7707){gyazo=loop}

To make it easier to understand, I made a video of the generated images when changing the switching step by 1. What was 100% apple gradually becomes a rabbit.

> Stable Diffusion web UI users might remember [Prompt Editing](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing). Actually, it is something similar.
> There was a feature to switch prompts every step, but unfortunately in ComfyUI, you can't do that without custom nodes.
> You can do it if you line up 20 KSampler (Advanced) nodes, but well... you wouldn't do that...

### Switching Models (LoRA)

Similarly, you can switch models or LoRA halfway through.

![](https://gyazo.com/f85b62fe88508687bf562fd162fcc569){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-LoRA.json)

The nodes have increased and it's getting a bit complicated.
But if you look closely, two text2image workflows are lined up, and it's just switching in the middle.

Generating the first 6 steps **without LoRA**, and the rest **with LoRA**.

![](https://gyazo.com/ca0b90aaa5297a515c7bfe8f94e55684){gyazo=image}


This is a LoRA that makes it pixel art, but LoRA has memories of the pictures used as training material in addition to the concept of "making it pixel art".

Therefore, images generated without LoRA do not simply become pixel art as they are.
Comparing when LoRA is not used and when it is applied to all steps, you can see that not only did it become pixel art style, but the shape of the apple also changed.

**Diffusion models create the shape in the early steps and draw the details in the latter half.**
By not applying LoRA in the first steps that create the form, and applying LoRA only in the latter half, you can perform style conversion with LoRA while utilizing the original ability of the model.

---

## image2image

Adding noise halfway through connects directly to the mechanism of image2image.
So, let's take a look at the mechanism of image2image as is.

→ [image2image](/en/basic-workflows/sd15-image2image/)
