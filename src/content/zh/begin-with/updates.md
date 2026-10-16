---
layout: page.njk
lang: zh
section: begin-with
slug: updates
navId: updates
title: "更新"
created: 2026-02-06
updated: 2026-03-02
summary: "让 ComfyUI 保持最新的方法"
seoTitle: "ComfyUI 更新方法：稳定版与开发版"
seoDescription: "ComfyUI 的更新步骤。讲解稳定版（Stable）与开发版（Nightly）的区别，以及便携版、手动安装版、ComfyUI Manager 和桌面版各自的更新方法。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 稳定版 (Stable) 与开发版 (Nightly)

更新时，可以选择用哪个版本。

| 版本 | 特征 | 推荐场景 |
| :--- | :--- | :--- |
| **稳定版 (Stable)** | 修复了明显 Bug、保证能正常运行的定版。官方正式发布的通常就是这个版本。 | 最看重稳定性时。 |
| **开发版 (Nightly)** | 包含所有新功能和修复的最新版。测试还不充分，可能会出问题。 | 想马上试用新功能或最新模型支持时。 |

> [!WARNING]
> 如果出现“明明更新到了最新版，却无法使用这个功能/模型”的情况，可能是因为选的是**稳定版**。新功能首先会进入**开发版**。

---

## 便携版 (Portable)

Windows 的便携版只需运行预置的 `.bat` 文件即可轻松更新。

运行位于以下层级的 `.bat` 文件即可开始更新。运行中即使看起来像卡住了，多半其实还在跑，耐心等到显示 **`Done!`** 吧。

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
    * PyTorch 的更新**非常有可能导致自定义节点无法运行**，所以如果目前没出问题，最好别用。

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
需要把当前 Git 的 HEAD 切换到最新稳定版的 tag，操作比较复杂。手动安装版想用稳定版的话，通常一开始就 Clone Stable 分支，或者用 Manager 会更简单。

---

## ComfyUI Manager

如果装了 ComfyUI Manager，就可以直接在 UI 上更新。

![ComfyUI_Manager_Updates](/media/begin-with/updates/legacy_gyazo_33cab8c113457ee1a54035612bea9c11.png){media=image}

- 1.  选择想要更新的版本（**Nightly Version** 或 **Stable Version**）
- 2.  点击 **`Update ComfyUI`** 按钮

> [!WARNING]
> `Update All` 并不是更新 ComfyUI 本身，而是更新**所有已安装的自定义节点**的按钮。

---

## 桌面版

会自动更新。

原则上只能用稳定版，想用最新功能的话，就用便携版等其他版本吧。
