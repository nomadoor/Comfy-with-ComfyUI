---
layout: page.njk
lang: zh
section: begin-with
slug: media
navId: media
title: "媒体 (Media)"
created: 2026-02-06
updated: 2026-03-02
summary: "关于媒体"
seoTitle: "在 ComfyUI 中读取与保存图像、视频、音频"
seoDescription: "ComfyUI 处理媒体的基础节点汇总。介绍 Load Image、Save Image 等图像节点，包括 Video Helper Suite 在内的视频节点、音频节点以及便捷的读取方法。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 图像

### Load Image 节点

把图像加载到 ComfyUI 中。

![](/media/begin-with/media/legacy_gyazo_9dd4bfe10197dddec18b0e7a1dc94f53.mp4){media=loop}

除了搜索并添加节点，还有几种方便的方法。
- a. 点击 `choose file to upload` 选择文件
- b. 将图像拖放到节点上
- c. 剪贴板里有图像时，在画布上按 `Ctrl + V`，就会粘贴成一个 `Load Image` 节点。

> [!NOTE]
> 上传的图像会被复制到 `ComfyUI\input` 文件夹，并从那里读取。**并不会引用原始文件。**
>
> 只要不从 input 文件夹里删掉，这些图像就会一直在，所以 Load 过一次的图像可以反复使用。

### Preview Image 节点

直接查看生成的图像。
它不会保存图像，适合临时查看处理的中间结果或生成结果。

![](/media/begin-with/media/legacy_gyazo_9f5a3055bbb8ef271583545155f70371.mp4){media=loop}

- 其他图像类节点也一样，可以通过右键菜单的 `Save Image` 或 `Copy Image` 保存或复制图像。
- 不用特地去 output 文件夹里找图片，很方便。


### Save Image 节点

保存生成的图像。

- 默认保存位置: `ComfyUI\output`
- 文件名会自动加上序号。(例: `ComfyUI_00001_.png`)

在 `filename_prefix` 中填入内容，就可以控制保存目录和文件名格式。

常用的写法如下：

| 用途 | 写法示例 | 说明 |
|------|--------|------|
| 插入日期 | `%date:yyyy-MM-dd%` | 插入年月日（例: `2025-11-23`） |
| 创建子文件夹 | 包含 `/` | 包含 `/` 会被视为文件夹层级 |

```text
%date:yyyy-MM-dd%/cat_project   #例
ComfyUI/output/2025-11-23/cat_project_00001_.png    #输出例
```

- 还有很多其他写法，详情请看这里：[ComfyUI 解説 (wiki ではない)/SaveImage](https://comfyui.creamlab.net/nodes/SaveImage)

如果想修改默认保存位置，可以通过 [命令行参数](/zh/begin-with/command-line-arguments/) 设置。
```powershell
main.py --output_dir --output-directory [path]
```

### Load Image (from Outputs) 节点

`Save Image` 节点保存的最新图像会加载到这里。
有时会用来实现伪循环处理。

![](/media/begin-with/media/legacy_gyazo_1b344fc1baa844c784d53a9790e6aafb.mp4){media=loop}

### Image Comparer (rgthree) 节点

可以用滑块比较两张图像。

![](/media/begin-with/media/legacy_gyazo_a3ac0fe532474c1447a2f9cd33b31649.mp4){media=loop}

[](/workflows/begin-with/media/image_comparer_rgthree.json)

- 由 [rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy) 提供。

---

## 视频

### Load Video 节点

加载视频。

![](/media/begin-with/media/legacy_gyazo_96531a04d73333953691800babd073b9.png){media=image}

在 ComfyUI 中，很多节点会把视频当作 **图像序列** 来处理。
但这个节点输出的是 `VIDEO` 类型，无法直接使用。需要通过 `Get Video Components` 节点，把视频拆成图像、音频和 fps。

因此，处理视频时推荐使用后面介绍的 **Video Helper Suite**。

> [!WARNING]
> 视频基本上都是压缩过的，但在 ComfyUI 中加载时，会被展开成未压缩的图像序列。
> 如果加载 4K、高 fps 的视频，哪怕只有几秒，也可能耗尽电脑的 RAM 而崩溃。
>
> **Video Helper Suite** 的节点可以缩放图像、指定加载的帧数，从内存管理的角度来看也更推荐。

### Save Video 节点

保存生成的视频。

![](/media/begin-with/media/legacy_gyazo_695faf8fda159e16dc56ef533e28eb8f.png){media=image}

这次反过来，需要把图像序列转回 `VIDEO`，所以要用 Create Video 节点把图像和音频合在一起。

## 🎥Video Helper Suite

[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

一套方便处理视频的节点。
它比核心节点出现得更早，功能丰富又好用，所以很多时候会用它。

![](/media/begin-with/media/legacy_gyazo_ebfd8a274dbdecb613f3fa232eb3dbb0.png){media=image}

### Load Video (Upload/Path) 节点

加载时可以降低 FPS 或缩小尺寸。
只要按当前视频生成 AI 所需的最低参数来加载视频，就不会带来多余的负担。

和 Load Image 节点一样，也可以拖放视频来加载。

已加载视频的 fps、帧数等信息，可以从 `Video Info` 节点获取。

| 参数名 | 说明 |
| --- | --- |
| force_rate | 指定帧率（0 表示不启用） |
| custom_width | 缩放时的宽度（0 表示不启用） |
| custom_height | 缩放时的高度（0 表示不启用） |
| frame_load_cap | 读取帧数的上限（0 为无限制） |
| skip_first_frames | 开头跳过的帧数 |
| select_every_nth | 每 N 帧获取 1 帧（抽帧） |
| format | 输出格式（可以选择适合各模型的预设） |

### Video Combine 节点

直接输入图像序列和音频来生成视频。

| 参数名 | 说明 |
| --- | --- |
| images | 输入图像（序列） |
| audio | 输入音频 |
| frame_rate | 输出帧率 |
| loop_count | 把输入的视频循环后输出 |
| filename_prefix | 与 `Save Image` 节点相同 |
| format | 输出格式（mp4, gif, webp 等） |
| pingpong | 往返播放（播放完后接上倒放） |
| save_output | 关闭后不保存，只做预览 |

---

## 音频

### Load Audio 节点

加载音频文件。

### Preview Audio 节点

直接试听音频。

### Save Audio 节点

保存音频。

根据保存格式，有以下 3 种。

- `Save Audio (FLAC)`
- `Save Audio (MP3)`
- `Save Audio (Opus)`

## 摄像头

![](/media/begin-with/media/legacy_gyazo_2a7ab2f8dc9179e6c02d15e74dedcea3.png){media=image}

可以把摄像头的画面作为图像导入。

详情请参阅 [摄像头 (Webcam)](/zh/data-utilities/webcam-input/)。
