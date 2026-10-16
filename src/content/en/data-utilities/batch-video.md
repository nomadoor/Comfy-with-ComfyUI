---
layout: page.njk
lang: en
section: data-utilities
slug: batch-video
navId: batch-video
title: "Batch & Video"
created: 2025-11-27
updated: 2026-03-02
summary: "How to handle multiple images or video frames together"
seoTitle: "Batches and Video in ComfyUI"
seoDescription: "Process many images or video frames at once with ComfyUI batches: vs. Queue and List, why video is a batch, OOM pitfalls, and batch nodes."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Batch?

A Batch is a way to **process multiple images together, at the same time**.
Where a List "processes items one at a time, in order," a Batch **sends several images through at once in a single run**.

Here's how Queue, List, and Batch relate:

- **Queue**
  - Runs the same workflow repeatedly, in order, from the outside
- **List**
  - Processes multiple inputs one at a time, in order (sequential processing)
- **Batch**
  - Processes multiple images as one bundle (parallel processing)

---

## Video is Batch

A video is made up of a sequence of numbered images,
so ComfyUI treats **video = a Batch of IMAGE**.

That means regular Batch nodes work on videos as they are,
and the other way around, video nodes feel almost the same as ordinary Batch operations.
You don't need to think of video and Batch as separate things.

---

## Images in Batch must be the same size

Images entering a Batch must **all be the same size**.
If the width or height doesn't match, the later images are automatically cropped to match the first one.

![](/media/data-utilities/batch-video/legacy_gyazo_8e42e9262108b5d6065a330d16863352.png){media=image}

[](/workflows/data-utilities/batch-video/diff_list_batch.json)

> Top: List
> Bottom: Batch
> Because the shapes have to match, the later images get cropped in the Batch.

---

## Load of Parallel Processing (Note on OOM)

A Batch processes several images at the same time, so it needs that much more memory.
Try feeding a 1-minute video straight into image2image, and you'll run out of VRAM and hit **OOM (Out Of Memory)** in no time.

In cases like this, it's best to **convert the Batch → List** and process the frames one at a time.

---

## Required Custom Nodes

The basics are covered by core nodes, but they fall a bit short once you start working with video.

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)
- [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)
- [kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)
- [Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

---

## Creating a Batch

### Batch Images Node

Groups multiple `IMAGE`s into a Batch.

![](/media/data-utilities/batch-video/legacy_gyazo_6663a7ba4d243f0afd79c41a9406a42d.mp4){media=loop}

[](/workflows/data-utilities/batch-video/batch_images.json)

- A new slot appears each time you connect one, so you can combine as many images as you like.

### Load Image Batch From Dir (Inspire) / Load Images (Path) Node

Groups images in a folder into a Batch.

![](/media/data-utilities/batch-video/legacy_gyazo_fca9d0847d5c6a45aafa63c923b0e0d8.png){media=image}

[](/workflows/data-utilities/batch-video/load_image_batch_from_dir_load_image_path.json)

- The Inspire node can sort
- The VHS node has extra options, such as "output every N images"

---

## Operating Batch

### Reverse Image Batch Node

Reverses the order of the Batch.
Useful for things like playing a video backwards.

![](/media/data-utilities/batch-video/legacy_gyazo_433f02c632e722abfe3174cd7eb23837.png){media=image}

[](/workflows/data-utilities/batch-video/reverse_image_batch.json)

### RepeatImageBatch Node

Repeats the entire Batch a specified number of times.

### ImageBatchRepeatInterleaving Node

Repeats each frame a specified number of times.

![](/media/data-utilities/batch-video/repeatimagebatch_imagebatchrepeatinterleaving.png){media=image}

[](/workflows/data-utilities/batch-video/repeatimagebatch_imagebatchrepeatinterleaving.json)

> Top: RepeatImageBatch
> Bottom: ImageBatchRepeatInterleaving

---

## Extracting from Batch

### ImageFromBatch Node

Picks out the image at any position in the Batch.

![](/media/data-utilities/batch-video/legacy_gyazo_6e48d34613f09e7dddfe3f40187f0de0.png){media=image}

[](/workflows/data-utilities/batch-video/imagefrombatch.json)

- `batch_index`: Position to extract (starts from 0)
- `length`: Number of images in Batch

### Get Image or Mask Range From Batch Node

Extracts a range of images (or masks) at once.

### Select Every Nth Image Node (Video Helper Suite)

Takes every Nth frame.

![](/media/data-utilities/batch-video/legacy_gyazo_f5b845e89342f120cc994b999e390e11.png){media=image}

[](/workflows/data-utilities/batch-video/select_every_nth_image.json)

- `select_every_nth`: How often to take a frame
- `skip_first_images`: How many images to skip at the start

---

## Conversion Batch ↔ List

If you want to process a video or Batch one image at a time after loading it, convert it to a List.

### Image Batch to Image List Node

![](/media/data-utilities/batch-video/image_batch_to_image_list.png){media=image}

[](/workflows/data-utilities/batch-video/image_batch_to_image_list.json)

There's also a node that goes the other way, combining a List into a Batch.

- `Image List to Image Batch` Node
