---
layout: page.njk
lang: en
section: basic-workflows
slug: ltx-2-5
navId: ltx-2-5
title: "LTX 2.5"
created: 2026-09-01
updated: 2026-10-05
summary: "Generate video and audio with LTX 2.5"
seoTitle: "LTX 2.5 in ComfyUI: Generate Video and Audio Together"
seoDescription: "Use Lightricks' LTX 2.5 in ComfyUI: Multi-shot, Duration Predictor, text2video, image2video, FLF2V, and IC-LoRA, with easy-to-read workflows."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/ltx-2-5/legacy_gyazo_f0a0582dba74a4ef6e731142136b5c59.mp4"
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

> [!WARNING]
> LTX 2.5 models cannot be downloaded without authentication. Log in with your Hugging Face account and click `Agree and Access` on the [LTX-2.5 page](https://huggingface.co/Lightricks/LTX-2.5).
>
> ![](/media/basic-workflows/ltx-2-5/ltx_2_5_huggingface_agree_and_access.png){media=image}
>
> The IC-LoRAs used later on also need the same agreement on each of their pages.

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

![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_text2video.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="255s", tags=["1MP"], samplers=[{ name: "1st", speed: "1.70 s/it" }, { name: "2nd", speed: "12.77 s/it" }] %}

Like LTX-2, this is a 2-stage workflow. It first generates at half the target resolution, then upscales the result by 2x.

{% mediaRow img="/media/basic-workflows/ltx-2-5/legacy_gyazo_d353cf476e7c8be513f7bc1e55cef365.png", width=40, align="left" %}
**Resolution settings**

Enter half the target resolution in `EmptyLTXVLatentVideo`, since the result will be upscaled by 2x afterward.

This value must also be a multiple of 32, so set the target width and height to multiples of 64.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_frame.png", width=40, align="left" %}
**Frame count settings**

In this workflow, enter the desired duration in seconds (sec) and the FPS, and the frame count is rounded to a suitable `8n + 1` value.

{% endmediaRow %}

{% outputs %}
![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_output.mp4){media=loop}
{% endoutputs %}

### Multi-shot

This has become more common with models such as Seedance 2: you can generate multiple shots in a single run.

![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_multishot.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_text2video_multishot.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="256s", tags=["1MP"], samplers=[{ speed: "12.69 s/it" }] %}

There is no special format. You can simply write something natural such as “a cut happens here...” and the model will recognize it.

This makes prompts easy to write, but the model may not always recognize them as Multi-shot. If it does not work, be patient and try a few times.

{% outputs %}
![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_multishot_output.mp4){media=loop}
{% endoutputs %}

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

![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_duration_predictor.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_text2video_duration_predictor.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="221s", tags=["1MP"], samplers=[{ speed: "5.66 s/it" }] %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/legacy_gyazo_4567c3906de961a9c90bc01cef27db5d.png", width=40, align="left" %}
**LTXV Duration Predictor**

It outputs the predicted frame count, which is connected to `length` in the regular text2video workflow.

It is only a prediction, so the result may be shorter or longer than expected. Even so, automatically predicting the video length is an interesting feature.

{% endmediaRow %}

{% outputs %}
![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_duration_predictor_output.mp4){media=loop}
{% endoutputs %}

## image2video

![](/media/basic-workflows/ltx-2-5/ltx_2_5_image2video.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_image2video.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="254s", tags=["1MP"], samplers=[{ speed: "12.82 s/it" }] %}

This works the same way as [image2video in LTX 2](/en/basic-workflows/ltx-2/#image2video). `LTXVImgToVideoInplace` inserts the input image as the first frame.

> [!NOTE]
> For various reasons, earlier workflows deliberately degraded the input image with `LTXV Preprocess`. With LTX 2.5, at least in my experience, it no longer seems necessary, so I have left it out.

{% outputs %}
![Input](/media/basic-workflows/ltx-2-5/ltx_2_5_image2video_input.webp){media=image} ![Output](/media/basic-workflows/ltx-2-5/ltx_2_5_image2video_output.mp4){media=loop}
{% endoutputs %}

---

## Generative Interpolation / FLF2V

This workflow takes any number of images and smoothly fills in the gaps between them.

If you specify only the first and last images of the video, it becomes what is commonly called **FLF2V**.

![](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="334s", tags=["1MP"], samplers=[{ speed: "16.08 s/it" }] %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/legacy_gyazo_2e39b3e006fcb35d96b87d649ded0146.png", width=40, align="left" %}
**LTXV Add Guide**

Use `frame_idx` to specify where each image is inserted.

- `0`: First frame
- `-1`: Last frame

Add more nodes and connect them in sequence to create Generative Interpolation.

> [!NOTE]
> Depending on the images, the result may look more like a transition than frame interpolation.<br>
> For an intermediate `LTXVAddGuide`, it may help to lower `strength` to around 0.3–0.4.

{% endmediaRow %}

{% outputs %}
![Input 1](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation_input1.webp){media=image} ![Input 2](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation_input2.webp){media=image} ![Input 3](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation_input3.webp){media=image} ![Output](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation_output.mp4){media=loop}
{% endoutputs %}

---

## IC-LoRA

IC-LoRA plays a role similar to ControlNet or a video-editing LoRA for LTX.

LTX 2.5 is compatible with many IC-LoRAs made for LTX 2.3, and they can be used without modification.

### Union Control

Like a regular ControlNet, it can control the generated video with line art, depth maps, or pose videos.

**Model download**

- loras
  - [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) (654 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_union_control_pose.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_union_control_pose.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="404s", tags=["1MP"], samplers=[{ name: "1st", speed: "2.37 s/it" }, { name: "2nd", speed: "8.56 s/it" }] %}

For a more detailed explanation of IC-LoRA, see [LTX 2 / IC-LoRA (Pose)](/en/basic-workflows/ltx-2/#ic-lora-pose).

{% outputs %}
![Input / pose](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_union_control_pose_input.mp4){media=loop} ![Output](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_union_control_pose_output.mp4){media=loop}
{% endoutputs %}

### Clean Plate

Lightricks has released plenty of [fun IC-LoRAs](https://huggingface.co/collections/Lightricks/ltx-25-creative-lab) for VFX work with LTX 2.5.

There are all sorts, from turning day into night to flooding a scene. This time, let's try **Clean Plate**, which removes a specific thing from a video.

**Model download**

- loras
  - [ltx-2.5-22b-ic-lora-clean-plate-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Clean-Plate) (327 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.5-22b-ic-lora-clean-plate-1.0.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_clean_plate.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_clean_plate.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="433s", tags=["1MP"], samplers=[{ speed: "27.37 s/it" }] %}

The prompt needs a little care.

Instead of writing "remove ○○" as you would for image editing, describe the scene after ○○ is gone, as ordinary text. When you know exactly what should disappear, adding that it is absent, as in `no bicycle anywhere in the frame`, makes it work more reliably.

> [!NOTE]
> Things at the edge of the frame or partly hidden seem to disappear cleanly, while something filling the center of the frame seems hard for it. There is probably too little background left in the video to reconstruct from.

{% outputs %}
![Input](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_clean_plate_input.mp4){media=loop} ![Output](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_clean_plate_output.mp4){media=loop}
{% endoutputs %}

In most cases, this workflow can run other IC-LoRAs too. A few need a dedicated workflow, though, so let's look at those below.

### Alpha Gen

It cuts the foreground out of a video.

It does not output a video with a transparent background directly, though, so a little post-processing is needed.

**Model download**

- loras
  - [ltx-2.5-22b-ic-lora-alpha-gen-0.9.safetensors](https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Alpha-Gen) (1.31 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.5-22b-ic-lora-alpha-gen-0.9.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="369s", tags=["1MP"], samplers=[{ speed: "25.78 s/it" }] %}

It does not use a prompt. Leave it empty.

The output is a black-and-white mask video.

ComfyUI cannot make transparent video, so here we turn it into a green-screen video.

{% mediaRow img="/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen_image_composite_masked.png" %}
**Composite onto a green screen**

- Turn the black-and-white video into a mask with `ImageToMask`
- Invert it with `InvertMask`
- With `ImageCompositeMasked`, composite a solid green `EmptyImage` onto the background

{% endmediaRow %}

> [!NOTE]
> With videos longer than 145 frames, the original footage seems to start leaking into the mask. The workflow cuts the video at 145 frames.

{% outputs %}
![Input](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen_input.mp4){media=loop} ![Mask](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen_output_mask.mp4){media=loop} ![Green screen](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen_output_gb.mp4){media=loop}
{% endoutputs %}

### Refine Details

It upscales any video to a high resolution such as 4K while drawing in fine detail.

To keep the computation down it processes the video in tiles, so it needs a custom node.

**Custom node**

- [Lightricks/ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo)

**Model download**

- loras
  - [ltx-2.5-22b-ic-lora-refine-details-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Refine-Details) (1.31 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.5-22b-ic-lora-refine-details-1.0.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="533s", tags=["4MP"] %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details_resize.png" %}
**Resize the video first**

First, enlarge the video to a large size (about 4 MP in this workflow).

What Refine Details does is redraw that stretched, blurry video cleanly.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details_tiled_fusion_sampler.png" %}
**Tiled Fusion Sampler**

`LTXVTiledFusionSampler` splits the video into tiles and samples them.

There is no need to change its settings.

{% endmediaRow %}

In the prompt, write words about image quality, such as `sharp photographic detail` or `natural film grain`, not about what is in the video. Every tile receives the whole prompt, so if you name a person, that person can get drawn into tiles where they are not.

{% outputs %}
![Input](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details_input.mp4){media=loop} ![Output](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details_output.mp4){media=loop}
{% endoutputs %}
