---
layout: page.njk
lang: en
section: basic-workflows
slug: scail-2
navId: scail-2
title: "SCAIL-2"
created: 2026-06-11
updated: 2026-06-11
summary: "Transfer video motion to the person in a reference image with SCAIL-2"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["human-motion-transfer","video-generation"]
---

## What is SCAIL-2?

[SCAIL-2](https://teal024.github.io/SCAIL-2/) is a Wan2.1-based model specialized for motion transfer to people and characters.

The major difference from [Wan-Animate](/en/basic-workflows/wan-animate/) and the previous SCAIL-1 is that it does **not** convert the input into an intermediate representation such as a stick figure.

The usual idea has been to make a stick figure with ViTPose or OpenPose, then use that as the condition for moving the person. But once you convert the video into a stick figure, a lot of information is lost.

Depth, contact, intertwined multi-person motion, non-human character motion, and so on...

So SCAIL-2 passes the reference image and motion video almost directly to the DiT.

Rather than humans building a complicated processing pipeline by hand, it is often more flexible to prepare the right dataset and let the AI understand the task. That way of thinking will probably become more common from here.

---

## Model Download

- checkpoints
  - [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors)
- clip_vision
  - [clip_vision_h.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/clip_vision/clip_vision_h.safetensors)
- diffusion_models
  - [wan2.1_14B_SCAIL_2_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/SCAIL-2/blob/main/diffusion_models/wan2.1_14B_SCAIL_2_fp8_scaled.safetensors)
- loras
  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)
- text_encoders
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── sam3.1_multiplex_fp16.safetensors
    ├── 📂clip_vision/
    │   └── clip_vision_h.safetensors
    ├── 📂diffusion_models/
    │   └── wan2.1_14B_SCAIL_2_fp8_scaled.safetensors
    ├── 📂loras/
    │   └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

---

## Animation Mode

Move a **reference image** using a motion video.

