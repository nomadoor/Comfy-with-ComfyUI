---
layout: page.njk
lang: en
section: basic-workflows
slug: controlnet-prep
navId: controlnet-prep
title: "ControlNet Preprocessor"
summary: "Creating auxiliary images for use with ControlNet"
tags: ["controlnet"]
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/b0ce7cf302624ce253c4d12e78885127.png"
---

## What is Preprocessor?

How do you prepare "control images" like stick figures and depth maps used in ControlNet?
While simple edges like Canny might be manageable, drawing a depth map by hand every time is not realistic.

Therefore, the process of automatically creating stick figures, depth maps, line drawings, normal maps, etc. from reference images is collectively called **"Preprocessor"** for convenience in the ControlNet community.

There is no single technology that does all of these; there are separate technologies for each, such as pose estimation, depth estimation, and line drawing extraction.

---

## The True Nature of Control Images

I said it was hard to draw by hand, but please remember that **"it IS possible to draw by hand"**.

The control image is not a special data type, but **just an RGB image**.
You can paint over interfering parts in a depth map with black, or redraw just the arms of a pose image to change the posture.

---

## Required Custom Nodes

- [Fannovel16/comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux)

Basically, this is all you need.

---

## Frequently Used Preprocessors

Here we introduce technologies that are actually used frequently.
There are things with better performance, but we have chosen them focusing on ease of use, lightness, and usability.

If you are using it for ControlNet, you don't need such extreme accuracy.

{% mediaRow img="https://gyazo.com/25026afc9e67bd130954acbf98fd851a{gyazo=image}", width=50, align="left" %}

### Canny


- 🟩 Canny
- 🟨 Canny Edgy

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/Canny-Canny_Edge.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/4be8acdf3533fb7c80d9b580f755f1db{gyazo=image}", width=50, align="left" %}

### SoftEdge / HED


- 🟩 HED Soft-Edge

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/HED_Soft-Edge.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5fcfc6e4a07be8ed93ec0e3f9ed6a993{gyazo=image}", width=50, align="left" %}

### Lineart


- 🟩 Realistic Lineart
- 🟨 AnyLine Lineart

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/Realistic-AnyLine_Lineart.json)
{% endmediaFooter %}

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/6be6036f6e7a7f56a8f6de81aeeea7d6{gyazo=image}", width=50, align="left" %}

### Depth


- 🟩 Depth Anything V2
  - Currently developed up to V3, but V2 is sufficient for ControlNet use.

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/Depth_Anything_V2.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e55cf3d13d1b3c3c07497724d42b2780{gyazo=image}", width=50, align="left" %}

### Normal


- 🟩 DSINE

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/DSINE.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d7fe5840a075c7567848f8953c381734{gyazo=image}", width=50, align="left" %}

### MLSD


- 🟩 M-LSD Lines

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/M-LSD.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9297daf25cc10b21f495ed985e2bae7c{gyazo=image}", width=50, align="left" %}

### Pose


- 🟩 OpenPose
- 🟨 DWPose
  - Often treated as a higher compatible version of OpenPose, but it has a clear weakness that it is not good at back views. Use it together with OpenPose depending on the situation.

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/OpenPose_DWPose.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/d859b24e730122c4e510e2c97878a7e8{gyazo=image}", width=50, align="left" %}

### SDPose


[judian17/ComfyUI-SDPose-OOD](https://github.com/judian17/ComfyUI-SDPose-OOD)
- 🟩 SDPose
  - OpenPose is very weak with animals and anime illustrations, so try this if it doesn't work well.

{% mediaFooter %}
[](/workflows/basic-workflows/controlnet-prep/SDPose.json)
{% endmediaFooter %}

{% endmediaRow %}
