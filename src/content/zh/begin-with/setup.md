---
layout: page.njk
lang: zh
section: begin-with
slug: setup
navId: setup
title: "安装与设置"
created: 2026-02-06
updated: 2026-03-02
summary: "关于安装与设置"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUI 的安装

有几种方法可以在本地环境中运行 ComfyUI：

* **便携版（推荐）**
* 桌面版（安装程序形式）
* 手动安装版（venv + Git / 面向高级用户）

便携版灵活且稳定，无论谁来安装都能创建出相似的环境，因此本站将以使用便携版为前提进行解说。

此外，我们也将在这里介绍 **ComfyUI Manager** 的安装。

这是一个能简化 ComfyUI 管理（如安装自定义节点）的工具。

---

## 使用便携版进行安装

便携版打包了 Python、PyTorch 和 CUDA 环境，只需解压即可运行。

### 1. 下载

访问 ComfyUI 的 [GitHub 发布页面](https://github.com/comfyanonymous/ComfyUI/releases) 并选择适合你 GPU 的文件。

| GPU 类型 | 文件名 (例) | 备注 |
| :--- | :--- | :--- |
| **NVIDIA GPU** | `ComfyUI_windows_portable_nvidia.7z` | 驱动程序足够新的环境下，请首先选择此版本。如果启动失败，请更新 GPU 驱动，或使用下方的**旧驱动版**。|
| NVIDIA GPU (稳定/旧版环境) | `cu126`/`cu128` | 不想更新驱动，或者标准版启动后立即退出的情况下使用。|
| AMD GPU | `ComfyUI_windows_portable_amd.7z` | 面向 AMD 用户。 |


### 2. 解压与启动

- 1.  右键点击下载的 `7z 文件`，选择“提取到”进行解压。
  - ![](https://gyazo.com/776dafe2320c41526e6292f52edbe07d){gyazo=loop}
  - 正如在[推荐配置的存储部分](/zh/begin-with/recommended-specs/#存储)中所述，推荐将其放置在 SSD 上。
- 2.  双击解压文件夹中的 `run_nvidia_gpu.bat` 启动。
- 3.  首次启动时环境配置需要一些时间。如果浏览器自动打开，即表示成功。

### 3. 安装 ComfyUI Manager

- 1. 安装 Git
  - 从 [Git for Windows](https://gitforwindows.org/) 下载安装程序并进行安装。
  - 设置全部保持默认即可（一直点 Next 就行）。

- 2. 打开安装位置
  - 打开 ComfyUI 文件夹中的 `custom_nodes` 文件夹。
  - ```text
    📂ComfyUI_windows_portable/
    └── 📂ComfyUI/
          └── 📂custom_nodes/
    ```

- 3. 打开终端
	- 在 `custom_nodes` 文件夹的空白处点击右键，选择 **“在终端中打开”**。
	- Windows Terminal（PowerShell）将会启动，并以该文件夹作为工作目录。

- 4. 执行命令
  - 复制以下命令，粘贴到黑色窗口中（右键点击），然后按 Enter 键。
  - ```powershell
    git clone https://github.com/ltdrdata/ComfyUI-Manager.git
    ```

- 5. 完成
  - 如果 `custom_nodes` 文件夹中生成了 `ComfyUI-Manager` 文件夹，即表示成功。
  - 重启 ComfyUI 后，菜单中会增加“Manager”按钮。

---

## 桌面版

这是面向 Windows 的安装程序形式。预装了 ComfyUI Manager 等，提供了稳定的运行环境，但也因此稍微多了一些限制。

### 下载

- 1.  从 ComfyUI Desktop 的 [GitHub 页面](https://github.com/Comfy-Org/desktop) 下载 `ComfyUI Setup.exe`。
- 2.  运行程序，选择安装位置和 GPU 设置。

---

## 手动安装 (Windows, Linux)

使用标准的 `git clone` 和 `pip` 进行安装的方法。

### 关于 Python 版本
* 推荐 **Python 3.13**。
* 如果自定义节点的依赖关系出现问题，请尝试 **3.12**。

### 1. 安装

首先克隆仓库，创建并激活虚拟环境。

```powershell
# 克隆仓库
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 创建并激活虚拟环境 (Windows)
python -m venv venv
venv\Scripts\activate

# (Linux/macOS)
# python -m venv venv
# . venv/bin/activate
```

### 2. 安装 PyTorch (NVIDIA)

稳定版 (Stable):
```bash
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130
```

Nightly (可能提升性能):
```bash
pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu130
```

### 3. 安装依赖

在 ComfyUI 文件夹内执行以下命令。

```bash
pip install -r requirements.txt
```

### 4. 安装 ComfyUI Manager

即使是手动安装，Manager 也是必须的。

```bash
cd custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager.git
cd ..
```

---

## 关于一键安装包

像 Pinokio 或 Stability Matrix 这样的一键安装包确实很方便，可以轻松引入复杂的功能。

然而，中间涉及的要素越多，故障也就越多……当出现问题时，很难查明原因，最终往往超出初学者的处理能力。

包括便携版在内，ComfyUI 的安装并不难，因此建议简单地只使用官方提供的手段进行安装。

---

### 参考文献
* [ComfyUI - Installing](https://github.com/comfyanonymous/ComfyUI#installing)
