---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-image2image
navId: sd15-image2image
title: "image2image"
created: 2025-12-06
updated: 2026-03-02
summary: "Learn image2image with Stable Diffusion 1.5"
seoTitle: "image2image in ComfyUI and What Denoise Does"
seoDescription: "How image2image redraws a reference image, shown with Stable Diffusion 1.5: KSampler vs. KSampler (Advanced) workflows and what denoise means."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is image2image?

![](/media/basic-workflows/sd15-image2image/legacy_gyazo_bbb1bca709f4a0b20735da8222d6e3f9.png){media=image}

image2image is a way of **using a reference image as a draft and having the model draw over it**.

Draft or not, if it traces the image perfectly, you just get a copy. No originality at all.

So we add just enough noise that the original is still recognizable, then remove it, and have the model draw a different version that follows the prompt while carrying over a fair amount of the original's composition and mood.

---

## How image2image Works

Let's review diffusion models and sampling once more.
In ComfyUI, KSampler first filled an "empty latent" with noise, then generated the image by removing that noise little by little.

In image2image, this "empty latent" is replaced with a **latent encoded from the reference image**. Then `start_at_step` sets **from which point noise starts being added**.

Now let's see what happens when we change `start_at_step` on a KSampler (Advanced) with `steps: 20`.

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_9068f8b11d1798b5aef16930565aa97c.png{media=image}", width=50, align="left" %}
**start_at_step: 0**
- It's filled with noise from the very start.
- The draft image isn't visible at all. It's almost the same as regular text2image.
- > *Stable Diffusion 1.5 alone behaves a little differently.
 → [image2image and text2image when denoise is 1.0](#image2image-and-text2image-when-denoise-is-1-0)
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_9e4a63492f71b4f31e4efa761999c772.png{media=image}", width=50, align="left" %}
**start_at_step: 1**
- It starts one step in.
- So the amount of noise added to the draft (= the noise still to be removed) drops slightly.
- Even so, you can still hardly see the draft image.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_2f5da8a9b3c1cdc017149a7c63fa7678.png{media=image}", width=50, align="left" %}
**start_at_step: 9**
- The amount of noise added to the draft (= the noise still to be removed) drops considerably.
- The draft's outlines and composition remain clearly recognizable.
{% endmediaRow %}



{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_26906eaf7dfc00de20c1f265be4feff9.png{media=image}", width=50, align="left" %}
**start_at_step: 20**
- It's told to start from the last of the 20 steps, so it's effectively the same as "doing nothing".
- In other words, no sampling actually happens, and no noise is added.
- So the input image comes out unchanged.
{% endmediaRow %}

So if you set `start_at_step` somewhere in `1 ~ (steps - 1)`, the model samples while keeping some of the original picture.

That's what we call **image2image**.

---

## Workflow with KSampler (Advanced)

![](/media/basic-workflows/sd15-image2image/legacy_gyazo_e5ff6f57deb2d62f568cb8897eb41355.png){media=image}

[](/workflows/basic-workflows/sd15-image2image/sd1_5_image2image_ksampler_advanced.json)

- 🟩 Convert the image to a latent with the VAE Encode node.
- 🟨 Try changing the value of `start_at_step` to see how much of the original image remains.

---

## Workflow with KSampler

Of course, you can do image2image with the standard KSampler too.
However, **"which knob decides how much of the original image remains"** is quite different from KSampler (Advanced).

![](/media/basic-workflows/sd15-image2image/legacy_gyazo_41975fb8a105170ea9d8a9dbbd48b5dd.png){media=image}

[](/workflows/basic-workflows/sd15-image2image/sd1_5_image2image_ksampler.json)

- 🟪 Change `denoise` to set how much of the original image to keep.
  - At `1.0`, the image is completely filled with noise. In other words, it's the same as text2image.
  - At `0.0`, no noise is added at all, so the original image comes out unchanged.

---

## Difference between Standard and Advanced

Let's compare it with KSampler (Advanced).

The goal is the same: both adjust **"how much noise to add to the original image, and how much to remove"**.

But the knobs are assigned differently, which gets a little confusing. Let's look at how each behaves with settings that look like they'd give the same result.

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_589d8db0a9506a3df81f2169de272d1e.png{media=image}", width=50, align="left" %}
**KSampler (Advanced)**
- For example, with `steps: 20` and `start_at_step: 4`,
  it runs only "steps 4 through 20 out of 20 in total".
- The number of sampling steps actually run is **20 - 4 = 16**.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-image2image/legacy_gyazo_cbcfaf5df9cee8f8079c82e903b492b8.png{media=image}", width=50, align="left" %}
**Standard KSampler**
- If you likewise use `steps: 20` with something like `denoise: 0.8`, the noise looks like it's applied in a similar way, but **it still samples 20 times**.
- Change `denoise` to 0.5 or to 0.1, and it still samples 20 times.
{% endmediaRow %}


- **Advanced**
  - `steps` is the "total number of steps", and only the steps from `start_at_step` on are run → the number of runs changes
- **Standard**
  - `steps` is the "actual number of runs", and `denoise` only changes the noise strength → the number of runs stays the same

If you want the standard KSampler to apply noise "roughly the way Advanced does", the formula below is a rough guide. (It won't match exactly.)
```
Steps to set ≒ Total steps * denoise
```

### You don't really need to worry about it

I say this after explaining it all in detail, but both are really just deciding **"how much noise to add to the original image"**.

You'd need to be careful if you mixed the standard KSampler and Advanced, but nobody builds a workflow like that, so don't worry about it.

As long as you know which parameter to change, and how much of the original image that keeps, you're fine.

---

## image2image and text2image when denoise is 1.0

At `denoise: 1.0`, the original image is completely buried in noise, so in principle image2image and text2image with the `Empty Latent Image` node should come out the same.

![](/media/basic-workflows/sd15-image2image/legacy_gyazo_aae8ea31ec753bc12053ae1d6b701179.png){media=image}

But **with Stable Diffusion 1.5, they don't**. (I think it's an implementation difference, but I don't really understand it, so I can't say.)
Recent models (Flux, etc.), on the other hand, give exactly the same image.

Stable Diffusion 1.5 is a special case, so on this site we treat **"image2image at denoise 1.0 and text2image as the same thing"**, as originally designed.

---

{% outputs "samples" %}
![](/media/basic-workflows/sd15-image2image/legacy_gyazo_1f5fee22e1db9942bf950cf39906c881.png){media=image}
{% endoutputs %}
