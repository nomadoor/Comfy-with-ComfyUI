---
layout: page.njk
lang: en
section: begin-with
slug: mask-editor
navId: mask-editor
title: "Mask Editor"
summary: "How to use the mask editor"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## What is Mask Editor?

It is a tool that allows you to draw a specific part of an image as a mask (black and white image) on ComfyUI.

It has not only mask creation but also a simple paint function.

---

## How to Launch

- Select `Load Image` node etc. → Click `🌔` (Open Mask Editor) in `Node Selection Toolbox`

![](https://gyazo.com/41526255834943bb591e62583d85d324){gyazo=loop}

---

## Tool Operation

Switch functions with the tab on the left end.

- * If browser's "Hardware Acceleration" is off, operation may become heavy.

### Mask Drawing

Draw a mask with a brush.

- **Brush Shape**: Shape of the brush
- **Thickness**: Thickness of the brush
- **Opacity**: Opacity
  - Since masks in AI generation are usually handled as "white or black (0 or 1)", basically use at maximum value.
- **Hardness**: Hardness of the brush (blurring degree)
- **Smoothing precision**: Line correction strength

### Paint

Paint color on the image. Can be used for guides during Inpaint etc.

- **Color Selector**: Selection of drawing color

![](https://gyazo.com/398548a6895a8ad00ab2c9f5cf509222){gyazo=loop}

### Eraser

Erases drawn masks and paints.

Right-clicking while int Mask or Paint mode also functions as an eraser.

### Fill

Fills the area surrounded by handwritten masks.

- **Tolerance**: Tolerance range
  - If low, gaps will be created, so it is better to increase it.

![](https://gyazo.com/98edbb1b4ca8324d0974416546194a3c){gyazo=loop}

### Automatic Selection

So-called "Magic Wand".

Automatically masks the range of colors similar to the clicked location.

- **Tolerance**: Color tolerance

![](https://gyazo.com/bf6ca9fd1af91d39c50174a4ef981b90){gyazo=loop}

---

## Top Menu Operation

- **Undo / Redo**: Undo / Redo operation
- **Clear**: Clear all
- **Invert**: Invert mask

---

## Save and Apply

- Click `Save to node`

Edits are applied to the node and the editor closes.

![](https://gyazo.com/05a4f6930a6d074435ac29b77c97e82e){gyazo=loop}
