---
layout: page.njk
lang: en
section: ai-capabilities
slug: talking-head
navId: talking-head
title: talking head
created: 2025-12-01
updated: 2026-03-02
summary: Making a single image or face photo talk, driven by a reference video or audio
seoTitle: "What Is a Talking Head Model? Make a Still Image Speak"
seoDescription: "Talking head models animate one image from a video or audio. How they differ from lip sync, plus warping (LivePortrait), diffusion, and video-model methods."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## What is talking head?

Talking head animates a single image or face photo so it looks like "a person talking." It moves the mouth and expressions of the input image using the **motion from a separate reference video** or **audio** as a guide.

It's very similar to lip sync, but lip sync is mostly about "matching just the mouth in an existing video to audio." Talking head is basically about animating a single image, and many methods are driven mainly by the motion in a reference video rather than by audio.

As the name suggests, it started with moving the face, but it's been evolving toward moving the upper body and even the whole body.

---

## Deformation-based talking head

### [Thin-Plate Spline Motion Model for Image Animation](https://github.com/yoyo-nb/Thin-Plate-Spline-Motion-Model)

![](/media/ai-capabilities/talking-head/legacy_gyazo_8e6de400ea9bc95a25e689483bd6b238.png){media=image} ![](/media/ai-capabilities/talking-head/legacy_gyazo_b38439d333755e724f174fa774f74f71.mp4){media=loop} ![](/media/ai-capabilities/talking-head/legacy_gyazo_c86570789722d04da913aed1f9ffd268.mp4){media=loop}

Give it a single image and a video of someone moving, and the image deforms to mimic that motion.

Rather than using a 3D model, it's more like squishing and twisting the image while it stays 2D. Think Photoshop's Puppet Warp.

### [LivePortrait](/en/basic-workflows/liveportrait/)

![](/media/ai-capabilities/talking-head/legacy_gyazo_c893e38c12859f8f20ff1e0fca545788.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2v_ref.json)

This also takes a single image and a reference video, but it's designed to reproduce the movement of each facial feature, gaze direction, and subtle emotion reliably.

It isn't a diffusion model, so it's relatively light and leans toward real-time use. It also lets you make edits like "tilt the face down a little" or "open the eyes a bit," so it's still widely used today.

---

## Diffusion model-based talking head

The next generation brought talking heads that use diffusion models to "redraw the picture itself," such as [X-Portrait](https://byteaigc.github.io/x-portrait/) and [HelloMeme](https://songkey.github.io/hellomeme/).

![](/media/ai-capabilities/talking-head/legacy_gyazo_c70468086a939dce538a876073c9c523.mp4){media=loop}

[](/workflows/ai-capabilities/talking-head/hellomeme_video.json)

They extract signals for things like "head direction" and "changes in expression" from the reference video and pass them to the diffusion model as conditions. It's a lot like generating an image while ControlNet holds the pose and composition in place, as if you were saying "redraw this character's face with this motion."

---

## Video generation model-based talking head

Even newer are talking head / avatar models built on video generation models themselves. [OmniAvatar](https://omni-avatar.github.io/) and [Wan-Animate](https://humanaigc.github.io/wan-animate/) belong to this line.

![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_9f0e0e20d750b2e207b01adc56858202.png){media=image} ![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_d7f66b4153473136c37e48c7066709a1.mp4){media=loop} ![](/media/ai-capabilities/human-motion-transfer/legacy_gyazo_86ed4c6aa64af79325ce18359a4021bc.mp4){media=loop}
> Wan-Animate

Wan-Animate takes a character image and a "reference video with motion" and animates the character to follow that motion.

---

## To Human Motion Transfer

Once talking head techniques could handle the face reliably, it was only natural to want to "move the upper body and whole body too."

Older methods like Thin-Plate Spline could already be applied to the whole body, not just the face, and Wan-Animate handles the whole body perfectly, so honestly I don't think there's much need to separate it from talking head. Still, human motion transfer has evolved along its own path, so let's take a quick look.

→ [Human Motion Transfer](/en/ai-capabilities/human-motion-transfer)
