---
layout: page.njk
lang: en
section: ai-capabilities
slug: frame-interpolation
navId: frame-interpolation
title: Frame Interpolation
summary: Technology to smooth videos or connect distant frames
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: 'https://github.com/google-research/frame-interpolation/raw/main/moment.gif'
---

## What is Frame Interpolation?

**Video Frame Interpolation (VFI)** is a technology to insert new frames between frames of a video to make the movement look smooth.

It has been used for quite a long time for purposes such as smoothing out jerky old videos or compensating for fps dropped in slow motion.

Also, with the advent of video generation AI, **Generative Frame Interpolation**, a technology beyond simple FPS interpolation, has also been born.

---

## Frame Interpolation to Increase FPS (Classical VFI)

General VFI receives two temporally close frames (less than 0.1 seconds) and generates one or more "intermediate frames" sandwiched between them. By repeating this, the number of frames in the entire video is increased.

![](https://gyazo.com/af7273352979b5286d8f85a9b6915ab6.png){gyazo=image}

[](/workflows/ai-capabilities/frame-interpolation/VFI_GMFSS.json)

Various interpolation methods exist, such as [FILM](https://github.com/google-research/frame-interpolation) and GMFSS.

---

## Generative interpolation (FLF2V)

Conventional frame interpolation connected "adjacent frames with almost no change".

Recently, going a step further, technologies of the type that **fill the gap between frames separated by more than 1 second with the power of video generation models** have appeared.

![](https://gyazo.com/669467e658bbd5cd9e03207a5ccd1faa.gif){gyazo=image}

[](/workflows/ai-capabilities/frame-interpolation/tooncrafter_interp.json)

If you pass two images, it connects them while creating **"movement with a story"** between them.

It is not simple linear interpolation, but since the AI also creates "what happens in the middle" to some extent, it approaches "a video with a short story" rather than morphing.

ToonCrafter is an early model of this lineage, but every time a new video model comes out, an FLF2V model that is orders of magnitude more natural comes out, so there is almost no point in using it now.

---

## Extension

Frame interpolation up to this point was "processing each adjacent pair independently".
Even if there are 3 or more input frames, each was just repeating frame interpolation of 2 frames as follows.

- Fill between 1st and 2nd frames...
- Fill between 2nd and 3rd frames...
- Fill between 3rd and 4th frames...

![](https://gyazo.com/356c0e45a7ccf73ace4714f84ccc30fa.gif){gyazo=loop}

VACE's **Extension** has evolved one step from here.

While conventional VFI "looks only between adjacent two frames", Extension places multiple keyframes for one entire video and connects the entire interval on the generation model side.

For example, let's say you generate a video of 81 frames.
Insert "keyframes" into some of those frames. The model generates the video so that the keyframes are connected naturally **within the same time axis**.

![](https://gyazo.com/1bd83bd9c5258b25ce9016917516a526.gif){gyazo=image}

Compared to FLF2V, a much more natural video is generated. Probably, technologies like Extension will become mainstream in the future.
