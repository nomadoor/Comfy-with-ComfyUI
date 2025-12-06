---
layout: page.njk
lang: en
section: ai-capabilities
slug: sampling
navId: sampling
title: Sampling
summary: Mechanism to decide the procedure for reducing noise
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is Sampling?

![](https://gyazo.com/bf9d6d2e5b528f0b82f9d13e3c18c5fa){gyazo=image}

[Diffusion models](/en/ai-capabilities/diffusion-models/) do not eliminate noise all at once; they generate images by proceeding through steps of reducing noise little by little many times.

During training, steps are divided really finely to increase noise little by little, but if we decrease noise one step at a same fineness during generation, the number of steps becomes too large and it will not finish in a realistic time.

Therefore, in actual generation, the noise stages, which are actually divided much more finely, are regrouped into several representative steps so that they are completed in, for example, around 20 steps.

In this site, the whole way of deciding how to reduce noise, such as **how many steps to divide the whole into** and **how much noise to reduce in one step**, is called **Sampling**.

---

## Sampler and Scheduler

In ComfyUI, Sampling is configured by dividing it into two elements.

### Sampler

An algorithm that calculates "how much noise to reduce in the next step".

- **Euler**: Applies the amount of change for one step as is.
- **DPM family**: Smartly corrects by referring to past steps as well.

Besides these, as a result of evolving to finish beautifully with as few steps as possible, a huge number of samplers have been invented, but remembering 2 to 3 is enough.

### Scheduler

Decides the **timetable** of "where in the total steps and how much noise to reduce".

Diffusion models are trained on the premise of destroying images continuously while changing the noise level little by little. If we remove noise with the same fineness, the number of steps becomes too large, so during actual generation, we calculate by "selecting only a few noise levels on that trajectory as representatives".
The scheduler decides the allocation, such as whether to reduce greatly in the early stages or use the latter half for fine adjustments.

---

## How much does it affect quality?

It's not that Sampling doesn't affect image quality, but being particular about this setting doesn't necessarily improve quality that much.

Basically, choosing **Euler + normal 20step** is fine.

### Beware of Bad Combinations

However, depending on the combination of sampler, scheduler, CFG, and number of steps, generation may not work well.

Reference: [Stable Diffusion Deep Dive - CFG - Don't Accidentally Fry Your Images](https://www.youtube.com/watch?v=kuhO9zAzetk)


> ![](https://gyazo.com/2726d797e03185230ce53475d48d707b){gyazo=image}

According to this diagram, for example, **with DPM++ 2M Karras 20step, exceeding CFG 25 is a red signal**.

If you actually generate it, you can see that the quality of the generated image is bad.

- DPM++ 2M Karras / Steps 20 / **CFG 8**  
  ![](https://gyazo.com/262e228b7207b827b105bfad833d3ac5){gyazo=image}

- DPM++ 2M Karras / Steps 20 / **CFG 30**  
  ![](https://gyazo.com/375e367784f6446fcc1e4a0a93fbc0cb){gyazo=image}

Even causes other than CFG can generate images with excessively high saturation like this. Such images are sometimes described as **over-saturated colors** or **burnt out**.

Conversely, if such an image is generated, the combination of sampler and CFG might be bad. Please check these parameters.

---

## Sampling for Speed Up (LCM family etc.)

Normal diffusion models take around 20 steps to reduce noise, but there are models re-trained to approximate the changes made in "20 steps" by the original model in 1 to a few steps.

Such models are called **accelerated distillation models**. Representative ones include LCM (Latent Consistency Model) and Lightning family.

Initially, it was premised on using them in combination with dedicated samplers (such as LCM sampler), but recent ones are adjusted to work with general-purpose samplers like Euler as well.

A particular point to note is that they are often trained on the premise of `CFG = 1`.
In other words, if you set a CFG larger than 1, it may become **over-saturated colors** like the experiment above, or may not generate correctly. Please be careful.
