---
layout: page.njk
lang: en
section: begin-with
slug: mask-editor
navId: mask-editor
title: "Mask Editor"
created: 2025-11-24
updated: 2026-03-02
summary: "How to use the mask editor"
seoTitle: "How to Use the ComfyUI Mask Editor"
seoDescription: "Draw masks with the ComfyUI Mask Editor: opening it, brush, eraser, fill, and auto-select tools, the top menu, and saving and applying masks."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What is the Mask Editor?

It's a tool for drawing a mask (a black-and-white image) over part of an image, right inside ComfyUI.

Besides making masks, it also has basic painting features.

---

## How to Launch

- Select a node such as `Load Image` → click `🌔` (Open Mask Editor) in the `Node Selection Toolbox`

![](/media/begin-with/mask-editor/legacy_gyazo_41526255834943bb591e62583d85d324.mp4){media=loop}

---

## Tools

Switch tools with the tabs on the far left.

- * If your browser's "Hardware Acceleration" is turned off, the editor may become sluggish.

### Mask Drawing

Draw a mask with a brush.

- **Brush Shape**: Shape of the brush
- **Thickness**: Thickness of the brush
- **Opacity**: Opacity
  - Masks in AI generation are usually treated as "white or black (0 or 1)", so you'll normally leave this at the maximum.
- **Hardness**: Brush hardness (how soft the edge is)
- **Smoothing precision**: Line correction strength

### Paint

Paint colors onto the image. Useful as a guide for inpainting, for example.

- **Color Selector**: Pick the paint color

![](/media/begin-with/mask-editor/legacy_gyazo_398548a6895a8ad00ab2c9f5cf509222.mp4){media=loop}

### Eraser

Erases masks and paint you've drawn.

You can also erase by **right-clicking** while in Mask or Paint mode.

### Fill

Fills an area enclosed by a hand-drawn mask.

- **Tolerance**: Tolerance range
  - If it's low, gaps get left behind, so it's better to turn it up.

![](/media/begin-with/mask-editor/legacy_gyazo_98edbb1b4ca8324d0974416546194a3c.mp4){media=loop}

### Automatic Selection

This is the so-called "magic wand" tool.

It automatically masks the area with colors similar to where you clicked.

- **Tolerance**: Color tolerance

![](/media/begin-with/mask-editor/legacy_gyazo_bf6ca9fd1af91d39c50174a4ef981b90.mp4){media=loop}

---

## Top Menu

- **Undo / Redo**: Undo / redo
- **Clear**: Clear all
- **Invert**: Invert mask

---

## Save and Apply

- Click `Save to node`

Edits are applied to the node and the editor closes.

![](/media/begin-with/mask-editor/legacy_gyazo_05a4f6930a6d074435ac29b77c97e82e.mp4){media=loop}
