---
layout: page.njk
lang: en
section: basic-workflows
slug: controlnet-prep
navId: controlnet-prep
title: "ControlNet Preprocessor"
summary: "Create helper images for ControlNet"
tags: ["controlnet"]
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## What is a Preprocessor?

How do you prepare "control images" like stick figures and depth maps used in ControlNet?
Simple edges like Canny might be doable, but drawing a depth map by hand every time is not realistic.

Therefore, the process of automatically creating stick figures, depth maps, line drawings, normal maps, etc. from reference images is collectively called **"Preprocessor"** in the ControlNet community for convenience.

There is no single technology that does all of these; there are separate technologies for pose estimation, depth estimation, line drawing extraction, etc.

---

## The Identity of Control Images

I said it's hard to draw by hand, but please remember that it IS possible to draw by hand.

Control images are not special data types, just **regular RGB images**.
You can paint over unwanted parts in black on a depth map, or redraw just the arm in a pose image to change the posture.

---

## Required Custom Node

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

Basically, this is all you need.

---

## Commonly Used Preprocessors

Here we introduce technologies that are frequently used.
There are better ones in terms of performance, but we have chosen them focusing on ease of use, lightness, and usability.

If you are using it for ControlNet, you don't need that much performance.



{% mediaRow img="https://gyazo.com/25026afc9e67bd130954acbf98fd851a {gyazo=image}", width=50, align="left" %}

### Canny
[](/workflows/basic-workflows/controlnet-prep/Canny-Canny_Edge.json)
- 🟩Canny
- 🟨Canny Edgy

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/4be8acdf3533fb7c80d9b580f755f1db {gyazo=image}", width=50, align="left" %}

### SoftEdge / HED
[](/workflows/basic-workflows/controlnet-prep/HED_Soft-Edge.json)
- 🟩 HED Soft-Edge

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5fcfc6e4a07be8ed93ec0e3f9ed6a993 {gyazo=image}", width=50, align="left" %}

### Lineart
[](/workflows/basic-workflows/controlnet-prep/Realistic-AnyLine_Lineart.json)
- 🟩 Realistic Lineart
- 🟨 AnyLine Lineart

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/6be6036f6e7a7f56a8f6de81aeeea7d6 {gyazo=image}", width=50, align="left" %}

### Depth
[](/workflows/basic-workflows/controlnet-prep/Depth_Anything_V2.json)
- 🟩 Depth Anything V2
  - Currently V3 is being developed, but V2 is sufficient.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e55cf3d13d1b3c3c07497724d42b2780 {gyazo=image}", width=50, align="left" %}

### Normal
[](/workflows/basic-workflows/controlnet-prep/DSINE.json)
- 🟩DSINE

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d7fe5840a075c7567848f8953c381734 {gyazo=image}", width=50, align="left" %}

### MLSD
[](/workflows/basic-workflows/controlnet-prep/M-LSD.json)
- 🟩M-LSD Lines

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9297daf25cc10b21f495ed985e2bae7c {gyazo=image}", width=50, align="left" %}

### Pose

[](/workflows/basic-workflows/controlnet-prep/OpenPose_DWPose.json)
- 🟩OpenPose
- 🟨DWPose
DWPose is treated as a superior version of OpenPose, but it has a clear weakness in that it is not good at back views, so please use them together.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d859b24e730122c4e510e2c97878a7e8 {gyazo=image}", width=50, align="left" %}

### SDPose

[](/workflows/basic-workflows/controlnet-prep/OpenPose_DWPose.json)
- 🟩OpenPose
- 🟨DWPose
DWPose is treated as a superior version of OpenPose, but it has a clear weakness in that it is not good at back views, so please use them together.

{% endmediaRow %}
