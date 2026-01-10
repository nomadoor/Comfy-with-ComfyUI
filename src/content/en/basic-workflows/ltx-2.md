---
layout: page.njk
lang: en
section: basic-workflows
slug: ltx-2
navId: ltx-2
title: "LTX-2"
summary: "Handle text2video / image2video / audio2video with LTX-2"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2a89cce32669413fb7f5b3fe4ca22960.mp4"
tags: []
---

## What is LTX-2?

**LTX-2** is an audio-visual diffusion model released by Lightricks that can generate both audio and video simultaneously.

---

## Recommended Settings

- Resolution
  - 640×640 (1:1)
  - 768×512 (3:2)
  - 704×512 (4:3)
  - *Upscaled 2x in post-processing, so actual output will be 1280×1280, etc.*
  - *Must be a multiple of 32*
- FPS
  - 24 / 25 / 30
- Frames
  - Max: 257 frames (approx. 10 sec at 25fps)
  - Recommended: 121–161 (balance of quality and memory)
  - *Must be 8n+1*

---

## Model Download

- checkpoints (VAE included)

  - [ltx-2-19b-dev-fp8.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-19b-dev-fp8.safetensors)
- latent_upscale_models

  - [ltx-2-spatial-upscaler-x2-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-spatial-upscaler-x2-1.0.safetensors)
- loras

  - [ltx-2-19b-distilled-lora-384.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-19b-distilled-lora-384.safetensors)
