---
layout: page.njk
lang: zh
section: begin-with
slug: updates
navId: updates
title: "更新"
created: 2026-02-06
updated: 2026-03-02
summary: "关于 ComfyUI 的更新方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 稳定版 (Stable) 与开发版 (Nightly)

在进行更新时，您可以选择应用哪个版本。

| 版本 | 特征 | 推荐场景 |
| :--- | :--- | :--- |
| **稳定版 (Stable)** | 修正了明显 Bug，保证动作的确定版。正式的官方发布通常指这个版本。 | 想要最优先考虑稳定性的情况。 |
| **开发版 (Nightly)** | 包含所有新实现的功能和修正的最新版。由于动作确认不完全，可能会出现问题。 | 想要立刻尝试新功能或新模型支持的一情况。 |

> **注意:** 如果出现“明明更新到了最新版，却无法使用这个功能/模型”的情况，可能是您选择了**稳定版**。新功能首先会进入**开发版**。

---

## 便携版 (Portable)

Windows 的便携版只需运行预置的 `.bat` 文件即可轻松更新。

运行位于以下层级的 `.bat` 文件即可开始更新。运行时即便看起来像停住了一样，其实后台通常还在动，请耐心等待直到显示 **`Done!`**。

```bat
📂ComfyUI_windows_portable/
└── 📂update/
    ├── update_comfyui.bat
    ├── update_comfyui_stable.bat
    └── update_comfyui_and_python_dependencies.bat
```

* **`update_comfyui.bat`**
    * 更新到开发版。
* **`update_comfyui_stable.bat`**
    * 更新到稳定版。
* **`update_comfyui_and_python_dependencies.bat` ⚠️**
    * 更新到开发版后，还会进行 PyTorch（Python 的核心库）的更新。
    * PyTorch 的更新**非常有可能导致自定义节点无法运行**，因此如果现状没有问题，最好不要使用。

---

## 手动安装版

### 更新到开发版

执行以下命令，即可更新到最新的开发版。

**Windows**

```powershell
# 1. 激活虚拟环境
.\venv\Scripts\activate

# 2. 用 Git 更新 ComfyUI 本体
git pull --ff-only

# 3. 更新必要的 Python 库
pip install -r requirements.txt
```

**Mac / Linux**

```bash
# 1. 激活虚拟环境
source venv/bin/activate

# 2. 用 Git 更新 ComfyUI 本体
git pull --ff-only

# 3. 更新必要的 Python 库
pip install -r requirements.txt
```


### 切换到稳定版
需要将当前 Git 的 HEAD 切换到最新稳定版 Tag 的复杂操作。通常，如果是手动安装版想要使用稳定版，从一开始就 Clone Stable 分支，或者使用 Manager 会更简单。

---

## ComfyUI Manager

如果您安装了 ComfyUI Manager，则可以通过 UI 进行更新。

![ComfyUI_Manager_Updates](https://i.gyazo.com/33cab8c113457ee1a54035612bea9c11.png){gyazo=image}

- 1.  选择想要更新的版本（**Nightly Version** 或 **Stable Version**）
- 2.  点击 **`Update ComfyUI`** 按钮

> **注意:** `Update All` 并不是更新 ComfyUI 本体，而是更新**所有已安装的自定义节点**的按钮。

---

## 桌面版

会自动更新。

原则上只能使用稳定版，所以如果想使用最新功能，请使用便携版等其他版本。
