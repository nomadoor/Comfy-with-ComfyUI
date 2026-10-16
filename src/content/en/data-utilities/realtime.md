---
layout: page.njk
lang: en
section: data-utilities
slug: realtime
navId: realtime
title: "Realtime Processing"
created: 2025-11-27
updated: 2026-03-02
summary: "Realtime-like processing and when to use Instant/Change"
seoTitle: "Near-Realtime ComfyUI: Run (Instant / On Change)"
seoDescription: "ComfyUI is not built for realtime, but it can feel close. Run (Instant) vs. Run (On Change), and notes on realtime image2image and video2video."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI Isn't Built for Realtime Processing

To start with the basics: ComfyUI is **not well suited to realtime processing**.
Everything runs as a single workflow, and nothing else can happen until that run finishes.

That said, by automatically feeding in the next run as soon as one finishes,
you can make it *look* like realtime.

---

## Run(Instant) / Run(Change)

ComfyUI has two run modes for this.

### Run (Instant)

![](/media/data-utilities/realtime/legacy_gyazo_ba99c003cb82d4e8f2a483eab84e9f03.mp4){media=loop}

- Once execution starts, **the same workflow is automatically re-executed every time processing finishes**
- To stop it, switch to another mode (it won't stop on its own)

### Run (On Change)

![](/media/data-utilities/realtime/legacy_gyazo_59133ed0ac3bcc4d02f0a34cc8bf9320.mp4){media=loop}

- Runs only when a value, such as a slider, changes
- A run is queued automatically every time you move the mouse


---

## About Realtime image2image / video2video

In theory, running image2image / video2video on every frame could get you something close to "realtime video processing."
But generative AI inference always takes time, so **true realtime processing is very hard**.


Recent research is bringing that day closer, but for now it still takes a lot of patient optimization.

- Lower resolution
- Switch to lightweight models
- Use speed-up techniques made for video (covered on another page)

> [!NOTE]
> "Realtime image2image" is a **special kind of workflow that depends on speed-up techniques**.
