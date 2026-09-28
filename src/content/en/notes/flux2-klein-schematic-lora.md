---
layout: page.njk
lang: en
section: notes
slug: flux2-klein-schematic-lora
navId: flux2-klein-schematic-lora
title: "FLUX.2 [klein] Schematic LoRA"
created: 2026-05-30
updated: 2026-06-01
noteTags: ["project", "flux-2-klein", "lora"]
summary: "Training FLUX.2 [klein] to produce CV-task-like RGB outputs"
seoTitle: "FLUX.2 [klein] Schematic LoRA: Depth, Normal, Pose"
seoDescription: "A LoRA that teaches FLUX.2 [klein] to output depth, normals, and pose like computer-vision models: download, task setup, dataset, and training."
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/flux2-klein-schematic-lora/legacy_gyazo_a0dc0970df98429dcf703e3ed095f6fa.png"
---

## Overview

![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_2bd9f7b01d61bea0658ba82a750f227e.png){media=image}

There are many studies that reuse the prior knowledge of image generation models for CV tasks. Representative examples include [Marigold](https://marigoldmonodepth.github.io/), [Lotus-2](https://huggingface.co/papers/2512.01030), and [SDPose](https://tsliang.top/SDPose/).

Although these methods use pretrained image generation models, they are ultimately designed specifically for each task.

Now that instruction-based image editing models have become common, another idea has appeared: maybe tasks such as depth estimation and segmentation can be treated, in a broad sense, as **image editing**. That is the idea behind Google DeepMind's [Vision Banana](https://vision-banana.github.io/).

Inspired by that direction, I wanted to see whether something similar could be done with FLUX.2 [klein].

The result is not SOTA-level performance. Still, I hope this experiment shows that even a simple LoRA can make a local model behave in a direction somewhat close to Vision Banana.

## Downloads

- LoRA: [nomadoor/flux-2-klein-9B-schematic-lora](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora)
- Dataset: [nomadoor/flux-2-klein-9B-schematic-dataset](https://huggingface.co/datasets/nomadoor/flux-2-klein-9B-schematic-dataset)

---

## Task Setup

Vision Banana mainly covers depth / normal / segmentation.

For this experiment, I did not use exactly the same task set. Instead, I chose outputs that are familiar in ComfyUI and the image generation community, roughly like ControlNet Preprocessor outputs.

Personally, I call these tasks `image2schematic`, and every LoRA created for this experiment includes the word `schematic`.

| task | output |
|---|---|
| relative depth | near = white / far = black |
| normal map | RGB normal map |
| pose body | OpenPose-style body skeleton |
| pose full | body + hands + face |
| binary segmentation | visible region mask |
| amodal segmentation | mask including occluded parts |

### amodal segmentation

![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_a0cf18a91c6349d3d3002fe98453b723.png){media=image}

Some readers may not be familiar with amodal segmentation.

- Regular segmentation masks only the **visible region** of the target.
- Amodal segmentation estimates and masks the full shape of the target, including parts hidden behind occluders.

For example, if branches are blocking a deer, regular segmentation will not output the parts hidden behind the branches.  
With amodal segmentation, the mask includes the full deer, including the hidden parts.

Because it has to infer invisible regions, this is closer to generation than simple classification.  
In that sense, it is also a task where an image generation model may be able to show its strengths, so I decided to try it.

### One LoRA Per Task

At first, I planned to train all tasks into a single LoRA, but the tasks mixed internally and could not be switched well with prompts alone.

So this experiment uses one LoRA per task.

---

## Dataset

| task | positive | negative | total |
|---|---:|---:|---:|
| depth | 300 | 0 | 300 |
| normal | 300 | 0 | 300 |
| pose body | 300 | 30 | 330 |
| pose full | 300 | 30 | 330 |
| binary segmentation | 300 | 30 | 330 |
| amodal segmentation | 300 | 30 | 330 |

### Depth / Normal

Images were taken from Open Images, and the teacher outputs were created with Lotus-2.

- depth
  - relative depth
  - near = white
  - far = black
- normal
  - RGB normal map

Depth and normal use the same input image set.

### Pose

Person images were taken from Open Images, and the teacher outputs were created with DWPose.

- pose body
- pose full

Candidate images were reviewed manually, and crowded images or obviously broken outputs were removed.

### Amodal Segmentation

Amodal segmentation is a task that creates a mask for the whole object, including not only the visible area but also parts hidden by occluders.

I did not have an existing dataset or a teacher that could directly generate this, so I created it by combining image generation and image editing.

Creation flow:

![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_c3daf3c0a5804bf37d4920a95c7dde61.png){media=image}

1. GPT-5.5 created prompts for occlusion scenes with a clear subject and a natural occluder
2. Z-Image-Turbo generated the source image
3. GPT-5.5 reviewed the source image
4. FLUX.2 [klein] 9B image edit removed the occluder
5. SAM 3.1 segmented the target object from the edited image
6. The source image and complete-object mask were paired
7. Manual review
8. Refinement with BiRefNet and manual editing

SAM 3.1 alone was unstable for these masks, so almost all of them were fixed with BiRefNet and manual edits.

This is not the main point, but when an LLM generates large numbers of image prompts, the results tend to converge toward:

- similar subjects
- similar occluders
- similar compositions

To avoid that, I showed random Open Images examples as inspiration and increased the scene variation.

### Binary Segmentation

The source images created for amodal segmentation were reused.

The actually visible target object region in the input image was segmented with SAM 3.1 and refined manually.

### Negative Samples

For both pose and segmentation, hallucination becomes a problem when the requested target is not present in the input image.

For example, if there is no cat in the input image but the prompt says `generate mask of the cat`, the model may invent a cat-shaped mask.

To address this, I added some negative pairs with all-black targets.

- segmentation
  - If the specified target does not exist in the image, return an all-black mask
  - Example: asking for a `cat` amodal mask when the conditioning image only contains a giraffe
- pose
  - If no person appears in the input image, return an all-black pose image

However, at this scale, I could not confirm a clear improvement. For pose in particular, it may have made training less stable.

---

## Training

Training was done with [AI Toolkit](https://github.com/ostris/ai-toolkit).

| item | value |
|---|---|
| base model | `black-forest-labs/FLUX.2-klein-base-9B` |
| architecture | `flux2_klein_9b` |
| LoRA rank | linear 32 / conv 16 |
| optimizer | `adamw8bit` |
| lr | `5e-5` |
| dtype | `bf16` |
| quantization | transformer / text encoder: `qfloat8` |
| batch size | 4 |
| text encoder | frozen |
| caption dropout | 0.05 |
| EMA | enabled |

To keep the compute cost down, I basically used a 768 bucket.

Only pose full was trained with both 768 / 1024 buckets, because details in the face and hands matter more.

Checkpoints were saved every 100 steps.  
I tested them in ComfyUI and picked the step that looked best. All LoRAs converged at around 2000-2500 steps.

---

## workflow

This is the workflow for using the LoRAs in ComfyUI.

Note that LoRAs trained on FLUX.2 [klein] Base do not work well with the FLUX.2 [klein] Distilled model. Use the Base model, or use a Base-to-Distilled difference LoRA such as [Klein 4B/9B Base to Turbo Lora](https://civitai.com/models/2324315/klein-4b9b-base-to-turbo-lora?modelVersionId=2617121).

### Model Download

The base is [FLUX.2 [klein]](/en/basic-workflows/flux-2-klein/).

- LoRA
  - [flux2-klein-schematic-relative-depth-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-relative-depth-lora.safetensors)
  - [flux2-klein-schematic-surface-normal-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-surface-normal-lora.safetensors)
  - [flux2-klein-schematic-body-pose-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-body-pose-lora.safetensors)
  - [flux2-klein-schematic-full-pose-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-full-pose-lora.safetensors)
  - [flux2-klein-schematic-binary-segmentation-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-binary-segmentation-lora.safetensors)
  - [flux2-klein-schematic-amodal-segmentation-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-amodal-segmentation-lora.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── flux2-klein-schematic-relative-depth-lora.safetensors
        ├── flux2-klein-schematic-surface-normal-lora.safetensors
        ├── flux2-klein-schematic-body-pose-lora.safetensors
        ├── flux2-klein-schematic-full-pose-lora.safetensors
        ├── flux2-klein-schematic-binary-segmentation-lora.safetensors
        └── flux2-klein-schematic-amodal-segmentation-lora.safetensors
```

### image edit Base

![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_596669219726f35c5106037b4fce9e38.png){media=image}

[](/workflows/notes/flux2-klein-schematic-lora/flux_2_klein_base_9b_image_edit.json)

---

## Practical Tests

### relative depth

```text
Generate a relative depth map of the input image.
```

| input | Depth Anything V2 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_668960b4d9147ef1260a01957f93ce9a.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_20a4dcedf04be910c3dbf0830a34cd02.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_8d011d8f92dfaea759907a6430493d63.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/relative_depth_cyclist_input.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/relative_depth_cyclist_depth_anything_v2.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_6e27345a2ecf071e40671ca000fd84f9.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_0ec98b233b467a27a1ac497d2ccf02f9.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_7b1501385098f7cc43354a257739a069.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_ef6402a1b2562118d88f6c471e00bbc0.png){media=image} |

### normal map

```text
Generate a surface normal map of the input image.
```

| input | Lotus-2 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_b3a1684aefa305aacdc41d92ea4c3485.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_a75bc8fdb2794f16d264f8da33dcd7cc.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_a1def11da46b031feabe3f0e6b3f50a2.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_225d29e4318a97b1bfc378091cd06b0e.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_8cc65f987cd5dc9f277efbb242bc6a11.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_595aff620129e00f348fe4ebed8425c7.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_a3566d450ba6209c256f8c55293a428c.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_c2aa1322ad6e17b2b900762ac63f1ba8.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_9f1ea3ff029395ab2d6121c059a3bc3a.png){media=image} |

### pose body

```text
Generate a body pose map of all visible people in the input image.
```

| input | DWPose | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_c3e372e31e394aec307a20fbb9b5fb73.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_5aa247ce618c608d195328483bd5f336.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_d503b1b89f9361c12d110e95dba909f0.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_9ee77ec890a84129011b3ef339576171.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_a4a31c41ec507aa59eb0430b0eb05fc3.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_b06ce32e1e60019e84844b5c885f0022.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_bd3bb102f39717b6bbfdae0cc68e96b5.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_5f949073e42723d6bef17932c8aa6139.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_5fcc24d235f0360e1284f32cf30fa9ff.png){media=image} |

### pose full

```text
Generate a full pose map of all visible people in the input image.
```

| input | DWPose | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_c3e372e31e394aec307a20fbb9b5fb73.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_cd1c92e205f413cc144b2ec534a398d3.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_aec346f0e8592e8f946f8c2993491955.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_9ee77ec890a84129011b3ef339576171.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_90e9d09c619cbea9c8e788e7b4643616.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_ce5459cca85c4ec415e402d6ecf9da8f.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_bd3bb102f39717b6bbfdae0cc68e96b5.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_5f949073e42723d6bef17932c8aa6139.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_db7abedc5ea7431d831076ce4f58353c.png){media=image} |

### binary segmentation

```text
Generate a binary segmentation mask of the stretcher in the input image.
Generate a binary segmentation mask of the tuna sushi in the input image.
Generate a binary segmentation mask of all jars in the input image.
```

| input | SAM 3.1 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_38dd24bd0eec756210f300aa6bc22dbd.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_78f513b8690050f8085995e79a2bf16a.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_8a1faf3881821b454265ab60f7d97af0.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_ff1760a3c6943a2e4e666ec61e1b6eab.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_1abbfc37a68d8335a7f66b9bed7561c3.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_f2ecfb80e270561e7685dfa227855c84.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_5cc009a2cf9ed0da1a2ba74c12e1ec8c.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_a355a426888bd07b48efdf8ee3b6f7d7.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_61c49e77830d9ea82039b839cb18b38e.png){media=image} |

### amodal segmentation

```text
Generate an amodal segmentation mask of the woman in the input image.
Generate an amodal segmentation mask of the bench in the input image.
Generate an amodal segmentation mask of the steam locomotive in the input image.
```

| input | SAM 3.1 visible mask | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_6b4da57f9c240ace62c66fe6c49c49f6.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_ab3b4dbd6acadbe89e038d121ba011c7.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_79f8e50117e8bbab8dcdfee43b5d75e3.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_3882219095ebaa6a3c148be2cd6c8cbc.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_34b8014d2efe1557b06403772c5c009d.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_fc9840c4f47858a7d52351694494c6c0.png){media=image} |
| ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_4a50a286d8870c218e6c792138983ff1.jpg){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_95c93284e620212e59cbf261b29f21eb.png){media=image} | ![](/media/notes/flux2-klein-schematic-lora/legacy_gyazo_4a3159526479a1ac84b9ce1bc99262d7.png){media=image} |

---

## Limitations and Issues

### Depth / Normal

I used Lotus-2 as the teacher, but the LoRA also learned noise that came from Lotus-2.

For this kind of task, synthetic data from 3D models should probably have been considered as well.

As a side note, before Lotus-2, I also trained with target images created by DSINE. DSINE produces much flatter normal maps than Lotus-2, and the LoRA outputs became similarly flat.

The quality of the teacher appears directly in the LoRA output, so this made me feel again how important dataset quality is.

### pose

The first problem is that pose is the least suited to RGB-image representation among the tasks tested here.

Even if the model outputs an OpenPose-style image, converting that back into keypoints is not easy, which makes it difficult to use in practice. The colors and number of bones are also strict, so even small deviations stand out.

I thought this would be an easy task to train, but it broke down more than expected. Hallucinations on animal images and non-person images are not prevented either.

### segmentation

I expected the prompt understanding ability of the Qwen3 8B text encoder to help, but the control was not as strong as I hoped.

The model can follow instructions like "remove the person in X", but when applying the LoRA and asking it to "segment the person in X", it may fail or segment a different person.

So this may not be just a problem of prompt understanding. The model may not have learned the segmentation task itself well enough from the dataset.

For boundary precision, I was hoping for smoother edges closer to matting, but at the moment it remains around the roughness of SAM 3.1.

### Overall

Overall, the dataset size was not enough.

Creating the amodal segmentation dataset was very heavy, so I roughly aligned all tasks to around 300 images.  
To properly isolate the causes, I think each task would have needed around 2000-3000 images.

There are many things left to improve, but I spent too much budget and time on this, so I am stopping here for now.  
If I get the chance, I would like to try again with a larger dataset.

---

## Closing

Regardless of quality, this small-scale LoRA training was enough to teach FLUX.2 [klein] some CV-task-like RGB outputs.

The important point is not really whether it "can do CV tasks." It is that the possible uses of image editing models can expand quite a lot depending on **what we decide to treat as image editing**.

When we hear "image editing," style transfer and object removal come to mind first.  
But outputs like these CV-task-like images, or custom intermediate representations, can also be treated as image editing in a broad sense.

It is fun to watch image generation models, which used to be mostly about drawing pictures, gradually look more like general-purpose vision models.

---

## References

- [Marigold: Repurposing Diffusion-Based Image Generators for Monocular Depth Estimation](https://arxiv.org/abs/2312.02145)
- [Lotus: Diffusion-based Visual Foundation Model for High-quality Dense Prediction](https://huggingface.co/papers/2409.18124)
- [Lotus-2: Advancing Geometric Dense Prediction with Powerful Image Generative Model](https://huggingface.co/papers/2512.01030)
- [Vision Banana: Image Generators are Generalist Vision Learners](https://arxiv.org/abs/2604.20329)
- [Vision Banana Project Page](https://vision-banana.github.io/)
