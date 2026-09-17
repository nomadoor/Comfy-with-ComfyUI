---
layout: page.njk
lang: en
section: basic-workflows
slug: minimax-h3
navId: minimax-h3
title: "MiniMax H3"
created: 2026-09-14
summary: "Generate video and audio with MiniMax H3"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/minimax-h3/minimax_h3_hero.mp4"
tags: []
---

## What is MiniMax H3?

[MiniMax H3](https://github.com/MiniMax-AI/MiniMax-H3) is a video generation model released by MiniMax.

It uses a simple architecture that handles text, images, video, and audio in a single Transformer, yet delivers exceptional performance and flexibility among local video generation models.

There are two model variants.

- **FL2VA**
  - Used for text2video, image2video, and First / Last Frame to Video
- **Ref2VA**
  - Uses images, video, and audio as references, combining people, motion, camera work, visual style, voices, and more

---

## Recommended Settings

- Resolution
  - 768p, about 1 MP
  - Width and height must be multiples of 32
- FPS
  - 24 FPS
- Frames
  - `17n + 5`
- Video length
  - 5–15 seconds

---

## Model Download

- diffusion_models
  - [minimax_h3_fl2va_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_fl2va_pruned_int8_convrot.safetensors) (21 GB)
  - [minimax_h3_ref2va_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_ref2va_pruned_int8_convrot.safetensors) (21 GB)
- text_encoders
  - [qwen3vl_32b_minimax_h3_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/text_encoders/qwen3vl_32b_minimax_h3_int8_convrot.safetensors) (27.1 GB)
- vae
  - [minimax_h3_audio_vae_fp32.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_audio_vae_fp32.safetensors) (605 MB)
  - [minimax_h3_video_vae_fp16.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_video_vae_fp16.safetensors) (5.21 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── minimax_h3_fl2va_pruned_int8_convrot.safetensors
    │   └── minimax_h3_ref2va_pruned_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_32b_minimax_h3_int8_convrot.safetensors
    └── 📂vae/
        ├── minimax_h3_audio_vae_fp32.safetensors
        └── minimax_h3_video_vae_fp16.safetensors
```

---

## Prompts

Natural-language prompts work, but you will need to follow the recommended prompt format to get the most out of the model.

The format is too complicated to write by hand, so give MiniMax's official prompt guides to ChatGPT or Claude and have it write the prompt for you.

- [MiniMax H3 Skills](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills)
- [Video Prompt Writing Guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md)
  - For T2VA, I2VA, FL2VA, and L2VA
- [Full-Reference Prompt Guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md)
  - For Ref2VA

Still, it helps to know the basics so that you can check whether the generated prompt is correct.

### FL2VA

For T2VA / I2VA / FL2VA / L2VA, split the video and audio description into three sections.

```text
integrated_multimodal_description:
[Shot 1] Describe the visuals, character motion, camera work, dialogue, and sound effects.

overall_soundscape:
Describe ambient and physical sounds.

non_diegetic_music:
Describe the background music. If there is none, write N/A.
```

For a single continuous shot, state explicitly in the description that there should be no cuts.

```text
[Shot 1] Single continuous shot, one take, no cuts. ...
```

For multiple shots, omit the timestamp from the first shot and specify the cut time from the second shot onward.

```text
[Shot 1] Describe the first shot.
[Shot 2] At 00:02.000, the camera cuts to ...
[Shot 3] At 00:04.000, the shot changes to ...
```

### Ref2VA

For Ref2VA, split the prompt into its dedicated six-section format.

```text
subject_definitions:
Define the people, objects, video, and audio to reference.

summary:
Briefly describe what you want to create.

retention_analysis:
Describe what to preserve or transfer from the reference materials.

detailed_description:
Describe the visuals, motion, camera work, dialogue, and sound effects.

overall_soundscape:
Describe ambient and physical sounds.

non_diegetic_music:
Describe the background music. If there is none, write N/A.
```

Refer to connected materials with tags such as `<Picture 1>`, `<Video 1>`, and `<Audio 1>`, and describe what to use from each one.

If you only want to use one part of a reference, such as a person in a photo, define it as something like `<Subject 1>`.

```text
<Subject 1> is the woman in <Picture 1>.
```

Wrap dialogue in `<d>` tags and specify the language with a tag such as `[Japanese]`.

```text
<Subject 1> (S1) says: <d>[Japanese] こんにちは。</d>
```

---

## About Optimization

MiniMax H3 produces excellent quality, but it is also an extremely demanding model.

Many techniques have been developed to reduce VRAM usage or speed up generation. They are all impressive, but each comes with some loss of quality.

Choosing among them means weighing the benefits against the drawbacks, and that is surprisingly difficult. For this page, the workflows use only `Comfy Kitchen Attention` (CK Attention) and no other optimizations.

I have collected more details here:

- [MiniMax H3 model selection, acceleration, memory reduction, and compute optimization](https://scrapbox.io/work4ai/MiniMax_H3%E3%81%AE%E3%83%A2%E3%83%87%E3%83%AB%E9%81%B8%E6%8A%9E%E3%83%BB%E9%AB%98%E9%80%9F%E5%8C%96%E3%83%BB%E8%BB%BD%E9%87%8F%E5%8C%96%E3%83%BB%E7%9C%81%E8%A8%88%E7%AE%97)

Once the available techniques have settled down a little, I plan to cover them in a separate article.

---

## text2video / T2VA

Model: `fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_t2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_t2va.json)

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_t2va_resolution_length.png", width=40, align="left" %}
**Resolution and video length**

The recommended resolution is about 1 MP, but the computational cost is also quite high. You may want to begin with a smaller size, such as 0.3 MP.

Enter the desired video length in seconds (sec), and the workflow rounds the frame count to a suitable `17n + 5` value.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_t2va_cfg.png", width=40, align="left" %}
**CFG**

H3 is already CFG-distilled, so set CFG to `1.0`.

{% endmediaRow %}

**Output example**

![](/media/basic-workflows/minimax-h3/minimax_h3_t2va_output.mp4){media=player}

---

## image2video / I2VA

Model: `fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_i2va.json)

Enter the prompt and first image in `MiniMax H3 Image to Video`.

**Output example**

![input](/media/basic-workflows/minimax-h3/minimax_h3_i2va_input.png){media=image} ![output](/media/basic-workflows/minimax-h3/minimax_h3_i2va_output.mp4){media=loop}

---

## First / Last Frame to Video

Model: `fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_flf2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_FLF2VA.json)