- text_encoders

  - [gemma_3_12B_it.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── ltx-2-19b-dev-fp8.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2-spatial-upscaler-x2-1.0.safetensors
    ├── 📂loras/
    │   └── ltx-2-19b-distilled-lora-384.safetensors
    └── 📂text_encoders/
        └── gemma_3_12B_it.safetensors
```

---

## Basic Process Flow

![](https://gyazo.com/1884b40ee25bafb8476dd4df1256b026){gyazo=image}

It might feel complicated because there are more nodes compared to Wan, but this is all it does:

- 1. text2video + audio
  - First, generate the base video (and audio).
- 2. Hires.fix (2nd stage)
  - Upscale the generated video by 2x and refine it with video2video.
  - You can skip this and decode directly, but Hires.fix is recommended for quality.
- 3. Decode
  - Decode video and audio separately for output.

---

## text2video

![](https://gyazo.com/b6df8e98ae7d7337f2f32a65a10661d3){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_text2video.json)

{% mediaRow img="https://gyazo.com/129febfcdbfc077bf36db4a6aa33fb19 {gyazo=image}", width=50, align="left" %}

**1. Set Video Resolution, Length, FPS**

Decide the parameters for the video and audio you want to generate here.

- Enter resolution, frame count, and FPS in `EmptyLTXVLatentVideo` / `LTXV Empty Latent Audio`.
- Follow the [Recommended Settings](/en/basic-workflows/ltx-2/#recommended-settings).
- 🚨Resolution will be doubled in post-processing.
  - In other words, set the resolution here to **half** the value of the video you want to create.

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/e058d717d9255db19e0bb0c186950e42 {gyazo=image}", width=50, align="left" %}

**2. Prompt**

A characteristic of the LTX series is that you need to be somewhat particular about the prompt, otherwise you won't get a very good video.

- That said, there isn't a strict format like when borrowing the power of LLMs.
- Try describing the video you want to generate as if you were writing a novel.
- cf. [Prompting Guide for LTX-2](https://docs.ltx.video/open-source-model/usage-guides/prompting-guide)

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/1385ab23c63b68656e24650d11f5f5a9 {gyazo=image}", width=50, align="left" %}

**3. Sampling (1st Stage)**

It doesn't look like the familiar `KSampler` so it might seem a bit complicated, but the basics are just "decide steps and CFG and sample".

- In this workflow, the 1st stage is run with 20 steps / CFG 4.0.
- It uses a dedicated scheduler called `LTXVScheduler`.
  - It behaves similarly to `linear_quadratic`, but you don't need to worry about it too much.
- Since LTX-2 handles video and audio simultaneously, combine video latent and audio latent into one with 🟫 `LTXVConcatAVLatent`.

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/353e095a574e974a64cff4593f8bf907 {gyazo=image}", width=50, align="left" %}

**4. Latent Upscale (x2)**

Upscale the resolution of the video latent by 2x.

- Use a dedicated model (`ltx-2-spatial-upscaler-x2`).

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5625337c055851450dd6dc0357891631 {gyazo=image}", width=50, align="left" %}

**5. Sampling (2nd Stage / video2video)**

Refine the upscaled latent with short steps.

- Here we use `distilled-lora` which allows generation in 4~8 steps.
- This workflow runs in 3 steps.
- Because it uses `Manual Sigma`, it's a bit hard to understand, but if thinking in terms of `Simple`, it behaves somewhat close to `denoise = 0.47`.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/801da41aa50410fb70b55eab18a8ab83 {gyazo=image}", width=50, align="left" %}

**6. Decode**

Finally, decode and export video and audio respectively.

- Separate the latent for video / audio and decode with appropriate VAE.
- (Tiled VAE is used because VRAM is tight.)

{% endmediaRow %}



## text2video 8 steps

Above, we used `Distilled LoRA` only for Hires.fix, but let's apply it to the 1st stage as well and generate quickly in 8 steps.

![](https://gyazo.com/aa18f5b7bb97ae164002fdef187f5790){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_text2video_distilled.json)

To apply `distilled-lora`, change some sampling settings.

- CFG : `1.0`
- scheduler : `Simple`
- steps : `8`

### 20 steps / 8 steps Distilled LoRA Comparison

![20 steps](https://gyazo.com/decf4a825d56382d22b6c3a0fe549a64){gyazo=player} ![8 steps (Distilled LoRA)](https://gyazo.com/05affbce361f48b4249a22b639a05e65){gyazo=player}

> As far as I tried, applying distilled LoRA produces more stable generations.
> Therefore, for speed and stability, all subsequent workflows apply distilled lora from the 1st stage.

---

## image2video

![](https://gyazo.com/3ceb9e3b3fdbdf7e2187e709fe8022d7){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_image2video_distilled.json)


The basic idea is "fix the 1st frame with input image and generate the rest".
Since LTX-2 is 2-stage (half resolution -> x2 upscale), handle the input image accordingly.


{% mediaRow img="https://gyazo.com/e30bb042c1ba2960ecdf369bd8263fe5 {gyazo=image}", width=50, align="left" %}

**1. Resize Input Image (Create 2 versions)**

- First, create a full-resolution version matching the final output resolution.
  - Resize to arbitrary size (here 1MP).
  - Width and height must be multiples of 32.
- Next, for the 1st stage (half resolution), create a version with width/height halved from the above image.
  - Input this half-resolution width/height into `EmptyLTXVLatentVideo`.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ee5118476eb8c7d581339c94943bd6f2 {gyazo=image}", width=50, align="left" %}

**2. Image Preprocessing**

A characteristic from LTX-Video is that since video is slightly compressed and degraded compared to still images, using an image that is too clean may result in a video that doesn't move at all.
- To avoid this, intentionally degrade it to look like video compression with `LTXVPreprocess`.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/90c0a4dc550eb34a03a1a7ab100f866d {gyazo=image}", width=50, align="left" %}

**3. LTXVImgToVideoInplace (Insert into 1st Stage)**

This is the core of image2video.

- Insert the image as the 1st frame into the video latent of the 1st stage (half resolution).

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/0be31e6d4769cbdfdb1b13100bb14cfe {gyazo=image}", width=50, align="left" %}

**4. Do the same for Upscale side (2nd Stage)**

Insert the image into the 2nd stage as well.

- Make sure to connect this node **after** the spatial node.
- Set strength to `1.0`.
  - If you reduce this, the inserted image itself will behave like it's being image2image'd.
  - That's fine if you want it to blend in as a whole, but if you want to match the input image and 1st frame perfectly, set it to `1.0`.


{% endmediaRow %}


**Output Example**

![Input](https://gyazo.com/9e1e51a809c8838bb01c1258925c4e0e){gyazo=image} ![Output](https://gyazo.com/f1878afbef8827ba5d6d70aee609c0e0){gyazo=player}

---

## audio2video

Since LTX-2 is a model that handles "video + audio" simultaneously, you can configure it to take audio as input and create a video driven by the sound.

![](https://gyazo.com/5f4301951dfc2a62f0feaec21aed425c){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_audio2video_distilled.json)

- Trim audio to appropriate length with `Trim Audio Duration`.
- Encode audio and connect to `LTXVConcatAVLatent`.
- Connect to the second stage `LTXVConcatAVLatent` as well.
- Use the input audio as is (do not use generated audio).

> 🚨If the audio length is **shorter** than the generated video length, the audio condition will not work. A video unrelated to the sound will be generated.
> Even if it's silent, you need to make it longer than the video being generated.

I see workflows using `Set Latent Noise Mask` here, but the result is the same whether it's there or not.


**Output Example**

![](https://gyazo.com/69fdf6a78c1534e1b69bd0aa44677903){gyazo=player}

---

## audio-image2video

You can combine the above two.
If you combine a face image with spoken audio, you can do something like a talking head. Let's try it.

![](https://gyazo.com/c07d99d56bef862ed590ea351e2d9b22){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_audio-image2video_distilled.json)

- Just combine the audio2video / image2video workflows.

**Output Example**

![Input](https://gyazo.com/7bf65ca84f1583d324c0debeee85b616){gyazo=image} ![Output](https://gyazo.com/f614c8645cac991c9b9dd918baa8fd5c){gyazo=player}


---

## IC-LoRA

IC-LoRA creates video from control signals such as pose, depth map, edges, etc.

### Model Download

- loras
  - [ltx-2-19b-ic-lora-canny-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Canny-Control/blob/main/ltx-2-19b-ic-lora-canny-control.safetensors)
  - [ltx-2-19b-ic-lora-depth-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Depth-Control/blob/main/ltx-2-19b-ic-lora-depth-control.safetensors)
  - [ltx-2-19b-ic-lora-detailer.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Detailer/blob/main/ltx-2-19b-ic-lora-detailer.safetensors)
  - [ltx-2-19b-ic-lora-pose-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Pose-Control/blob/main/ltx-2-19b-ic-lora-pose-control.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── ltx-2-19b-ic-lora-canny-control.safetensors
        ├── ltx-2-19b-ic-lora-depth-control.safetensors
        ├── ltx-2-19b-ic-lora-detailer.safetensors
        └── ltx-2-19b-ic-lora-pose-control.safetensors
```

### IC-LoRA (Pose)


Add control video based on text2video.

![](https://gyazo.com/e87ed3c369e8e0ed2473bffac25ec966){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Pose)_distilled.json)

{% mediaRow img="https://gyazo.com/72c9389b8f7a9e2070b7b3eb407d8bbf {gyazo=image}", width=50, align="left" %}

**1. Resize Control Video**

Align to the same ratio and resolution as the video to be generated.

- Resize to arbitrary size (here 1MP).
- Width and height must be multiples of 32.
- Input the width/height of the image halved vertically and horizontally into `EmptyLTXVLatentVideo`.


{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2c5faecd7ec8b06281d445f3c8f643b4 {gyazo=image}", width=50, align="left" %}

**2. Generate Pose Image**

Create stick figure images from video.

- Extract pose with OpenPose or DWPose.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2d140f1d0b0c6fa0fba818e535c04082 {gyazo=image}", width=50, align="left" %}

**3. LTXVAddGuide**

Put the control signal (pose video) into conditioning.

- Input the pose video created earlier into `LTXVAddGuide`.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9049aa36e2220ea94aa0b1bd6f541c37 {gyazo=image}", width=50, align="left" %}

**4. Apply IC-LoRA**

Apply IC-LoRA (Pose this time) and sample.

- IC-LoRA is designed assuming `strength = 1.0`.
- In this workflow, IC-LoRA is applied only to the 1st stage sampling.
  - Making the 2nd stage focus on refining results in a cleaner video.

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/c30823a0376a9ff24e83b555cc55796f {gyazo=image}", width=50, align="left" %}

**5. LTXVCropGuides**

If you decode once after the 1st stage is finished, it's easy to understand, but the generated video is mixed with the pose video created earlier.

- Focus on the latter half: [Before LTXVCropGuides.mp4](https://gyazo.com/8c92e2b45a7d3f3ee98f6a3d0a3cc14b)

This is exactly how IC-LoRA works, but since it is unnecessary for the output, remove it before entering the 2nd stage.

- `LTXVCropGuides` is a node for removing control images from latent / conditioning.

{% endmediaRow %}

> You can use it in the same way by changing Pose Image / IC-LoRA to Canny / Depth.
> Note that using basically one type is recommended. (Applying Pose and Depth at the same time is not recommended.)


**Output Example**

![](https://gyazo.com/ba07959b5807a8d7254255a30697f34b){gyazo=loop}

---

### IC-LoRA (Pose) + image2video

You cannot stack multiple IC-LoRAs, but you can combine with image2video or audio2video.

![](https://gyazo.com/641c1ae330f7f684103aabe121d5edd1){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Pose)_image2video_distilled.json)

What it's doing is just combining IC-LoRA (Pose) above with image2video.

- Note that `LTXVAddGuide` is connected **after** `LTXVImgToVideoInplace`.
  - Provide control won't work if reversed.
- This is strictly image2video, **not reference2video** like VACE.
  - Since the input image is "an image fixed as the 1st frame", if it deviates significantly from the 1st frame of the pose video, you won't get the expected video.
  - Create an "image close to the 1st frame of pose" with ControlNet or Qwen-Image-Edit etc. in advance.

**Output Example**

![](https://gyazo.com/f580b5e68fc33f5f34787fadcc01d36c){gyazo=loop}

---

### IC-LoRA (Detailer)

IC-LoRA (Detailer) restores details and textures of low-resolution videos.

**Install Custom Nodes**

- [ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo)

- You can run it with just core nodes, but custom nodes are required to handle large resolutions / long duration videos.

![](https://gyazo.com/bfae276aad1df7f61c4ce1bf3a22d30f){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Detailer).json)

Basically it is video2video with IC-LoRA(Detailer) applied.

- 🟦 First, resize the input video to the desired final size.
- Use `🅛🅣🅧 LTXV Looping Sampler` instead of `SamplerCustomAdvanced`.
  - This works like Ultimate SD, processing time/space in tiles, so you can save VRAM.
  - In this workflow, only the time direction is tiled.
- It does not use distilled LoRA, but generates in 3 steps.

**Output Example**

![Input](https://gyazo.com/aa14f25d1ad8e274a8de629f4666b1bd){gyazo=loop} ![Output](https://gyazo.com/98d208dc9e7c629fff9b060b1aa7bf76){gyazo=loop}

---

## Reference

- [Prompting Guide](https://ltx.io/model/model-blog/prompting-guide-for-ltx-2)
- [LTX-2 Official Doc](https://docs.ltx.video/open-source-model/getting-started/overview)
- [Lightricks/ComfyUI-LTXVideo/example_workflows](https://github.com/Lightricks/ComfyUI-LTXVideo/tree/master/example_workflows)
- [Comfy.Org blog](https://blog.comfy.org/p/ltx-2-open-source-audio-video-ai)