![](https://gyazo.com/3f28188680b010f2bce1a13858ccaf9f){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation.json)

The base workflow is similar to [Wan-Animate](/en/basic-workflows/wan-animate/), but this one is much simpler, so let's look through it.

{% mediaRow img="https://gyazo.com/0846209526768f5c450c700d1a153dad {gyazo=image}", width=33, align="left" %}
**Reference Image / Motion Video**

The reference image and motion video are resized internally, so they do not need to be the same size.

- Similar aspect ratios are easier to handle.
- The pose in the image and the pose in the video do not need to match perfectly.
- However, if they are too different, generation will fail.
- It is usually safer to choose a reference image close to the first frame of the motion video.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ce84cc6fe405261d50b5a6a3cfd8bf91 {gyazo=image}", width=33, align="left" %}
**Prompt**

Since this is just motion transfer, you do not need a detailed prompt.

- However, if the prompt is too short, generation can fail more easily, especially in [Replacement Mode](#replacement-mode).
- For this example, write enough to describe the intended video, such as `a man in a shirt is standing with one hand on his waist and touching his hair`.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a632cf95fdb6fb5997e6fff4b71218fb {gyazo=image}", width=33, align="left" %}
**Resolution / Frame Count**

Set the generation size and frame count in `WanSCAILToVideo`.

- Recommended resolution is 480p (864×480) to roughly 720p (1280×704), and a multiple of 32
- Maximum frame count is 81
- In this workflow, the reference image is resized and that size is used as the generation resolution.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/74c8fc85eb5026b42cbb8f5d6255ba9b {gyazo=image}", width=33, align="left" %}
**Mask Generation with SAM3.1**

Mask the people in the reference image and motion video with [SAM 3 / 3.1](/en/data-utilities/sam3/).

- This is not a strict inpainting mask. It is just a helper that tells SCAIL-2 which people correspond to each other, so a little misalignment is fine.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/608eb36831300427187be280cf45c420 {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

The generated masks are colored appropriately.

- This becomes a little more important when there are multiple people. More on that later.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/25a3907c1246d3513e3bb109997579ab {gyazo=image}", width=33, align="left" %}
**6-Step Generation**

SCAIL-2 can also use the Lightx2v LoRA for [fast Wan2.1 generation](/en/basic-workflows/wan-2-1/#self-forcing-fast-generation).

- `cfg` is 1.0
- `steps` is 6

{% endmediaRow %}

**Output Example**

![reference image](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![motion video](https://gyazo.com/f14aef04ac197a4b92680e05c4fbd178){gyazo=loop} ![output](https://gyazo.com/d87b2644f8f71218ebe678736479959e){gyazo=loop}

---

## Replacement Mode

Replace the **person in the video** with the **person in the reference image**.

![](https://gyazo.com/6ade374ea0cbcb2175889cdc0be0bc46){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Replacement.json)

Basically, just set `replacement_mode` to `true` in `Create SCAIL-2 Colored Mask` and `WanSCAILToVideo`.

{% mediaRow img="https://gyazo.com/5862792bc1510147b0cc73b260624a11 {gyazo=image}", width=33, align="left" %}
**Resolution**

Replacement uses the video size as the base.

- In this workflow, it resizes the first frame of the video, reads that size, and sets it as the output size.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/cfdb30273c14347f30aad0d2c9987f8c {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask and WanSCAILToVideo**

Set `replacement_mode` to `true`.

- By the way, the output of `Create SCAIL-2 Colored Mask` only makes the pose_video background white.

{% endmediaRow %}

**Output Example**

![motion video](https://gyazo.com/395fd549274fb126d836ac0a9414d07d){gyazo=loop} ![reference image](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![output](https://gyazo.com/1a7caa57ded15aee5700bed072a4a0a7){gyazo=loop}

---

## Animation Mode (Multiple People)

SCAIL-2 also supports videos and images with multiple people.

No special operation is required. As before, just input the video and reference image.

![](https://gyazo.com/a04e322f84ca4377479a7760a60436cd){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation_multi-char.json)

{% mediaRow img="https://gyazo.com/86e8ccd07a045bb039e2e69b81b2781b {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

When there are multiple people, it becomes important to control which person should follow which motion. SCAIL-2 uses colored masks for this.

- When SAM3.1 segments multiple targets, `Create SCAIL-2 Colored Mask` paints them in different colors in order.
- Basically, matching colors are linked together, so use options such as `sort_by` to align the colors.

> However, as in the output example below, the color correspondence and the motion may not always match. This is only a light condition, and the model may simply choose the closer composition.

{% endmediaRow %}

**Output Example**

![reference image](https://gyazo.com/567acaf722ca9e839ec7cb834c1ed344){gyazo=image} ![motion video](https://gyazo.com/53461ca17746349fbd11e69798460ea6){gyazo=loop} ![output](https://gyazo.com/913ff446dd39fa33f56ba9ed07ce6e16){gyazo=loop}

---

## Animation Mode (Over 81 Frames)

SCAIL-2 basically generates up to 81 frames, but with `WAN Context Windows (Manual)`, you can generate longer videos by splitting along the time direction.

![](https://gyazo.com/43b5c2e2684957795ab7d80f8ce9976a){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation_WAN-Context-Windows.json)

{% mediaRow img="https://gyazo.com/55aa8d3ccee17c3a43f87f17895ebfb1 {gyazo=image}", width=33, align="left" %}
**WAN Context Windows (Manual)**

It is like tiling along the time axis, or context sliding.

- Set `context_length` to 81, and it generates internally in chunks of 81 frames.
- If you leave it as-is, the seams will be obvious, so set an appropriate number of frames in `context_overlap` as overlap.

{% endmediaRow %}

**Output Example**

![reference image](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![motion video](https://gyazo.com/5491ba090036cbac5d76abd293d842ef){gyazo=loop} ![output](https://gyazo.com/ae5729a3c9c70711f767364534ccedf9){gyazo=loop}