This is basically the same as I2VA. Just provide an image for `last_frame` as well.

**Output example**

![first](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_first_frame.png){media=image} ![last](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_last_frame.png){media=image} ![output](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_output.mp4){media=loop}

### Generative Interpolation

Model: `fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_generative-interpolation.json)

Insert images at specified frames and have the model fill in the motion between them.

This uses the `Add Guide for MiniMax H3` node.

**Output example**

![input1](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_1.png){media=image} ![input2](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_2.png){media=image} ![input3](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_3.png){media=image} ![output](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_output.mp4){media=loop}

---

## Audio-driven Video Generation

Model: `fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_audio-driven-i2va.json)

`Add Guide for MiniMax H3` can also take audio as input.

Provide an image and audio clip, then generate a video in which the person in the image moves in time with the audio.

**Output example**

![input](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va_input.png){media=image} ![output](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va_output.mp4){media=player}

---

## Reference Generation

Model: `ref2va`

This is where MiniMax H3 really comes into its own—and where things get interesting.

H3 lets you freely provide multiple images, videos, and audio clips as reference material for video generation.

Then simply give it an instruction such as “make the person in Picture 1 speak with the voice from Audio 1” to control the generated video. It is remarkably flexible.

![](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_reference-generation.json)

For this example, we will generate a video using only images as references.

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_prompt.png", width=40, align="left" %}
**Prompt**

The prompt format differs from the `fl2va` model.

