---
layout: page.njk
lang: en
section: data-utilities
slug: layer-composite-blend
navId: layer-composite-blend
title: "Layer Composition"
summary: "Overlaying, stitching, and blending images"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Image Composition

This involves overlaying two images or arranging them side by side.

While this is a simple drag-and-drop operation in Photoshop, it can be quite a struggle to achieve in the node-based ComfyUI.

Although there are scenes where it is necessary, such as in Inpainting processing, like color correction, giving up and using a paint tool is also a good choice.

---

## Overlaying Images

This is the operation of simply placing one image on top of another.

### ImageCompositeMasked Node

![](https://gyazo.com/0f12d674fe3e1f6f30c2a06340464eb4){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked.json)

This is the basic node for overlaying images.

- **destination**: The background (base) image.
- **source**: The foreground (top) image.
- **x / y**: Position adjustment based on the top-left corner.
- **resize_source**: If set to `true`, the `source` image is stretched to the same size as the `destination` (Note: it will be distorted if the aspect ratio is different).

### Centering the Image

![](https://gyazo.com/282ad8bae51d35eef6a4810780f3eb82){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-Align_center.json)

It is possible to center the image by performing coordinate calculations with nodes like the familiar `position: absolute; top: 50%; left: 50%;` in CSS, but... well, honestly, it's a hassle (；・∀・)

---

## Overlaying Transparent Images

This is the core of layer composition in ComfyUI.

If you want to overlay an "image with a transparent background", simply connecting the images will not work.

In ComfyUI, you need to rethink this as a process of **"replacing the masked part with the source image"**.

### Steps to Composite Transparent PNGs

![](https://gyazo.com/cd53e89115c033f8a8ea175b72ca0aef){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-with_Alpha.json)

We use the same `ImageCompositeMasked` node, but we use the **`mask` input**.

- 1. When you load a transparent image, you get a "mask of the transparent part" from the `MASK` output.
- 2. Connect this mask to the `mask` input of the `ImageCompositeMasked` node.
- 3. Then, **only the masked part is replaced by the source image (e.g., pink sky)**.

### Handling Distortion Due to Size Differences

If `resize_source` is set to `true`, the source image is forcibly stretched to the same size as the destination image.

![](https://gyazo.com/f7ba12c0cf33e3e5dc8a9b5fb24cb0a6){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked-with_crop-pad.json)

This is not a concern if the background is a solid color or pattern, but it will be distorted in the case of photos.
The easiest solution is to **pad/crop the two images to the same size in advance**.

- 🟪 Pad the foreground image to the size of the background image.
- 🟨 Crop the background image to the size of the foreground image.

### Practical Example: Combining with Segmentation

![](https://i.gyazo.com/c848c0f8e8d3ee590ba7ae09e8db7e68.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/ImageCompositeMasked_Segmentation.json)

The same logic applies when you want to "change the color of only the dress part".

- 1. Create a "dress mask" from the input image using segmentation.
- 2. Connect `EmptyImage` (solid color image) etc. to `source`.
- 3. Set `resize_source` to `true` (It's OK because it doesn't matter if a solid color is distorted).
- 4. Now only the dress part is filled with the specified color.

It may be hard to grasp at first, but you will get used to it gradually.

---

## Stitching Images (Concatenation)

Combine images side by side or vertically. This is useful when you want to create comparison images.

### Image Stitch Node

![](https://i.gyazo.com/4ce9346ef269709f6456f0fcd5832a9c.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Stitch.json)

A simple stitching node.

### 🪢 Image Concatenate From Batch Node

![](https://i.gyazo.com/18d0555fd1d0bd01ead60b3992662cb0.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Concatenate_From_Batch.json)

You can arrange 3 or 4 images by using multiple Stitch nodes, but if you want to arrange batch (multiple set) images in a grid, this node handles it smartly.

- Included in **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**.

---

## Mixing Images (Blending)

### Image Blend Node

![](https://i.gyazo.com/0c3dbad0a36a0399e7e12301a4b58638.png){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/Image_Blend.json)

This is like the "blend mode" of layers in paint software.
Standard nodes can only do very simple blending, but you can adjust the strength of the composition with `blend_factor`.

- `blend_factor`: The closer to 1.0, the stronger the source image becomes.

---

## EmptyImage Node

![](https://gyazo.com/c39404b4f19fe6a47565b326b7f0dc6d){gyazo=image}

[](/workflows/data-utilities/layer-composite-blend/EmptyImage.json)

A node that just creates a solid color image.

### How to Set Color

Setting the color is tricky; instead of the familiar hexadecimal or RGB, you set it in **24-bit color (decimal)**.

The calculation formula is as follows:

```
Decimal Value = (Red × 65536) + (Green × 256) + Blue
```

**Example:** If you want to create pink (RGB: 255, 192, 203)

```
255 × 65536 + 192 × 256 + 203 = 16,761,035
```

Enter the value calculated in this way into the `color` parameter.
