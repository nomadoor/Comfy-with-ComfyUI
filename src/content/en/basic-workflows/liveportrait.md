---
layout: page.njk
lang: en
section: basic-workflows
slug: liveportrait
navId: liveportrait
title: "LivePortrait"
created: 2025-12-12
updated: 2026-08-26
summary: "Control the expression and head movement of a single face photo with LivePortrait"
seoTitle: "LivePortrait in ComfyUI: Control Expression and Head Pose"
seoDescription: "Control expression and head pose in a face photo with LivePortrait in ComfyUI: parameters, reference-image edits, and motion transfer from video."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/liveportrait/legacy_gyazo_0df8e012722c39159be1762a9a38ea99.png"
tags: ["talking-head"]
---

## What is LivePortrait?

[LivePortrait](https://liveportrait.github.io/) is a **keypoint-based Talking Head model** that animates a single face photo to follow another video or a set of parameters.

It uses keypoints placed on the face as guides and deforms it—picture an AI running Photoshop's Liquify tool for you dozens of times a second.

You can have it copy the expression and head movement of a reference video, or fine-tune individual parts of the face (eyes, mouth, head direction, and so on).
It doesn't have the "anything goes" feel of recent video generation models, but its big selling point is that **since it isn't a diffusion model, it's very light and runs in near real time**.

You could use it for an installation, and it's also really handy for touching up generated images—"close the eyelids a little," "tilt the face down a bit," that kind of thing.

---

## Custom Nodes

- [PowerHouseMan/ComfyUI-AdvancedLivePortrait](https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait)

---

## image2image

This changes the head direction and expression of the person in the input image.
There are two main ways to control it.

- Adjusting expressions with parameters
- Mimicking the expression of a reference image

### Adjusting expressions with parameters

![](/media/basic-workflows/liveportrait/legacy_gyazo_f3793dcde8d6e286a67c3dd41b732da5.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2i.json)

- There are lots of parameters, but the quickest way to learn them is to play with them.
- As in this video, `▷ Run (On Change)` is handy here.

### Editing from a reference image

![](/media/basic-workflows/liveportrait/legacy_gyazo_0df8e012722c39159be1762a9a38ea99.png){media=image}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2i_ref.json)

- Just add `sample_image` to the previous workflow.
- In `sample_parts`, you choose which parts follow the reference image.
  - `OnlyExpression` ... Expression only
  - `OnlyRotation` ... Face direction only
  - `OnlyMouth` ... Mouth only
  - `OnlyEyes` ... Eyes only
  - `All` ... All

After matching the reference image's expression (or head direction), you can fine-tune it further with the parameters.

---

## image2video

Animates the person in the image according to parameters or a reference video.

### motion_link

You can make a video by creating several expressions with `Expression Editor (PHM)` and moving from one to the next.

![](/media/basic-workflows/liveportrait/legacy_gyazo_adf677e141945fd7d957acb2e26c02ec.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2v_motion_link.json)

- 🟨 `Advanced Live Portrait (PHM)` node
  - Set `animate_without_vid` to `true`
  - In the command field below it, set which expression to move to and how long each transition takes.

The command field format looks roughly like this:

```text
Expression Index = "Frames to transition" to that expression : "Frames to wait" with that expression
```

For example, say you write this:

```text
1 = 1:0
2 = 15:0
3 = 20:10
```

* `1 = 1:0`

  * Transition frames: 1, Wait frames: 0
  * Starts with expression 1 and immediately transitions to the next expression.
* `2 = 15:0`

  * Transitions from expression 1 to this expression over 15 frames, and immediately moves to the next expression.
* `3 = 20:10`

  * Transitions from expression 2 to this expression over 20 frames, and then holds for 10 frames.

This gives you a 46-frame video in total.

### Transferring from a reference video

What we did above was a bit of a trick; in practice, I think this will be the main way you use it.

![](/media/ai-capabilities/talking-head/legacy_gyazo_c893e38c12859f8f20ff1e0fca545788.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_i2v_ref.json)

* 🟨 Just input the reference video into `driving_images`.

It transfers the expression and head movement from the reference video straight onto the input image.
Of course, you can also use it in combination with `motion_link` above.

---

## video2video

This matches the expression of the person in a video to a reference video.

![](/media/basic-workflows/liveportrait/legacy_gyazo_1a0205956e78b32045372f207582566d.mp4){media=loop}

[](/workflows/basic-workflows/liveportrait/liveportrait_v2v_ref.json)

- 🟨 Just set both `src_images` and `driving_images` to video.
- You can swap out just the person's expression and lip movements while keeping the base video's camera work and background as they are.
