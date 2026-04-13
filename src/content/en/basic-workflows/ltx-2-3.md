---
layout: page.njk
lang: en
section: basic-workflows
slug: ltx-2-3
navId: ltx-2-3
title: "LTX 2.3"
summary: "Handle text2video, image2video, audio2video, and audio-image2video with LTX 2.3"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f3f8635fb9056670204fe9bdac577b39.mp4"
tags: []
---

## What is LTX 2.3?

`LTX 2.3` is an improved version of Lightricks' video generation model `LTX-2`.

The basic ideas and node structure are the same as [LTX-2](/en/basic-workflows/ltx-2/).  
So on this page, we only look at **what changed from LTX-2**.

---

## Recommended Settings

- Resolution
  - Final output around 1.5M pixels
  - *Must be a multiple of 32*
- FPS
  - 24 / 25 / 48 / 50
- Frames
  - 65 / 97 / 121 / 161 / 257
  - *Must be 8n + 1*

---

## Model Download

- checkpoints
  - [ltx-2.3-22b-dev-fp8.safetensors](https://huggingface.co/Lightricks/LTX-2.3-fp8/blob/main/ltx-2.3-22b-dev-fp8.safetensors) (29.1 GB)
- latent_upscale_models
  - [ltx-2.3-spatial-upscaler-x2-1.1.safetensors](https://huggingface.co/Lightricks/LTX-2.3/blob/main/ltx-2.3-spatial-upscaler-x2-1.1.safetensors) (996 MB)
- loras
  - [ltx-2.3-22b-distilled-lora-384.safetensors](https://huggingface.co/Lightricks/LTX-2.3/blob/main/ltx-2.3-22b-distilled-lora-384.safetensors) (7.61 GB)
- text_encoders
  - [gemma_3_12B_it_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it_fp8_scaled.safetensors) (13.2 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── ltx-2.3-22b-dev-fp8.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2.3-spatial-upscaler-x2-1.1.safetensors
    ├── 📂loras/
    │   └── ltx-2.3-22b-distilled-lora-384.safetensors
    └── 📂text_encoders/
        └── gemma_3_12B_it_fp8_scaled.safetensors
```

---

## Basic Process Flow

![](https://gyazo.com/7ace8e776133d570e2d42b1a27435189){gyazo=image}

The architecture is the same as [LTX-2](/en/basic-workflows/ltx-2/), so the workflow itself can be reused.  
However, the results are not very good if you use it as-is.

So on this page, we use the community-discovered **[3-stage workflow](https://www.reddit.com/r/StableDiffusion/comments/1rn3fjv/for_ltx2_use_triple_stage_sampling/)**.

Originally, LTX-2 used a 2-stage process: generate once at low resolution, then Hires.fix it to 1.5MP.  
In 2.3, you add one more stage: generate at a very small resolution, do 2x Hires.fix, then do another 2x Hires.fix.

This is not the officially recommended method, but the results are clearly better, so this is what we use here.

> Everything here uses `distilled-lora` with 8-step generation.

---

## About prompts

Just like LTX-2, prompt quality directly affects video quality.  
It is a good idea to use the [official prompt guide](https://x.com/ltx_model/status/2029927683539325332) as a reference and write prompts that are both specific and information-rich.

It can also help to let an LLM assist with prompt writing. Give it the reference link and a rough description of what you want, and have it clean the prompt up for you.

> ComfyUI has a core [TextGenerate node](/en/basic-workflows/llm-mllm/#textgenerate-node) that can run an LLM directly.  
> Many LTX-2 workflows use it to refine prompts, but it is still just a node for editing prompts, so the workflows on this page do not use it.  
> Personally, I think it is easier to make prompts separately with ChatGPT or Gemini.

---

## text2video

![](https://gyazo.com/7477c07351d62edda93ae50270bbbaf5){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_text2video_distilled_3stage.json)

{% mediaRow img="https://gyazo.com/6e9e9474d28ef76af5053fb0be5e6290 {gyazo=image}", width=40, align="left" %}

**Set video resolution, length, and FPS**

This is where you decide the parameters for the video and audio you want to generate.

- Enter resolution, frame count, and FPS in `EmptyLTXVLatentVideo` / `LTXV Empty Latent Audio`
- 🚨This is the part that differs from LTX-2
  - Since it upscales by 2x twice, meaning 4x in width and height overall, set a value around 0.1MP with that in mind

{% endmediaRow %}

**Output example**

![](https://gyazo.com/2cd2d6eb51760a4928ba476bf2c0878b){gyazo=loop}

---

## image2video

![](https://gyazo.com/0bb56ddc29aa5c644460f5eb6a2c7443){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_image2video_distilled_3stage.json)

**Output example**

![Input](https://gyazo.com/bf4c40372ce923fb53f2867c33c27bc6){gyazo=image} ![Output](https://gyazo.com/cb1a91ed174f29d4441ae1332590f3a0){gyazo=loop}

---

## audio2video

![](https://gyazo.com/0d62ef375ff30b08ea96c40b5105c94c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_audio2video_distilled_3stage.json)

**Output example**

![](https://gyazo.com/4e0ce0ea62fc7138ffe7ea1892ec21b8){gyazo=player}

---

## audio-image2video

![](https://gyazo.com/443cbbeacab7a63e85641c0b209ab5da){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_audio-image2video_distilled_3stage.json)

**Output example**

![](https://gyazo.com/dc3fb2e0b92432ca2651ca121aea7205){gyazo=image} ![](https://gyazo.com/69ebdac3cc6a3badd9452f0cbb345167){gyazo=player}

---

## Generative Interpolation

It is also called FLF2V or FMLF2V, but in practice it means inserting images into intermediate frames and generating a video while using them as guideposts.

![](https://gyazo.com/f0cdfd8e0d5f0106e0d6fc98fdcb9aee){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_generative-Interpolation_distilled_1stage.json)

It may look like an extension of `image2video`, but the mechanism is different.  
In `image2video`, the first frame itself is replaced with the reference image, and the remaining frames are generated afterward.  
Here, the reference images are placed beside intermediate frames as guides during generation.

{% mediaRow img="https://gyazo.com/e115e860b7b68f36f27937d9e630501d {gyazo=image}", width=40, align="left" %}

**1. Resize the images**

Resize the reference images to an appropriate size (around 1.5 MP).
- Every image after the first one also needs to be resized to the same dimensions.
- The `match size` mode in the `Resize Image/Mask` node makes this easy.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9cd44b6e0a04e7a63cb0f8de0ed01475 {gyazo=image}", width=40, align="left" %}

**2. LTXVAddGuide**

Insert the reference images here as guides.

- In `frame_idx`, specify the frame position and the image you want to insert.
  - `0`: first frame
  - `-1`: last frame
- This workflow uses 3 reference frames, but you can chain more of them in series if needed
  - With only 1 image, it can behave a lot like `image2video`, and if you only place images at the first and last frames, it becomes FLF2V.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/13c859c89782a23e4d001be63cde0057 {gyazo=image}", width=40, align="left" %}

**3. LTXVCropGuides**

With LTX-2's guide mechanism, the guide images will remain mixed into the generated video if you output it as-is.  
So you remove those guide areas with the `LTXVCropGuides` node.

For more detail on the behavior, see this page.
- [LTX-2 IC-LoRA (Pose)](/en/basic-workflows/ltx-2/#ic-lora-pose)

{% endmediaRow %}

**Output example**

![Input](https://gyazo.com/513a407f54159c8e3cae9a32fe888702){gyazo=loop} ![Output](https://gyazo.com/fad61f020fb0ed54bd23c59782bff81d){gyazo=loop}

---

## IC-LoRA

`LTX-2.3` can also use IC-LoRA-based extensions, just like `LTX-2`.  
There are several variations, but here we only introduce two easy-to-understand ones.

- Union
  - Generate video using pose, depth maps, or edges as conditions
- Outpaint
  - Naturally fill the black areas of an input video

### Model Download

- [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) (654 MB)
- [ltx-2.3-22b-ic-lora-outpaint.safetensors](https://huggingface.co/oumoumad/LTX-2.3-22b-IC-LoRA-Outpaint/blob/main/ltx-2.3-22b-ic-lora-outpaint.safetensors) (1.31 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
        └── ltx-2.3-22b-ic-lora-outpaint.safetensors
```

### IC-LoRA Union (Pose)

![](https://gyazo.com/9432f1cad25a54328ed912bc85af4a2d){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_IC-LoRA(Pose)_distilled_2stage.json)

- 🚨For IC-LoRA, use a **2-stage workflow instead of 3-stage**
- IC-LoRA Union uses a slightly unusual method where the control video is set to half the resolution of the generated video
  - So if you use 3 stages, the control image resolution becomes even smaller and drops to around 100px
  - At that size, it becomes hard to preserve enough information for a proper control image
  - That is why IC-LoRA is more stable when you stop at 2 stages

**Output example**

![Input](https://gyazo.com/9aea1871cc24b0c98931d55bebb1c19c){gyazo=loop} ![Output](https://gyazo.com/25f44e7a08247ae96a2ebcc3cb901d56){gyazo=loop}

### IC-LoRA Outpaint

![](https://gyazo.com/b43880620c819f250e61f6df0e494a7c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_IC-LoRA-Outpaint_distilled_1stage.json)

This workflow naturally fills the black areas of an input video.  
To preserve the original video as much as possible, it uses a 1-stage workflow instead of a 3-stage workflow that gradually scales up from low resolution.

{% mediaRow img="https://gyazo.com/80624e8617d2df1c92f929249c681752 {gyazo=image}", width=40, align="left" %}
**Load the LoRA model**

Load the `IC-LoRA-Outpaint` LoRA here.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/404ebbcfd601d31b927e97573327e398 {gyazo=image}", width=40, align="left" %}
**Add black padding**

Add the area you want to expand by padding it with black.  
You do not need a special mask here, as long as the added area is black.
- I have not tested it yet, but it may also work for something like inpainting

{% endmediaRow %}

**Output example**

![Input](https://gyazo.com/676f9b4dfb10ea6bc80b25b46d3b63ef){gyazo=loop} ![Output](https://gyazo.com/2776655edfe4896da1697755084b5e57){gyazo=loop}

---

## ID-LoRA

Generate a talking-head video of a person speaking in a scene, using one reference image, a short reference audio clip, and a text prompt.

Unlike feeding cloned audio into `audio-image2video` afterward, ID-LoRA generates the audio and video at the same time.  
Because of that, the mouth movement and overall voice feel tend to come out more naturally as one piece.

### Model Download

- [LTX-2.3-ID-LoRA-CelebVHQ-3K.safetensors](https://huggingface.co/AviadDahan/LTX-2.3-ID-LoRA-CelebVHQ-3K/blob/main/lora_weights.safetensors) (1.16 GB)
- [LTX-2.3-ID-LoRA-TalkVid-3K.safetensors](https://huggingface.co/AviadDahan/LTX-2.3-ID-LoRA-TalkVid-3K/blob/main/lora_weights.safetensors) (1.16 GB)
> Both distributed files are named `lora_weights.safetensors`.  
> To keep them easy to tell apart, it is helpful to rename them to `LTX-2.3-ID-LoRA-CelebVHQ-3K.safetensors` and `LTX-2.3-ID-LoRA-TalkVid-3K.safetensors`.

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── LTX-2.3-ID-LoRA-CelebVHQ-3K.safetensors
        └── LTX-2.3-ID-LoRA-TalkVid-3K.safetensors
```

### workflow

![](https://gyazo.com/cd8a2899358fbac24b90eebe9b10a823){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_ID-LoRA_distilled_3stage.json)

The overall base is [image2video](#image2video).  
On top of that, you add the ID-LoRA LoRA and the reference-audio condition.

{% mediaRow img="https://gyazo.com/cb84a0967e26e916925aaa4cfeb6d782 {gyazo=image}", width=40, align="left" %}

**ID-LoRA model**

Load the ID-LoRA model.

- LTX-2.3-ID-LoRA-CelebVHQ-3K
- LTX-2.3-ID-LoRA-TalkVid-3K

There are two versions, but the method is the same and only the dataset differs.  
There is not a huge difference between them, but it is worth trying both to see which one works better for you.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/3a653c109b828ad561e428c09b8eb91f {gyazo=image}", width=40, align="left" %}

**LTXV Reference Audio (ID-LoRA)**

Connect ID-LoRA and the reference audio.

- Use a reference audio clip trimmed to around 5 seconds
- It is only used as a reference, so it does not determine the final video length

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/c987355bbbd29dfdc866dee769937957 {gyazo=image}", width=40, align="left" %}

**Prompt**

The prompt format is fixed, so write it in this structure.
- cf. [ID-LoRA/📝 Prompt Format](https://github.com/ID-LoRA/ID-LoRA/tree/main?tab=readme-ov-file#-prompt-format)

```text
[VISUAL]: Scene description and the character's appearance
[SPEECH]: The line the character speaks
[SOUNDS]: Speaking style + ambient / surrounding sounds
```

- To avoid ending up with audio that feels like narration laid over the video, it helps to state in `[VISUAL]` that the character is actually speaking

{% endmediaRow %}

**Output example**

![input](https://gyazo.com/7d7fa9dc9a9f4fa1a08e25aff1285fd7){gyazo=image} ![ref_audio](https://gyazo.com/921d5546567ae28fc9616803f0dcccb9){gyazo=player}  ![output](https://gyazo.com/f179f159e0f3cf6fb05cf259b2828425){gyazo=player}
