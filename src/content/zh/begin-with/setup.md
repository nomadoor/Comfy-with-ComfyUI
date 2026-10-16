---
layout: page.njk
lang: zh
section: begin-with
slug: setup
navId: setup
title: "安装与设置"
created: 2025-11-20
updated: 2026-05-25
summary: "关于安装与设置"
seoTitle: "ComfyUI 安装方法：便携版、桌面版"
seoDescription: "在本地运行 ComfyUI 的安装步骤。以推荐的便携版为主，也介绍桌面版，以及在 Windows / Linux 上用 venv 和 Git 手动安装的方法。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUI 的安装

在本地运行 ComfyUI 有几种方法：

* **[便携版（推荐）](#使用便携版进行安装)**
* [桌面版（安装程序形式）](#桌面版)
* [手动安装版（venv + Git / 面向高级用户）](#手动安装-windows-linux)

便携版既灵活又稳定，不管谁来装，环境都差不多，所以本站的讲解基本都以便携版为前提。

另外，**ComfyUI Manager** 也顺便在这里装好吧。

这是一个能简化 ComfyUI 管理（如安装自定义节点）的工具。

---

## 使用便携版进行安装

便携版打包了 Python、PyTorch 和 CUDA 环境，只需解压即可运行。

### 1. 下载

访问 ComfyUI 的 [GitHub 发布页面](https://github.com/comfyanonymous/ComfyUI/releases) ，选择适合自己 GPU 的文件。

| GPU 类型 | 文件名 (例) | 备注 |
| :--- | :--- | :--- |
| **NVIDIA GPU** | `ComfyUI_windows_portable_nvidia.7z` | 驱动足够新的话，请先选择这个不带后缀的版本。如果启动失败，请更新 GPU 驱动，或使用下方的**旧驱动版**。|
| NVIDIA GPU (稳定/旧版环境) | `cu126`/`cu128` | 不想更新驱动，或者不带后缀的版本启动后马上退出时使用。|
| AMD GPU | `ComfyUI_windows_portable_amd.7z` | 面向 AMD 用户。 |


### 2. 解压与启动

1. 右键点击下载的 `7z 文件`，选择“全部解压缩”进行解压。
   - [推荐配置的存储](/zh/begin-with/recommended-specs/#存储)里也提到过，建议放在 SSD 上。
2. 双击解压文件夹中的 `run_nvidia_gpu.bat` 启动。
3. 首次启动时环境配置需要一些时间。浏览器自动打开就说明成功了。

### 3. 安装 ComfyUI Manager

1. 打开 `ComfyUI_windows_portable` 文件夹，在文件夹内右键点击，选择 `在终端中打开`。

2. 在打开的窗口中输入以下命令，然后按 `Enter`。

   ```powershell
   .\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt
   ```

   这样会安装 Manager 所需的库。

   不过，光这样画面里还不会出现 Manager，所以要给启动用的 `.bat` 文件追加命令行参数。

3. 右键点击 `run_nvidia_gpu.bat`，选择 `编辑`。

4. 在执行 `main.py` 的那一行末尾，追加 `--enable-manager`。

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager
   ```

5. 如果想使用旧版 ComfyUI Manager，也追加 `--enable-manager-legacy-ui`。

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager --enable-manager-legacy-ui
   ```

---

## 桌面版

这是面向 Windows 的安装程序形式。已经预装了 ComfyUI Manager 等，运行很稳定，但相应地限制也稍多一些。

### 下载

1. 从 ComfyUI Desktop 的 [GitHub 页面](https://github.com/Comfy-Org/desktop) 下载 `ComfyUI Setup.exe`。
2. 运行程序，选择安装位置和 GPU 设置。

> [!NOTE]
> ComfyUI Manager 默认已经搭载。

---

## 手动安装 (Windows, Linux)

使用标准的 `git clone` 和 `pip` 进行安装的方法。

### 关于 Python 版本
* 推荐 **Python 3.13**。
* 如果自定义节点的依赖关系出现问题，请尝试 **3.12**。

### 1. 安装

1. 克隆仓库，并移动到 ComfyUI 文件夹。

   ```powershell
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   ```

2. 创建并激活虚拟环境。

   Windows：

   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```

   Linux/macOS：

   ```bash
   python -m venv venv
   . venv/bin/activate
   ```

### 2. 安装 PyTorch (NVIDIA)

1. 通常安装稳定版 (Stable)。

   ```bash
   pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130
   ```

2. 如果想使用 Nightly 版，请执行下面的命令。

   它有可能提升性能，但通常使用稳定版即可。

   ```bash
   pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu130
   ```

### 3. 安装依赖

1. 安装依赖。

   ```bash
   pip install -r requirements.txt
   ```

### 4. 安装 ComfyUI Manager

1. 安装 ComfyUI Manager 所需的库。

   ```bash
   pip install -r manager_requirements.txt
   ```

2. 光这样画面里还不会出现 Manager，所以启动 ComfyUI 时要追加 `--enable-manager`。

   ```bash
   python main.py --enable-manager
   ```

3. 如果想使用旧版 ComfyUI Manager，也追加 `--enable-manager-legacy-ui`。

   ```bash
   python main.py --enable-manager --enable-manager-legacy-ui
   ```

---

## 关于一键安装包

像 Pinokio 或 Stability Matrix 这样的一键安装包确实很方便，可以轻松引入复杂的功能。

然而，中间涉及的要素越多，故障也就越多……当出现问题时，很难查明原因，最终往往超出初学者的处理能力。

以便携版为首，ComfyUI 的安装并没有那么难，所以建议简单一点，只用官方提供的方式来安装。

---

### 参考资料
* [ComfyUI Manager 的安装](https://docs.comfy.org/zh/manager/install)
