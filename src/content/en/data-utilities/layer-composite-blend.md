---
layout: page.njk
lang: en
section: data-utilities
slug: layer-composite-blend
navId: layer-composite-blend
title: "Layer Composition"
created: 2025-11-25
updated: 2026-03-02
summary: "Overlaying, stitching, and blending images"
seoTitle: "Composite, Stitch, and Blend Images in ComfyUI"
seoDescription: "Combine images in ComfyUI: overlay with ImageCompositeMasked, composite transparent PNGs, stitch images side by side, and blend with Image Blend."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Image Composition

This means layering two images or placing them side by side.

In Photoshop, you'd just drag one image on top of the other, but doing the same thing in node-based ComfyUI takes some work.

You'll sometimes need it for things like inpainting, but just like with color correction, giving up and using a paint tool is also a perfectly good choice.

---

## Overlaying Images

This simply places one image on top of another.

### ImageCompositeMasked Node

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_0f12d674fe3e1f6f30c2a06340464eb4.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked.json)

This is the basic node for overlaying images.

- **destination**: The background (base) image.
- **source**: The foreground (top) image.
- **x / y**: Position, measured from the top-left corner.
- **resize_source**: If set to `true`, the `source` image is stretched to the same size as the `destination` (Note: it will be distorted if the aspect ratio is different).

### Centering the Image

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_282ad8bae51d35eef6a4810780f3eb82.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked_align_center.json)

You can center it by doing coordinate math with nodes, like the familiar `position: absolute; top: 50%; left: 50%;` in CSS, but... well, honestly, it's a pain (；・∀・)

---

## Overlaying Transparent Images

This is the key to layer compositing in ComfyUI.

If you want to overlay "an image with a transparent background," simply connecting the images won't work.

In ComfyUI, you have to think of it instead as **"replacing the masked area with the source image."**

### Steps to Composite Transparent PNGs

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_cd53e89115c033f8a8ea175b72ca0aef.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked_with_alpha.json)

It's the same `ImageCompositeMasked` node, but this time you use the **`mask` input**.

- 1. When you load a transparent image, you get a "mask of the transparent part" from the `MASK` output.
- 2. Connect this mask to the `mask` input of the `ImageCompositeMasked` node.
- 3. Then, **only the masked part is replaced by the source image (e.g., pink sky)**.

### Handling Distortion Due to Size Differences

If `resize_source` is set to `true`, the source image is forcibly stretched to the same size as the destination image.

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_f7ba12c0cf33e3e5dc8a9b5fb24cb0a6.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked_with_crop_pad.json)

That's fine if the background is a solid color or a pattern, but a photo will end up distorted.
The easiest solution is to **pad/crop the two images to the same size in advance**.

- 🟪 Pad the foreground image to the size of the background image.
- 🟨 Crop the background image to the size of the foreground image.

### Practical Example: Combining with Segmentation

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_c848c0f8e8d3ee590ba7ae09e8db7e68.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/imagecompositemasked_segmentation.json)

The same idea applies when you want to "change the color of just the dress."

- 1. Create a "dress mask" from the input image using segmentation.
- 2. Connect `EmptyImage` (solid color image) etc. to `source`.
- 3. Set `resize_source` to `true` (a solid color doesn't care about distortion, so this is fine).
- 4. Now only the dress is filled with the chosen color.

It may be hard to get a feel for at first, but you'll get used to it.

---

## Stitching Images (Concatenation)

Joins images side by side or top to bottom. Handy for making comparison images.

### Image Stitch Node

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_4ce9346ef269709f6456f0fcd5832a9c.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/image_stitch.json)

A simple stitching node.

### 🪢 Image Concatenate From Batch Node

![](/media/data-utilities/layer-composite-blend/image_concatenate_from_batch.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/image_concatenate_from_batch.json)

You can line up 3 or 4 images by chaining Stitch nodes, but if you want to lay out a batch (a set of images) in a grid all at once, this node handles it neatly.

- Included in **[Kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**.

---

## Mixing Images (Blending)

### Image Blend Node

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_0c3dbad0a36a0399e7e12301a4b58638.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/image_blend.json)

It's like a layer's "blend mode" in paint software.
Out of the box it can only do very simple blending, but you can adjust how strongly the images are mixed with `blend_factor`.

- `blend_factor`: The closer to 1.0, the stronger the source image.

---

## EmptyImage Node

![](/media/data-utilities/layer-composite-blend/legacy_gyazo_c39404b4f19fe6a47565b326b7f0dc6d.png){media=image}

[](/workflows/data-utilities/layer-composite-blend/emptyimage.json)

A node that just creates a solid color image.

### How to Set Color

Setting the color is a bit confusing: instead of the familiar hex code or RGB, you enter it as **24-bit color (a decimal number)**.

The calculation formula is as follows:

```
Decimal Value = (Red × 65536) + (Green × 256) + Blue
```

**Example:** If you want to create pink (RGB: 255, 192, 203)

```
255 × 65536 + 192 × 256 + 203 = 16,761,035
```

Enter the resulting value in the `color` parameter.