Use [the Ref2VA prompt section above](#ref2va) as a guide.

> Confusingly, the node counts from 0 with names such as `ref_image_0`, while H3 prompts count from 1 with tags such as `<Picture 1>`.

{% endmediaRow %}

**Output example**

![](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output.mp4){media=player}


### 🤔 Ref2VA has lower basic output quality than FL2VA

[MiniMax itself acknowledges this](https://www.reddit.com/r/StableDiffusion/comments/1vh9rtw/comment/p29qqaa/): the Ref2VA model produces lower basic output quality than the FL2VA model.

Ideally, this will be solved properly in the future, but there are a few workarounds.

The two models actually have almost the same architecture, so FL2VA can handle Reference Generation to some extent as well.

![ref2va](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output.mp4){media=loop} ![fl2va](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output_fl2va.mp4){media=loop} ![Hybrid](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output_hybrid.mp4){media=loop}

The result is cleaner, though Ref2VA is still considerably more flexible.

There is also a community-made Hybrid model that mixes the two models together. If Ref2VA's output quality becomes too frustrating, it may be worth trying.

- [Minimax-H3-fl2va-ref2va-hybrid-models](https://huggingface.co/smhfacct/Minimax-H3-fl2va-ref2va-hybrid-models/tree/main)
  - Several versions are available, differing in how heavily they lean toward Ref2VA
  - Try `b20-49` or `b25-49`.

---

## Video Editing

Model: `ref2va`

Another major use of `ref2va` is instruction-based video editing.

It is the video equivalent of image-editing models such as FLUX.2 [klein] and Nano Banana.

![](/media/basic-workflows/minimax-h3/minimax_h3_video_editing.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_video-editing.json)

The workflow is basically the same as Reference Generation.

Provide a video as a reference, then write a prompt instructing the model to do something such as “remove the person” or “change the visual style.”

**Output example**

![Ref image](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_ref.png){media=image} ![input video](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_input.mp4){media=loop} ![output](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_output.mp4){media=loop}

---

## Spatial Inpainting

Model: `either model`

H3 can also perform traditional(?) mask-based inpainting, regenerating only the masked area.

However, you can usually accomplish the same thing through Video Editing by simply asking it to “change X into Y,” so there may not be many reasons to use this method.

![](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_spatial-inpainting.json)

For this example, we use the `ref2va` model to replace the dog in the video with the stuffed toy from the reference image.

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_segmentation.png", width=40, align="left" %}
**Segmentation**

Use SAM 3.1 to mask the dog, then expand the mask slightly to leave some margin.

- [SAM 3.1](/en/data-utilities/sam3/) is covered on a separate page.

{% endmediaRow %}

**Output example**

![input](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_input.mp4){media=loop} ![mask](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_mask.mp4){media=loop} ![output](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_output.mp4){media=loop}

---

## Hires.fix

Until now, the workflows have generated directly at 1.0 MP. The quality is good, but each attempt takes quite a long time.

Another option is to generate the first stage at 0.25 MP, then upscale promising results by 2x and finish them. This is the familiar [Hires.fix](/en/basic-workflows/sd15-hires-fix/) approach.

> Even with the same prompt, what the model can express differs between 0.25 MP and 1.0 MP.
>
> If you have the time, generating directly at the recommended 1.0 MP is still the better choice.

### Required Custom Node and Model

- [xmarre/Comfyui_Minimax_h3_latent_Upscaler-Plus](https://github.com/xmarre/Comfyui_Minimax_h3_latent_Upscaler-Plus)
  - The upstream repository is not listed in ComfyUI Manager, so we will use this version, which can be installed through Manager
- latent_upscale_models
  - [minimax_h3_latent_upscaler_3d_bf16.safetensors](https://huggingface.co/LBH-123-AI/Minimax_h3_latent_Upscaler/blob/main/minimax_h3_latent_upscaler_3d_bf16.safetensors) (691 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂latent_upscale_models/
        └── minimax_h3_latent_upscaler_3d_bf16.safetensors
```

### text2video / T2VA

![](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_Hiresfix_t2va.json)

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_first_stage_resolution.png", width=40, align="left" %}
**First-stage resolution**

Enter half the desired final width and height in the first `Empty Latent`.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_latent_upscale.png", width=40, align="left" %}
**Upscaling the latent**

Upscale the **latent itself** to twice the width and height without decoding it into pixel images.

Simply enlarging the latent causes severe degradation, so this requires a dedicated model.

H3 also stores the video and audio latents together. Since only the video needs to be upscaled, first separate them, then combine them again after upscaling.

{% endmediaRow %}


**Output example**

![0.25 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_output_0_25mp.mp4){media=loop} ![1.0 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_output_1_0mp.mp4){media=loop}

### image2video / I2VA

![](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/MiniMax_H3_Hiresfix_i2va.json)

I2VA and Ref2VA also take the resolution as part of their Conditioning.

The first stage must be set to 0.25 MP, while the second must be set to 1.0 MP with twice the width and height, which makes the workflow a little complicated....

**Output example**

![0.25 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va_output_0_25mp.mp4){media=loop} ![1.0 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va_output_1_0mp.mp4){media=loop}

## References

- [MiniMax H3](https://github.com/MiniMax-AI/MiniMax-H3)
- [ComfyUI MiniMax H3 Video Generation Guide](https://docs.comfy.org/tutorials/video/minimax/minimax-h3)
