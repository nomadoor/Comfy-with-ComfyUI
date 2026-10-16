---
layout: page.njk
lang: en
section: data-utilities
slug: resize-crop-pad
navId: resize-crop-pad
title: "Resize, Crop, and Pad"
created: 2025-11-25
updated: 2026-03-02
summary: "Resizing, cropping, and padding images"
seoTitle: "Resize, Crop, and Pad Images in ComfyUI"
seoDescription: "ComfyUI nodes for resizing, cropping, and padding images, and when to use each to match a model's resolution and save VRAM, with easy-to-read workflows."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/resize-crop-pad/legacy_gyazo_02cf6bd2a573dc15dff4799c94b15a0d.png"
---

## Image Resizing and Cropping

Making an image bigger, cropping it to a square... these are simple tasks, but they matter a lot in image generation.

- **The model's ideal resolution**: Every model has a resolution where it performs best.
- **Saving VRAM**: Accidentally load and process a 4K image, and you'll hit "Out of memory" in no time.
- **Matching your inputs**: For things like compositing, you need several images to be the same size.

You'll do this a lot, so it's worth getting a solid grasp of how each node differs.

---

## Getting Image Information

### Get Image Size Node

Outputs the image's width, height, and batch size (number of images) as numbers.

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_ffb5c8bfea06d5ce1b15183cc70dc973.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/get_image_size.json)

---

## Resize

### Resize Image/Mask Node

A node that lets you switch between several resize methods.  
This one node covers most of what you'll need. (It can resize masks too, by the way.)

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_afa66ff808e05a40e363761184c668c1.png {media=image}", width=45, align="left" %}

**scale by multiplier**

Scales width and height by a multiplier.

For example, `0.5` halves both, and `2.0` doubles both.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_by_multiplier.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_4fc6f32dc60859a38a2cf3a125aa82bf.png {media=image}", width=45, align="left" %}

**scale dimensions**

Forces the image to the width and height you specify.

- `crop`
  - `disabled` : Distorts the image if the aspect ratio is different.
  - `center` : Keeps the center and crops off (discards) whatever sticks out.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_dimensions.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_bdc737b190e9e45ebc6a55a1b155414e.png {media=image}", width=45, align="left" %}

**scale longer/shorter dimension**

Resizes while keeping the aspect ratio, based only on the long side (longer) or short side (shorter).

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_longer_dimension.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_adcd25f46b34298cea4a37a046b221bf.png {media=image}", width=45, align="left" %}

**scale width/height**

Resizes while keeping the aspect ratio, based only on the width or the height.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_width.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/resize_imagemask_scale_total_pixels.png {media=image}", width=45, align="left" %}

**scale total pixels**

Resizes to the specified **total pixel count** while keeping the aspect ratio.

Calculated as `1024 * 1024 = 1.00MP`.

| Target Size | Total Pixels | Setting Value |
| :--- | :--- | :--- |
| **512 × 512** | 262,144 | **0.25** |
| **768 × 768** | 589,824 | **0.56** |
| **1024 × 1024** | 1,048,576 | **1.00** |
| **1536 × 1536** | 2,359,296 | **2.25** |

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_total_pixels.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_e4398957f8190305364c6b9c12948c3c.png {media=image}", width=45, align="left" %}

**match size**

Resizes the image to the same size as a reference image.

You used to have to get the reference image's size and pass it to another node, but now it all happens in one.

- `match`: Connect the image you want to use as a reference.
- `crop`
  - `disabled` : Distorts the image if the aspect ratio is different.
  - `center`: Keeps the center and crops off (discards) whatever sticks out.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_match_size.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/resize-crop-pad/legacy_gyazo_28d95c2ef2e320c18761852f60f2a508.png {media=image}", width=45, align="left" %}

**scale to multiple**

Resizes so that width and height are multiples of N.

I go into detail in [Why can I only generate resolutions that are multiples of 8?](/en/notes/why-multiple-of-8/), but because of how the VAE works, diffusion models can't handle resolutions that aren't a certain multiple as-is.

Some node along the way often adjusts this for you, but this comes in handy when you get errors unless the resolution is exactly right, or when you want the input and output pixels to match exactly.

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/resize_imagemask_scale_to_multiple.json)
{% endmediaFooter %}

{% endmediaRow %}


### ImageScaleToMaxDimension Node

Resizes so that the image's **long side** matches the size you set, keeping the aspect ratio.  
(For example, the longer side becomes 1024px whether the image is portrait or landscape.)

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_42ffc7b0534face3e58fc7946b243ce0.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/imagescaletomaxdimension.json)


---

## Padding

Padding adjusts the size by adding margins (such as black bars) around the image.  
Some nodes can output the margin as a mask, which makes padding a common first step for Outpainting.

### ResizeAndPadImage Node

Resizes to the specified resolution and fills the rest with padding.

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_633441a119959e98e0dca5cb765a53d8.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/resizeandpadimage.json)

> [!NOTE]
> This node can't output the padding as a mask, so you'll hardly ever use it.

### Pad Image for Outpainting Node

Adds the specified number of pixels of margin to the top, bottom, left, and right of the image.

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_c6200467aad1b43edbc09b2ec4f3f2b0.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/pad_image_for_outpainting.json)


The margin is output as a mask.

- **feathering**: Blurs the boundary between the margin and the image. Affects only the mask.

---

## Cropping and Other Edits

### ImageCrop Node

Cuts out a rectangular part of the image, given x/y coordinates and a width and height.

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_1c996b2fa8f7213f05c524b16468181e.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/imagecrop.json)


### ImageRotate Node

Rotates the image by 90 / 180 / 270 degrees.

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_8de36981f39e9c39ec1b6c4aa3f9a7ff.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/imagerotate.json)


### ImageFlip Node

Flips the image horizontally / vertically.

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_e0661734e160f918d9fc9080dda91240.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/imageflip.json)


---

## Resize Image v2 Node

This node comes from **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**.

It's basically the resize, crop, and padding above rolled into one node.

| Parameter Name | Description |
| :--- | :--- |
| **width / height** | Target width and height (no change if 0) |
| **upscale_method** | Interpolation method during resizing (nearest, bilinear, etc.) |
| **keep_proportion** | stretch, pad, crop, etc. |
| **pad_color** | Color for padding (RGB) |
| **crop_position** | center, top, bottom, left, right |
| **divisible_by** | Resizes to a resolution that is a multiple of this value (e.g., 32, 64) |

> [!NOTE]
> I used to use this a lot for resizing to multiples of N, but core nodes can do that now, so I don't use it much anymore.

---

## Putting It Together

Let's combine the nodes so far to do something a little more involved.

### Crop Image to Half

![](/media/data-utilities/resize-crop-pad/legacy_gyazo_02cf6bd2a573dc15dff4799c94b15a0d.png){media=image}

[](/workflows/data-utilities/resize-crop-pad/crop_to_half_size.json)

- Get the size of the image
- Calculate half the width with the `Simple math` node
- Feed that width into the `ImageCrop` node to crop the image in half
