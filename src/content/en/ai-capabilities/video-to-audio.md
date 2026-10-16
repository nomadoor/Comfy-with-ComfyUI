---
layout: page.njk
lang: en
section: ai-capabilities
slug: video-to-audio
navId: video-to-audio
title: video2audio
created: 2025-12-01
updated: 2026-03-02
summary: Technology that automatically generates sound effects and ambient sound from video
seoTitle: "video2audio: Generate Sound Effects from Video"
seoDescription: "Most generated videos are silent. video2audio adds sound effects and ambience synced to the footage. How FoleyCrafter and HunyuanVideo-Foley work."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## What is video2audio?

Apart from a few like Sora 2 and Veo 3, today's video generation models still generate only video. In other words, there's no sound.

That's where **video2audio** comes in: technology that generates audio from video.

It works out "what is happening" in the footage and generates matching sound, synced to the video.

---

## FoleyCrafter

FoleyCrafter is a **Video2Audio framework that adds a "video adapter" on top of an existing Text2Audio model**.

<iframe width="100%" height="540" src="https://www.youtube.com/embed/7m4YLrSBOv0" title="FoleyCrafter: Bring Silent Videos to Life with Lifelike and Synchronized Sounds" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Think of it as giving the base Text2Audio model extra information: "what sound fits what's on screen" and "when it should play (timing)."

---

## HunyuanVideo-Foley

[HunyuanVideo-Foley](https://szczesnys.github.io/hunyuanvideo-foley/) is a multimodal diffusion Transformer designed for **text + video -> audio** from the start.

Rather than bolting features onto a text2audio model the way FoleyCrafter does, it is trained on text, video, and audio together from the outset.
