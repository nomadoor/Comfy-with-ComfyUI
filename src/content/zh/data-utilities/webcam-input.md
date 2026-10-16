---
layout: page.njk
lang: zh
section: data-utilities
slug: webcam-input
navId: webcam-input
title: "摄像头 (Webcam)"
created: 2026-02-06
updated: 2026-03-02
summary: "把网络摄像头或 OBS 的画面导入 ComfyUI 的方法"
seoTitle: "将网络摄像头或 OBS 画面导入 ComfyUI"
seoDescription: "用 Webcam Capture 节点把摄像头画面导入 ComfyUI，以及通过 OBS 虚拟摄像头读取电脑屏幕的方法。还介绍自动重复执行以实现伪实时处理的设置。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/webcam-input/legacy_gyazo_5c2f4a37547aa854b5dcc8d264ff962b.png"
---
## 网络摄像头输入

ComfyUI 可以把连接在电脑上的摄像头画面作为图像导入。

### Webcam Capture 节点

![](/media/begin-with/media/legacy_gyazo_2a7ab2f8dc9179e6c02d15e74dedcea3.png){media=image}

- 1. 添加 `Webcam Capture` 节点
- 2. 如果浏览器请求摄像头权限，请允许。
- 3. 执行 `▷ Run`，就会把那一刻的摄像头画面作为图像输出。

---

## 使用 OBS 读取电脑画面

使用知名直播软件 **[OBS Studio](https://obsproject.com/ja/download)** 的 **虚拟摄像头** 功能，可以把桌面画面或特定窗口当作网络摄像头的画面发送给 ComfyUI。

这与其说是 ComfyUI 的功能，不如说是 OBS 的功能，不过很方便，所以在这里介绍一下。

### 1. OBS 的设置

安装 OBS，设置好想要采集的画面。

- **源设置（窗口采集）**
  - 在来源的 `+` 中选择 `窗口采集`，并指定某个软件（例：画图）。
  - ![](/media/data-utilities/webcam-input/legacy_gyazo_3ae7154d9a7d58b54a5e331858a119ad.mp4){media=loop}
  - **采集方式**: 如果画面全黑，改成 `Windows 10 (1903 版本及以上)` 也许就能显示出来（Affinity 等绘图类软件经常出现这种情况）。
  - **光标**: 按需取消勾选“捕获光标”。

- **画布尺寸**
  - 不是必须的，但在 `设置` → `视频` 中把它调成与 ComfyUI 生成的分辨率一致，管理纵横比会轻松些。

### 2. 启动虚拟摄像头

点击 OBS 右下角 `控件` 中的 **启动虚拟摄像机**。
这样 OBS 的画面就会被识别成网络摄像头。

### 3. 在 ComfyUI 中读取

回到 ComfyUI，更改 `Webcam Capture` 节点的设置。

- 1. 在摄像头选择下拉菜单中选择 **`OBS Virtual Camera`**
    - ※如果没有显示，请刷新 ComfyUI（`F5`）。
- 2. 执行后，OBS 的画面就会作为图像导入。

### 实时执行 (Auto Queue)

![](/media/data-utilities/webcam-input/legacy_gyazo_6b57f5d40d4c55b13d82bf6737a24e5a.mp4){media=loop}

如果只是拍一张静态图，普通执行就够了；但如果想把正在画的画实时交给 AI 转换，请使用 `▷ Rum` 菜单中的 **`Run (Instant)`**。
