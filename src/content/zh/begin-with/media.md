---
layout: page.njk
lang: zh
section: begin-with
slug: media
navId: media
title: "媒体 (Media)"
created: 2026-02-06
updated: 2026-03-02
summary: "关于媒体文件"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 图像

### Load Image 节点

将图像读取到 ComfyUI 中。

![](https://gyazo.com/9dd4bfe10197dddec18b0e7a1dc94f53){gyazo=loop}

除了搜索并添加节点外，还有几种方便的方法。
- a. 点击 `choose file to upload` 选择文件
- b. 将图像拖放到节点上
- c. 在剪贴板中有图像的状态下，在画布上按 `Ctrl + V`，会作为 `Load Image` 节点粘贴。

> 上传的图像会被复制到 `ComfyUI\input` 文件夹，并从那里读取。**并不会引用原始文件。**
>
> 这个图像只要不从 input 文件夹中删除就不会消失，因此一旦 Load 过的图像可以多次使用。

### Preview Image 节点

当场确认生成的图像。
由于不会被保存，因此用于暂时确认处理的中途经过或生成结果。

![](https://gyazo.com/9f5a3055bbb8ef271583545155f70371){gyazo=loop}

- 其他图像类节点也通用，可以通过右键菜单中的 `Save Image` 或 `Copy Image` 来保存或复制图像。
- 不需要特地去 output 文件夹找图片，很方便。


### Save Image 节点

保存生成的图像。

- 默认保存位置: `ComfyUI\output`
- 文件名会自动赋予连号。(例: `ComfyUI_00001_.png`)

通过在 `filename_prefix` 中输入数值，可以控制保存目录和文件名格式。

主要使用的格式如下：

| 用途 | 格式例 | 说明 |
|------|--------|------|
| 插入日期 | `%date:yyyy-MM-dd%` | 插入年月日（例: `2025-11-23`） |
| 创建子文件夹 | 包含 `/` | 包含 `/` 会被视为文件夹层级 |

```text
%date:yyyy-MM-dd%/cat_project   #例
ComfyUI/output/2025-11-23/cat_project_00001_.png    #输出例
```

- 虽然还有很多其他用法，但详细请见：[ComfyUI 解説 (wiki ではない)/SaveImage](https://comfyui.creamlab.net/nodes/SaveImage)

如果想更改默认保存位置，请在 [命令行启动参数](/zh/begin-with/command-line-arguments/) 中进行设置。
```powershell
main.py --output_dir --output-directory [path]
```

### Load Image (from Outputs) 节点

`Save Image` 节点保存的最新图像会被读取到这里。
有时被用作伪循环处理。

![](https://gyazo.com/1b344fc1baa844c784d53a9790e6aafb){gyazo=loop}

### Image Comparer (rgthree) 节点

可以用滑块比较两张图像。

![](https://gyazo.com/a3ac0fe532474c1447a2f9cd33b31649){gyazo=image}

[](/workflows/begin-with/media/Image_Comparer_(rgthree).json)

- 通过 [rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy) 添加。

---

## 视频

### Load Video 节点

读取视频。

![](https://gyazo.com/96531a04d73333953691800babd073b9){gyazo=image}

在 ComfyUI 中，许多节点将视频视为 **连续的静态图像** 来处理。
但是，这个节点的输出是 `VIDEO` 类型，直接是无法使用的。需要通过 `Get Video Components` 节点，将视频分解为图像、音频和 fps。

因此，处理视频时推荐使用后述的 **Video Helper Suite**。

> **注意:**
> 视频基本上都是经过压缩的，但在 ComfyUI 中读取时会作为连续图像（非压缩）展开。
> 如果读取 4K 高 fps 视频等，即使只有几秒钟，也可能耗尽 PC 的 RAM 导致崩溃。
>
> **Video Helper Suite** 的节点可以进行图像缩放或指定读取帧数，从内存管理的角度来看也更推荐使用。

### Save Video 节点

保存生成的视频。

![](https://gyazo.com/695faf8fda159e16dc56ef533e28eb8f){gyazo=image}

这次反过来，需要将连续图像转回 `VIDEO`，因此使用 Create Video 节点将图像和音频合并。

## 🎥Video Helper Suite

[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

处理视频用的便捷节点群。
比核心节点存在得更久，功能丰富且易用，因此经常被使用。

![](https://gyazo.com/ebfd8a274dbdecb613f3fa232eb3dbb0){gyazo=image}

### Load Video (Upload/Path) 节点

在读取时，可以降低 FPS 或缩小尺寸。
只要以当前视频生成 AI 所需的最低限度参数读取视频，就不会产生多余的负载。

和 Load Imaeg 节点一样，也可以通过拖放来读取视频。

加载视频的 fps 和帧数等，从 `Video Info` 节点获取。

| 参数名 | 说明 |
| --- | --- |
| force_rate | 指定帧率（0 为无效） |
| custom_width | 缩放时的宽度（0 为无效） |
| custom_height | 缩放时的高度（0 为无效） |
| frame_load_cap | 读取帧数的上限（0 为无限制） |
| skip_first_frames | 开头跳过的帧数 |
| select_every_nth | 每 N 帧获取 1 帧（抽帧） |
| format | 输出格式（可选择对应模型的预设） |

### Video Combine 节点

直接输入连续图像、音频来创建视频。

| 参数名 | 说明 |
| --- | --- |
| images | 输入图像（连续） |
| audio | 输入音频 |
| frame_rate | 输出帧率 |
| loop_count | 循环输出输入视频 |
| filename_prefix | 与 `Save Image` 节点相同 |
| format | 输出格式（mp4, gif, webp 等） |
| pingpong | 往返播放（播放后追加倒放） |
| save_output | 关闭后不会保存，仅进行预览 |

---

## 音频

### Load Audio 节点

读取音频文件。

### Preview Audio 节点

当场确认音频。

### Save Audio 节点

保存音频。

根据保存格式分为以下 3 种。

- `Save Audio (FLAC)`
- `Save Audio (MP3)`
- `Save Audio (Opus)`

## 摄像头

![](https://gyazo.com/2a7ab2f8dc9179e6c02d15e74dedcea3){gyazo=image}

可以将摄像头的输入作为图像导入。

详情请参阅 [摄像头 (Webcam)](/zh/data-utilities/webcam-input/)。
