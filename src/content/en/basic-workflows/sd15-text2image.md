---
layout: page.njk
lang: en
section: basic-workflows
slug: sd15-text2image
navId: sd15-text2image
title: "text2image"
summary: "text2image with Stable Diffusion 1.5"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## What is text2image?

You input a text prompt, and it generates an image.

More fundamentally, you are controlling the diffusion model using **text prompts as conditions**.

This forms the basis of all workflows we will create. Let's look at it step by step.

---

## Mechanism of Image Generation AI

I explain it very briefly here.
If you know absolutely nothing about how image generation AI works, please take a quick look. It will help you understand the meaning of the parameters a little better.

- [Diffusion Models](/en/ai-capabilities/diffusion-models/)
- [Conditioning](/en/ai-capabilities/conditioning/)
- [CFG](/en/ai-capabilities/cfg/)
- [Sampling](/en/ai-capabilities/sampling/)
- [Latent Diffusion Model & VAE](/en/ai-capabilities/latent-diffusion-vae/)


---

## Downloading the Model

We will explain using Stable Diffusion 1.5, which is where it all started.

- [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂checkpoints/
              └── v1-5-pruned-emaonly-fp16.safetensors
    ```

---

## workflow

![](https://gyazo.com/363769552b12b2072756280f163183df){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image.json)

## About Each Node

{% mediaRow img="https://gyazo.com/c9e67fd1fd3382708102f366bdf63855 {gyazo=image}", width=33, align="left" %}
### Load Checkpoint Node

Loads a Checkpoint model in the old format.
- A Checkpoint is a package containing **Diffusion Model / Text Encoder / VAE**.
- Initially, models were often distributed in this format, but now they are mostly distributed separately.
- Therefore, you will use separate nodes like Load Diffusion Model / Load CLIP / Load VAE.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2321a6cfbee1f95261c5bf857068f4b7 {gyazo=image}", width=33, align="left" %}
### Empty Latent Image Node

Creates an empty latent image, which serves as the "starting point" for image generation.
- You specify the size of the image you want to create.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ba121f352d6252f885c2855cd99ad2f5 {gyazo=image}", width=33, align="left" %}
### CLIP Text Encode Node

Converts the text prompt into Conditioning that the model can understand.
- Prepare separate nodes for what you want to generate as "positive prompt" and what you want to avoid as "negative prompt".
- However, this node itself does not have a concept of `positive` / `negative`.
- If connected to the `positive` slot of the KSampler, it is treated as positive; if connected to the `negative` slot, it is treated as negative.
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5404e0e4a52dade391da4cb125b8512e {gyazo=image}", width=33, align="left" %}
### KSampler Node

The core node of image generation that performs Sampling (noise removal).

- Connect all the above nodes (Model / Positive / Negative / Latent).
- `seed`: A value that determines the shape of the noise. The same settings produce the same image.
- `control_after_generate`: Decides how the seed changes after each generation. `fixed` stays the same, `randomize` changes randomly.
- `steps`: The number of steps to remove noise. `20` is sufficient for most models.
- `cfg`: Determines how strongly the prompt affects the generation.
- `sampler_name`: Selects which sampling algorithm to use. `Euler` is generally fine.
- `scheduler`: The type of schedule for how (order/strength) to reduce noise at each step.
- `denoise`: Explained in detail in [KSamplerAdvanced](/en/basic-workflows/ksampler-advanced/). Set to `1.0` for text2image.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/73b18040b915d0c1159a79cabbb8d065 {gyazo=image}", width=33, align="left" %}

### VAE Decode Node

Converts the latent into a pixel image.

{% endmediaRow %}



## Changing the VAE

To be honest, the VAE of Stable Diffusion 1.5 is not very good. Using fine-tuned models can sometimes result in images with weird colors.

Since then, improved VAEs have been released. There are various VAEs, but if you use this one for Stable Diffusion 1.5, you will rarely have problems.

### Downloading the VAE

- [vae-ft-mse-840000-ema-pruned.safetensors](https://huggingface.co/stabilityai/sd-vae-ft-mse-original/blob/main/vae-ft-mse-840000-ema-pruned.safetensors)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂vae/
              └── vae-ft-mse-840000-ema-pruned.safetensors
    ```

### workflow

![](https://gyazo.com/897f66c308b3b98440f641ee3d33d50e){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image_vae-ft-mse-840000.json)

- 🟥 Add a `Load VAE` node and select the VAE you just downloaded.
  - Connect it to VAE Decode.

> **Future workflows will be based on this.**

---

## Questions Beginners Might Trip Over

There are some things that are treated as obvious but are actually peculiar to image generation when you think about them.
We explain them briefly on separate pages.

  - [Even with the same parameters, Stable Diffusion web UI and ComfyUI cannot generate the same image]()
  - [Why generate at 512px × 512px?]()
  - [Why can only resolutions that are multiples of 8 be generated?]()
  - [Seed "1234" and "1235" are completely different things]()

---

## How to Write Prompts

The **CLIP** text encoder used in Stable Diffusion 1.5 / SDXL is not very good, to put it mildly. Therefore, to generate the desired image, there were techniques called prompt engineering or "spells".

### Tag List

Since CLIP cannot **read** sentences, writing prompts as sentences didn't make much sense.
```
1girl, solo, upper body, looking at viewer, smile, outdoors, sunset
```
Therefore, prompts were often written in the form of a simple **list of tags**.

Also, anime-style models used images from the site Danbooru and the tags used to organize those images as they were. Therefore, users would look up tags used on Danbooru and use them directly.

### Quality Spells

```
(best quality, masterpiece, ultra detailed, 8k, HDR, sharp focus, highly detailed)
```

Like this, users would write a list of words that **seemed likely to improve quality** at the beginning.
Thinking back, I don't know if it meant anything, but since we didn't know which words were effective and how much, we just kept writing them.

### Negative Prompt

```
bad anatomy, extra fingers, extra limbs, blurry, lowres, jpeg artifacts, ...
```

Conversely, users would write words that seemed likely to lower quality in the negative prompt. Who knows how effective these were...

### Attention Notation

By setting a numerical value like `(red:1.05)` / `(blue:0.9)` for each word in the prompt, you can change the importance of that word.

CLIP places more importance on text at the beginning, so text written in the second half is almost ignored. Also, some words work well and some don't.

To adjust this manually, we use this attention notation.

> However, this only works if CLIP understands the word.
> Adding `(Ghoti:999)` to a word it probably doesn't know has no meaning.

![](https://gyazo.com/e13bd76787711c8392334243177e60f3){gyazo=loop}

- Place the cursor on the word you want to change the attention of, and use `Ctrl + Up/Down Arrow` to adjust it by 0.05.
