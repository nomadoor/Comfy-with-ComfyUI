---
layout: page.njk
lang: en
section: ai-capabilities
slug: video-to-audio
navId: video-to-audio
title: video2audio
summary: Technology to automatically generate sound effects and environmental sounds from video
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## What is video2audio?

Except for Sora 2 and Veo 3, current video generation models still only generate video. In other words, there is no sound.

That's where **video2audio** comes in handy - technology to generate audio from video.

It understands "what is happening" from the video and generates sound corresponding to that content so that it synchronizes with the video.

---

## FoleyCrafter

FoleyCrafter is a **Video2Audio framework that adds a "video adapter" on top of an existing Text2Audio model**.

<iframe width="100%" height="540" src="https://www.youtube.com/embed/7m4YLrSBOv0" title="FoleyCrafter: Bring Silent Videos to Life with Lifelike and Synchronized Sounds" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

It is an image of adding information on "what sound is appropriate by looking at the video" and "when it should sound (timing)" to the original Text2Audio model.

---

## HunyuanVideo-Foley

[HunyuanVideo-Foley](https://szczesnys.github.io/hunyuanvideo-foley/) is a multimodal diffusion Transformer that assumes **text + video -> audio** from the beginning.

It does not add functions to a text2audio model like FoleyCrafter from the start, but learns text, video, and audio together.
