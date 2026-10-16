---
layout: page.njk
lang: en
section: ai-capabilities
slug: frame-interpolation
navId: frame-interpolation
title: Frame Interpolation
created: 2025-12-01
updated: 2026-03-02
summary: Smoothing out video and bridging frames that are far apart
seoTitle: "Video Frame Interpolation with AI: VFI and FLF2V"
seoDescription: "Frame interpolation adds frames between frames: classic VFI for higher fps, generative interpolation (FLF2V) that bridges distant frames, and extension."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://github.com/google-research/frame-interpolation/raw/main/moment.gif'
---

## What is Frame Interpolation?

**Video Frame Interpolation (VFI)** inserts new frames between a video's existing frames to make motion look smoother.

It's been around for a long time, used to smooth out choppy old footage or make up for the fps lost in slow motion.

And with the arrival of video generation AI, **generative frame interpolation** has appeared, which goes beyond simply interpolating to a higher fps.

---

## Frame Interpolation to Increase FPS (Classical VFI)

Typical VFI takes two frames that are close together in time (less than about 0.1 seconds apart) and generates one or more in-between frames. Repeating this increases the frame count of the whole video.

![](/media/ai-capabilities/frame-interpolation/legacy_gyazo_af7273352979b5286d8f85a9b6915ab6.mp4){media=loop}

[](/workflows/ai-capabilities/frame-interpolation/vfi_gmfss.json)

There are many interpolation methods, such as [FILM](https://github.com/google-research/frame-interpolation) and GMFSS.

---

## Generative interpolation (FLF2V)

Traditional frame interpolation connects "neighboring frames that barely differ."

More recently, a step beyond that, techniques have appeared that **use video generation models to fill the gap between frames more than a second apart**.

![](/media/ai-capabilities/frame-interpolation/legacy_gyazo_669467e658bbd5cd9e03207a5ccd1faa.mp4){media=loop}

[](/workflows/ai-capabilities/frame-interpolation/tooncrafter_interp.json)

Give it two images, and it connects them by creating **"motion with a story"** in between.

It isn't simple linear interpolation. The AI also invents, to some extent, "what happens along the way," so the result is less like a morph and more like a short video with a little story.

ToonCrafter is an early model of this kind, but every new video model brings an FLF2V model that's vastly more natural, so there's almost no reason to use it now.

---

## Extension

All the frame interpolation so far "processes each neighboring pair independently."
Even with three or more input frames, it was just repeating two-frame interpolation like this:

- Fill between 1st and 2nd frames...
- Fill between 2nd and 3rd frames...
- Fill between 3rd and 4th frames...

![](/media/ai-capabilities/frame-interpolation/legacy_gyazo_356c0e45a7ccf73ace4714f84ccc30fa.mp4){media=loop}

VACE's **Extension** takes this a step further.

Whereas traditional VFI "only looks at the gap between two neighboring frames," Extension places multiple keyframes across a single video and has the generative model connect the whole stretch between them.

Say you're generating an 81-frame video.
You insert "keyframes" at a few of those frames. The model then generates the video so those keyframes connect naturally **on a single shared timeline**.

![](/media/ai-capabilities/frame-interpolation/legacy_gyazo_1bd83bd9c5258b25ce9016917516a526.png){media=image}

The result is far more natural than FLF2V. Techniques like Extension will probably become the norm going forward.
