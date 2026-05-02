---

layout: page.njk
lang: en
section: basic-workflows
slug: flux-2-klein
navId: flux-2-klein
title: "FLUX.2 [klein]"
created: 2026-01-22
updated: 2026-03-02
summary: "FLUX.2 [klein] generation and image editing workflow"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/46ebf7545e89db8df26b83a992e4c728.png"
tags: [instruction-based-image-editing]
---

## What is FLUX.2 [klein]?

**FLUX.2 [klein]** is a compact and fast Flux.2 series model that can handle both **Image Generation** and **Instruction-based Image Editing** with a single model.

Lineup:

* **9B** / **9B Base** (FLUX Non-Commercial License)
* **4B** / **4B Base** (Apache 2.0)

It's a bit confusing, but the one without "Base" is the Distilled model.
While Base requires 20 steps, Distilled can generate in 4 steps.

Since there is no significant difference in performance, we will basically use the Distilled model for generation.

---

## Recommended Settings

- Resolution
  - Min: 64×64
  - Max: 4MP (2048×2048)
  - Both width and height must be multiples of 16
- Number of Reference Images
  - Max: 4

---

## Flux.2 [klein] 9B

### Model Download (9B)

* diffusion_models

  * [flux-2-klein-9b-fp8.safetensors (distilled)](https://huggingface.co/black-forest-labs/FLUX.2-klein-9b-fp8/blob/main/flux-2-klein-9b-fp8.safetensors)
  * [flux-2-klein-base-9b-fp8.safetensors](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9b-fp8/blob/main/flux-2-klein-base-9b-fp8.safetensors)
* text_encoders

  * [qwen_3_8b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/text_encoders/qwen_3_8b.safetensors)
* vae

  * [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)


```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-9b-fp8.safetensors
    │   └── flux-2-klein-base-9b-fp8.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_8b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### text2image Base

![](https://gyazo.com/0936f046def982bdf00c697bb1740bfa){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_text2image.json)

> The official workflow uses `Flux2Scheduler`, but since there is no major difference, we use `Simple` to simplify the workflow.

### text2image Distilled

![](https://gyazo.com/ba71c46ad1a5880a40a4897992777050){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_text2image.json)

Change only the following parameters:
- `CFG` : 1.0
- `steps` : 4

### Image Editing Base

![](https://gyazo.com/74b3fe065e88c1a48210c04b0e9c0766){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_image-edit.json)

"Input Image + Instruction Prompt" is the basic method.
- VAE Encode the input image and pass it to `ReferenceLatent`.


### Image Editing Distilled

![](https://gyazo.com/e55ff686078115488cef6406f60b9370){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit.json)

### Image Editing (Multi-Reference) Base

You can also input and reference multiple images.

![](https://gyazo.com/d5d524090b273847fbc4a45cf52284b4){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-base-9b_image-edit-multi.json)

- Just connect the block of `Reference Image → VAE Encode → ReferenceLatent` in series.
- 2 or 3 images are OK. (Maximum is 4)

### Image Editing (Multi-Reference) Distilled

![](https://gyazo.com/8d4bcf62e22ccaf6e91c3b2de20a417b){gyazo=image}

[](/workflows/basic-workflows/flux-2-klein/9b/Flux.2-klein-9b_image-edit-multi.json)

---

## Flux.2 [klein] 4B

### Model Download (4B)

* diffusion_models

  * [flux-2-klein-4b.safetensors (distilled)](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-4b.safetensors)
  * [flux-2-klein-base-4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-base-4b.safetensors)
* text_encoders

  * [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/text_encoders/qwen_3_4b.safetensors)
* vae

  * [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-4b.safetensors
    │   └── flux-2-klein-base-4b.safetensors
    ├── 📂text_encoders/
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### Workflow

The basics are exactly the same as 9B.
Just replace the model and text encoder with the 4B ones.

**text2image**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_text2image.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_text2image.json)

**Image Editing**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_image-edit.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_image-edit.json)

**Image Editing (Multi-Reference)**
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-base-4b_image-edit-multi.json)
- [](/workflows/basic-workflows/flux-2-klein/4b/Flux.2-klein-4b_image-edit-multi.json)

---

## Capabilities / Examples

These are just a few examples.

Changing style or removing objects is only a small part of image editing. The possibilities are endless depending on what you consider "image editing". Please explore various uses.

### Single Image

{% mediaRow img="https://gyazo.com/9739688bffdd08a9c5b3db5fa1dd8119 {gyazo=image}", width=45, align="left" %}

**Style Transfer**

```text
Reskin this into a watercolor illustration on textured paper.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Style-transfer.json)
{% endmediaFooter %}

