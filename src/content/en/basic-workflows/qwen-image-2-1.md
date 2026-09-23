---
layout: page.njk
lang: en
section: basic-workflows
slug: qwen-image-2-1
navId: qwen-image-2-1
title: "Qwen-Image-2.1"
created: 2026-09-21
updated: 2026-09-23
summary: "Image generation and editing with Qwen-Image-2.1"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_hero.png"
tags: []
---

## What is Qwen-Image-2.1?

[Qwen-Image-2.1](https://qwen.ai/blog?id=qwen-image-2.1) is an open-weight image generation model that combines image generation and editing in a single model.

A closed-source Qwen-Image 2.0 came first, but within the open-weight Qwen-Image family this is the successor to `Qwen-Image-2512` and `Qwen-Image-Edit-2511`.

Previous Qwen-Image models used separate models for generation and editing. Like [MiniMax H3](/en/basic-workflows/minimax-h3/), the 2.x architecture feeds both text and reference images into a single DiT, so the same model can handle image generation, editing, and Ref2Image.

It also supports native RGBA output—in other words, transparent images.

The image generation component is a compact 7B model, yet it covers generation, editing, references, and transparency. It is quite a versatile model.

---

## Recommended settings

- Resolution
  - 2K (about 4 MP recommended)
    - 2048 × 2048 px for 1:1
  - Use multiples of 32 for both width and height

---

## Downloading the models

- diffusion_models
  - [qwen_image_2.1_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/diffusion_models/qwen_image_2.1_int8_convrot.safetensors) (7.26 GB)
- text_encoders
  - [qwen3vl_8b_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/text_encoders/qwen3vl_8b_int8_convrot.safetensors) (9.35 GB)
- vae
  - [qwen_image_2.1_vae_bf16.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-2.1/blob/main/vae/qwen_image_2.1_vae_bf16.safetensors) (676 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_2.1_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_8b_int8_convrot.safetensors
    └── 📂vae/
        └── qwen_image_2.1_vae_bf16.safetensors
```

---

## text2image

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="121s", tags=["4MP"], samplers=[{ speed: "3.45 s/it" }] %}

- `CFG`: 1.0
  - The official workflow does not use CFG, but it may be worth raising it slightly to try a Negative Prompt

For better or worse, the Seed makes a very large difference. Changing the resolution also changes the image substantially, so try a variety of resolutions and Seeds.

**Output example**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_output.png){media=image}

---

## Ref2Image

This workflow combines reference images to create a new image.

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="108s", tags=["2MP"], samplers=[{ speed: "1.95 s/it" }] %}

- Accepts up to 10 reference images
- Specify which images to use in the prompt, such as “the woman from `<image1>` is sitting in the location from `<image2>`.”

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image_text_encode.png", width=40, align="left" %}
**Text Encode Qwen Image 2.1**

Enter the reference images and prompt here.

- `resolution`
  - Reference images are resized to about 1 MP while preserving their aspect ratio before being passed to the model
- `latent` output
  - This is an empty latent based on the size of the first image, but its dimensions are rounded internally. I do not use it in my workflow because I want the output to match the input image dimensions exactly

{% endmediaRow %}

**Output example**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_ref2image_output.png){media=image}

---

## Image editing

The workflow is almost the same as Ref2Image. The only difference is that the output size is matched to the first image.

For editing, it would be inconvenient if the result came back at a different size. This workflow reads the first image dimensions with `Get Image Size` and passes them to `Empty Latent Image`.

The second and subsequent images can be used as references, just as in Ref2Image.

### Basic image editing

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit.json", level=1, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="57s", tags=["1MP"], samplers=[{ speed: "1.72 it/s" }] %}

As with other image-editing models, simply give an instruction such as “remove the man,” “make the clothes red,” or “turn this into a watercolor painting.”

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_text_encode.png", width=40, align="left" %}
**Text Encode Qwen Image 2.1**

- `resolution`
  - Unlike Ref2Image, set this to `0`. The image is not scaled; its dimensions are only rounded to multiples of 32 (I resize the image beforehand, so in practice nothing changes)
  - It is still a good idea to match the size seen by the model to the output size

{% endmediaRow %}

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_output.png){media=image}

### Specify the location with colored circles

Draw colored circles around the areas you want to edit.

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local.json", level=1, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="64s", tags=["1MP"], samplers=[{ speed: "1.72 it/s" }] %}

Draw directly on the image to mark the objects you want to edit.

- You can also use the `Mask Editor` attached to the `Load Image` node

Then simply give an instruction such as “remove the wristwatch inside the red circle.”

You can use several colors for separate instructions, which is handy when the location is difficult to describe in words.

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_output.png){media=image}

### Specify the location with a mask

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="117s", tags=["2MP"], samplers=[{ speed: "2.27 s/it" }] %}

The idea is the same as using a colored circle, but here a black-and-white image that marks the location is supplied **separately from the original image**.

The nice part is that you do not have to draw directly on and alter the original image.

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert.png", width=40, align="left" %}
**Convert the mask to an image**

Convert the MASK output from `Load Image` into a black-and-white image with `Convert Mask to Image`, then connect it to `image_2`.

In fact, the model only receives an ordinary black-and-white image. You can skip the mask conversion and prepare an image painted white over a black background instead.

{% endmediaRow %}

> This works very differently from [inpainting](/en/basic-workflows/sd15-inpainting/).\
> Inpainting has a mechanism that prevents edits outside the mask, while this is only a location guide.\
> The edit may therefore spill outside the specified area.

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_input.png){media=image} ![mask](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_mask.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_local_mask_convert_output.png){media=image}

### Outpainting

This works very differently from ordinary [Outpainting](/en/basic-workflows/sd15-outpainting/), where padding is added and then inpainted.

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="93s", tags=["2MP"], samplers=[{ speed: "1.67 s/it" }] %}

What happens if you provide a wide image as a reference, but generate a portrait image?

Qwen-Image-2.1 creates a new image that fills in the space above and below.

It redraws the whole image rather than only the added space, so the original area will also change slightly.

This is not a way to preserve the source image precisely, but it is wonderfully simple.

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_outpainting_output.png){media=image}

### Generate from guide images

Although this is not ControlNet itself, you can pass pose images, depth maps, and similar images as image-editing references and generate images based on them.

**Required custom node**

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="82s", tags=["2MP"], samplers=[{ speed: "1.38 s/it" }] %}

Let’s also provide a reference image and put the person in a specified pose.

You might wonder whether turning the pose into a stick figure is really necessary. Even if you ask the model to look only at the pose, it may also pick up unnecessary details such as the clothing and background.

Rather than using Pose simply because that is what you do with ControlNet, the point here is to strip away unnecessary information from the reference image and pass only the pose or shape.

![reference](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose_ref.png){media=image} ![pose](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose_pose.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_openpose_output.png){media=image}

### Upscale

Since it can generate images up to 4 MP, let’s use that ability to clean up a low-quality image.

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_upscale.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_upscale.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="212s", tags=["4MP"], samplers=[{ speed: "5.28 s/it" }] %}

First upscale the image to 4 MP and provide it as a reference, then have the model refine it.

This model is very good at preserving the reference image, so Upscale is probably one of its strongest tasks.

On the other hand, getting it to redraw the image more aggressively, as in what is often called enhancement, may take a little ingenuity.

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_upscale_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_image_edit_upscale_output.png){media=image}

---

## Transparent images

Qwen-Image-2.1 can generate transparent images with only a small change to the prompt.

No special nodes are required. It produces an RGBA image with an Alpha Channel from the start.

### Generate a transparent image

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba.json", level=1, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="65s", tags=["2MP"], samplers=[{ speed: "1.11 s/it" }] %}

Write the prompt in this format:

```text
This is an RGBA image with transparency. <your prompt here>. The image has alpha channel and the background is transparent.
```

The beginning and ending are fixed phrases, so you can copy them as-is and replace only the middle.

Save the output as PNG to preserve transparency. JPEG would discard the Alpha Channel.

**Output example**

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_text2image_rgba_output.png){media=image}

### Subject extraction

Combine transparent generation with image editing and—yes—you can pull a subject out of an image too.

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction.png){media=image}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="90s", tags=["2MP"], samplers=[{ speed: "1.67 s/it" }] %}

Use the same format as above and tell it what to extract with `Extract ...`.

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction_input.png){media=image} ![output](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_subject_extraction_output.png){media=image}

---

## Applications

### Panorama generation

Give it any reference image and ask for an ERP image at a 2:1 resolution. That alone is enough to generate a 360-degree panorama. Almost too easy...

**Custom node**

- [nomadoor/ComfyUI-Panorama-Stickers](https://github.com/nomadoor/ComfyUI-Panorama-Stickers)
  - A little self-promotion: this is my custom node for previewing panoramas and taking shots inside a panorama. Give it a try if it sounds useful.

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_panorama.mp4){media=loop}

{% workflow "/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_panorama.json", level=2, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="159s", tags=["4MP"], samplers=[{ speed: "4.29 s/it" }] %}

This workflow generates a wide 2:1 image while using the source image as a reference.

Rather than strictly outpainting the left and right sides, it redraws the full ERP image so everything fits naturally into the panoramic space.

### Layer decomposition

In [Subject extraction](#subject-extraction), we extracted any subject from an image as a transparent image.

Now remove that subject from the image, then extract the next thing in front. Repeat the process, and a single image can be split into layers from front to back.

![](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition.png){media=image}

[](/workflows/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition.json)

This uses [loops](/en/data-utilities/loop/) to repeat the following steps:

1. Have an MLLM choose what appears to be at the very front
2. Extract only that subject as a transparent image
3. Remove the same subject from the current image
4. Pass the image with the subject removed to the next iteration

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_number.png", width=40, align="left" %}

**Set the number of layers**

First, provide the image and the number of layers you want.

Set this to `5` to extract four layers in order from the front, with the remaining background becoming the fifth.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_mllm.png", width=40, align="left" %}

**Choose what to extract next**

`Generate Text` looks at the current image and answers with a short description of what to extract next.

What should count as one layer depends on how many layers remain, so the prompt also includes `number of layers - iteration_index` to tell the MLLM how many more layers the image will be split into.

The returned subject name is inserted into the Qwen-Image-2.1 instruction with `Format Text`.

> `Generate Text` raises an error when given an RGBA image, so `Split Image with Alpha` removes the Alpha information first.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_object_extraction.png", width=40, align="left" %}

**Extract the foremost subject**

Only the subject selected by the MLLM is extracted as a transparent image.

This is the same process used in [Subject extraction](#subject-extraction) above.

The resulting image is passed to `End Loop` as one layer.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_object_removal.png", width=40, align="left" %}

**Remove the foremost subject**

Layer decomposition needs not only the extracted subject, but also an image with that subject removed.

Passing the source image and cutout directly and asking it to “remove this” did not work well. Instead, the extracted region is painted green and the model is told to fill the green area naturally.

The image with the subject removed then becomes the source for the next extraction.

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_switch.png", width=40, align="left" %}

**Output the background as-is at the end**

After repeating this process, only the background remains.

There is no need to extract or remove anything from the background.

With `is_last` and `If/Else Switch`, the last iteration bypasses extraction and removal and outputs the current image as-is.

{% endmediaRow %}

> You might be wondering why I use `iteration_index` instead of a fixed seed.  
> I do not know whether this is a bug or intended behavior, but editing an image again with the same seed makes the output badly artifacted.  
> It works fine as long as the seed changes, so as a quick workaround I use `iteration_index`, which changes on every loop.

**Output example**

![input](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_input.png){media=image} ![output 1](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output1.png){media=image} ![output 2](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output2.png){media=image} ![output 3](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output3.png){media=image} ![output 4](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output4.png){media=image} ![output 5](/media/basic-workflows/qwen-image-2-1/qwen_image_2_1_layer_decomposition_output5.png){media=image}
