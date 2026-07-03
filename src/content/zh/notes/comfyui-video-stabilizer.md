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
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI Video Stabilizer

[ComfyUI Video Stabilizer](https://github.com/nomadoor/ComfyUI-Video-Stabilizer) 是一个用于在 ComfyUI 中进行视频防抖的 custom node。

主要有以下 3 个功能。

- 对视频进行手抖补正
- 从补正后的视频中还原原本的手抖
- 添加人工手抖

---

## 安装

[nomadoor/ComfyUI-Video-Stabilizer](https://github.com/nomadoor/ComfyUI-Video-Stabilizer)

- 请通过 `ComfyUI Manager` 安装。

---

## 手抖补正

手抖补正使用 `Video Stabilizer Classic` 或 `Video Stabilizer Flow`。

功能完全相同，只是处理方式不同。

Flow 稍微重一些，但效果好很多，所以基本上推荐使用 Flow。

![](https://gyazo.com/779732831dc0e69b5eae8519d4599d24){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_Flow.json)


### 参数

`Video Stabilizer Classic` 和 `Video Stabilizer Flow` 的参数是共通的。

| Parameter | 说明 |
| --- | --- |
| `frame_rate` | 输入视频的 FPS。它会作为时间方向 smoothing 的基准。 |
| <span style="white-space: nowrap;">🎞️ <code>framing_mode</code></span> | 处理手抖补正后画面边缘缺失的方式。这个参数在视频里很容易看出差异。 |
| `transform_mode` | 用哪种变换来估计相机运动。 |
| <span style="white-space: nowrap;">🔒 <code>camera_lock</code></span> | 让画面更接近三脚架拍摄的固定镜头。 |
| `strength` | 去除估计出的相机运动的强度。`0.0` 基本保持原来的运动，`1.0` 会进行较强补正。 |
| `smooth` | 让相机运动变得多平滑。值越高，越能抑制突然的抖动。 |
| `keep_fov` | 只在 `framing_mode` 为 `crop` 时有效。指定保留多少视角。`1.0` 缩放较少，`0.0` 则牺牲视角来消除边缘空白。 |
| `padding_color` | padding 区域的颜色。如果后续用 `padding_mask` 做 inpaint / outpaint，颜色本身并不太重要。 |

### 🎞️ framing_mode

![原视频](https://gyazo.com/32044ef9e564ad2228cdae872e9a35ed){gyazo=loop} ![crop](https://gyazo.com/f901016b9fd5d2ecc40db8430ae8ffef){gyazo=loop} ![crop_and_pad](https://gyazo.com/b7f5e7145c066ab0b94b20a401b79690){gyazo=loop} ![expand](https://gyazo.com/971541da6bcc4659360cc72b2c008d8c){gyazo=loop}

- `crop`
  - 稍微放大 / 裁剪视频，让空白边缘不可见。
  - 抖动越大，视角会变得越窄。
- `crop_and_pad`
  - 尽量保留原来的视角，不足的部分用 padding 填充。
  - padding 部分会作为 `padding_mask` 输出。
- `expand`
  - 完全不裁剪，只根据需要扩大画布。

一般的视频编辑软件大多只能做接近 `crop` 的处理，但如果使用视频生成模型，就可以把 padding 部分当作 mask 来 outpainting。这样会有一些很有意思的用法。

### 🔒 camera_lock

启用 `camera_lock` 后，虽然并不完美，但会把视频调整得更接近三脚架拍摄的固定镜头。

普通的手抖补正只是让相机运动“更平滑”，而 `camera_lock` 会尽量把相机运动停下来。

---

## 还原手抖

在视频编辑中，先消除手抖再处理，有时会更稳定；但如果一直保持防抖后的状态，原本的临场感也会消失。

使用 `Video Stabilizer Motion Apply`，可以把之前用 Video Stabilizer 消除的手抖反向应用回来，从而还原原来的运动。

![](https://gyazo.com/cf0408a1b507b5ecd0699c2e16ff539d){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_to_Motion_Apply.json)

> 如果用 `crop` 或 `crop_and_pad` 做了补正，已经被裁掉的像素无法恢复。如果后面还想还原手抖，最开始补正时建议使用 `expand`。

---

## 添加人工手抖

不限于 AI 生成的视频，如果相机运动过于平滑，有时会显得有些 CG 感。

这时有意识地添加一点手抖，可以营造临场感和真实感。

![](https://gyazo.com/695ab8d32156327393d57ac9432a1e62){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_Shake.json)

`Video Stabilizer Shake Generator` 用来生成人工相机抖动，再把它交给 `Video Stabilizer Motion Apply`，就可以让视频产生抖动。

### 参数

| Parameter | 说明 |
| --- | --- |
| `frame_rate` | 输入视频的 FPS。当视频侧没有 FPS 元数据时，会作为 fallback 使用。 |
| `style` | 抖动的类型。 |
| `amount` | 抖动强度。只想稍微增加自然感时，较低的值就足够了。调得太高会很容易让人看着不舒服。 |
| `speed` | 抖动速度。想要较慢的手持感就调低，想要更细碎、更忙的抖动就调高。 |
| `seed` | 抖动的随机 seed。即使其他设置相同，改变 `seed` 也会改变抖动方式。 |

### style

![tripod](https://gyazo.com/e11213660ec6a4473adf422011c54eb1){gyazo=loop}  ![handheld](https://gyazo.com/1febc33e4083bc2f4ff0cf30ea6c8f28){gyazo=loop} ![walking](https://gyazo.com/f08efa57fb62658e2745509a5881462f){gyazo=loop} ![action](https://gyazo.com/112121eaed2dacbba58626dcd1ba110d){gyazo=loop} ![vibration](https://gyazo.com/437717f27d6f65bd5b6d15321b7b547d){gyazo=loop}

- `tripod`: 添加接近固定相机的、非常轻微的抖动。
- `handheld`: 添加自然的手持相机风格抖动。
- `walking`: 添加像边走边拍那样的上下 / 左右抖动。
- `action`: 添加更强、更粗糙的运动。
- `vibration`: 添加细小振动。

> 还有一个叫做 `Video Stabilizer Shake Generator Manual` 的节点。
> 它不是使用 preset，而是可以通过内部参数细调运动。

### Motion Blur

`Video Stabilizer Motion Apply` 也可以添加 motion blur。

稍微加一点后，会更接近真实相机拍摄的氛围。

![原视频](https://gyazo.com/430ba048b450cebcc13829b3ac6151c8){gyazo=loop}  ![Blur: 0](https://gyazo.com/3cc5171d2839d110d07748395ddbf32f){gyazo=loop} ![Blur: 1.00](https://gyazo.com/a5a106e029af738b5642e1c0aff3c57c){gyazo=loop}
