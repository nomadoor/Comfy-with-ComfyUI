---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-text2image
navId: sd15-text2image
title: "text2image"
created: 2025-12-04
updated: 2026-08-26
summary: "text2image with Stable Diffusion 1.5"
seoTitle: "ComfyUI text2image for Beginners: The Basic Workflow"
seoDescription: "text2image basics in ComfyUI with Stable Diffusion 1.5: what Load Checkpoint, Empty Latent Image, CLIP Text Encode, KSampler, and VAE Decode do."
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## What is text2image?

You enter a text prompt and generate an image.

More fundamentally, you're steering the diffusion model with **a text prompt as the condition**.

This is the foundation of every workflow we'll build from here on. Let's take it slowly.

---

## How Image Generation AI Works

I've written a very simple explanation here.
If you know nothing at all about how image generation AI works, give it a quick read. The parameters should start to make a bit more sense.

- [Diffusion Models](/en/ai-capabilities/diffusion-models/)
- [Conditioning](/en/ai-capabilities/conditioning/)
- [CFG](/en/ai-capabilities/cfg/)
- [Sampling](/en/ai-capabilities/sampling/)
- [Latent Diffusion Model & VAE](/en/ai-capabilities/latent-diffusion-vae/)


---

## Downloading the Model

We'll use Stable Diffusion 1.5, where it all started.

- [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂checkpoints/
              └── v1-5-pruned-emaonly-fp16.safetensors
    ```

---

## workflow

![](/media/basic-workflows/sd15-text2image/legacy_gyazo_363769552b12b2072756280f163183df.png){media=image}

[](/workflows/basic-workflows/sd15-text2image/sd1_5_text2image.json)

## About Each Node

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_c9e67fd1fd3382708102f366bdf63855.png {media=image}", width=33, align="left" %}
### Load Checkpoint Node

Loads a model in the older Checkpoint format.
- A Checkpoint bundles the **diffusion model / text encoder / VAE** into one package.
- Early on, models were usually distributed this way, but now they're almost always distributed separately.
- So you'll use separate nodes such as Load Diffusion Model / Load CLIP / Load VAE.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_2321a6cfbee1f95261c5bf857068f4b7.png {media=image}", width=33, align="left" %}
### Empty Latent Image Node

Creates an empty latent image that serves as the "starting point" for image generation.
- Set the size of the image you want to create.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_ba121f352d6252f885c2855cd99ad2f5.png {media=image}", width=33, align="left" %}
### CLIP Text Encode Node

Converts the text prompt into Conditioning that the model can understand.
- Prepare what you want as the "positive prompt" and what you want to avoid as the "negative prompt", in separate nodes.
- However, this node itself does not have a concept of `positive` / `negative`.
- Connect it to the KSampler's `positive` slot and it's treated as positive; connect it to the `negative` slot and it's treated as negative.
{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_5404e0e4a52dade391da4cb125b8512e.png {media=image}", width=33, align="left" %}
### KSampler Node

The core node of image generation, which performs Sampling (noise removal).

- Connect all the nodes above (Model / Positive / Negative / Latent) to it.
- `seed`: A value that determines the shape of the noise. With the same settings, you can reproduce the same image.
- `control_after_generate`: How the seed changes after each generation. `fixed` keeps it as is, `randomize` picks a random one every time.
- `steps`: The number of denoising steps. `20` is enough for most models.
- `cfg`: How strongly the prompt takes effect.
- `sampler_name`: Which sampling algorithm to use. `Euler` is usually fine.
- `scheduler`: The type of schedule for the order and strength in which noise is reduced at each step.
- `denoise`: Explained in detail in [KSamplerAdvanced](/en/basic-workflows/ksampler-advanced/). Set to `1.0` for text2image.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/sd15-text2image/legacy_gyazo_73b18040b915d0c1159a79cabbb8d065.png {media=image}", width=33, align="left" %}

### VAE Decode Node

Converts the latent into a pixel image.

{% endmediaRow %}



## Changing the VAE

Honestly, the Stable Diffusion 1.5 VAE isn't very good. With fine-tuned models, it sometimes produces images with strange colors.

Later, an improved VAE was released. Plenty of other VAEs have come out too, but for Stable Diffusion 1.5, this one will almost never give you trouble.

### Downloading the VAE

- [vae-ft-mse-840000-ema-pruned.safetensors](https://huggingface.co/stabilityai/sd-vae-ft-mse-original/blob/main/vae-ft-mse-840000-ema-pruned.safetensors)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂vae/
              └── vae-ft-mse-840000-ema-pruned.safetensors
    ```

### workflow

![](/media/basic-workflows/sd15-text2image/legacy_gyazo_897f66c308b3b98440f641ee3d33d50e.png){media=image}

[](/workflows/basic-workflows/sd15-text2image/sd1_5_text2image_vae_ft_mse_840000.json)

- 🟥 Add a `Load VAE` node and select the VAE you just downloaded.
  - Connect it to VAE Decode.

> [!NOTE]
> **The workflows from here on are built on this one.**

---

## Questions Beginners Might Trip Over

Some things get treated as a given, but when you think about it, they're strange quirks unique to image generation.
I cover them briefly on separate pages.

  - [Even with the same parameters, Stable Diffusion web UI and ComfyUI cannot generate the same image]()
  - [Why generate at 512px × 512px?]()
  - [Why can you only generate resolutions that are multiples of 8?]()
  - [Seed "1234" and "1235" are completely different things]()

---

## How to Write Prompts

**CLIP**, the text encoder used in Stable Diffusion 1.5 / SDXL, is not very capable, to put it kindly. So to get the images people wanted, there were techniques known as prompt engineering, or "spells".

### Tag List

CLIP can't actually **read** sentences, so writing the prompt as prose didn't mean much.
```
1girl, solo, upper body, looking at viewer, smile, outdoors, sunset
```
So prompts were often written as a plain **list of tags**, like this.

Also, anime models were trained on images from a site called Danbooru, along with the tags used to organize them, as-is. So we'd look up the tags used on Danbooru and use them directly.

### Quality Spells

```
(best quality, masterpiece, ultra detailed, 8k, HDR, sharp focus, highly detailed)
```

Like this, we'd pile up words that **seemed likely to improve quality** at the very start.
Looking back, I'm not sure it meant anything, but we didn't know which words worked or how much, so we just kept adding them.

### Negative Prompt

```
bad anatomy, extra fingers, extra limbs, blurry, lowres, jpeg artifacts, ...
```

Conversely, we'd fill the negative prompt with words that seemed likely to lower quality. Who knows how much good these did either...

### Attention Notation

Giving a word in the prompt a number, like `(red:1.05)` / `(blue:0.9)`, changes how much weight that word gets.

CLIP tends to weight text near the start of the prompt more, so the later something is written, the less effect it has. Some words also just work better than others.

Attention notation lets you adjust for that by hand.

> [!NOTE]
> However, this only works when CLIP actually understands the word.
> Slapping something like `(Ghoti:999)` on a word it probably doesn't know won't do anything.

![](/media/basic-workflows/sd15-text2image/legacy_gyazo_e13bd76787711c8392334243177e60f3.mp4){media=loop}

- Put the cursor on the word you want to adjust, and press `Ctrl + Up/Down Arrow` to change its weight in steps of 0.05.
