---
layout: page.njk
lang: zh
section: begin-with
slug: custom-nodes
navId: custom-nodes
title: "自定义节点"
created: 2026-02-06
updated: 2026-03-02
summary: "介绍自定义节点"
seoTitle: "什么是 ComfyUI 自定义节点？安装方法与注意事项"
seoDescription: "为 ComfyUI 添加功能的自定义节点基础。讲解安装的风险、用 ComfyUI Manager 或手动安装的方法、推荐节点，以及原生实现与 Wrapper 的区别。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 什么是自定义节点

在其他软件里，它可能叫“MOD”或“插件”，简单说就是用来添加默认没有的功能的插件。

它可以支持默认无法使用的 AI 模型，把复杂的处理整合到一个节点里，甚至让界面变得更酷炫，是让 ComfyUI 如此强大的功能之一。

---

## 自定义节点的风险

虽然非常方便，但你应该记住：**安装得越多，遇到问题的概率就越高**。

- 节点之间不兼容导致报错
- 作者停止更新，导致在新的 ComfyUI 上无法运行
- 含有恶意代码的可能性（并非为零）

当然，很多技术不装自定义节点就用不了，所以该装的时候还是会装，但请不要忘记 **“越少越好”**。

---

## 安装自定义节点

基本上都通过 **ComfyUI Manager** 安装。

### 使用 ComfyUI Manager（推荐）

![](/media/begin-with/comfyui-manager/legacy_gyazo_c0d8901537b65da709f9ba9d6e1a0055.mp4){media=loop}

1. 安装 ComfyUI Manager
   - 如果还没有安装 ComfyUI Manager，请参考 [ComfyUI Manager](/zh/begin-with/comfyui-manager/) 进行安装。
2. 点击菜单中的 `Manager`
3. 点击 `Custom Nodes Manager`
4. 在搜索栏输入节点名称进行搜索
5. 点击 `Install`（版本通常选 `latest` 即可）
6. 点击 `Restart` 重启 ComfyUI

### 手动安装

Manager 里找不到，或者想用开发中的最新版时，可以手动安装。

1. 在终端中移动到 `ComfyUI/custom_nodes` 文件夹
2. 使用 `git clone` 命令下载仓库
   ```powershell
   cd ComfyUI/custom_nodes
   git clone https://github.com/username/repository-name.git
   ```
3. 根据需要安装依赖库
   ```powershell
   # venv
   cd path/to/ComfyUI
   venv/Scripts/activate
   cd custom_nodes/自定义节点
   pip install -r requirements.txt

   # 便携版
   cd path/to/ComfyUI/custom_nodes/自定义节点
   ../../../python_embeded/python.exe -s -m pip install -r requirements.txt
   ```
4. 重启 ComfyUI

---

## 建议先装上的自定义节点

虽然基本上都用默认节点来搭建，但日常使用中难免有不够用的地方，所以请先装上下面这些节点。

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**
  - 大量实用工具功能、视频生成辅助
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
  - 批处理、列表操作、Detailer
- **[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)**
  - 视频的读取与输出

### 装了会很方便的节点

- **[rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**
  - 对比滑块、文件夹层级显示、高级计算
- **[crystian/ComfyUI-Crystools](https://github.com/crystian/ComfyUI-Crystools)**
  - 实时显示 CPU、RAM、GPU、VRAM 等的资源监视器

---

## ComfyUI 原生 vs Wrapper

不用特意记住，不过自定义节点大致可以分为两种类型。

### 1. ComfyUI 原生

在 [什么是 ComfyUI？](/zh/begin-with/what-is-comfyui/) 里也稍微提过，ComfyUI 真正的价值在于**优化**，让家用电脑也能流畅地运行 AI 模型。

利用这一核心功能的自定义节点称为 ComfyUI 原生，能充分发挥 ComfyUI 的优势。

### 2. Wrapper（包装器）

这是为了让外部代码在 ComfyUI 上运行而**包装 (Wrap)** 起来的节点。

多数是为了让研究用的代码等原样在 ComfyUI 上运行而制作的。
它们往往优化不足，运行起来很重，或者容易出错，整体偏不稳定。

当然，也有很多技术只能通过 Wrapper 使用，而且不少实现也做了自己的优化。在深深感谢开发者的同时，最好还是把它当作试用来对待。
