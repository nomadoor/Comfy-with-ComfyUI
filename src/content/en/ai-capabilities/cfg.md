---
layout: page.njk
lang: en
section: ai-capabilities
slug: cfg
navId: cfg
title: CFG
created: 2025-12-01
updated: 2026-03-02
summary: How strongly the prompt takes effect
seoTitle: "What Is CFG? How the CFG Scale Works in Image Generation"
seoDescription: "How CFG sets how closely a model follows the prompt: what changing it does, how to pick a value, and why CFG 1 cuts compute and ignores the negative prompt."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is CFG?

Roughly speaking, CFG (Classifier-Free Guidance) is a **coefficient that sets "how strongly the model follows the prompt."**

- **Higher values**: The model tries harder to follow the prompt.
- **Lower values**: The output drifts toward the model's own idea of a "plausible, natural image."

That said, CFG only helps when the text encoder actually understands the prompt and the model is capable enough to express it.

The prompt, the model, and how you set up conditioning are what really matter. CFG is just a **knob for fine adjustments**.

---

## How CFG Works

Internally, the diffusion model makes two "noise predictions":

- **positive**: with the prompt (conditional)
- **negative**: ignoring the prompt (unconditional)

ComfyUI blends them with this formula:

```
output = negative + guidance_scale × (positive - negative)
```

Here, `guidance_scale` is the **CFG value**.

In other words, it sets **how much to amplify the difference between the "with prompt" and "without prompt" predictions.**

- **Larger values**: The `positive - negative` difference is amplified, pulling the result strongly toward the prompt.
- **Smaller values**: The prompt has less influence, and the result leans toward `negative` (the model's own tendencies).

---

## Finding the "Just Right" CFG

The best CFG value depends on the model and sampler, but **4 to 7** is a safe place to start.

I said that raising CFG makes the prompt take stronger effect, but that's only true when:

- The text encoder understands what the prompt says
- The model is capable of expressing that image

If those aren't the case, raising CFG won't make the results any better.

---

## Special Meaning of CFG = 1

A CFG of `1` is a bit special.
Let's plug `guidance_scale = 1` into the formula from earlier.

```
output = negative + 1 × (positive - negative)
       = positive
```

The `negative` term cancels out, leaving **only `positive`**.

This has two consequences:

### 1. Less Computation

Since the `negative` (unconditional) pass is no longer needed, **compute per step can drop to roughly half** of what it is with CFG > 1 (depending on the implementation).

There are many ways to speed up image generation, but the simplest is **using CFG = 1**. You lose the ability to adjust prompt strength with CFG, though, so many models handle that with other parameters instead.

### 2. The Negative Prompt Stops Working

Since the output is just `positive`, **the negative prompt has no effect**.
Whatever text you put on the `negative` side cancels out in the formula.

### Note

Most so-called fast (accelerated) models are trained with CFG = 1 in mind.
Setting CFG above 1 on these models **produces broken images**, so check the model's download page or documentation to see which CFG value it expects.
