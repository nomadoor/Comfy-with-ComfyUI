---
layout: page.njk
lang: en
section: ai-capabilities
slug: talking-head
navId: talking-head
title: talking head
summary: Technology to make a single image or face photo speak in sync with a reference video or audio
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## What is talking head?

Talking head is a technology to move a single image or face photo to look like a "speaking person". It moves the mouth and facial expressions of the input image using the **movement of a separately prepared reference video** or **audio** as a clue.

It is very similar to lip sync, but lip sync focuses on "matching only the mouth of an existing video to audio". Talking head is basically about moving a single image, and many of them focus on moving based on the movement of a reference video rather than audio.

As the name talking head suggests, it started from moving the face, but it is evolving in the direction of moving the upper body and even the whole body.

---

## Deformation-based talking head

### [Thin-Plate Spline Motion Model for Image Animation](https://github.com/yoyo-nb/Thin-Plate-Spline-Motion-Model)

![](https://gyazo.com/8e6de400ea9bc95a25e689483bd6b238){gyazo=image} ![](https://gyazo.com/b38439d333755e724f174fa774f74f71){gyazo=loop} ![](https://gyazo.com/c86570789722d04da913aed1f9ffd268){gyazo=loop}

When you input a single image and a video of a moving person, the image side deforms to mimic that movement.

What it is doing is closer to an image of twisting "squishy" in 2D rather than a 3D model. It's like Photoshop's Puppet Warp.

### [LivePortrait](https://liveportrait.github.io/)

![](https://gyazo.com/4dbed52f9f26d6f5ac4a15dac7f1c3af){gyazo=loop}

[](/workflows/ai-capabilities/talking-head/AdvancedLivePortrait_image2video.json)

This also takes a single image and a reference video as input, but it is devised to stably reproduce the movement of each part of the face, line of sight, and nuances of emotion.

Since it is not a diffusion model, it is relatively light and suitable for real-time applications. Also, since it allows editing such as "face direction slightly down" or "open eyes slightly", it is still often used today.

---

## Diffusion model-based talking head

In the next generation, talking heads in the direction of "redrawing the picture itself" using diffusion models appeared. This includes lineages such as [X-Portrait](https://byteaigc.github.io/x-portrait/) and [HelloMeme](https://songkey.github.io/hellomeme/).

![](https://gyazo.com/c70468086a939dce538a876073c9c523){gyazo=loop}

[](/workflows/ai-capabilities/talking-head/HelloMeme_video.json)

These extract signals corresponding to "head orientation" and "facial expression changes" from the reference video and pass them to the diffusion model as conditions. What they are doing is close to generating an image while fixing the pose and composition with ControlNet, specifying "I want you to redraw this character's face with this movement".

---

## Video generation model-based talking head

In a newer generation, talking head / avatar models based on video generation models themselves have appeared. [OmniAvatar](https://omni-avatar.github.io/) and [Wan-Animate](https://humanaigc.github.io/wan-animate/) fall into this line.

![](https://gyazo.com/9f0e0e20d750b2e207b01adc56858202){gyazo=image} ![](https://gyazo.com/d7f66b4153473136c37e48c7066709a1){gyazo=loop} ![](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop}
> Wan-Animate

Wan-Animate is a type of model that takes a character image and a "reference video with movement" as input and moves the character to trace that movement.

---

## To Human Motion Transfer

When talking head technology becomes able to handle the face area stably, it is a natural flow to want to "move the upper body and whole body as well".

Old things like Thin-Plate Spline could originally be applied to the whole body as well as the face, and Wan-Animate can handle the whole body perfectly, so I feel there is no need to distinguish it from talking head, but Human Motion Transfer has evolved independently here, so let's take a look.

→ [Human Motion Transfer](/en/ai-capabilities/human-motion-transfer)
