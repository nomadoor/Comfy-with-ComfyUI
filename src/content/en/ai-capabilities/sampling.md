---
layout: page.njk
lang: en
section: ai-capabilities
slug: sampling
navId: sampling
title: Sampling
created: 2025-12-01
updated: 2026-03-27
summary: How the step-by-step removal of noise is decided
seoTitle: "Samplers and Schedulers Explained"
seoDescription: "How sampling removes noise step by step: samplers vs. schedulers, how much they affect quality, bad combinations, and fast sampling like LCM."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is Sampling?

![](/media/ai-capabilities/sampling/legacy_gyazo_bf9d6d2e5b528f0b82f9d13e3c18c5fa.png){media=image}

[Diffusion models](/en/ai-capabilities/diffusion-models/) don't wipe out the noise all at once. They build the image by taking many steps, each removing a little noise.

During training, noise is added in very fine increments. If generation removed noise one level at a time at that same fine granularity, there would be far too many steps to finish in any reasonable time.

So in actual generation, those much finer noise levels are regrouped into a handful of representative steps, so the image is done in, say, around 20 steps.

On this site, **Sampling** means this whole set of decisions about how to remove noise: **how many steps to split the process into** and **how much noise to remove in each step**.

---

## Sampler and Scheduler

In ComfyUI, Sampling is set up as two separate pieces.

### Sampler

The algorithm that decides how to move to the next step, based on the current state and the model's prediction.

- **Euler**: applies one step's worth of change as is.
- **DPM family**: also looks at previous steps to correct more cleverly.

In the push to get clean results in as few steps as possible, a ridiculous number of other samplers have been invented, but knowing two or three is plenty.

### Scheduler

Sets the **schedule** for "at which points in the run, and by how much, to reduce noise."

Diffusion models are trained on images that are destroyed gradually, with the noise level changing in small, continuous increments. Removing noise at that same granularity would take far too many steps, so actual generation "picks just a few noise levels along that path as representatives" and computes those.
The scheduler decides how to distribute them: for example, whether to remove a lot of noise early on, or save the later steps for fine-tuning.

---

## How Much Does It Affect Quality?

Sampling does affect image quality, but obsessing over these settings won't improve it all that much.

In most cases, **Euler + normal or Simple / 20 steps** is fine.

### Beware of Bad Combinations

That said, some combinations of sampler, scheduler, CFG, and step count just don't generate well.

Reference: [Stable Diffusion Deep Dive - CFG - Don't Accidentally Fry Your Images](https://www.youtube.com/watch?v=kuhO9zAzetk)


> ![](/media/ai-capabilities/sampling/legacy_gyazo_2726d797e03185230ce53475d48d707b.png){media=image}

Going by this chart, for example, **with DPM++ 2M Karras at 20 steps, anything above CFG 25 is in the red zone**.

If you actually try it, you can see the image quality is poor.

- DPM++ 2M Karras / Steps 20 / **CFG 8**  
  ![](/media/ai-capabilities/sampling/legacy_gyazo_262e228b7207b827b105bfad833d3ac5.png){media=image}

- DPM++ 2M Karras / Steps 20 / **CFG 30**  
  ![](/media/ai-capabilities/sampling/legacy_gyazo_375e367784f6446fcc1e4a0a93fbc0cb.png){media=image}

Causes other than CFG can also produce over-saturated images like this. These are sometimes described as **over-saturated colors** or **burnt out**.

So if you get an image like this, your sampler/CFG combination may be the problem. Check those parameters.

---

## Sampling for Speed (LCM and Similar)

A normal diffusion model takes around 20 steps to remove noise, but some models have been retrained to approximate what the original model does in "20 steps" in just one to a few steps.

These are called **distilled (speed-up) models**. Well-known examples include LCM (Latent Consistency Model) and the Lightning family.

At first they were meant to be used with dedicated samplers (like the LCM sampler), but recent ones are tuned to work with general-purpose samplers like Euler too.

One thing to watch out for in particular: they're often trained assuming `CFG = 1`.
So if you set CFG above 1, you may get **over-saturated colors** like in the experiment above, or the image may not generate correctly. Be careful.
