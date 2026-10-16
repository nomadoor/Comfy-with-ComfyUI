---
layout: page.njk
lang: zh
section: begin-with
slug: comfyui-manager
navId: comfyui-manager
title: "ComfyUI Manager"
created: 2026-05-26
updated: 2026-05-27
summary: "关于 ComfyUI Manager"
seoTitle: "ComfyUI Manager 使用方法：安装与管理自定义节点"
seoDescription: "ComfyUI Manager 用于管理自定义节点的安装和更新，本文介绍它的用法。讲解新旧 Manager 的区别，以及在便携版、桌面版和手动安装版中启用它的步骤。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  image: "/media/begin-with/comfyui-manager/legacy_gyazo_76b47ed5d45cf694b436022589464255.png"
---

## 什么是 ComfyUI Manager

ComfyUI Manager 是 ltdrdata 开发的工具，用于统一管理自定义节点的安装、更新等操作。

由于大多数环境都会理所当然地装上它，它实际上已经相当于默认功能。随着 ComfyUI 转由 Comfy.Org 开发，现在 Manager 也被纳入了官方功能。

---

## 新旧 Manager

![](/media/begin-with/comfyui-manager/legacy_gyazo_a0b09641bae0c8b02187e6c6b7bb9c5a.png){media=image}

麻烦的是，现在的 ComfyUI Manager 有 **新版 Manager** 和 **旧版（legacy）Manager** 两种。

新版 Manager 配有漂亮的 UI，并且只专注于管理自定义节点。
另一方面，旧版中的重启和更新 ComfyUI 本身、下载模型等便利功能都被去掉了。

如果考虑 Comfy.Org 的意图，应该推荐新版 Manager，但继续用旧版的人应该也不少。

---

## 安装与启用

> [!WARNING]
> 只安装的话，Manager 并不会显示出来。  
> 需要加上命令行参数再启动。

### 桌面版

如果使用 ComfyUI Desktop，ComfyUI Manager 已经包含在其中。

不需要额外安装。

### 便携版

1. 打开 `ComfyUI_windows_portable` 文件夹。
2. 在文件夹内右键点击，选择 `在终端中打开`。
3. 执行以下命令。

   ```powershell
   .\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt
   ```

   这样会安装 ComfyUI Manager 所需的库。

4. 右键点击 `run_nvidia_gpu.bat`，选择 `编辑`。
5. 在执行 `main.py` 的那一行末尾追加 `--enable-manager`。

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager
   ```

这样启动时 ComfyUI Manager 就会启用。

### 手动安装版

手动安装版需要在激活虚拟环境的状态下，在 ComfyUI 文件夹内操作。

1. 激活虚拟环境。

   Windows:

   ```powershell
   venv\Scripts\activate
   ```

   Linux/macOS:

   ```bash
   . venv/bin/activate
   ```

2. 安装 ComfyUI Manager 所需的库。

   ```bash
   pip install -r manager_requirements.txt
   ```

3. 启动 ComfyUI 时追加 `--enable-manager`。

   ```bash
   python main.py --enable-manager
   ```

### 打开 ComfyUI Manager

![](/media/begin-with/comfyui-manager/legacy_gyazo_ff8b7cdae4aba2a086a9cfebe8019023.png){media=image}

安装并启用成功后，右上角会显示 `Extensions` 按钮。

点击它即可打开 Manager 画面。

---

## 使用旧版 UI 启动

如果想使用旧版 ComfyUI Manager，请在 `--enable-manager` 的基础上同时指定 `--enable-manager-legacy-ui`。

便携版:

```powershell
.\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager --enable-manager-legacy-ui
```

手动安装版:

```bash
python main.py --enable-manager --enable-manager-legacy-ui
```

如果新版 Manager UI 就够用，先只加 `--enable-manager` 就行。
如果想用更新、模型管理等只有旧版才有的功能，再根据需要启用旧版 UI。

---

## 安装自定义节点

### 新版 UI

![](/media/begin-with/comfyui-manager/legacy_gyazo_85ac7d6fb86580c06f252938e153a152.mp4){media=loop}

1. 在搜索栏输入节点名称进行搜索。
2. 点击 `Install`。
3. 点击 `Apply Changes`，或者手动重启 ComfyUI。

### 旧版 UI

![](/media/begin-with/comfyui-manager/legacy_gyazo_c0d8901537b65da709f9ba9d6e1a0055.mp4){media=loop}

1. 点击 `Custom Nodes Manager`。
2. 在搜索栏输入节点名称进行搜索。
3. 点击 `Install`（版本通常选 `latest` 即可）。
4. 点击 `Restart`，或者手动重启 ComfyUI。

---

## 更新自定义节点

### 新版 UI

![](/media/begin-with/comfyui-manager/legacy_gyazo_3f8316ae71333f2214173e9987346153.png){media=image}

切换到 `Updates Available` 标签页。

如果有可以更新的节点，会显示在这里。

- 使用右上角的 `Update` 按钮可以一次性全部更新。
- 选择目标后，可以从侧边栏的 `Update` 单独更新。

### 旧版 UI

![](/media/begin-with/comfyui-manager/legacy_gyazo_3eeb7b5df0d8567f0fdc37ec8c73fff1.png){media=image}

1. 点击 `Custom Nodes Manager`。
2. 将 Filter 设置为 `Installed`，只显示已经安装的节点。
3. 点击想要更新的自定义节点的 `Try Update`。

---

### 参考资料

* [ComfyUI Manager 的安装](https://docs.comfy.org/zh/manager/install)
