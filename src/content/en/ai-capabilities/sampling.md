---
layout: page.njk
lang: en
section: ai-capabilities
slug: sampling
navId: sampling
title: "Sampling"
summary: "A mechanism that determines the procedure for reducing noise."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Sampling?

The diffusion model does not remove noise all at once but creates an image while proceeding through steps to reduce noise little by little many times.

During training, the steps are divided really finely and noise is increased little by little, but if you remove noise one step at a time with the same fineness during generation, the number of steps becomes too large and it will not finish in a realistic time.

Therefore, in actual generation, the noise stages that are actually divided more finely are summarized into several representative steps, for example, to be completed in around 20 steps.

In this site, the entire method of deciding how to reduce noise, such as how many steps to divide the whole into and how much noise to reduce in one step, is called **Sampling**.

---

## Sampler and Scheduler

In ComfyUI, Sampling is set by dividing it into two elements.

### Sampler

An algorithm that calculates "how much noise to reduce in the next step."

- **Euler**: Applies the amount of change for one step as is.
- **DPM family**: Smartly corrects by referring to past steps as well.

Besides these, as a result of evolving to finish beautifully with as few steps as possible, a huge number of samplers have been invented, but remembering 2 or 3 is enough.

### Scheduler

Decides the **timetable** of "where in the overall steps and how much noise to reduce."

The diffusion model learns on the premise of continuously destroying the image while changing the noise level little by little during training. If you remove noise with the same fineness as it is, the number of steps becomes too large, so during actual generation, calculation is done by "selecting only a few noise levels on that trajectory as representatives."
The scheduler decides the allocation, such as whether to reduce significantly in the early stages or use the latter half for fine-tuning.

---

## How Much Does It Affect Quality?

It's not that Sampling doesn't affect image quality, but being particular about this setting doesn't improve quality that much.

Basically, choosing **Euler + normal 20step** should be fine.

### Beware of Incompatible Combinations

However, depending on the combination of sampler, scheduler, CFG, and number of steps, generation may not work well.

Reference: [Stable Diffusion Deep Dive - CFG - Don't Accidentally Fry Your Images](https://www.youtube.com/watch?v=kuhO9zAzetk)

![](https://gyazo.com/2726d797e03185230ce53475d48d707b){gyazo=image}

For example, **with DPM++ 2M Karras 20step, exceeding CFG 25 is a red flag**.

If you actually generate it:

- **DPM++ 2M Karras / Steps 20 / CFG 8**
  ![](https://gyazo.com/262e228b7207b827b105bfad833d3ac5){gyazo=image}

- **DPM++ 2M Karras / Steps 20 / CFG 30**
  ![](https://gyazo.com/375e367784f6446fcc1e4a0a93fbc0cb){gyazo=image}

Even for reasons other than CFG, images with excessively high saturation like this may be generated. Such images are sometimes described as **over-saturated colors** or **burn out**.

Conversely, if such an image is generated, the combination of sampler and CFG might be bad.

---

## Sampling for Speed (LCM, etc.)

Normal diffusion models take around 20 steps to reduce noise, but there are models retrained to approximate the changes made by the original model in "20 steps" in 1 to a few steps.

Such models are called **distilled models**. Representative ones include LCM (Latent Consistency Model) and Lightning series.

These are used in combination with dedicated samplers (LCM sampler, etc.) or adjusted to work with general-purpose samplers like Euler in recent ones.

As a particular point to note, since they are often trained assuming `CFG = 1`, let's check that first.
