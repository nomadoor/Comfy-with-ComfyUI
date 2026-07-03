---
layout: page.njk
lang: en
section: notes
slug: comfyui-video-stabilizer
navId: comfyui-video-stabilizer
title: "ComfyUI Video Stabilizer"
created: 2026-07-03
updated: 2026-07-03
noteTags: ["project", "custom-nodes"]
summary: "A custom node for video stabilization, restoring camera shake, and adding artificial camera shake in ComfyUI"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI Video Stabilizer

[ComfyUI Video Stabilizer](https://github.com/nomadoor/ComfyUI-Video-Stabilizer) is a custom node for stabilizing video inside ComfyUI.

It mainly has three features.

- Stabilize camera shake in a video
- Restore the original camera shake after stabilization
- Add artificial camera shake

---

## Installation

[nomadoor/ComfyUI-Video-Stabilizer](https://github.com/nomadoor/ComfyUI-Video-Stabilizer)

- Install it from `ComfyUI Manager`.

---

## Video Stabilization

Use `Video Stabilizer Classic` or `Video Stabilizer Flow` for stabilization.

They provide the same functionality, but use different processing methods.

Flow is a little heavier, but performs much better, so I generally recommend Flow.

![](https://gyazo.com/779732831dc0e69b5eae8519d4599d24){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_Flow.json)


### Parameters

`Video Stabilizer Classic` and `Video Stabilizer Flow` share the same parameters.

| Parameter | Description |
| --- | --- |
| `frame_rate` | The input video FPS. This is used as the basis for temporal smoothing. |
| <span style="white-space: nowrap;">🎞️ <code>framing_mode</code></span> | Controls how to handle missing edges created by stabilization. This is an important parameter where the difference is easy to see in video. |
| `transform_mode` | Controls which transform model is used to estimate camera motion. |
| <span style="white-space: nowrap;">🔒 <code>camera_lock</code></span> | Pushes the result toward a much more fixed, tripod-like shot. |
| `strength` | Controls how much of the estimated camera motion is removed. `0.0` keeps the original motion almost as-is, while `1.0` applies stronger stabilization. |
| `smooth` | Controls how smooth the camera motion should become. Higher values suppress sudden shake more strongly. |
| `keep_fov` | Only applies when `framing_mode` is `crop`. Controls how much of the original field of view to preserve. `1.0` means less zoom, while `0.0` sacrifices FOV to remove borders. |
| `padding_color` | The color used for padding. If you use `padding_mask` for later inpaint / outpaint steps, the color itself is not very important. |

### 🎞️ framing_mode

![Original video](https://gyazo.com/32044ef9e564ad2228cdae872e9a35ed){gyazo=loop} ![crop](https://gyazo.com/f901016b9fd5d2ecc40db8430ae8ffef){gyazo=loop} ![crop_and_pad](https://gyazo.com/b7f5e7145c066ab0b94b20a401b79690){gyazo=loop} ![expand](https://gyazo.com/971541da6bcc4659360cc72b2c008d8c){gyazo=loop}

- `crop`
  - Slightly zooms / crops the video so the empty borders are not visible.
  - The stronger the shake, the narrower the field of view becomes.
- `crop_and_pad`
  - Preserves as much of the original field of view as possible and fills the missing areas with padding.
  - The padded area is also output as `padding_mask`.
- `expand`
  - Does not crop at all, and expands the canvas as much as needed.

Most video editing tools only provide something close to `crop`, but with video generation models, you can use the padded area as a mask and outpaint it. That opens up some interesting workflows.

### 🔒 camera_lock

When `camera_lock` is enabled, it tries to make the video look closer to a fixed tripod shot, though it is not perfect.

Normal stabilization only makes the camera motion smoother, but `camera_lock` tries to stop the camera motion as much as possible.

---

## Restoring Camera Shake

In video editing, processing can be more stable if you remove camera shake first, but leaving it removed can also erase the original sense of presence.

With `Video Stabilizer Motion Apply`, you can apply the shake removed by Video Stabilizer in reverse, restoring the original motion.

![](https://gyazo.com/cf0408a1b507b5ecd0699c2e16ff539d){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_to_Motion_Apply.json)

> If you stabilized with `crop` or `crop_and_pad`, pixels that were already cropped away cannot be recovered. If you plan to restore the shake later, I recommend using `expand` for the first stabilization step.

---

## Adding Artificial Camera Shake

This is not limited to AI-generated video, but when camera work is too smooth, it can feel a little CG-like.

By intentionally adding camera shake, you can create a stronger sense of presence and rawness.

![](https://gyazo.com/695ab8d32156327393d57ac9432a1e62){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_Shake.json)

`Video Stabilizer Shake Generator` creates artificial camera motion, and `Video Stabilizer Motion Apply` applies that motion to the video.

### Parameters

| Parameter | Description |
| --- | --- |
| `frame_rate` | The input video FPS. Used as a fallback when FPS metadata is not available from the video. |
| `style` | The type of shake. |
| `amount` | The strength of the shake. Lower values are enough if you only want to add a little naturalness. Too much can easily make the video uncomfortable to watch. |
| `speed` | The speed of the shake. Lower it for slower handheld motion, or raise it for busier, finer shake. |
| `seed` | The random seed for the shake. Changing `seed` changes the shake pattern even with the same settings. |

### style

![tripod](https://gyazo.com/e11213660ec6a4473adf422011c54eb1){gyazo=loop}  ![handheld](https://gyazo.com/1febc33e4083bc2f4ff0cf30ea6c8f28){gyazo=loop} ![walking](https://gyazo.com/f08efa57fb62658e2745509a5881462f){gyazo=loop} ![action](https://gyazo.com/112121eaed2dacbba58626dcd1ba110d){gyazo=loop} ![vibration](https://gyazo.com/437717f27d6f65bd5b6d15321b7b547d){gyazo=loop}

- `tripod`: Adds a very weak shake, close to a fixed camera.
- `handheld`: Adds natural handheld-style motion.
- `walking`: Adds vertical and horizontal shake like walking while filming.
- `action`: Adds stronger, rougher motion.
- `vibration`: Adds fine vibration.

> There is also a node called `Video Stabilizer Shake Generator Manual`.
> Instead of using presets, it lets you fine-tune the motion through internal parameters.

### Motion Blur

`Video Stabilizer Motion Apply` can also add motion blur.

Adding a little motion blur makes the result feel closer to real camera footage.

![Original video](https://gyazo.com/430ba048b450cebcc13829b3ac6151c8){gyazo=loop}  ![Blur: 0](https://gyazo.com/3cc5171d2839d110d07748395ddbf32f){gyazo=loop} ![Blur: 1.00](https://gyazo.com/a5a106e029af738b5642e1c0aff3c57c){gyazo=loop}
