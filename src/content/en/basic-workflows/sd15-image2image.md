---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-image2image
navId: sd15-image2image
title: "image2image"
summary: "Learning image2image with Stable Diffusion 1.5"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is image2image?

![](https://gyazo.com/bbb1bca709f4a0b20735da8222d6e3f9){gyazo=image}

image2image is a method of **using a reference image as a draft and having a picture drawn over it**.

Even if you use it as a draft, if you trace it perfectly, it's just a copy. It has no originality.

So, by adding noise to the extent that the original image is still recognizable, and then removing the noise, let's have it draw a different version of the picture that follows the prompt while inheriting the composition and atmosphere of the original image moderately.

---

## Mechanism of image2image

Here is a review of diffusion models and Sampling again.
In ComfyUI, KSampler first fills an "empty latent" with noise, and generates an image by gradually removing noise from there.

In image2image, this "empty latent" is replaced with a **latent encoded from the reference image**. And you adjust **from which point to start adding noise** with `start_at_step`.

Now, let's see what happens when we change `start_at_step` with a KSampler (Advanced) of `steps: 20`.

{% mediaRow img="https://gyazo.com/9068f8b11d1798b5aef16930565aa97c{gyazo=image}", width=50, align="left" %}
**start_at_step: 0**
- It is filled with noise from the beginning.
- The draft image is not visible at all. It is almost the same as normal text2image.
- > *Behavior is slightly different only in Stable Diffusion 1.5.
 → [image2image and text2image when denoise is 1.0](#image2image-and-text2image-when-denoise-is-1-0)
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9e4a63492f71b4f31e4efa761999c772{gyazo=image}", width=50, align="left" %}
**start_at_step: 1**
- Starts from 1 step forward.
- Therefore, the amount of noise added to the draft (= amount of noise to be removed from now on) decreases slightly.
- However, the draft image is still barely visible.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2f5da8a9b3c1cdc017149a7c63fa7678{gyazo=image}", width=50, align="left" %}
**start_at_step: 9**
- The amount of noise added to the draft (= amount of noise to be removed from now on) decreases significantly.
- The outline and composition of the draft remain to the extent that they can be understood as they are.
{% endmediaRow %}



{% mediaRow img="https://gyazo.com/26906eaf7dfc00de20c1f265be4feff9{gyazo=image}", width=50, align="left" %}
**start_at_step: 20**
- Since it starts from the last step out of 20 steps, it is effectively the same as "doing nothing".
- In other words, practically no sampling is done, and no noise is added.
- Therefore, the input image is output as it is.
{% endmediaRow %}

In this way, if `start_at_step` is set somewhere between `1 ~ (steps - 1)`, it will be in a state of sampling while leaving the original picture.

This is called **image2image**.

---

## Workflow with KSampler (Advanced)

![](https://gyazo.com/e5ff6f57deb2d62f568cb8897eb41355){gyazo=image}

[](/workflows/basic-workflows/sd15-image2image/SD1.5_image2image_KSampler_(Advanced).json)

- 🟩 Convert the image to latent with the VAE Encode node.
- 🟨 Try changing the value of `start_at_step` to see how much of the original image remains.

---

## Workflow with KSampler

Of course, you can do image2image with the standard KSampler as well.
However, **"which knob determines how much of the original image remains"** is quite different from KSampler (Advanced).

![](https://gyazo.com/41975fb8a105170ea9d8a9dbbd48b5dd){gyazo=image}

[](/workflows/basic-workflows/sd15-image2image/SD1.5_image2image_KSampler.json)

- 🟪 set how much of the original image to leave by changing the value of `denoise`.
  - At `1.0`, it fills completely with noise. In other words, it is the same as text2image.
  - At `0.0`, no noise is added at all, so the original image is output as it is.

---

## Difference between Standard and Advanced

Here, let's compare it with KSampler (Advanced).

What we want to do is the same, and both adjust **"how much noise is added to the original image and then how much is removed"**.

However, since the assignment of knobs is different, it is a bit confusing. Let's look at the behavior of each with settings that seem to produce the same result.

{% mediaRow img="https://gyazo.com/e38909e3a90797d5b6aba273df2b97ca{gyazo=image}", width=50, align="left" %}
**KSampler (Advanced)**
- For example, if you set `steps: 20`, `start_at_step: 4`,
  It executes only "from the 4th step to the 20th step of the total 20 steps".
- The actual number of times sampled is **20 - 4 = 16 times**.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/b3bd1f3ffe6b83d34ce52fbe27958768{gyazo=image}", width=50, align="left" %}
**Standard KSampler**
- Similarly, if you set `steps: 20` and `denoise: 0.8`, the appearance of "how noise is applied" will be close, but **the sampling count remains 20 times**.
- Even if you change the value of `denoise` to 0.5 or 0.1, it still samples 20 times.
{% endmediaRow %}


- **Advanced**
  - `steps` is "total number of steps", execute only after `start_at_step` → execution count changes
- **Standard**
  - `steps` is "actual execution count", `denoise` changes only the strength of noise → execution count does not change

If you want to achieve "noise application close to Advanced" with Standard KSampler, the following formula gives a rough estimate. (It does not match perfectly)
```
Steps to set ≒ Total steps * denoise
```

### You don't really need to worry about it

After explaining it so thoroughly, both determine **"how much noise to add to the original image"**.

Care must be taken when mixing standard KSampler and Advanced, but since no one builds such a workflow, there is no need to worry.

It is OK if you know which parameter to change to leave how much of the original image.

---

## image2image and text2image when denoise is 1.0

When `denoise: 1.0`, the original image is completely filled with noise, so mechanically image2image and text2image using the `Empty Latent Image` node should be the same.

![](https://gyazo.com/aae8ea31ec753bc12053ae1d6b701179){gyazo=image}

But **they are not the same in Stable Diffusion 1.5**. (I think it's a difference in implementation, but I don't understand it so I don't know.)
On the other hand, in recent models (Flux etc.), they become exactly the same image.

Stable Diffusion 1.5 is a special case, and on this site, we treat **"image2image with denoise 1.0 and text2image as the same thing"** as originally designed.

---

## Sample Images

![](https://gyazo.com/1f5fee22e1db9942bf950cf39906c881){gyazo=image}
