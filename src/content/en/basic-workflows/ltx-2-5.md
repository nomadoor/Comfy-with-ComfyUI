---
layout: page.njk
lang: en
section: basic-workflows
slug: ltx-2-5
navId: ltx-2-5
title: "LTX 2.5"
created: 2026-09-01
updated: 2026-09-03
summary: "Generate video and audio with LTX 2.5"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f0a0582dba74a4ef6e731142136b5c59.mp4"
tags: []
---

## What is LTX 2.5?

`LTX 2.5` is a new version of Lightricks' video generation model, following `LTX-2` and `LTX 2.3`.

The basic architecture is the same as [LTX 2.3](/en/basic-workflows/ltx-2-3/), but it does more than simply produce cleaner output. It also comes with several major improvements.

- **Multi-shot**
  - Generate multiple shots in a single run
- **Gemma 4 Text Encoder**
  - The Text Encoder has changed from Gemma 3 to Gemma 4
- **Diffusion Decoder**
  - Instead of VAE Decode, it uses a diffusion model to reconstruct video from the latent
  - The basic idea is similar to [PiD](/en/basic-workflows/pixeldit-pid/#pid)

There are several other improvements, but this is enough to know for now if you are using it in ComfyUI.

---

## Recommended Settings

- Resolution
  - Must be a multiple of 32
- FPS
  - It is not restricted to a fixed set of values
  - The default is 24 FPS
- Frames
  - Must be `8n + 1`
- Maximum video length
  - 481 frames
  - About 20 seconds at 24 FPS

---

## Model Download

- diffusion_models
  - [ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/diffusion_models/ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors) (21.5 GB)
- latent_upscale_models
  - [ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors) (1 GB)
- text_encoders
  - [gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/text_encoders/gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors) (15.4 GB)
- vae
  - [ltx-2.5-video-vae-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/vae/ltx-2.5-video-vae-bf16.safetensors) (1.47 GB)
  - [ltx-2.5-audio-vae-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/vae/ltx-2.5-audio-vae-bf16.safetensors) (365 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors
    ├── 📂text_encoders/
    │   └── gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors
    └── 📂vae/
        ├── ltx-2.5-video-vae-bf16.safetensors
        └── ltx-2.5-audio-vae-bf16.safetensors
```

---

## text2video

![](https://gyazo.com/891b0474ea9ec2636b188b803f6ef2c3){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video.json)

Like LTX-2, this is a 2-stage workflow. It first generates at half the target resolution, then upscales the result by 2x.

{% mediaRow img="https://gyazo.com/d353cf476e7c8be513f7bc1e55cef365", width=40, align="left" %}
**Resolution settings**

Enter half the target resolution in `EmptyLTXVLatentVideo`, since the result will be upscaled by 2x afterward.

This value must also be a multiple of 32, so set the target width and height to multiples of 64.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/82803fd97cf50afbdb616105f14b0405", width=40, align="left" %}
**Frame count settings**

In this workflow, enter the desired duration in seconds (sec) and the FPS, and the frame count is rounded to a suitable `8n + 1` value.

{% endmediaRow %}

**Output example**

![](https://gyazo.com/e68699b3ebb44d9b20b5d85c73cf9644){gyazo=loop}

### Multi-shot

This has become more common with models such as Seedance 2: you can generate multiple shots in a single run.

![](https://gyazo.com/7d681d86ce23e28e4e48aed1fe452c7d){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video_multishot.json)

There is no special format. You can simply write something natural such as “a cut happens here...” and the model will recognize it.

This makes prompts easy to write, but the model may not always recognize them as Multi-shot. If it does not work, be patient and try a few times.

**Output example**

![](https://gyazo.com/7fe2eadbd6abb69f2015df4f8531fe26){gyazo=loop}

### Duration Predictor

Video length is normally set manually, but deciding how many seconds best fit a prompt can be surprisingly difficult.

LTX 2.5 can automatically estimate how long a video needs to be to express the content of the prompt.

**Model download**

- model_patches
  - [ltx-2.5-duration-head-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/model_patches/ltx-2.5-duration-head-bf16.safetensors) (3.84 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── ltx-2.5-duration-head-bf16.safetensors
```

![](https://gyazo.com/ecf49f82e56e0fdec6283401d71ae657){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video_Duration_Predictor.json)

{% mediaRow img="https://gyazo.com/4567c3906de961a9c90bc01cef27db5d", width=40, align="left" %}
**LTXV Duration Predictor**

It outputs the predicted frame count, which is connected to `length` in the regular text2video workflow.

It is only a prediction, so the result may be shorter or longer than expected. Even so, automatically predicting the video length is an interesting feature.

{% endmediaRow %}

## image2video

![](https://gyazo.com/e978305c53f6c658984db4ad42c71a7f){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_image2video.json)

This works the same way as [image2video in LTX 2](/en/basic-workflows/ltx-2/#image2video). `LTXVImgToVideoInplace` inserts the input image as the first frame.

> For various reasons, earlier workflows deliberately degraded the input image with `LTXV Preprocess`. With LTX 2.5, at least in my experience, it no longer seems necessary, so I have left it out.

**Output example**

![Input](https://gyazo.com/856453de1d4eaea2b8e02a8e6993db08){gyazo=image} ![Output](https://gyazo.com/d8bdced1eba00d48d1f5ff65dfb4e336){gyazo=loop}

---

## Generative Interpolation / FLF2V

This workflow takes any number of images and smoothly fills in the gaps between them.

If you specify only the first and last images of the video, it becomes what is commonly called **FLF2V**.

![](https://gyazo.com/a0e7571b01f97b79d73325390e0a4d3c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_generative-interpolation.json)

{% mediaRow img="https://gyazo.com/2e39b3e006fcb35d96b87d649ded0146", width=40, align="left" %}
**LTXV Add Guide**

Use `frame_idx` to specify where each image is inserted.

- `0`: First frame
- `-1`: Last frame

Add more nodes and connect them in sequence to create Generative Interpolation.

> Depending on the images, the result may look more like a transition than frame interpolation.<br>
> For an intermediate `LTXVAddGuide`, it may help to lower `strength` to around 0.3–0.4.

{% endmediaRow %}

**Output example**

![Input 1](https://gyazo.com/de4eaa85c26607d8b0f98f774880e2b8){gyazo=image} ![Input 2](https://gyazo.com/0ef0afcbe6a2d35cf018bb0f77e0a0ff){gyazo=image} ![Input 3](https://gyazo.com/c2058ec73687479e7abe3fa7f21f9d64){gyazo=image} ![Output](https://gyazo.com/e0e2fcb86f4a8513708807bacd79af8c){gyazo=loop}

---

## IC-LoRA

IC-LoRA plays a role similar to ControlNet or a video-editing LoRA for LTX.

LTX 2.5 is compatible with many IC-LoRAs made for LTX 2.3, and they can be used without modification.

There are many types available when you include those made for LTX 2.3, but here we will use the most basic one, Union Control.

### Model download

- [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) (654 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
```

### IC-LoRA Union

Like a regular ControlNet, it can control the generated video with line art, depth maps, or pose videos.

![](https://gyazo.com/4e194652b6db74b853390f20017bb542){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_IC-LoRA-Pose.json)

For a more detailed explanation of IC-LoRA, see [LTX 2 / IC-LoRA (Pose)](/en/basic-workflows/ltx-2/#ic-lora-pose).

**Output example**

![Input / pose](https://gyazo.com/824ba34d0fa1ef036db386c4f7f7b5f6){gyazo=loop} ![Output](https://gyazo.com/4f55983a4205360420e7cc605402301b){gyazo=loop}

---

## Use it as an upscaler

LTX 2.5 uses a 2-stage process: it generates at half resolution, then doubles the resolution and cleans the result up once more.

So it is only natural to use the second stage on its own and turn it into a 2x upscaler for any video.

![](https://gyazo.com/7fa914cfea3fe3b4648960d1c3474258){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_x2_upscaler.json)

It simply runs VAE Encode on any video and connects it to the second stage of the workflow used above.

However, the `ManualSigmas` values used above make the effective denoise too strong, changing too much of the original video.

Here, I replaced it with `Basic Scheduler` and set denoise to 0.3. Adjust it as needed.

**Output example**

![Input](https://gyazo.com/2090f2ae9f78af154922c00cd43e10f7){gyazo=loop} ![Output](https://gyazo.com/bb03d5683d784b144c290400638ba139){gyazo=loop}

Many competing models are now available, but its ability to produce natural-looking video still stands out among them. It would be nice to use each model where it works best.
