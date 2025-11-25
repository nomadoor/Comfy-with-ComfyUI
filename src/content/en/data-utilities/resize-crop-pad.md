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
  image: ""
---

## Image Resizing and Cropping

It may seem like a simple task of enlarging an image or cropping it to a square, but it is a very important process in image generation.

- **Model's Optimal Resolution**: Models have a "resolution where they perform best".
- **Saving VRAM**: If you inadvertently load and process a 4K image, you will instantly run "Out of memory".
- **Unifying Materials**: In image compositing, etc., it is necessary to align the sizes of multiple materials.

Since this is a frequently used task, let's firmly understand the differences between each node.

---

## Resize

### Upscale Image Node

![](https://gyazo.com/c34faedbc24e22f65ac65462b9684f52){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Upscale_Image.json)

Forcibly changes the resolution to the specified width and height.

- **Aspect Ratio**: If you specify a ratio different from the original image, the image will be distorted.
- **crop**: If set to `center`, it will maintain the center and crop (discard) the protruding parts instead of distorting.

### Upscale Image By Node

![](https://i.gyazo.com/adcb853e458db1583e11fbcb4a8b0f87.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Upscale_Image_By.json)

Specifies the size by magnification, such as "1.5x" or "0.5x". The aspect ratio is maintained.

### ImageScaleToMaxDimension Node

![](https://i.gyazo.com/42ffc7b0534face3e58fc7946b243ce0.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageScaleToMaxDimension.json)

Resizes the image so that the **long side** becomes the set size, maintaining the aspect ratio.
(Example: Whether it is a portrait or landscape image, make the longer side 1024px)

### Scale Image to Total Pixels Node

![](https://i.gyazo.com/e195b70965fc2e7dbf0511527516e527.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Scale_Image_to_Total_Pixels.json)

Resizes the image to the specified **total number of pixels** while maintaining the aspect ratio.

**This is a slightly important process**

Image generation models are trained with images of specific resolutions and various aspect ratios. For the model to perform at its best, it is important to generate images at a size (total number of pixels) similar to when it was trained.

Using this node, you can adjust the image by specifying the total number of pixels while maintaining the original composition. Convenient!

**Commonly Used Values (Megapixels)**

| Target Size | Total Pixels | Setting Value (megapixels) |
| :--- | :--- | :--- |
| **512 × 512** | 262,144 | **0.25** |
| **768 × 768** | 589,824 | **0.56** |
| **1024 × 1024** | 1,048,576 | **1.00** (Recommended for SDXL) |
| **1536 × 1536** | 2,359,296 | **2.25** |

---

## Padding

Padding is the process of adjusting the size by adding margins (black bars, etc.) around the image.

Depending on the node, this margin part can be output as a mask, so it is used as preparation for Outpainting.

### ResizeAndPadImage Node

![](https://gyazo.com/633441a119959e98e0dca5cb765a53d8){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ResizeAndPadImage.json)

Resizes to the specified resolution and fills the missing parts with padding.

Since it cannot output as a mask, there may be few occasions to use it.

### Pad Image for Outpainting Node

![](https://gyazo.com/c6200467aad1b43edbc09b2ec4f3f2b0){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Pad_Image_for_Outpainting.json)

Adds margins of the specified number of pixels to the top, bottom, left, and right of the image.

The margin part is output as a mask.

- **feathering**: Blurs the boundary between the margin and the image. Affects only the mask.

---

## Crop and Other Edit Operations

### ImageCrop Node

![](https://i.gyazo.com/1c996b2fa8f7213f05c524b16468181e.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageCrop.json)

- Crops a part of the image in a rectangle by specifying x, y coordinates and width/height.

### ImageRotate Node

![](https://gyazo.com/8de36981f39e9c39ec1b6c4aa3f9a7ff){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageRotate.json)

- Rotates the image by 90 / 180 / 270 degrees.

### ImageFlip Node

![](https://gyazo.com/e0661734e160f918d9fc9080dda91240){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageFlip.json)

- Flips the image horizontally / vertically.

---

## Resize Image v2 Node

This is a node included in **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**.

It is like a node that combines the above resize, crop, and padding into one.

Other than that, as an important process, it can **resize the image to a resolution that is a multiple of N**.

| Parameter Name | Description |
| :--- | :--- |
| **width / height** | Target width and height (no change if 0) |
| **upscale_method** | Interpolation method during resizing (nearest, bilinear, etc.) |
| **keep_proportion** | stretch, pad, crop, etc. |
| **pad_color** | Color for padding (RGB) |
| **crop_position** | center, top, bottom, left, right |
| **divisible_by** | Resizes to a resolution that is a multiple of this value (e.g., 32, 64) |

![](https://gyazo.com/35159d157a239f57c67b03484bd2cfa9){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Crop_to_multiple_of_32.json)

Settings to just resize the image to a resolution that is a multiple of 32.

- `divisible_by`: Resizes to a resolution that is a multiple of this value.
- If you simply want to perform this operation, set other parameters to 0.

**Why is this operation important?**

It involves something called VAE. I will explain in detail in [Why can only resolutions that are multiples of 8 be generated?](), but anyway, generative AI cannot generate images with subtle resolutions.

Basically, ComfyUI crops automatically internally, so there is no need to use this node, but it is used when an error occurs if it is not the specified resolution, or when you want to perfectly match the pixels of the input image and the output image.

---

## Getting Image Information

### Get Image Size Node

![](https://i.gyazo.com/961e83cbf29cbf1f1ab583de4a9e1a00.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Get_Image_Size.json)

- Outputs the width and height of the image as numerical values.
- If you connect the obtained size to `Upscale Image`, you can match another image to "exactly the same size".
- *In the latest version, batch size (number of sheets) can also be obtained.

---

## A Little Application

Let's try some slightly complex image processing by combining the nodes so far.

### Crop Image to Half

![](https://gyazo.com/02cf6bd2a573dc15dff4799c94b15a0d){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Crop_to_half_size.json)

- Get the size of the image
- Calculate half the width with `Simple math` node
- Input the calculated width to `ImageCrop` node and crop to half
