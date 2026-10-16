---
layout: page.njk
lang: zh
section: notes
slug: comfyui-video-stabilizer
navId: comfyui-video-stabilizer
title: "ComfyUI Video Stabilizer"
created: 2026-07-03
updated: 2026-07-03
noteTags: ["project", "custom-nodes"]
summary: "用于在 ComfyUI 中进行视频防抖、还原原始抖动，以及添加人工手持抖动的自定义节点"
seoTitle: "ComfyUI Video Stabilizer：视频防抖节点"
seoDescription: "在 ComfyUI 中进行视频防抖的自定义节点 ComfyUI Video Stabilizer 的用法。介绍安装、framing_mode 与 camera_lock 等参数、还原抖动以及添加人工手持抖动。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI Video Stabilizer

[ComfyUI Video Stabilizer](https://github.com/nomadoor/ComfyUI-Video-Stabilizer) 是一个在 ComfyUI 中给视频做防抖的自定义节点。

主要有以下 3 个功能。

- 给视频防抖
- 从防抖后的视频中还原原本的抖动
- 添加人工抖动

---

## 安装

[nomadoor/ComfyUI-Video-Stabilizer](https://github.com/nomadoor/ComfyUI-Video-Stabilizer)

- 请通过 `ComfyUI Manager` 安装。

---

## 防抖

防抖使用 `Video Stabilizer Classic` 或 `Video Stabilizer Flow`。

功能完全相同，只是处理方式不同。

Flow 稍微重一些，但效果好很多，所以基本上推荐使用 Flow。

![](/media/notes/comfyui-video-stabilizer/legacy_gyazo_779732831dc0e69b5eae8519d4599d24.png){media=image}

[](/workflows/notes/comfyui-video-stabilizer/video_stabilizer_flow.json)


### 参数

`Video Stabilizer Classic` 和 `Video Stabilizer Flow` 的参数相同。

| Parameter | 说明 |
| --- | --- |
| `frame_rate` | 输入视频的 FPS。它会作为时间方向 smoothing 的基准。 |
| <span style="white-space: nowrap;">🎞️ <code>framing_mode</code></span> | 如何处理防抖后画面边缘的缺失。这是个重要参数，在视频里差别很明显。 |
| `transform_mode` | 用哪种变换来估计相机运动。 |
| <span style="white-space: nowrap;">🔒 <code>camera_lock</code></span> | 让画面更接近三脚架拍摄的固定镜头。 |
| `strength` | 把估计出的相机运动去掉多少。`0.0` 基本保持原来的运动，`1.0` 会强力补正。 |
| `smooth` | 让相机运动平滑到什么程度。值越高，越能抑制突然的晃动。 |
| `keep_fov` | 只在 `framing_mode` 为 `crop` 时有效。指定保留多少视角。`1.0` 缩放较少，`0.0` 则牺牲视角来消除边缘空白。 |
| `padding_color` | 出现 padding 的区域的颜色。后续要 inpaint / outpaint 时会用到 `padding_mask`，所以颜色本身不太重要。 |

### 🎞️ framing_mode

![原视频](/media/notes/comfyui-video-stabilizer/legacy_gyazo_32044ef9e564ad2228cdae872e9a35ed.mp4){media=loop} ![crop](/media/notes/comfyui-video-stabilizer/legacy_gyazo_f901016b9fd5d2ecc40db8430ae8ffef.mp4){media=loop} ![crop_and_pad](/media/notes/comfyui-video-stabilizer/legacy_gyazo_b7f5e7145c066ab0b94b20a401b79690.mp4){media=loop} ![expand](/media/notes/comfyui-video-stabilizer/legacy_gyazo_971541da6bcc4659360cc72b2c008d8c.mp4){media=loop}

- `crop`
  - 稍微放大 / 裁剪视频，让空白边缘不可见。
  - 抖动越大，视角会变得越窄。
- `crop_and_pad`
  - 尽量保留原来的视角，不足的部分用 padding 填充。
  - padding 部分会作为 `padding_mask` 输出。
- `expand`
  - 完全不裁剪，只根据需要扩大画布。

一般的编辑软件只会用到接近 `crop` 的处理，但借助视频生成模型，就能把 padding 部分当作蒙版来 outpainting，玩出一些有意思的用法。

### 🔒 camera_lock

启用 `camera_lock` 后，虽然并不完美，但会把视频调整得更接近三脚架拍摄的固定镜头。

普通的防抖只是让相机运动“变平滑”，而 `camera_lock` 会尽量让相机运动停下来。

---

## 还原抖动

在视频编辑中，先去掉抖动再处理有时会更稳定，但就这样放着的话，原本的临场感也就没了。

使用 `Video Stabilizer Motion Apply`，可以把用 Video Stabilizer 去掉的抖动反过来再应用回去，把它还原出来。

![](/media/notes/comfyui-video-stabilizer/legacy_gyazo_cf0408a1b507b5ecd0699c2e16ff539d.png){media=image}

[](/workflows/notes/comfyui-video-stabilizer/video_stabilizer_to_motion_apply.json)

> [!WARNING]
> 如果用 `crop` 或 `crop_and_pad` 做了补正，已经裁掉的像素是回不来的。如果打算之后还原，建议最初防抖时就用 `expand`。

---

## 人为添加抖动

AI 生成的视频……其实不限于此，相机运动太平滑的话，就会有点 CG 感。

这时故意加一点手持抖动，就能营造出临场感和真实感。

![](/media/notes/comfyui-video-stabilizer/legacy_gyazo_695ab8d32156327393d57ac9432a1e62.png){media=image}

[](/workflows/notes/comfyui-video-stabilizer/video_stabilizer_shake.json)

用 `Video Stabilizer Shake Generator` 生成人工的相机晃动，再交给 `Video Stabilizer Motion Apply`，就能让视频晃起来。

### 参数

| Parameter | 说明 |
| --- | --- |
| `frame_rate` | 输入视频的 FPS。视频那边没有传入 FPS 时，作为 fallback 使用。 |
| `style` | 抖动的类型。 |
| `amount` | 抖动强度。只想稍微增加一点自然感的话，低一些就够了。调得太高，就会变成很容易让人晕的画面。 |
| `speed` | 抖动速度。想要缓慢的手持感就调低，想要细碎、急促的抖动就调高。 |
| `seed` | 抖动的随机 seed。即使其他设置相同，改变 `seed` 也会改变抖动方式。 |

### style

![tripod](/media/notes/comfyui-video-stabilizer/legacy_gyazo_e11213660ec6a4473adf422011c54eb1.mp4){media=loop}  ![handheld](/media/notes/comfyui-video-stabilizer/legacy_gyazo_1febc33e4083bc2f4ff0cf30ea6c8f28.mp4){media=loop} ![walking](/media/notes/comfyui-video-stabilizer/legacy_gyazo_f08efa57fb62658e2745509a5881462f.mp4){media=loop} ![action](/media/notes/comfyui-video-stabilizer/legacy_gyazo_112121eaed2dacbba58626dcd1ba110d.mp4){media=loop} ![vibration](/media/notes/comfyui-video-stabilizer/legacy_gyazo_437717f27d6f65bd5b6d15321b7b547d.mp4){media=loop}

- `tripod`: 添加接近固定相机的、非常轻微的抖动。
- `handheld`: 添加自然的手持相机风格抖动。
- `walking`: 添加像边走边拍那样的上下 / 左右抖动。
- `action`: 添加更强、更粗糙的运动。
- `vibration`: 添加细小振动。

> [!NOTE]
> 还有一个叫做 `Video Stabilizer Shake Generator Manual` 的节点。
> 它不用 preset，而是可以通过内部参数细致地调整运动。

### Motion Blur

`Video Stabilizer Motion Apply` 也可以添加 motion blur。

稍微加一点，氛围就更接近真实相机拍出来的画面了。

![原视频](/media/notes/comfyui-video-stabilizer/legacy_gyazo_430ba048b450cebcc13829b3ac6151c8.mp4){media=loop}  ![Blur: 0](/media/notes/comfyui-video-stabilizer/legacy_gyazo_3cc5171d2839d110d07748395ddbf32f.mp4){media=loop} ![Blur: 1.00](/media/notes/comfyui-video-stabilizer/legacy_gyazo_a5a106e029af738b5642e1c0aff3c57c.mp4){media=loop}
