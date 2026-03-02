---
layout: page.njk
lang: en
slug: panorama-stickers
section: notes
navId: panorama-stickers
title: "ComfyUI Panorama Stickers"
summary: "A dedicated UI for placing reference images on an ERP canvas and filling the rest with outpainting"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0732762b1efdf916b6a5836a9078e90e.png"
---

## ComfyUI Panorama Stickers

![](https://gyazo.com/748e50cd59976f45acabd7cf39d45bc6){gyazo=player}

This is a dedicated UI for **FLUX.2 Klein 4B/9B 360 ERP Outpaint LoRA**, which creates a 360 panorama from reference images.

The basic approach of this LoRA is outpainting.  
An image where a panorama is unfolded into a rectangle is called an **ERP** (equirectangular panorama), and the idea here is that you can create a panorama by placing any image on an empty ERP and outpainting the remaining area.

However, simply placing an image on a rectangle does not make it look natural as an ERP.  
Since an ERP is an unfolded panorama, the distortion changes depending on the location. Also, creating a control image while looking at an ERP and trying to imagine the finished panorama is not great UX.

This custom node

- **lets you step inside the panorama,**
- **place reference images while looking at the scene as if you were actually there,**
- **and output the result as an ERP.**

That makes it much easier to create control images.  
Then you can have FLUX.2 Klein edit the output ERP as-is to complete the panorama.

---

## Node Overview

This custom node consists of four nodes.

- `Panorama Stickers`: places images on the ERP canvas
- `Panorama Cutout`: cuts out any viewpoint inside the panorama, like taking a photo
- `Panorama Preview`: previews on the node itself
- `Panorama Seam Prep`: prepares the left/right seam

---

## Installation

[nomadoor/ComfyUI-Panorama-Stickers](https://github.com/nomadoor/ComfyUI-Panorama-Stickers/tree/main)

- Install it from `ComfyUI Manager`.

---

## Basic Canvas Controls

To keep it stable on both Legacy and Node 2.0, the main design is to operate it from a dedicated modal UI.

> `Panorama Preview` can still be previewed on the node, but operation is designed around the modal UI.

{% mediaRow img="https://gyazo.com/fc789c1056b38005c59d1e5be6c3095d{gyazo=loop}", width=60, align="left" %}

**Open the modal UI**

- Click the `Open Stickers Editor` button. (`Cutout` / `Preview` work the same way.)

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/18d7795a35504cf58fe4813ed364a00e{gyazo=loop}", width=60, align="left" %}

**Move viewpoint / Zoom**

- Left drag / middle drag to move the viewpoint
- Use the mouse wheel to change FOV (zoom in / out)

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/02163c2018590f8b022623f9e711878d{gyazo=loop}", width=60, align="left" %}

**Bottom-right buttons**

- Reset viewpoint
- Toggle guide lines

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ec0a8aaafab38c71dd23bdb075f224d5{gyazo=loop}", width=60, align="left" %}

**Switch render mode**

- Use the top-left toggle to switch between `Panorama` and `ERP`

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/0873609554f60abe700f435144d23936{gyazo=loop}", width=60, align="left" %}

**Drag direction**

- In the Inspector, go to `UI Setting` → `Inverted` to reverse it

{% endmediaRow %}


## Panorama Stickers

This is the editor for placing reference images on the ERP canvas.

{% mediaRow img="https://gyazo.com/217f50a8bb037ca6c10ce55cd230bf8d{gyazo=loop}", width=60, align="left" %}

**Add images**

- Add with the `+ Image` button, or via drag and drop
- Right after adding, the image is placed near the center of the current view

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e9907e0255952679f448d7796dd9d719{gyazo=loop}", width=60, align="left" %}

**Move / Scale / Rotate images**

- Drag the image to move it
- When you select an image, handles appear, so you can transform it by grabbing each dot
  - Hold `Shift` while rotating to snap in 45-degree steps
- You can also adjust it with the sliders in the Inspector

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e7ca94b114093b218c82a333761021a3{gyazo=loop}", width=60, align="left" %}

**Stack order / Duplicate**

- When you select an image, a UI appears below it
- Use the buttons to move it to the front or back
- You can duplicate the same image with the duplicate button

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/6080f7006f8dfdfcd1e15fd30a394e50{gyazo=loop}", width=60, align="left" %}

**Delete images**

- Use the delete button below the image, or press `Delete`
- You can also remove everything with the `Clear all` button at the bottom of the canvas

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ba80aed93898c33f2f2588f7245723eb{gyazo=loop}", width=60, align="left" %}

**Select images from the Inspector**

- If you choose an image from `Image` in the Inspector, the viewpoint moves so that image comes to the center

{% endmediaRow %}


## Panorama Cutout

This is the editor for stepping inside the panorama and cutting out any viewpoint as if you were taking a photo with a camera.

{% mediaRow img="https://gyazo.com/e7e7075770cd2693e94334bf09743fac{gyazo=loop}", width=60, align="left" %}

**Add frames**

- Add one from `+ Add frame` at the bottom
- A preview appears in the top-right

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/033ef3fd91b9bb4cc283906ae53b7269{gyazo=loop}", width=60, align="left" %}

**Move / Scale / Rotate frames**

- The basics are the same as `Panorama Stickers`
- You can also change the aspect ratio by dragging the edges

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/da133d6d6fc2c17e7f4a59f716b92fec{gyazo=loop}", width=60, align="left" %}

**Switch to preset aspect ratios**

- From the UI shown when a frame is selected, you can choose `1:1`, `3:2`, and so on
- Use `Rotate 90°` next to it to switch orientation

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a6d69406f8888c84cbbdcbd42a184107{gyazo=loop}", width=60, align="left" %}

**Move viewpoint to the frame**

- Use the `📷` button in the bottom UI to move the viewpoint to that frame

{% endmediaRow %}


## Panorama Preview

This node lets you preview directly on the node. It uses the same modal UI as the others, but with a narrower feature set.

{% mediaRow img="https://gyazo.com/fe09e529eea57ebf960f97b0d7720514{gyazo=loop}", width=60, align="left" %}

**On-node preview**

- Basically, you can operate it much like the modal UI, using drag and the mouse wheel

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/c98e12d762e11fb8922ffa3991912d6b{gyazo=image}", width=60, align="left" %}

**Fullscreen**

- Use the bottom-right button to enter fullscreen
- Press `Esc` to exit

{% endmediaRow %}


## Panorama Seam Prep

No matter how well the model is trained, getting the left and right edges (the seam) of a panorama to match perfectly is difficult.  
This node is used when you shift the image so the seam comes to the center, then do a final inpainting pass on that seam.

![](https://gyazo.com/09deac88400d8e8d1f9301eda07c7b13){gyazo=image}

[](/workflows/notes/panorama-stickers/PanoramaSeamPrep.json)

- `seam_width_px`: sets the width of the mask
- `seam_center_offset_px`: shifts the seam away from the center
- `mask_blur_px`: blurs both ends of the mask
  - Use this when compositing the inpainted result back onto the original image

---

## workflow

Let's actually use the LoRA and create an ERP panorama from reference images.

> This is a known issue, but the LoRA barely works with Distilled models. I am still looking for a workaround, but for now please use it with the base model.

### Model Download

- diffusion_models

  - [flux-2-klein-base-9b-fp8.safetensors](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9b-fp8/blob/main/flux-2-klein-base-9b-fp8.safetensors)
  - [flux-2-klein-base-4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-base-4b.safetensors)

- loras

  - [flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-360-erp-outpaint-lora/blob/main/flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors)
  - [flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors](https://huggingface.co/nomadoor/flux-2-klein-4B-360-erp-outpaint-lora/blob/main/flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors)

- text_encoders

  - [qwen_3_8b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/text_encoders/qwen_3_8b.safetensors)
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/text_encoders/qwen_3_4b.safetensors)

- vae

  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-base-9b-fp8.safetensors
    │   └── flux-2-klein-base-4b.safetensors
    ├── 📂loras/
    │   ├── flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors
    │   └── flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_3_8b.safetensors
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### flux-2-klein-9B-360-erp-outpaint

![](https://gyazo.com/fc52e8eca49723f6ca9fd426abadc636){gyazo=image}
[](/workflows/notes/panorama-stickers/flux-2-klein-9B-360-erp-outpaint.json)

- Use `Panorama Stickers` to place reference images and create the ERP
- The prompt can be just “trigger words + a little extra”

```text
Fill the green spaces according to the image. Outpaint as a seamless 360 equirectangular panorama (2:1). Keep the horizon level. Match left and right edges.
```

> What gets generated is an ERP (2:1) image. It is hard to read as-is, so check or capture it with `Panorama Preview` or `Panorama Cutout`.

### flux-2-klein-4B-360-erp-outpaint

![](https://gyazo.com/fa6b005b1c0389c38728310e5b7a3085){gyazo=image}
[](/workflows/notes/panorama-stickers/flux-2-klein-4B-360-erp-outpaint.json)
