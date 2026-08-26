---
layout: page.njk
lang: en
section: basic-workflows
slug: liveportrait
navId: liveportrait
title: "LivePortrait"
created: 2025-12-12
updated: 2026-08-26
summary: "Controlling expression and head movement from a single face photo with LivePortrait"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0df8e012722c39159be1762a9a38ea99.png"
tags: ["talking-head"]
---

## What is LivePortrait?

[LivePortrait](https://liveportrait.github.io/) is a **keypoint-based Talking Head model** for animating a single face photo according to another video or parameters.

Using keypoints placed on the face in the photo as clues, it deforms the face as if an AI were automatically executing Photoshop's "Liquify Tool" dozens of times per second.

You can make it mimic the expression and head movement of a reference video, or fine-tune each part of the face (eyes, mouth, head direction, etc.).
Although it doesn't have the "anything goes" feeling of recent diffusion-based video generation models, a major feature is that **it is extremely lightweight because it is not a diffusion model, and can be operated almost in real-time**.

You can use it for installations, or it is quite convenient to use for fine-tuning generated images, such as "closing eyelids slightly" or "turning the face slightly downwards".

---

## Custom Nodes

- [PowerHouseMan/ComfyUI-AdvancedLivePortrait](https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait)

---

## image2image

Changes the face direction and expression of the input person image.
There are two main control methods.

- Adjusting expressions with parameters
- Mimicking the expression of a reference image

### Adjusting expressions with parameters

![](https://gyazo.com/f3793dcde8d6e286a67c3dd41b732da5){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2i.json)

- There are various parameters, but it's quickest to try touching them.
- As shown in this video, it is convenient to use `▷ Run (On Change)`.

### Editing from a reference image

![](https://gyazo.com/0df8e012722c39159be1762a9a38ea99){gyazo=image}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2i_ref.json)

- Just add `sample_image` to the previous workflow.
- From `sample_parts`, you can choose which parts to follow the reference image.
  - `OnlyExpression` ... Expression only
  - `OnlyRotation` ... Face direction only
  - `OnlyMouth` ... Mouth only
  - `OnlyEyes` ... Eyes only
  - `All` ... All

You can also use parameters to fine-tune after making it match the expression (direction) of the reference image.

---

## image2video

Animates the person in the image according to parameters or a reference video.

### motion_link

You can create a video by making multiple expressions with the `Expression Editor (PHM)` and changing those expressions one after another.

![](https://gyazo.com/adf677e141945fd7d957acb2e26c02ec){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2v_motion_link.json)

- 🟨 `Advanced Live Portrait (PHM)` node
  - Set `animate_without_vid` to `true`
  - In the command field below it, set which expression to apply and for how long.

The format of the command field is as follows:

```text
Expression Index = "Frames to transition" to that expression : "Frames to wait" with that expression
```

For example, consider the following case:

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

In this case, a video with a total of 46 frames is created.

### Transferring from a reference video

Although we did something a bit tricky above, I think this usage will actually be the main one.

![](https://gyazo.com/c893e38c12859f8f20ff1e0fca545788){gyazo=image}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2v_ref.json)

* 🟨 Just input the reference video into `driving_images`.

It transfers the expression and head shaking of the reference video directly to the input image.
Of course, you can also use it in combination with `motion_link` above.

---

## video2video

Matches the expression of the person in the video to the reference video.

![](https://gyazo.com/1a0205956e78b32045372f207582566d){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_v2v_ref.json)

- 🟨 Just set both `src_images` and `driving_images` to video.
- You can replace only the person's expression and lip sync while keeping the camera work and background of the base video as is.
