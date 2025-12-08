---
layout: page.njk
lang: en
section: basic-workflows
slug: ultimate-sd-upscale
navId: ultimate-sd-upscale
title: "Ultimate SD upscale"
summary: "Super high-resolution upscaling using Tile and ControlNet"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
   image: ""
tags: ["upscale-restoration", "controlnet"]
---------------------------------------

## What is Ultimate SD upscale?

![](https://gyazo.com/d3b6f13de466be0cb0a17f2565d6f9e3){gyazo=image}

One reason why large images could not be generated with Stable Diffusion was that it wasn't trained on large images, but another simple cause was the problem of computational cost.

Attempting to generate a single ultra-high-resolution image such as 4K or 8K as is would be quite severe in terms of VRAM and computation time.

So, the idea was born not to make it all at once, but to divide the image and perform Hires.fix on each part.
- 1. Enlarge the image
- 2. Divide into tiles
- 3. Process each tile individually with image2image
- 4. Finally, stitch the tiles together

The name **Ultimate SD upscale** is famous, but what is really important is the concept of **Tile (tiled division)**.

---

## Custom Node

- [shiimizu/ComfyUI-TiledDiffusion](https://github.com/shiimizu/ComfyUI-TiledDiffusion)

There is also a node named [ssitu/ComfyUI_UltimateSDUpscale](https://github.com/ssitu/ComfyUI_UltimateSDUpscale) which is exactly Ultimate SD upscale, but this time we will use the simple node above because we want to follow the principles.

---

## Weakness of Tile: Boundaries

First, let's look at the basic behavior of Tile.
Here we will explain using the Tiled Diffusion node as an example, but any node will do as long as you grasp the concept.

![](https://gyazo.com/6ff5e63c42367c9ef8ffd8e2a89a61c5){gyazo=image} ![](https://gyazo.com/daf241e640303e9bdbebdbdb06ae4afa){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap0.json)

* 🟨 Resize input image to 1024 × 1024 px
* 🟩 Set tile size to 512 × 512 px

With this setting, the puppy image on the bottom left is neatly divided into 4 parts,
and each tile is processed as an independent image2image.

As you can see, the boundaries of the tiles are clearly visible, and the unity of the screen as a whole is weak.
This is the **first weakness** of Tile.

---

## Blending boundaries with overlap

If you are concerned about boundaries, there is an idea to arrange the tiles slightly overlapping.
This is `tile_overlap`.

![](https://gyazo.com/d6bf859530ae65b7b09ca8a2b2e3006b){gyazo=image} ![](https://gyazo.com/fec3f15e6e4ff7110d3f5ff110f0faa2){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap256.json)

- 🟩 Set `tile_overlap` to 256px
- Instead of lining up tiles neatly, imagine lining them up **deliberately overlapping by about half**.
  - ![](https://gyazo.com/5f5d51e77955a55c8df142e45d8d12f5){gyazo=image}

The overlapping parts act like a cushion where adjacent tiles share information,
so as sampling proceeds, the boundaries blend in and the seams of the tiles become less noticeable.

However, increasing overlap means sampling the same area multiple times, so the time required for generation increases.

---

## Another Weakness of Tile: Prompts

Tile has another major weakness.
Because **the same prompt is used for all tiles**, unnecessary things are generated in unexpected places.

![](https://gyazo.com/b180b2b157a72b030b099dcb6f7c046f){gyazo=image}

In the previous workflow, let's set `tile_overlap = 0` / `denoise = 1` and write only `a dog` in the prompt and generate.
Then, as shown in the image, many dogs will appear in one image.

Since it tries to generate one dog in each of the top left, top right, bottom left, and bottom right tiles, four dogs are drawn as a whole. This is the **second weakness** of Tile.

---

## Proposal to change prompts per tile

Theoretically speaking, a method of **writing separate prompts for each tile** can be considered.

* Top left tile: `dog's right ear, right eye`
* Top right tile: `dog's left ear, left eye`
* Bottom left tile: `dog's front paw`
* Bottom right tile: `dog's back paw`

If you do this, every tile should understand "I only need to handle the ear".

However, it is rarely used in practice.

It is not realistic to write prompts for the number of tiles, and above all, Stable Diffusion cannot understand and draw separately with prompts like "only the top right quarter of the dog's face".

---

## Fixing structure with ControlNet Tile

This is where **ControlNet Tile** comes in.

ControlNet Tile is a ControlNet that generates new images while **strongly preserving the structure** of the input image.

It does not copy pixels as they are, but it behaves like repainting textures and details while keeping the **rough shape** and **positional relationship of objects**.

![](https://gyazo.com/a0d8adb6b4cbd35562588238db87f71e){gyazo=image} ![](https://gyazo.com/1bf02bf5900f379735c6a29a7aa1935e){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/TiledDiffusion_ControlNet_Tile.json)

In this workflow, we dare to set `tile_overlap = 0` and `denoise = 1`, which is the setting where the weakness of Tile is most likely to appear.

Still, you should be able to see that upscaling is possible while **preserving the composition of the original image to a considerable extent** by passing it through ControlNet Tile.

---

## Finishing with overlap × ControlNet Tile

Combining the elements so far, the form of practical Tile upscaling comes into view.

![](https://gyazo.com/763660c52564a7af2f5dce9eaa81e20f){gyazo=image} ![](https://gyazo.com/3e4bf6018a4e4500f3bbd14151ce56e7){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap_ContolNet_Tile.json)

- 🟩 overlap 256px
- 🟦 Controlnet strength 0.6

It has become a much more natural finish.

---

## Summary: The Concept of Ultimate SD upscale

The essence of Ultimate SD upscale is the following three pillars.

- 1. **Tile (Tile Division)**
   Instead of handling a large image as is, divide it into tiles and perform image2image, aiming for super-resolution while suppressing the load on VRAM and computation time.

- 2. **overlap (Tile Overlap)**
   Arrange tiles slightly overlapping and blend the boundaries during the sampling process to make seams less noticeable.

- 3. **ControlNet Tile (Structure Fixing)**
   By performing tile upscaling while strongly preserving the structure of the input image, suppress the "dog inside a dog" problem and the problem where the whole becomes disjointed.

Actual Ultimate SD upscale nodes and presets are just packages of this idea into a single node.

By the way, a similar idea can be applied to video generation, where frames are divided.
It's like taking 20 frames from a 100-frame video and overlapping 5 frames.
We won't cover details here, but the point of dividing finely to lower computational cost is exactly the same.
