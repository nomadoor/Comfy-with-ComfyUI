---
layout: page.njk
lang: en
section: basic-workflows
slug: controlnet-prep
navId: controlnet-prep
title: "ControlNet Preprocessor"
created: 2025-12-08
updated: 2026-03-02
summary: "Making the control images ControlNet uses"
seoTitle: "ComfyUI ControlNet Preprocessors: Canny, Depth, OpenPose"
seoDescription: "Make ControlNet control images from a reference: Canny, SoftEdge, Lineart, Depth, Normal, MLSD, OpenPose, and other preprocessors compared."
tags: ["controlnet"]
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "/media/basic-workflows/controlnet-prep/legacy_gyazo_b0ce7cf302624ce253c4d12e78885127.png"
---

## What is a Preprocessor?

How do you prepare the "control images" ControlNet uses, like stick figures and depth maps?
Simple edges like Canny might be doable, but drawing a depth map by hand every time just isn't realistic.

So in the ControlNet world, the processes that automatically create stick figures, depth maps, line art, normal maps, and so on from a reference image are lumped together, for convenience, as **"Preprocessors."**

There isn't one technology that does all of this. Pose estimation, depth estimation, line art extraction, and the rest are each separate technologies.

---

## The True Nature of Control Images

I said drawing them by hand is hard, but keep in mind that you *can* draw them by hand.

A control image isn't a special data type. It's **just an RGB image**.
Feel free to paint out unwanted parts of a depth map in black, or redraw just the arms in a pose image to change the pose.

---

## Required Custom Nodes

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

Basically, this is all you need.

---

## Frequently Used Preprocessors

Here are the ones that actually get used a lot.
There are better-performing options, but I picked these for being easy, lightweight, and simple to use.

For ControlNet, you don't need extreme accuracy anyway.

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_25026afc9e67bd130954acbf98fd851a.png{media=image}", width=50, align="left" %}

### Canny


- 🟩 Canny
- 🟨 Canny Edgy

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/canny_canny_edge.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_4be8acdf3533fb7c80d9b580f755f1db.png{media=image}", width=50, align="left" %}

### SoftEdge / HED


- 🟩 HED Soft-Edge

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/hed_soft_edge.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_5fcfc6e4a07be8ed93ec0e3f9ed6a993.png{media=image}", width=50, align="left" %}

### Lineart


- 🟩 Realistic Lineart
- 🟨 AnyLine Lineart

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/realistic_anyline_lineart.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_6be6036f6e7a7f56a8f6de81aeeea7d6.png{media=image}", width=50, align="left" %}

### Depth


- 🟩 Depth Anything V2
  - It's up to V3 now, but V2 is plenty for ControlNet.

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/depth_anything_v2.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_e55cf3d13d1b3c3c07497724d42b2780.png{media=image}", width=50, align="left" %}

### Normal


- 🟩 DSINE

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/dsine.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_d7fe5840a075c7567848f8953c381734.png{media=image}", width=50, align="left" %}

### MLSD


- 🟩 M-LSD Lines

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/m_lsd.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_9297daf25cc10b21f495ed985e2bae7c.png{media=image}", width=50, align="left" %}

### Pose


- 🟩 OpenPose
- 🟨 DWPose
  - It's often treated as a straight upgrade over OpenPose, but it has one clear weakness: it struggles with people seen from behind. Use it alongside OpenPose depending on the situation.

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/openpose_dwpose.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/controlnet-prep/legacy_gyazo_d859b24e730122c4e510e2c97878a7e8.png{media=image}", width=50, align="left" %}

### SDPose


[judian17/ComfyUI-SDPose-OOD](https://github.com/judian17/ComfyUI-SDPose-OOD)
- 🟩 SDPose
  - OpenPose is really bad with animals and anime illustrations, so try this one when it doesn't work.

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/sdpose.json)
{% endmediaFooter %}

{% endmediaRow %}
