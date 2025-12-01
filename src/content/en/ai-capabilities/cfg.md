---
layout: page.njk
lang: en
section: ai-capabilities
slug: cfg
navId: cfg
title: "CFG"
summary: "A mechanism that determines the 'effectiveness' of the prompt."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is CFG?

Roughly speaking, CFG (Classifier-Free Guidance) is a **coefficient that determines "how strongly to follow the prompt."**

- **Higher value**: Tries to follow the prompt strongly.
- **Lower value**: Tends to lean towards the model's inherent "natural-looking image."

However, CFG is only effective when the text encoder can properly understand the prompt and the model has sufficient expressive power.

The design of the prompt, model, and conditioning plays the leading role, and CFG is merely a **fine-tuning knob**.

---

## Mechanism of CFG

Internally, the diffusion model calculates "noise prediction" in two ways:

- **positive**: When a prompt is provided (conditional)
- **negative**: When the prompt is ignored (unconditional)

In ComfyUI, these are mixed using the following formula:

```
output = negative + guidance_scale × (positive - negative)
```

Here, `guidance_scale` is the **CFG value**.

What this formula means is **how much to amplify the difference between the "with prompt" and "without prompt" predictions.**

- **Larger value**: The difference `positive - negative` is emphasized, pulling strongly in the direction of the prompt.
- **Smaller value**: The influence of the prompt weakens, leaning towards `negative` (the model's inherent tendency).

---

## CFG Value and "Just Right"

The optimal CFG value varies depending on the model and sampler, but for now, using **7 to 9** should be fine.

I said that increasing CFG can increase the effectiveness of the prompt, but that is only when:

- The text encoder understands the prompt content
- The model has the performance to express that image

If this is not possible, increasing CFG will not improve the generation result.

---

## Special Meaning of CFG = 1

Among CFG values, `1` is a bit special.
Let's substitute `guidance_scale = 1` into the previous formula.

```
output = negative + 1 × (positive - negative)
       = positive
```

The information of `negative` is canceled out, and **only `positive`** remains.

Two things happen at this time:

### 1. Reduction of Computational Cost

Since inference for `negative` (unconditional) becomes unnecessary, **the computational cost per step can be almost halved** compared to when CFG > 1 (depending on implementation).

There are various methods to speed up image generation, but the simplest is **using CFG = 1**. However, since you can no longer adjust the strength of the prompt with CFG, many models substitute with other parameters.

### 2. Negative Prompt Becomes Ineffective

Since the output becomes only `positive`, **Negative Prompt stops working**.
This is because whatever text you put in the `negative` side is canceled out in the formula.

### Note

Models called "turbo" or "lightning" are mostly trained assuming CFG = 1.
If you set CFG to a value larger than 1 with such models, **broken images will be output**, so check the distribution page or documentation to see what CFG value the model assumes.
