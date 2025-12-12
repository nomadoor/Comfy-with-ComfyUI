---
layout: page.njk
lang: en
section: basic-workflows
slug: wan-2-1-vace
navId: wan-2-1-vace
title: "Wan 2.1 VACE"
summary: "Handle ControlNet-like control, in/outpainting, reference2video, and Extension with Wan 2.1 VACE"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: []
---

## What is Wan 2.1 VACE?

**Wan 2.1 VACE** is an editing model for Wan 2.1 video generation.

It has features that summarize ControlNet for video, inpainting / outpainting / reference2video into a single node (`WanVaceToVideo`).

- Control "movement only" with pose or depth map for existing videos
- Swap characters or adapt styles based on reference images
- Inpaint / outpaint only specific areas
- Generate video continuation (Extension), loop, or create in-between frames

You can handle these things while maintaining the generation quality of Wan 2.1.

---

## Recommended Settings

- Recommended Resolution
  - Around 720p, and **multiple of 16**
- Maximum Frames
  - 81 frames

---

## Model Download

For Wan 2.1 VACE, use a VACE-dedicated diffusion model separate from the normal T2V model.
Here we only handle 14B.

- diffusion_models
  - [wan2.1_vace_14B_fp16.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_vace_14B_fp16.safetensors)
- text encoder
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf (Optional)
  - [Wan2.1-VACE-14B-GGUF](https://huggingface.co/QuantStack/Wan2.1-VACE-14B-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── wan2.1_vace_14B_fp16.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   └── Wan2.1_14B_VACE-XXXX.gguf   ← Only when using gguf
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

---

## Basic Structure

In any pattern, the basic form is adding the `WanVaceToVideo` node based on [Wan 2.1 text2video](/en/basic-workflows/wan-2-1/#quality-improvement-techniques).

![](https://gyazo.com/15272b819b453d21ec3707c059831edc){gyazo=image}

- `control_video`
  - "Guide video" such as pose, depth map, scribble, optical_flow, layout, etc.
- `control_masks`
  - Mask for inpainting
- `reference_image`
  - Reference image you want to transfer character or style

---

## ControlNet-like Usage

Control video movement using pose or depth map.

![](https://gyazo.com/ef1dae4f7c1fe82cb201e33558c6ca39){gyazo=image}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_control_pose.json)

- Input pose (OpenPose, etc.) or depth map into `control_video`.
- Can be used for purposes such as "borrowing only the pose from another video while maintaining the camera work of the original video".

---

## reference2video

Transfer the character or style of the reference image to the video.

![](https://gyazo.com/026bb65307ee96b243ccc2625e6d35a5){gyazo=image}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_reference.json)

- Input character image or illustration into `reference_image`.
- It is easier to stabilize if you use an image with the background cut out and filled with white.
- Since the reference image may remain as is in the beginning of the generated video, it is easier to handle if you cut the initial frames with `TrimVideoLatent`.
- Resizing the reference image to match the output resolution also prevents breakdown.

---

## Spatial Inpainting

Replace only a part of the video.

![](https://gyazo.com/516fed114e2f9cd247eed1d9a3c82770){gyazo=image}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_inpainting.json)

- Use a **video filled with gray (RGB 127,127,127) in the masked part** for `control_video`.
- Use the original video as is for the untouched area, and replace only the part filled with gray.

---

## Spatial Outpainting

Add margins to the top, bottom, left, and right of the video and fill those parts.

![](https://gyazo.com/b3775e8e75ff61ae0d87dcd3b43028d1){gyazo=image}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_outpainting.json)

- Add padding with `ImagePad KJ` node etc., and extract the increased part as a mask.
- Input the padded image and mask as `control_video` / `mask`.
- Adjust resolution to be a **multiple of 16**.

---

## Temporal Outpainting (Extension)

Extend the "time direction" of the video.
The mechanism uses only the first N frames of the input video and generates the continuation.

![](https://gyazo.com/ee3739958e95c68676cd003cf7753ce1){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_Extension.json)

- Make the section you want to generate continuation (e.g., from 11th frame onwards) a full mask with `Create Fade Mask Advanced` etc.
- If you leave unused frames as is in `control_video`, they will become unnecessary guides, so the trick is to fill the parts you want to generate with mask or gray.

---

## Looping Video

Apply Extension to make an existing video loop.

![](https://gyazo.com/d2b6874f4fea944fd8ddf8fd0d4ed5b9){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_Extension_loop.json)

- Use the beginning and end of the original video, and loop by generating frames connecting them with Extension.

---

## In-between Frame Generation

Generate only intermediate frames of the video by applying Extension.

![](https://gyazo.com/9cb508fbbc705b2719e6c66a813bf17e){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1-vace/Wan2.1_VACE_4images.json)

- Arrange still images serving as keyframes, and specify the interval between them as Extension section (full mask).
- Unlike FLF2V, since prompts and `control_video` can be used together, more detailed guidance is possible.
