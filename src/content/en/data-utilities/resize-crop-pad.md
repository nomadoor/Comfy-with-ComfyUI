---
layout: page.njk
lang: en
section: data-utilities
slug: resize-crop-pad
navId: resize-crop-pad
title: "Resize, Crop, and Pad"
summary: "About image resizing, cropping, and padding"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/02cf6bd2a573dc15dff4799c94b15a0d.png"
---

## Image Resizing and Cropping

It may seem like a simple task of enlarging an image or cropping it to a square, but it is a very important process in image generation.

- **Model's Optimal Resolution**: Models have a "resolution where they perform best".
- **Saving VRAM**: If you inadvertently load and process a 4K image, you will instantly run "Out of memory".
- **Unifying Materials**: In image compositing, etc., it is necessary to align the sizes of multiple materials.

Since this is a frequently used task, let's firmly understand the differences between each node.

---

## Getting Image Information

### Get Image Size Node

Outputs the width, height, and batch size (count) of the image as numerical values.

![](https://gyazo.com/ffb5c8bfea06d5ce1b15183cc70dc973){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Get_Image_Size.json)

---

## Resize

### Resize Image/Mask Node

A node that allows you to switch between several resizing methods.  
Basically, this one node covers most of the necessary processing. (By the way, masks can also be resized.)

{% mediaRow img="https://gyazo.com/afa66ff808e05a40e363761184c668c1 {gyazo=image}", width=45, align="left" %}

**scale by multiplier**

Scales vertically and horizontally by a "multiplier".

For example, `0.5` makes the vertical and horizontal dimensions half, and `2.0` makes them double.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-by-multiplier.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/4fc6f32dc60859a38a2cf3a125aa82bf {gyazo=image}", width=45, align="left" %}

**scale dimensions**

Forcibly changes the resolution to the specified width and height.

- `crop`
  - `disabled` : Distorts the image if the aspect ratio is different.
  - `center` : Maintains the center and crops (discards) the protruding parts instead of distorting.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-dimensions.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/bdc737b190e9e45ebc6a55a1b155414e {gyazo=image}", width=45, align="left" %}

**scale longer/shorter dimension**

Resizes the image specifying only the long side (longer) or short side (shorter), maintaining the aspect ratio.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-longer-dimension.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/adcd25f46b34298cea4a37a046b221bf {gyazo=image}", width=45, align="left" %}

**scale width/height**

Resizes the image specifying only either the width or height, maintaining the aspect ratio.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-width.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/13116851f0f749d7f4f5e350fb474f5e {gyazo=image}", width=45, align="left" %}

**scale total pixels**

Resizes the image to match the specified **total number of pixels** while maintaining the aspect ratio.

Calculated as `1024 * 1024 = 1.00MP`.

| Target Size | Total Pixels | Setting Value |
| :--- | :--- | :--- |
| **512 × 512** | 262,144 | **0.25** |
| **768 × 768** | 589,824 | **0.56** |
| **1024 × 1024** | 1,048,576 | **1.00** |
| **1536 × 1536** | 2,359,296 | **2.25** |

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-total-pixels.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e4398957f8190305364c6b9c12948c3c {gyazo=image}", width=45, align="left" %}

**match size**

Resizes the image to match the size of a reference image.

Previously, it was necessary to get the size of the reference image and pass it to another node, but now this combines it into one.

- `match`: Connect the image you want to use as a reference.
- `crop`
  - `disabled` : Distorts the image if the aspect ratio is different.
  - `center`: Maintains the center and crops (discards) the protruding parts.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_match-size.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/28d95c2ef2e320c18761852f60f2a508 {gyazo=image}", width=45, align="left" %}

**scale to multiple**

Resizes the vertical and horizontal dimensions to be multiples of N.

Details are explained in [Why can I only generate resolutions that are multiples of 8?](/en/faq/why-multiple-of-8/), but in short, diffusion models cannot handle resolutions that are not specific multiples due to VAE limitations.

Basically, ComfyUI often adjusts automatically internally, so there isn't much need for this node unless you encounter errors with non-specific resolutions, or when you want to "perfectly match" the pixels of the input and output.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-to-multiple.json)
{% endmediaFooter %}

{% endmediaRow %}


### ImageScaleToMaxDimension Node

Resizes the image so that the **long side** becomes the set size, maintaining the aspect ratio.  
(Example: Whether it is a portrait or landscape image, make the longer side 1024px)

![](https://i.gyazo.com/42ffc7b0534face3e58fc7946b243ce0.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageScaleToMaxDimension.json)


---

## Padding

Padding is the process of adjusting the size by adding margins (black bars, etc.) around the image.  
Depending on the node, this margin part can be output as a mask, so it is used as preparation for Outpainting.

### ResizeAndPadImage Node

Resizes to the specified resolution and fills the missing parts with padding.

![](https://gyazo.com/633441a119959e98e0dca5cb765a53d8){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ResizeAndPadImage.json)

> Since this node cannot output the padding part as a mask, there are practically no occasions to use it.

### Pad Image for Outpainting Node

Adds margins of the specified number of pixels to the top, bottom, left, and right of the image.

![](https://gyazo.com/c6200467aad1b43edbc09b2ec4f3f2b0){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Pad_Image_for_Outpainting.json)


The margin part is output as a mask.

- **feathering**: Blurs the boundary between the margin and the image. Affects only the mask.

---

## Crop and Other Edit Operations

### ImageCrop Node

Crops a part of the image in a rectangle by specifying x, y coordinates and width/height.

![](https://i.gyazo.com/1c996b2fa8f7213f05c524b16468181e.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageCrop.json)


### ImageRotate Node

Rotates the image by 90 / 180 / 270 degrees.

![](https://gyazo.com/8de36981f39e9c39ec1b6c4aa3f9a7ff){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageRotate.json)


### ImageFlip Node

Flips the image horizontally / vertically.

![](https://gyazo.com/e0661734e160f918d9fc9080dda91240){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageFlip.json)


---

## Resize Image v2 Node

This is a node included in **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**.

It is like a node that combines the above resize, crop, and padding into one.

| Parameter Name | Description |
| :--- | :--- |
| **width / height** | Target width and height (no change if 0) |
| **upscale_method** | Interpolation method during resizing (nearest, bilinear, etc.) |
| **keep_proportion** | stretch, pad, crop, etc. |
| **pad_color** | Color for padding (RGB) |
| **crop_position** | center, top, bottom, left, right |
| **divisible_by** | Resizes to a resolution that is a multiple of this value (e.g., 32, 64) |

> Previously, this was used frequently to resize to multiples of N, but now that core nodes handle this, it is not used much.

---

## A Little Application

Let's try some slightly complex image processing by combining the nodes so far.

### Crop Image to Half

![](https://gyazo.com/02cf6bd2a573dc15dff4799c94b15a0d){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Crop_to_half_size.json)

- Get the size of the image
- Calculate half the width with `Simple math` node
- Input the calculated width to `ImageCrop` node and crop to half
