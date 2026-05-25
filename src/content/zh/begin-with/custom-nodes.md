---
layout: page.njk
lang: zh
section: begin-with
slug: custom-nodes
navId: custom-nodes
title: "自定义节点"
created: 2026-02-06
updated: 2026-03-02
summary: "关于自定义节点"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 什么是自定义节点

在其他软件中，它可能被称为“MOD”或“插件”，是一种添加默认没有的功能的插件一样的东西。

它可以让本来无法使用的 AI 模型得到支持，或者将复杂的处理整合到一个节点中，又或者是让设计变得更酷炫，是让 ComfyUI 变得强大的功能之一。

---

## 自定义节点的风险

虽然非常方便，但你应该记住：**安装得越多，遇到问题的概率就越高**。

- 节点之间不兼容导致报错
- 作者停止更新，导致在新的 ComfyUI 上无法运行
- 含有恶意代码的可能性（并非为零）

当然，有很多技术不装自定义节点就没法用，所以我们会适时引入，但请不要忘记 **“越少越好”** 这一原则。

---

## 自定义节点的安装

基本上都是通过 **ComfyUI Manager** 进行安装。

### 使用 ComfyUI Manager（推荐）

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

1. 安装 ComfyUI Manager
   - 如果还没有安装 ComfyUI Manager，请参考 [安装与设置 - 安装 ComfyUI Manager](/zh/begin-with/setup/#3-安装-comfyui-manager) 进行安装。
2. 点击菜单中的 `Manager`
3. 点击 `Custom Nodes Manager`
4. 在搜索栏输入节点名称进行搜索
5. 点击 `Install`（版本通常选 `latest` 即可）
6. 点击 `Restart` 重启 ComfyUI

### 手动安装

当 Manager 中没有，或者想要使用开发中的最新版时进行。

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

## 推荐先装上的自定义节点

虽然基本是以默认节点来构建，但为了补足日常使用中必定不够用的功能，请安装以下节点。

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**
  - 许多实用功能、视频生成辅助
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
  - 批处理、列表操作、Detailer
- **[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)**
  - 视频的读取与输出

### 有了会很方便的节点

- **[rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**
  - 对比滑块、文件夹层级显示、高级计算
- **[crystian/ComfyUI-Crystools](https://github.com/crystian/ComfyUI-Crystools)**
  - 资源监视器

---

## ComfyUI 原生 vs Wrapper

虽然没必要特意记住，但自定义节点大致分为两种类型。

### 1. ComfyUI 原生

在 [什么是 ComfyUI？](/zh/begin-with/what-is-comfyui/) 中也提到过，ComfyUI 的真正价值在于其**优化**，使得家用 PC 也能舒适地运行 AI 模型。

利用了这一核心功能的自定义节点被称为 ComfyUI 原生，能发挥 ComfyUI 的优势。

### 2. Wrapper（包装器）

这是为了让外部代码在 ComfyUI 上运行而**包装 (Wrap)** 起来的节点。

通常是为了让研究用代码等直接在 ComfyUI 上运行而制作的。
往往优化不足，因此可能会很重，或者容易出错，有不稳定的倾向。

当然，有很多技术只能通过 Wrapper 使用，而且许多实现在其内部也进行了独特的优化。在对开发者心怀感激的同时，最好将其作为测试运用来看待。
