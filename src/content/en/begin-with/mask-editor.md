---
layout: page.njk
lang: en
slug: mask-editor
navId: mask-editor
title: "Mask Editor"
summary: "How to use the Mask Editor"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What is the Mask Editor?

It is a tool that allows you to draw specific parts of an image as a mask (black and white image) on ComfyUI.

It features not only mask creation but also simple painting functions.

## How to Launch

- Select a `Load Image` node, etc. → Click `🌔` (Open Mask Editor) in the `Node Selection Toolbox`.

![](https://gyazo.com/41526255834943bb591e62583d85d324){gyazo=loop}

## Tool Operations

Switch functions using the tabs on the far left.

### Mask Drawing

Draw a mask with a brush.

- **Brush Shape**: Shape of the brush
- **Thickness**: Thickness of the brush
- **Opacity**: Opacity
  - Since masks in AI generation are usually treated as "white or black (0 or 1)", basically use it at the maximum value.
- **Hardness**: Hardness of the brush (blurriness)
- **Smoothing precision**: Line correction strength

### Paint

Paint colors on the image. Can be used as a guide during Inpaint.

- **Color Selector**: Selection of drawing color

![](https://gyazo.com/398548a6895a8ad00ab2c9f5cf509222){gyazo=loop}

### Eraser

Erases drawn masks or paint.

You can also function as an eraser by **right-clicking** while in Mask or Paint mode.

### Fill

Fills the area enclosed by a hand-drawn mask.

- **Tolerance**: Tolerance range
  - If it is low, gaps may form, so it is better to increase it.

![](https://gyazo.com/98edbb1b4ca8324d0974416546194a3c){gyazo=loop}

### Auto Select

The so-called "Magic Wand" tool.

Automatically masks areas with colors similar to the clicked point.

- **Tolerance**: Color tolerance range

![](https://gyazo.com/bf6ca9fd1af91d39c50174a4ef981b90){gyazo=loop}

## Top Menu Operations

- **Undo / Redo**: Undo / Redo operations
- **Clear**: Clear all
- **Invert**: Invert mask

## Save and Apply

- Click `Save to node`

The edits are applied to the node, and the editor closes.

![](https://gyazo.com/05a4f6930a6d074435ac29b77c97e82e){gyazo=loop}