{% endmediaRow %}



{% mediaRow img="https://gyazo.com/1fc2e71374a7d109c7f4d008973b4693 {gyazo=image}", width=45, align="left" %}

**Environmental / State Change**

```text
Change the time to bright midday.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Environmental-change.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/13aca28a7b3b85966d2831ccd99ba2f4 {gyazo=image}", width=45, align="left" %}

**Object Swap / Addition**

```text
Replace the ice bear with an ice duck. Add a hat on the duck with light blue, red, and white colors. Add sneakers on the duck.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-swap.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/f7552667da5fcfa8ce3a4e4b49cf5cdd {gyazo=image}", width=45, align="left" %}

**Text Editing**

```text
Edit the text "WELCOME" to "Flux.2".
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Text-edit.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d1e84e57e066c8e30868ac97fbc5512b {gyazo=image}", width=45, align="left" %}

**Image Restoration**

```text
Restore and colorize this black-and-white photo.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Restore.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/ef668f3e2ef9f7598ec410bcbbd30960 {gyazo=image}", width=45, align="left" %}


**ControlNet-like (Pose)**

It does not work on the mechanism of ControlNet.
By providing a stick figure or depth map and asking it to generate a realistic image based on it, you can perform **ControlNet-like** tasks as image editing.

```text
A office lady sitting on outdoor stairs at dusk, matching the pose from the reference image. Evening ambient light, calm urban atmosphere. She wears a long skirt and a black camisole with frills. Natural, realistic photo
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Pose.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/090e1bccb68070e4a22c7315d1bdc2ce {gyazo=image}", width=45, align="left" %}

**inpainting / outpainting**

It doesn't fill in the masked area, but you just instruct it to "fill the gray area naturally".

```text
Outpaint the gray areas to extend the scene naturally
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_outpainting.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/4a562fb90e23c8695ebe7c13b0db223e {gyazo=image}", width=45, align="left" %}

**Collage Refinement**

```text
Turn this into a single realistic underwater ruins scene with two robots: a sleek white mecha and a large rusty moss-covered robot.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Collage-refinement.json)
{% endmediaFooter %}

{% endmediaRow %}

### Multi-Reference Image Editing

{% mediaRow img="https://gyazo.com/fabad47684ddbc15657d34973511a405 {gyazo=image}", width=45, align="left" %}

**Style Transfer**

```text
Change image 1 to match the style of image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Style-transfer-multi.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d673551f6b212c41c35c0cfd2e729e8f {gyazo=image}", width=45, align="left" %}

**Object / Person Swap**

```text
Replace the person in image 1 with the person from image 2.
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-swap-multi.json)
{% endmediaFooter %}
{% endmediaRow %}


{% mediaRow img="https://gyazo.com/6360d713f4bee61dd3c844d4336eebcd {gyazo=image}", width=45, align="left" %}

**Add Object**

```text
Place the airship from image 2 in the sky of image 1,Make the airship prominent (closer to camera)
```

{% mediaFooter %}
[](/workflows/basic-workflows/flux-2-klein/examples/Flux.2-klein-9b_Object-add-multi.json)
{% endmediaFooter %}

{% endmediaRow %}


## References

- [Prompting Guide - FLUX.2 [klein]](https://docs.bfl.ai/guides/prompting_guide_flux2_klein)
- [FLUX.2 [klein] Official Doc](https://docs.bfl.ai/flux_2/flux2_overview#flux-2-[klein]-models)
- [Comfy.Org blog](https://blog.comfy.org/p/flux2-klein-4b-fast-local-image-editing)
