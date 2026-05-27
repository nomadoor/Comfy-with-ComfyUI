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
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/76b47ed5d45cf694b436022589464255.png"
---

## 什么是 ComfyUI Manager

ComfyUI Manager 是 ltdrdata 开发的工具，用于统一管理自定义节点的安装、更新等操作。

由于许多环境几乎都会安装它，它实际上已经接近默认功能。随着 ComfyUI 转由 Comfy.Org 开发，目前 Manager 也被纳入了官方功能。

---

## 新旧 Manager

![](https://gyazo.com/a0b09641bae0c8b02187e6c6b7bb9c5a){gyazo=image}

稍微复杂的是，现在的 ComfyUI Manager 有 **新版 Manager** 和 **旧版 Manager**(legacy UI) 两种。

新版 Manager 提供了漂亮的 UI，并专注于自定义节点管理。
另一方面，旧版中曾经存在的 ComfyUI 本体重启、ComfyUI 更新、模型下载等便利功能已经被移除。

如果顺着 Comfy.Org 的方向，应该推荐使用新版 Manager，但继续使用旧版的人应该也不少。

---

## 安装与启用

> 只安装 Manager 并不会显示在画面上。  
> 还需要在启动 ComfyUI 时追加命令行参数。

### 桌面版的情况

如果使用 ComfyUI Desktop，ComfyUI Manager 已经包含在其中。

不需要额外安装。

### 便携版的情况

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

这样，下次启动 ComfyUI 时，ComfyUI Manager 就会启用。

### 手动安装版的情况

手动安装版需要在启用虚拟环境后，在 ComfyUI 文件夹内操作。

1. 启用虚拟环境。

   Windows 的情况:

   ```powershell
   venv\Scripts\activate
   ```

   Linux/macOS 的情况:

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

![](https://gyazo.com/ff8b7cdae4aba2a086a9cfebe8019023){gyazo=image}

如果安装和启用成功，右上角会显示 `Extensions` 按钮。

点击它即可打开 Manager 画面。

---

## 使用旧版 UI 启动

如果想使用旧版 ComfyUI Manager，请在 `--enable-manager` 的基础上同时指定 `--enable-manager-legacy-ui`。

便携版的情况:

```powershell
.\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager --enable-manager-legacy-ui
```

手动安装版的情况:

```bash
python main.py --enable-manager --enable-manager-legacy-ui
```

如果新版 Manager UI 已经足够，先只使用 `--enable-manager` 即可。
如果需要更新或模型管理等旧版中保留的功能，再根据需要启用旧版 UI。

---

## 安装自定义节点

### 现行 UI

![](https://gyazo.com/85ac7d6fb86580c06f252938e153a152){gyazo=loop}

1. 在搜索栏输入节点名称。
2. 点击 `Install`。
3. 点击 `Apply Changes`，或者手动重启 ComfyUI。

### 旧版 UI

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

1. 点击 `Custom Nodes Manager`。
2. 在搜索栏输入节点名称。
3. 点击 `Install`（版本通常选 `latest` 即可）。
4. 点击 `Restart`，或者手动重启 ComfyUI。

---

## 更新自定义节点

### 现行 UI

![](https://gyazo.com/3f8316ae71333f2214173e9987346153){gyazo=image}

移动到 `Updates Available` 标签页。

如果有可以更新的节点，会显示在这里。

- 使用右上角的 `Update` 按钮可以一次性全部更新。
- 选择目标后，可以从侧边栏的 `Update` 单独更新。

### 旧版 UI

![](https://gyazo.com/3eeb7b5df0d8567f0fdc37ec8c73fff1){gyazo=image}

1. 点击 `Custom Nodes Manager`。
2. 将 Filter 设置为 `Installed`，只显示已经安装的节点。
3. 点击想要更新的自定义节点的 `Try Update`。

---

### 参考文献

* [ComfyUI Manager 的安装](https://docs.comfy.org/zh/manager/install)
