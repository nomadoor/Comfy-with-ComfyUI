---
layout: page.njk
lang: en
section: basic-workflows
slug: ultimate-sd-upscale
navId: ultimate-sd-upscale
title: "Ultimate SD Upscale"
created: 2025-12-09
updated: 2026-03-02
summary: "Ultra-high-resolution upscaling with Tile and ControlNet"
seoTitle: "Ultimate SD Upscale in ComfyUI: Tiled Upscaling"
seoDescription: "Ultimate SD Upscale enlarges images tile by tile: hide seams with overlap, handle the prompt problem, and lock structure with ControlNet Tile."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
   image: ""
tags: ["upscale-restoration", "controlnet"]
---

## What is Ultimate SD upscale?

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_d3b6f13de466be0cb0a17f2565d6f9e3.png){media=image}

One reason Stable Diffusion couldn't generate large images was that it wasn't trained on them, but there was another, simpler cause: computational cost.

Trying to generate an ultra-high-resolution image like 4K or 8K in one go is pretty tough on VRAM and compute time.

So instead of making it all at once, the idea came up to split the image and run Hires.fix on each piece.
- 1. Enlarge the image
- 2. Split it into tiles
- 3. Run image2image on each tile separately
- 4. Stitch the tiles back together at the end

**Ultimate SD upscale** is the well-known name, but what really matters is the idea of **Tile (tiling)**.

---

## Custom Nodes

- [shiimizu/ComfyUI-TiledDiffusion](https://github.com/shiimizu/ComfyUI-TiledDiffusion)

There's also a node that is literally Ultimate SD upscale, [ssitu/ComfyUI_UltimateSDUpscale](https://github.com/ssitu/ComfyUI_UltimateSDUpscale), but this time I want to follow the underlying principle, so I'll use the simpler node above.

---

## Tile's Weakness: Seams

First, let's look at how Tile basically behaves.
I'll use the Tiled Diffusion nodes as an example, but any node will do as long as you get the idea.

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_6ff5e63c42367c9ef8ffd8e2a89a61c5.png){media=image} ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_daf241e640303e9bdbebdbdb06ae4afa.png){media=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/tiled_diffusion_overlap0.json)

* 🟨 Resize the input image to 1024 × 1024 px
* 🟩 Set tile size to 512 × 512 px

With these settings, the puppy image at the bottom left is split neatly into 4, and each tile is processed as an independent image2image.

As you can see, the tile boundaries are clearly visible, and the image doesn't hold together well as a whole.
This is Tile's **first weakness**.

---

## Blending seams with overlap

If the seams bother you, one idea is to place the tiles so they overlap a little.
That's what `tile_overlap` does.

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_d6bf859530ae65b7b09ca8a2b2e3006b.png){media=image} ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_fec3f15e6e4ff7110d3f5ff110f0faa2.png){media=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/tiled_diffusion_overlap256.json)

- 🟩 Set `tile_overlap` to 256px
- Instead of lining the tiles up neatly, picture placing them **deliberately overlapping by about half**.
  - ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_5f5d51e77955a55c8df142e45d8d12f5.png){media=image}

The overlapping areas act like a cushion where neighboring tiles share information, so as sampling proceeds, the boundaries blend in and the seams become less noticeable.

However, the more overlap you add, the more times the same area gets sampled, so generation takes longer.

---

## Tile's Other Weakness: The Prompt

Tile has one more big weakness.
Because **every tile uses the same prompt**, extra things get generated in places you never intended.

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_b180b2b157a72b030b099dcb6f7c046f.png){media=image}

In the previous workflow, set something like `tile_overlap = 0` / `denoise = 1`, write only `a dog` in the prompt, and generate.
As in the image, you get several dogs in a single image.

The top-left, top-right, bottom-left, and bottom-right tiles each try to draw one dog, so you end up with four dogs overall. This is Tile's **second weakness**.

---

## What About a Different Prompt per Tile?

In theory, you could **write a separate prompt for each tile**.

- Top left tile: `dog right ear, right eye`
- Top right tile: `dog left ear, left eye`
- Bottom left tile: `dog front leg`
- Bottom right tile: `dog back leg`

That way, each tile should understand "I only need to handle the ear".

In practice, though, this is hardly ever used.

Writing a prompt for every tile isn't realistic, and above all, Stable Diffusion can't understand a prompt like "only the top-right quarter of a dog's face" and draw accordingly.

---

## Locking the Structure with ControlNet Tile

This is where **ControlNet Tile** comes in.

ControlNet Tile is a ControlNet that generates a new image while **holding on to the input image's structure quite strongly**.

It doesn't copy the pixels as-is, but it behaves as if it were repainting textures and details while keeping the **rough shapes** and **positions of objects**.

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_a0d8adb6b4cbd35562588238db87f71e.png){media=image} ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_1bf02bf5900f379735c6a29a7aa1935e.png){media=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/tileddiffusion_controlnet_tile.json)

In this workflow, I deliberately use `tile_overlap = 0`, `denoise = 1`, the settings where Tile's weaknesses show up the most.

Even so, you should be able to see that going through ControlNet Tile lets it upscale **while keeping much of the original composition**.

---

## Finishing with overlap × ControlNet Tile

Put everything so far together, and a practical form of Tile upscaling starts to take shape.

![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_763660c52564a7af2f5dce9eaa81e20f.png){media=image} ![](/media/basic-workflows/ultimate-sd-upscale/legacy_gyazo_3e4bf6018a4e4500f3bbd14151ce56e7.png){media=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/tiled_diffusion_overlap_contolnet_tile.json)

- 🟩 overlap 256px
- 🟦 Controlnet strength 0.6

It looks much more natural now.

---

## Summary: The Ideas Behind Ultimate SD upscale

At its core, Ultimate SD upscale rests on three pillars.

- 1. **Tile (Tile Division)**
   Instead of handling a large image as-is, split it into tiles and run image2image on each, aiming for super-resolution while keeping the VRAM and compute load down.

- 2. **overlap (Tile Overlap)**
   Place the tiles slightly overlapping and let the boundaries blend during sampling, so the seams don't stand out.

- 3. **ControlNet Tile (fixing structure)**
   Upscale the tiles while strongly preserving the input image's structure, to keep the "dogs inside the dog" problem and the whole image falling apart in check.

The actual Ultimate SD upscale nodes and presets are nothing more than this idea packaged into a single node.

By the way, the same idea carries over to video generation, where you split by frames instead.
Something like splitting a 100-frame video into 20-frame chunks with a 5-frame overlap.
I won't go into detail here, but the point is exactly the same: split things up finely to cut computational cost.
