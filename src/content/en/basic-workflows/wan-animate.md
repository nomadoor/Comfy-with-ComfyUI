---
layout: page.njk
lang: en
section: basic-workflows
slug: wan-animate
navId: wan-animate
title: "Wan-Animate"
created: 2025-12-12
updated: 2026-03-02
summary: "Transfer motion to people and characters with Wan-Animate"
seoTitle: "Wan-Animate in ComfyUI: Motion Transfer to Characters"
seoDescription: "Animate a person in an image with a video's motion using Wan-Animate: Animation and Replacement modes, 6-step Lightx2v LoRA, and long videos."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["human-motion-transfer","talking-head"]
---

## What is Wan-Animate?

[Wan-Animate](https://humanaigc.github.io/wan-animate/) is a **Wan 2.1-14B-I2V based** model specialized for motion transfer to humans and characters.

> ![](/media/basic-workflows/wan-animate/legacy_gyazo_20a7f10f302751293cda0e0ed353d25a.png){media=image}

- **Animation Mode**: Animates the input image to follow the movement of the person in the reference video.
- **Replacement Mode**: Replaces the person in the input video with the person in the reference image.

There are these two generation modes. I think it's easiest to think of Replacement Mode as Animation Mode plus "some extra processing to blend into the background".

Because it's based on Wan 2.1, it can only generate up to 77 frames. But just like Extension in [Wan 2.1 VACE](/en/basic-workflows/wan-2-1-vace/), you can repeatedly take the last few frames and generate what comes next, which effectively lets you handle long videos.

---

## Required Custom Nodes

Face detection and pose estimation are done as preprocessing. These custom nodes make that much easier.

- [ComfyUI-WanAnimatePreprocess](https://github.com/kijai/ComfyUI-WanAnimatePreprocess)
  - Face detection by YOLO
  - Pose (stick figure) extraction by ViTPose
- [ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)
  - Person mask generation using SAM2 (Used in Replacement Mode)

---

## Model Download

Get the Wan-Animate model itself plus the models shared across the Wan 2.1 family.

- diffusion_models
  - [Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors](https://huggingface.co/Kijai/WanVideo_comfy_fp8_scaled/blob/main/Wan22Animate/Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors)
- loras
  - [WanAnimate_relight_lora_fp16.safetensors](https://huggingface.co/Kijai/WanVideo_comfy/blob/main/LoRAs/Wan22_relight/WanAnimate_relight_lora_fp16.safetensors)
- clip_vision
  - [clip_vision_h.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/clip_vision/clip_vision_h.safetensors)
- text_encoders
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf (Optional)
  - [Wan2.2-Animate-14B-GGUF](https://huggingface.co/QuantStack/Wan2.2-Animate-14B-GGUF/tree/main)

Placement example:

```text
📂ComfyUI/
└── 📂models/
    ├── 📂clip_vision/
    │   └── clip_vision_h.safetensors
    ├── 📂diffusion_models/
    │   └── Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors
    ├── 📂loras/
    │   └── WanAnimate_relight_lora_fp16.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   └── Wan2.2-Animate-14B-XXXX.gguf      ← Only when using gguf
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

---

## Animation Mode

This mode moves the input still image according to the movement of the person in the reference video.

It's pretty huge, which can make you nervous, but underneath it's exactly the same shape as [Wan 2.1 image2video](/en/basic-workflows/wan-2-1/#image2video). Don't be scared off; let's keep going.

![](/media/basic-workflows/wan-animate/legacy_gyazo_d25335c059e8117f9e617de4ffffefca.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_animation.json)

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_77b9c908b9e96505678ccaa0bde8055b.png {media=image}", width=33, align="left" %}

**1. Load Wan-Animate Model**

- Load `Wan2_2-Animate` with `Load Diffusion Model`.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_1516ab2c0949d0df3261a26e46815d08.png{media=image}", width=33, align="left" %}

**2. Decide Generation Resolution**

- Adjust the total number of pixels with `Scale Image to Total Pixels` according to the input image.
- Change the value according to your PC specs.
- Finally, crop the resolution to a **multiple of 16**.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_c76608836777ce6a604372c2d9cc9c43.png{media=image}", width=33, align="left" %}

**3. Feed extra inputs into the WanAnimateToVideo node**

- `reference_image`
  The still image you want to animate.
- `face_video`
  A video of the face cropped out of the reference video.
  `Pose and Face Detection` automatically runs YOLO face detection -> cropping.
- `pose_video`
  A stick-figure (keypoint) video made from the reference video with ViTPose.
  The driving video and the image you want to animate differ in body proportions and position, so a retarget step adjusts for that.

{% endmediaRow %}

{% outputs %}
![reference_image](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_9f0e0e20d750b2e207b01adc56858202.png){media=image} ![pose_video(before processing)](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_d7f66b4153473136c37e48c7066709a1.mp4){media=loop} ![output](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_86ed4c6aa64af79325ce18359a4021bc.mp4){media=loop}
{% endoutputs %}

---

## Replacement Mode

This mode replaces the person in the input video with the person in the reference image.

It's Animation Mode plus a mask for inpainting the person and a relighting step to blend them into the background.

![](/media/basic-workflows/wan-animate/legacy_gyazo_ab3d36d1e2ddfd5d7e452778dbab411c.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_replacement.json)

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_a26743871782e80338ed0d920ef6b786.png{media=image}", width=33, align="left" %}

**1. Add Relight LoRA**

- Add a relight LoRA to blend the swapped-in person into the background.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_bc59ff33c803effd0e772879857e8a3a.png{media=image}", width=33, align="left" %}

**2. Padding of Reference Image**

- This time the video is the base, so pad the reference image to match the video's resolution.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_a6c53693b87e1cebda390d6b7dca306a.png{media=image}", width=33, align="left" %}

**3. Person Mask Generation**

- Pass the person coordinates acquired by `Pose and Face Detection` to SAM2.1 to generate a mask.
- Expand the mask a little, then turn it into a blocky, pixel-art-like mask with the `Blockify` node and use that as `character_mask`.
  If you don't do this, for some reason a thin edge remains on the outline of the generated video.
- Fill the masked area with black using `ImageCompositeMasked`, and use that video as `background_video`.

{% endmediaRow %}

{% outputs %}
![background-pose_video](/media/basic-workflows/wan-animate/legacy_gyazo_f14909bbf4415e5477b67870379c6719.mp4){media=loop} ![reference_image](/media/basic-workflows/wan-animate/legacy_gyazo_59dda8074526ca42245b1220bbb4420f.png){media=image} ![output](/media/basic-workflows/wan-animate/legacy_gyazo_280c5916091919526db60ea0625d441a.mp4){media=loop}
{% endoutputs %}

---

## 6-Step Inference (Lightx2v LoRA)

With a distilled LoRA, you can cut sampling down to 4-6 steps.

With text2video the quality loss bothered me, but Wan-Animate isn't making a video from scratch, so it's barely noticeable. This one is worth using whenever you can.

### Model Download

- loras

  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
```

### Animation Mode (Fast Version)

![](/media/basic-workflows/wan-animate/legacy_gyazo_c8ff6a05cd057198146cd2cffb16d733.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_animation_lightx2v.json)

{% mediaRow img="/media/basic-workflows/wan-animate/legacy_gyazo_3808ae94efd870f0ff0ce1d77595ea36.png{media=image}", width=33, align="left" %}

**Apply LoRA**

- 🟪 Load the Lightx2v LoRA with `LoraLoaderModelOnly`.
- KSampler Settings

  - `steps` ... 4-6
  - `cfg` ... 1.0

{% endmediaRow %}

{% outputs %}
![20steps](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_86ed4c6aa64af79325ce18359a4021bc.mp4){media=loop} ![6steps](/media/basic-workflows/wan-animate/legacy_gyazo_67326f2a1a4d803ab4c6a40799aef8a7.mp4){media=loop}
{% endoutputs %}

### Replacement Mode (Fast Version)

![](/media/basic-workflows/wan-animate/legacy_gyazo_6e70b69630dea6bcf813917d8eb2c18a.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_replacement_lightx2v.json)

---

## Repeating Process for Long Videos

Like Wan 2.1 I2V, which it's based on, Wan-Animate can generate **at most 77 frames in one run**.
To make anything longer, set it up to "generate over and over, carrying over the last few frames each time".

ComfyUI can't do loops, so you end up chaining nearly identical copies of the workflow one after another.

Honestly, this isn't an elegant setup, and it's one place where Kijai's implementation in [ComfyUI-WanVideoWrapper](https://github.com/kijai/ComfyUI-WanVideoWrapper) does better.

### Animation Mode (Repeat)

![](/media/basic-workflows/wan-animate/legacy_gyazo_a489fad9b07fb1f1745d556fa130c731.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_animation_lightx2v_repeat.json)

At first glance it looks like a massive workflow, but there are only two differences from the earlier ones.

![](/media/basic-workflows/wan-animate/legacy_gyazo_5db9830b2a2db2dd24ad1543906f49da.png){media=image}

- `video_frame_offset`

  - If the first run generated 77 frames, the second run needs to use `face_video` and `pose_video` from frame 78 onward.
  - Put the number of offset frames in `video_frame_offset`, and it automatically shifts where `face_video` / `pose_video` start being read.
- `continue_motion_max_frames`

  - Sets how many frames overlap between runs.
  - For example, with `length` at 77 and `continue_motion_max_frames` at 5, it uses the last 5 frames of the previous run and generates the remaining 72 frames fresh.

Keep chaining this group and, in theory, you can make a video as long as you like.
Just like a photocopier, though, small errors build up a little at a time.

### Replacement Mode (Repeat)

![](/media/basic-workflows/wan-animate/legacy_gyazo_5efe20ed9671e3eb4960fd5ddc70cb46.png){media=image}

[](/workflows/basic-workflows/wan-animate/wan2_2_animate_replacement_lightx2v_repeat.json)
