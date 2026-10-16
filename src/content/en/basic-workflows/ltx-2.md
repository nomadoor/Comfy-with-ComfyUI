---
layout: page.njk
lang: en
section: basic-workflows
slug: ltx-2
navId: ltx-2
title: "LTX-2"
created: 2026-01-10
updated: 2026-09-03
summary: "text2video / image2video / audio2video with LTX-2"
seoTitle: "LTX-2 in ComfyUI: text2video, image2video, audio2video"
seoDescription: "Run LTX-2, Lightricks' video-with-audio model, in ComfyUI: settings, models, and text2video, image2video, and audio2video in easy-to-read workflows."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/ltx-2/legacy_gyazo_2a89cce32669413fb7f5b3fe4ca22960.mp4"
tags: []
---

## What is LTX-2?

**[LTX-2](https://website.ltx.video/blog/introducing-ltx-2)** is a diffusion model from Lightricks that generates audio and video together.

> [!NOTE]
> Its successor, [LTX 2.5](/en/basic-workflows/ltx-2-5/), is now available.<br>
> The architecture is the same, so this page is still useful for learning how it works, but for actual generation I recommend using the newer model.

---

## Recommended Settings

- Resolution
  - 640×640 (1:1)
  - 768×512 (3:2)
  - 704×512 (4:3)
  - *Upscaled 2x in post-processing, so the actual output is 1280×1280*
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

  - [gemma_3_12B_it_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it_fp8_scaled.safetensors)

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
        └── gemma_3_12B_it_fp8_scaled.safetensors
```

---

## Basic Process Flow

![](/media/basic-workflows/ltx-2/legacy_gyazo_1884b40ee25bafb8476dd4df1256b026.png){media=image}

It has more nodes than Wan and the like, so it may look complicated, but this is all it's doing:

- 1. text2video + audio
  - First, generate the base video (and audio).
- 2. Hires.fix (2nd stage)
  - Upscale the generated video by 2x and refine it with video2video.
  - You can skip this and decode directly, but for quality I recommend doing the Hires.fix.
- 3. Decode
  - Decode video and audio separately for output.

---

## text2video

![](/media/basic-workflows/ltx-2/legacy_gyazo_b6df8e98ae7d7337f2f32a65a10661d3.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_text2video_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_text2video.json"
%}

The workflow follows the basic flow described above.
- **1, 2, 3** are the 1st stage.
- **4, 5** are Hires.fix.
- **6** is Decode.

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_129febfcdbfc077bf36db4a6aa33fb19.png {media=image}", width=50, align="left" %}

**1. Set Video Resolution, Length, FPS**

This is where you set the parameters for the video and audio you want to generate.

- Enter resolution, frame count, and FPS in `EmptyLTXVLatentVideo` / `LTXV Empty Latent Audio`.
- Follow the [Recommended Settings](/en/basic-workflows/ltx-2/#recommended-settings).
- 🚨Resolution will be doubled in post-processing.
  - In other words, set the resolution here to **half** the value of the video you want to create.

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_e058d717d9255db19e0bb0c186950e42.png {media=image}", width=50, align="left" %}

**2. Prompt**

This is typical of the LTX series: unless you put some care into the prompt, you won't get much of a video.

- That said, the format isn't so detailed that you need an LLM's help.
- Try describing the video you want to generate as if you were writing a novel.
- cf. [Prompting Guide for LTX-2](https://docs.ltx.video/open-source-model/usage-guides/prompting-guide)

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_1385ab23c63b68656e24650d11f5f5a9.png {media=image}", width=50, align="left" %}

**3. Sampling (1st Stage)**

It isn't the familiar `KSampler`, so it may look a bit complicated, but at heart it's just "set the steps and CFG, then sample."

- In this workflow, the 1st stage is run with 20 steps / CFG 4.0.
- It uses a dedicated scheduler called `LTXVScheduler`.
  - It behaves similarly to `linear_quadratic`, but you don't need to worry about it too much.
- Since LTX-2 handles video and audio together, 🟫 `LTXVConcatAVLatent` merges the video latent and audio latent into one.

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_353e095a574e974a64cff4593f8bf907.png {media=image}", width=50, align="left" %}

**4. Latent Upscale (x2)**

Upscale the resolution of the video latent by 2x.

- Use a dedicated model (`ltx-2-spatial-upscaler-x2`).

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_5625337c055851450dd6dc0357891631.png {media=image}", width=50, align="left" %}

**5. Sampling (2nd Stage / video2video)**

Refine the upscaled latent in just a few steps.

- Here we use `distilled-lora`, which lets you generate in 4–8 steps.
  - Think of it as something like Lightning / Turbo in other models.
  - This workflow runs in **3 steps**.
  - Accordingly, CFG is changed to `1.0`.
- Because it uses `Manual Sigma`, it's a bit hard to read, but in `Simple` terms it behaves roughly like `denoise = 0.47`.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_801da41aa50410fb70b55eab18a8ab83.png {media=image}", width=50, align="left" %}

**6. Decode**

Finally, decode the video and audio separately and write them out.

- Split the latent into video and audio, and decode each with the matching VAE.
- (Tiled VAE is used because VRAM is tight.)

{% endmediaRow %}



## text2video 8 steps

Above, we used `distilled-lora` only for Hires.fix, but let's apply it to the 1st stage as well and generate quickly in 8 steps.

![](/media/basic-workflows/ltx-2/legacy_gyazo_e9e4851525adda6c3aab20a9acb09582.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_text2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_text2video_distilled.json"
%}

To apply `distilled-lora`, change a few sampling settings.

- CFG : `1.0`
- scheduler : `Simple`
- steps : `8`

### 20 steps / 8 steps distilled-lora Comparison

![20 steps](/media/basic-workflows/ltx-2/legacy_gyazo_d7457da890a04a168e0f82655c9a6392.mp4){media=player} ![8 steps (distilled-lora)](/media/basic-workflows/ltx-2/legacy_gyazo_1e20bd8fd074213736b0a7a2e3766be1.mp4){media=player}

> [!NOTE]
> In my testing, applying distilled-lora gives more stable results.  
> So, partly for the speed boost too, every workflow from here on **applies distilled-lora from the 1st stage**.

---

## image2video

### single-frame I2V

![](/media/basic-workflows/ltx-2/legacy_gyazo_a16d62da150521a5b0c96dc32bbea33b.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_image2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_image2video_distilled.json"
%}

The basic idea is "lock the 1st frame to the input image and generate the rest."

For example, for a 121-frame video, the flow is roughly this:

```text
(1) Create a frame for 121 frames (8n+1)
    [ 🌫️ 🌫️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]

(2) Overwrite only the 1st frame with input image
    [ 🖼️ 🌫️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]

(3) Generate the remaining 120 frames
    [ 🖼️ ✨ ✨ ✨ ✨ ... ✨ ]
```
Picture the following frames (✨) being filled in, starting from 🖼️.


{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_981d0f06afef7364fcbe2c10bc1428c1.png {media=image}", width=40, align="left" %}

**1. Resize Input Image (Create 2 versions)**

- First, create a full-resolution version matching the final output resolution.
  - Resize to any size you like (1MP here).
  - Width and height must be multiples of 64.
    - Since the 1st stage runs at 1/2 resolution, make it a multiple of 64 so it remains a multiple of 32 when halved.
- Next, for the 1st stage (half resolution), create a version with width/height halved from the above image.
  - Input this half-resolution width/height into `EmptyLTXVLatentVideo`.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_4198b2a54986678bbcf735dda9c8cb79.png {media=image}", width=40, align="left" %}

**2. Image Preprocessing**

This goes back to LTX-Video: unlike still images, video frames are slightly compressed and degraded, so an image that's too clean can produce a video that doesn't move at all.
- To avoid this, `LTXVPreprocess` deliberately degrades the image to look like video compression.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_90c0a4dc550eb34a03a1a7ab100f866d.png {media=image}", width=40, align="left" %}

**3. LTXVImgToVideoInplace (Insert into 1st Stage)**

This is the core of image2video.

- Insert the image as the 1st frame into the video latent of the 1st stage (half resolution).

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_2a0c109b88debb478cf1d66f4a0b2f57.png {media=image}", width=40, align="left" %}

**4. Do the same for Upscale side (2nd Stage)**

Insert the image into the 2nd stage as well.

- Make sure to connect this node **after** the spatial node.
- Set strength to `1.0`.
  - If you lower it, the inserted image itself gets image2image'd as well.
  - That's fine if you want everything to blend together, but if you want the 1st frame to match the input image exactly, set it to `1.0`.


{% endmediaRow %}


{% outputs %}
![Input](/media/basic-workflows/ltx-2/legacy_gyazo_9e1e51a809c8838bb01c1258925c4e0e.png){media=image} ![Output](/media/basic-workflows/ltx-2/legacy_gyazo_cdd2bcb62649ec744892c1615eae01d9.mp4){media=player}
{% endoutputs %}

> [!NOTE]
> A known issue is that the video sometimes barely moves, or just zooms out.  
> A good prompt helps somewhat, but a LoRA has come out to deal with this, so here it is.
>
> link + workflow : [LTX-2 Image2Video Adapter LoRa](https://scrapbox.io/work4ai/LTX-2_Image2Video_Adapter_LoRa)

---

### multi-frame I2V

The previous image2video workflow can take not only a **single image** but also an **image batch (= video)** as input.  
Building on this, you can make a workflow that uses the end of any video as an "overlap" and extends it from there.

![](https://gyazo.com/777521712af9329c1f8612710f00584a){gyazo=image}

[](/workflows/basic-workflows/ltx-2/ltx_2_extension_distilled.json)

It takes the last few frames of the input video and generates the continuation.

```text
(1) Input video (= image batch)
    [ 🖼️ 🖼️ 🖼️ 🖼️  ... 🖼️ 🖼️ 🖼️ ]

(2) Take N frames from the end (N = 8n+1)
    [ 🖼️ 🖼️ 🖼️ 🖼️... 🖼️ 🖼️ 🖼️ ]
                      └─── N ───┘

(3) Create a 121 frames slot and overwrite the beginning with N frames
    [ 🖼️ 🖼️ 🖼️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]
      └── N ──┘     

(4) Generate the remaining (121 - N frames) to make the continuation
    [ 🖼️ 🖼️ 🖼️ ✨ ✨ ✨ ... ✨ ]

(5) Delete the first N frames (as they duplicate the end of original video)
    [ ✨ ✨ ✨ ... ✨ ]
    
(6) Concatenate original video + continuation
    [ 🖼️ 🖼️ 🖼️ ... 🖼️] + [ ✨ ✨ ✨ ... ✨ ]
```

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_5b0892af938467f9abf134e6dba73e87.png {media=image}", width=40, align="left" %}

**1. Get End Image Batch**

Take the image batch that will serve as the overlap from the end of the input video.
- Enter any number you like in `num_frames` of `Get Image or Mask Range From Batch` (it must be 8n+1).
- The larger N is, the better it carries over the original video's motion and mood.
- However, since the generated section becomes 121 - N frames, increasing N makes the "continuation" shorter.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_c87f00b6590f5b3b4b983dc204c99476.png {media=image}", width=40, align="left" %}

**2. Concatenate Generated Video and Original Video**

The generated result starts with the "overlap" (the last N frames of the original video), which duplicates the original, so delete it before joining.
- Delete the first N frames of the generated video (25 frames in this example)
- Concatenate to the end of the original video

{% endmediaRow %}

{% outputs %}
![Input](/media/basic-workflows/ltx-2/legacy_gyazo_4c2fdd21e0ff8bac1c572dc130753018.mp4){media=loop} ![Output](/media/basic-workflows/ltx-2/legacy_gyazo_1bce09367191f5fc19297331b43bdbb1.mp4){media=loop}
{% endoutputs %}


---

## audio2video

Since LTX-2 handles "video + audio" together, you can also feed it audio as input and make a video driven by the sound.

![](/media/basic-workflows/ltx-2/legacy_gyazo_be5aaa842432ee760228eeed24a3636f.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_audio2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_audio2video_distilled.json"
%}

- Trim audio to appropriate length with `Trim Audio Duration`.
- Encode audio and connect to `LTXVConcatAVLatent`.
- Connect to the second stage `LTXVConcatAVLatent` as well.
- Use the input audio as is for the output video (do not use generated audio).

> [!WARNING]
> If the audio length is **shorter** than the generated video length, the audio condition will not work. A video unrelated to the sound will be generated.
> Silence is fine, but the audio has to be longer than the video you're generating.

You'll also see workflows that use `Set Latent Noise Mask` here, but the result is the same with or without it.


{% outputs %}
![](/media/basic-workflows/ltx-2/legacy_gyazo_a4290b4a15307547b106f83ced77ae44.mp4){media=player}
{% endoutputs %}

---

## audio-image2video

You can also combine the two above.
If you combine a face image with spoken audio, you can do something like a talking head. Let's try it.

![](/media/basic-workflows/ltx-2/legacy_gyazo_853b6d4b375b6ea1ef45f7697b71d369.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_audio_image2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_audio_image2video_distilled.json"
%}

- Just combine the audio2video / image2video workflows.

{% outputs %}
![Input](/media/basic-workflows/ltx-2/legacy_gyazo_7bf65ca84f1583d324c0debeee85b616.png){media=image} ![Output](/media/basic-workflows/ltx-2/legacy_gyazo_8cb2045b833bb0507d048bf9965cbf63.mp4){media=player}
{% endoutputs %}

> [!NOTE]
> The video didn't follow the dialogue very well, so I actually put the lines in the prompt too. There may be a better workflow.

---

## video2audio

The reverse of audio2video: you can also input a video and generate sound to match it (sound effects or ambient sound).

> [!NOTE]
> This task isn't stable. It probably needs some work.

![](/media/basic-workflows/ltx-2/legacy_gyazo_62df52a54b4bfcf67f53429d6343d666.png){media=image}

[](/workflows/basic-workflows/ltx-2/ltx_2_video2audio_distilled.json)


{% outputs %}
*Caution: Sound may be loud.*

![](/media/basic-workflows/ltx-2/legacy_gyazo_79db38d1a4e4f16317613bbb85cd37f7.mp4){media=player}
{% endoutputs %}

---

## Temporal inpainting

This is inpainting along the time axis (= regenerating just part of a video). It's like VACE Extension.

![](/media/basic-workflows/ltx-2/legacy_gyazo_4f55cbb7932cdefc0d879c2c432ed224.png){media=image}

[](/workflows/basic-workflows/ltx-2/ltx_2_temporal_inpainting_distilled.json)

Basically it is video2video.
Mask only the "time range you want to redo" and have just that section regenerated.

```text
(1) Input video (= existing video latent)
    [ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ ]

(2) Specify section to remake (start_time ~ end_time)
    e.g.: 2.0s ~ 4.0s
    [ 🖼️ 🖼️ | 🖼️ 🖼️ 🖼️ | 🖼️ 🖼️ 🖼️ ]
             ^           ^
         start_time   end_time

(3) Mask only the specified section
    [   0    0 |  1   1   1 |  0   0   0  ]
               └─── Mask ───┘

(4) Regenerate only the masked section
    [ 🖼️ 🖼️ | ✨ ✨ ✨ | 🖼️ 🖼️ 🖼️ ]
             └─ inpaint ─┘
```

> [!NOTE]
> Because of how it works, a two-stage workflow (low resolution → Hires.fix) is hard to set up, so this generates at 1.5MP from the start.

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_b8efdb1050318602e40897d0d181c77c.png {media=image}", width=40, align="left" %}

**1. LTXVAudioVideoMask**

Specify the time range you want to inpaint.

- `video_fps`: Basically set to same fps as input video
- `video_start_time` : Inpainting start (seconds)
- `video_end_time` : Inpainting end (seconds)
- `audio_start_time` / `audio_end_time`: Basically same as video, but by shifting them you can do "edit video only while keeping sound" or "edit sound only while keeping video"
{% endmediaRow %}

**It can extend, too**

If you set `end_time` past the end of the input video, the part that runs over is newly generated, which extends the video.
e.g.: If input is "2 seconds"
- Redo 2.0s → 5.0s (= generate everything after 2 seconds, extending the video)
- `start_time = 2.0` / `end_time = 5.0`


{% outputs %}
![Input](/media/basic-workflows/ltx-2/legacy_gyazo_c460984d015f16a93523a37f70ff730a.mp4){media=player} ![Output](/media/basic-workflows/ltx-2/legacy_gyazo_2ba5e11ee85ff39b50e44a3700cf8aa6.mp4){media=player}
{% endoutputs %}


---

## IC-LoRA

IC-LoRA generates video from control signals such as poses, depth maps, and edges.

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


Starting from the text2video workflow, add a ControlNet-style control video input.

![](/media/basic-workflows/ltx-2/legacy_gyazo_d520faa02e72245494eedeea79ebef20.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_pose_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_pose_distilled.json"
%}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_5efc334e9408a80a1328d0dceeadb892.png {media=image}", width=40, align="left" %}

**1. Resize Control Video**

Match it to the aspect ratio and resolution of the video you'll generate.

- Resize to any size you like (1.5MP here).
- Width and height must be multiples of 64.
- Enter the width/height of the image halved on each side into `EmptyLTXVLatentVideo`.


{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_95c6efb7ad89b70494e4db25c2b98121.png {media=image}", width=40, align="left" %}

**2. Generate Pose Image**

Make stick-figure images from the video.

- Extract pose with OpenPose or DWPose.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_2d140f1d0b0c6fa0fba818e535c04082.png {media=image}", width=40, align="left" %}

**3. LTXVAddGuide**

Put the control signal (pose video) into conditioning.

- Input the pose video created earlier into `LTXVAddGuide`.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_9049aa36e2220ea94aa0b1bd6f541c37.png {media=image}", width=40, align="left" %}

**4. Apply IC-LoRA**

Apply IC-LoRA (Pose this time) and sample.

- IC-LoRA is designed assuming `strength = 1.0`.
- In this workflow, IC-LoRA is applied only to the 1st stage sampling.
  - Letting the 2nd stage concentrate on refining gives a cleaner video.

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/ltx-2/legacy_gyazo_c30823a0376a9ff24e83b555cc55796f.png {media=image}", width=40, align="left" %}

**5. LTXVCropGuides**

It's easy to see if you decode once after the 1st stage: the pose video you made earlier is mixed into the generated video.

- Watch the second half: [Before LTXVCropGuides.mp4](/media/basic-workflows/ltx-2/legacy_gyazo_8c92e2b45a7d3f3ee98f6a3d0a3cc14b.mp4)

This is exactly how IC-LoRA works, but it isn't wanted in the output, so remove it before the 2nd stage.

- `LTXVCropGuides` is a node for removing control images from latent / conditioning.

{% endmediaRow %}

> [!TIP]
> Swap the pose images and IC-LoRA for Canny / Depth and it works the same way.
> Note that using only one type at a time is generally recommended. (Applying Pose and Depth together is not recommended.)


{% outputs %}
![Input](/media/basic-workflows/ltx-2/legacy_gyazo_a999fcd3eca5bcd0a3e89714be6d8074.mp4){media=loop} ![Output](/media/basic-workflows/ltx-2/legacy_gyazo_35e6cc779d6d126973a46cac63c7dec9.mp4){media=loop}
{% endoutputs %}

---

### IC-LoRA (Pose) + image2video

You can't stack multiple IC-LoRAs, but you can combine one with image2video or audio2video.

![](/media/basic-workflows/ltx-2/legacy_gyazo_a65682de39d9ea5c9fe6003cdf27e892.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_pose_image2video_distilled_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_pose_image2video_distilled.json"
%}

All it does is merge IC-LoRA (Pose) above with image2video.

- Note: connect `LTXVAddGuide` **after** `LTXVImgToVideoInplace`.
  - The other way around, the control won't take effect.
- This is strictly image2video, **not reference2video** like VACE.
  - The input image is "the image locked in as the 1st frame," so if it differs a lot from the pose video's 1st frame, you won't get the video you expect.
  - Make an "image matched to the pose's 1st frame" beforehand with ControlNet, Qwen-Image-Edit, or similar.

{% outputs %}
![Input](/media/basic-workflows/ltx-2/legacy_gyazo_aed000bfabc8665e0fadb350ca72500b.mp4){media=loop} ![Output](/media/basic-workflows/ltx-2/legacy_gyazo_0ec1dbf4cf746b021443ca341b6c019a.mp4){media=loop}
{% endoutputs %}

---

### IC-LoRA (Detailer)

IC-LoRA (Detailer) restores details and textures of low-resolution videos.

**Install Custom Nodes**

- [ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo)

- It does run with core nodes alone, but you need the custom nodes to handle high resolutions and long videos.

![](/media/basic-workflows/ltx-2/legacy_gyazo_a366728b300f253233432d1c12239f8d.png){media=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_detailer_v2.json",
  "/workflows/basic-workflows/ltx-2/ltx_2_ic_lora_detailer.json"
%}

Basically it is video2video with IC-LoRA(Detailer) applied.

- 🟦 First, resize the input video to the desired final size.
- Use `🅛🅣🅧 LTXV Looping Sampler` instead of `SamplerCustomAdvanced`.
  - Like [Ultimate SD upscale](/en/basic-workflows/ultimate-sd-upscale/), it splits time and space into tiles, which saves VRAM.
  - In this workflow, only the time direction is tiled.
- It doesn't use the distilled LoRA, but still generates in 3 steps.

{% outputs %}
![Input](/media/basic-workflows/ltx-2/legacy_gyazo_aa14f25d1ad8e274a8de629f4666b1bd.mp4){media=loop} ![Output](/media/basic-workflows/ltx-2/legacy_gyazo_ceb4d9d0ba0eec0b5379b63ec307460a.mp4){media=loop}
{% endoutputs %}

---

## Reference

- [Prompting Guide](https://ltx.io/model/model-blog/prompting-guide-for-ltx-2)
- [LTX-2 Official Doc](https://docs.ltx.video/open-source-model/getting-started/overview)
- [Lightricks/ComfyUI-LTXVideo/example_workflows](https://github.com/Lightricks/ComfyUI-LTXVideo/tree/master/example_workflows)
- [Comfy.Org blog](https://blog.comfy.org/p/ltx-2-open-source-audio-video-ai)
