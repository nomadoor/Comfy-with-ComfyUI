---
layout: page.njk
lang: en
section: data-utilities
slug: batch-video
navId: batch-video
title: "Batch & Video"
summary: "Mechanism to handle multiple images/video frames collectively"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Batch?

Batch is a mechanism to **process multiple images simultaneously**.
While List "processes one by one sequentially", Batch differs in that it **passes multiple images at once in a single execution**.

The relationship between Queue / List / Batch is as follows:

- **Queue**
  - Executes the same workflow sequentially from the outside
- **List**
  - Processes multiple inputs one by one sequentially (Sequential processing)
- **Batch**
  - Processes multiple images collectively (Parallel processing)

---

## Video is Batch

Since a video consists of a collection of sequential images,
ComfyUI treats **Video = Batch of IMAGE**.

Therefore, normal Batch operation nodes can be used for videos as they are,
and conversely, video nodes can be used with almost the same feeling as general Batch operations.
There is no need to distinguish between Video and Batch.

---

## Images in Batch must be the same size

Images entering a Batch must **all be the same size**.
If the width/height do not match, subsequent images are automatically cropped based on the first one.

![](https://gyazo.com/8e42e9262108b5d6065a330d16863352){gyazo=image}

[](/workflows/data-utilities/batch-video/Diff_List-Batch.json)

> Top: List
> Bottom: Batch
> Since shapes need to be aligned, images in the back are truncated in Batch.

---

## Load of Parallel Processing (Note on OOM)

Since Batch processes multiple images simultaneously, the required memory amount increases accordingly.
For example, if you flow a 1-minute video directly into image2image, VRAM is likely to be insufficient and cause **OOM (Out Of Memory)**.

In such cases, it is safe to **convert Batch → List** and process one by one.

---

## Required Custom Nodes

Basic ones are provided as core nodes, but it is a bit tough when trying to handle videos.

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)
- [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)
- [kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)
- [Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

---

## Creating a Batch

### Batch Images Node

Groups two `IMAGE`s into a Batch.

![](https://gyazo.com/aca8d944c0efb06dd3c36ff7f3060b15){gyazo=image}

[](/workflows/data-utilities/batch-video/Batch_Images.json)

- You can make a Batch of any number of images by increasing nodes, but for 3 or more, it is more practical to use the node below.

### Make Image Batch Node

![](https://gyazo.com/221f5ed72be92b9215f9d0eaff753669){gyazo=image}

[](/workflows/data-utilities/batch-video/Make_Image_Batch.json)

- Slots are added every time connection increases, allowing you to group any number of images.
- Once connected, it is fixed to that data type.
  If you want to change to another data type, use Fix node (recreate) or place a new node.

### Load Image Batch From Dir (Inspire) / Load Images (Path) Node

Groups images in a folder into a Batch.

![](https://gyazo.com/fca9d0847d5c6a45aafa63c923b0e0d8){gyazo=image}

[](/workflows/data-utilities/batch-video/Load_Image_Batch_From_Dir-Load_Image_(Path).json)

- Inspire node can sort
- VHS node has additional functions such as "Output every N images"

---

## Operating Batch

### Reverse Image Batch Node

Reverses the order of the Batch.
Can be used for reverse playback of videos, etc.

![](https://gyazo.com/433f02c632e722abfe3174cd7eb23837){gyazo=image}

[](/workflows/data-utilities/batch-video/Reverse_Image_Batch.json)

### RepeatImageBatch Node

Repeats the entire Batch a specified number of times.

### ImageBatchRepeatInterleaving Node

Repeats each frame a specified number of times.

![](https://gyazo.com/1384e9cff563f76a7b15fbd0f70f1aa5){gyazo=image}

[](/workflows/data-utilities/batch-video/RepeatImageBatch-ImageBatchRepeatInterleaving.json)

> Top: RepeatImageBatch
> Bottom: ImageBatchRepeatInterleaving

---

## Extracting from Batch

### ImageFromBatch Node

Extracts an image at an arbitrary position from the Batch.

![](https://gyazo.com/6e48d34613f09e7dddfe3f40187f0de0){gyazo=image}

[](/workflows/data-utilities/batch-video/ImageFromBatch.json)

- `batch_index`: Position to extract (starts from 0)
- `length`: Number of images in Batch

### Get Image or Mask Range From Batch Node

Extracts a range of images (or masks) collectively.

### Select Every Nth Image Node (Video Helper Suite)

Gets frames skipping every N images.

![](https://gyazo.com/f5b845e89342f120cc994b999e390e11){gyazo=image}

[](/workflows/data-utilities/batch-video/Select_Every_Nth_Image.json)

- `select_every_nth`: Interval to extract
- `skip_first_images`: Skip the first number of images

---

## Conversion Batch ↔ List

If you want to process one by one after loading a video or Batch, convert it to a List.

### Image Batch to Image List Node

![](https://gyazo.com/1b63fa52915e6e923b0802907066d81c){gyazo=image}

[](/workflows/data-utilities/batch-video/Image_Batch_to_Image_List.json)

Conversely, there is also a node to group a List into a Batch.

- `Image List to Image Batch` Node
