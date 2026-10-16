---
layout: page.njk
lang: en
section: ai-capabilities
slug: lip-sync
navId: lip-sync
title: Lip Sync
created: 2025-12-01
updated: 2026-03-02
summary: Moving the mouth and face in sync with audio
seoTitle: "What Is AI Lip Sync? Matching Mouths to Audio"
seoDescription: "Lip sync adds mouth movement that matches audio: mouth-only models like Wav2Lip and LatentSync, talking still images, and audio-driven video models."
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## What is Lip Sync?

Lip sync adds mouth and facial movement after the fact, matched to what's being said and its rhythm.

It's used to put separately recorded audio onto existing video, or to animate a single image so it "looks like it's talking."

---

## Matching Mouth Movement in Existing Video

![](https://gyazo.com/17b81df017311b5fee98119e7e808492){gyazo=player} ![](/media/ai-capabilities/lip-sync/legacy_gyazo_a6286699b56195148b64533d441561c0.mp4){media=player}
> ← Base Video | → Lip Sync (LatentSync)

The first type to become widely known was models like Wav2Lip that "fix only the mouth."

Give it existing footage and separately recorded audio, and it outputs a video where the face and body move exactly as before, but the mouth now matches the new audio.

---

## Making a Single Image Speak

> ![](/media/ai-capabilities/lip-sync/legacy_gyazo_a74335c1403caa5475429688f420212d.mp4){media=player}
> EMO

Models like [EMO](https://humanaigc.github.io/emote-portrait-alive/) generate a talking video directly from a single face image and audio.
You could call it an evolution of image2video, with audio as the control that drives the input image.

Prepare a single character illustration or face photo, give it spoken lines or a song, and you get back a lip-synced video as long as the audio. Blinks, movement at the corners of the mouth, and small head movements are generated along with it.

---

## Moving the Entire Video from Audio

Try talking a bit loudly and you'll notice you're not just moving your mouth.
Your lungs fill, your shoulders lift, and before you know it you're gesturing with your hands too.

In other words, just moving the mouth to the audio, the way Wav2Lip does, can't produce a natural video.

Now that video generation models have become good enough to be practical, things are moving beyond simple "lip sync" toward **audio-driven portrait video generation**.

> ![](/media/ai-capabilities/lip-sync/legacy_gyazo_808dcfc73aa5fb1959eb35be3534e5e7.mp4){media=player}
> InfiniteTalk

The current SoTA includes Wan2.1-based models such as [FantasyTalking](https://fantasy-amap.github.io/fantasy-talking/) and [InfiniteTalk](https://meigen-ai.github.io/InfiniteTalk/).
