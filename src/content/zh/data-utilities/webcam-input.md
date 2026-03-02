---
layout: page.njk
lang: zh
section: data-utilities
slug: webcam-input
navId: webcam-input
title: "摄像头 (Webcam)"
summary: "将网络摄像头或 OBS 的影像导入 ComfyUI 的方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/5c2f4a37547aa854b5dcc8d264ff962b.png"
---
## 网络摄像头输入

ComfyUI 可以将连接到电脑的摄像头影像作为图像导入。

### Webcam Capture 节点

![](https://gyazo.com/2a7ab2f8dc9179e6c02d15e74dedcea3){gyazo=image}

- 1. 添加 `Webcam Capture` 节点
- 2. 如果浏览器请求相机使用权限，请允许。
- 3. 执行 `▷ Run` 后，该瞬间的摄像头影像就会作为图像输出。

---

## 使用 OBS 读取电脑画面

只要使用知名直播软件 **[OBS Studio](https://obsproject.com/ja/download)** 的 **虚拟摄像头** 功能，就可以将桌面画面或特定窗口作为网络摄像头的影像发送给 ComfyUI。

与其说是 ComfyUI 的功能不如说是 OBS 的功能，因为很方便所以介绍一下。

### 1. OBS 的设置

安装 OBS，并设置想要捕获的画面。

- **源设置（窗口采集）**
  - 从来源的 `+` 中选择 `窗口采集`，并指定特定的软件（例：画图）。
  - ![](https://i.gyazo.com/3ae7154d9a7d58b54a5e331858a119ad.png){gyazo=loop}
  - **采集方法**: 如果画面全黑，更改为 `Windows 10 (1903 版本及以上)` 可能会显示出来（在 Affinity 等绘图类软件中经常发生）。
  - **光标**: 根据喜好取消勾选“捕获光标”。

- **画布尺寸**
  - 虽然不是必须的，但如果从 `设置` → `视频` 中调整为与 ComfyUI 生成的分辨率一致，纵横比的管理会变得更轻松。

### 2. 启动虚拟摄像头

点击 OBS 右下角 `控件` 中的 **启动虚拟摄像机**。
这样 OBS 的画面就会被识别为网络摄像头。

### 3. 在 ComfyUI 中读取

回到 ComfyUI，更改 `Webcam Capture` 节点的设置。

- 1. 从相机选择下拉菜单中选择 **`OBS Virtual Camera`**
    - ※如果没有显示，请刷新 ComfyUI（`F5`）。
- 2. 执行后，OBS 的画面就会作为图像被导入。

### 实时执行 (Auto Queue)

![](https://gyazo.com/6b57f5d40d4c55b13d82bf6737a24e5a){gyazo=loop}

如果只是拍一张静止画，普通执行就可以，但如果是想把绘画实时进行 AI 转换等情况，请使用 `▷ Rum` 菜单中的 **`Run (Instant)`**。
