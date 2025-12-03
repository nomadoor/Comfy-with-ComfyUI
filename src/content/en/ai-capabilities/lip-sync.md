---
layout: page.njk
lang: en
section: ai-capabilities
slug: lip-sync
navId: lip-sync
title: Lip Sync
summary: Technology to move mouth and facial expressions in sync with audio
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## What is Lip Sync?

Lip sync is a technology to add mouth and facial expression movements later in sync with the content and rhythm of the audio.

It is used to overlay separately recorded audio on an existing video, or to move a single image "as if it were speaking".

---

## Matching Lip Sync of Existing Video

![](https://gyazo.com/17b81df017311b5fee98119e7e808492){gyazo=player} ![](https://gyazo.com/a6286699b56195148b64533d441561c0){gyazo=player}
> ← Base Video | → Lip Sync (LatentSync)

The first widely known type was models like Wav2Lip that "fix only the mouth area".

When you input an already filmed video and separately recorded audio, it outputs a video where only the mouth moves to match the new audio, while the movements of the face and body remain the same.

---

## Making a Single Image Speak

> ![](https://gyazo.com/a74335c1403caa5475429688f420212d){gyazo=player}
> EMO

Models like [EMO](https://humanaigc.github.io/emote-portrait-alive/) generate a speaking video directly from a single face image and audio.
It can be said to be an evolution of image2video, moving the input image with the control of audio.

If you prepare a single character illustration or face photo and give it lines or singing voice, a video with lip sync corresponding to that length is returned. Blinking, movement of the corners of the mouth, and slight head shaking are also created together.

---

## Moving the Entire Video from Audio

If you try speaking with a slightly raised voice, you will understand that you are not moving only your mouth when speaking.
The lungs expand, the shoulders rise, and before you know it, you are even gesturing with your hands.

In short, you cannot create a natural video just by moving only the mouth in sync with the audio like Wav2Lip.

Coupled with the fact that video generation models have become practical performance, the trend is moving towards **audio-driven portrait video generation** rather than simple "lip sync".

> ![](https://gyazo.com/808dcfc73aa5fb1959eb35be3534e5e7){gyazo=player}
> InfineTalk

As current SoTA, there are things like [FantasyTalking](https://fantasy-amap.github.io/fantasy-talking/) and [InfiniteTalk](https://meigen-ai.github.io/InfiniteTalk/) based on Wan2.1.
