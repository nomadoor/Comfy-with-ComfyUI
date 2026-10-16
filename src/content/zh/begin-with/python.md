---
layout: page.njk
lang: zh
section: begin-with
slug: python
navId: python
title: "Python"
created: 2026-02-06
updated: 2026-08-01
summary: "驱动 ComfyUI 的 Python 基础"
seoTitle: "面向 ComfyUI 用户的 Python 入门"
seoDescription: "驱动 ComfyUI 的 Python 基础术语。在应对报错所需的范围内，讲解版本、库、pip install、虚拟环境，以及便携版 Python 的处理方式与注意事项。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 关于 Python

世界上有无数种编程语言，而 ComfyUI 是用 **Python** 这门语言运行的。

想用好 ComfyUI，完全不需要会用 Python 编程。
不过，稍微知道一些术语的话，以后面对各种报错时，也许就更有勇气和它们战斗了。

---

## 版本

“语言”还有版本，听起来有点奇怪。不过就像以前没有的词会在新时代诞生一样，Python 每次更新也会加入新功能和改进。

它基本上会保持向下兼容（让旧代码也能运行），但版本升级后，也有一些程序会跑不起来。

* **推荐版本**
  - 目前 Python 的最新版更新得很快，但 ComfyUI 能稳定运行的版本范围在 `3.10` 〜 `3.13` 之间。

---

## 库 (Library)

用 ComfyUI 来打比方有点怪，不过“库”就像是 **自定义节点**。
它是用来给 Python 本身添加没有的功能，或者让复杂的处理写起来更简单的“扩展部件”。

库很方便，但一个库可能依赖其他库，或者和 Python 本身的版本对不上，这时就可能出现 **“明明什么都没做，却坏掉了”** 的情况。
实际上，在 ComfyUI 中遇到的大部分错误都是由库引起的。

---

## pip install

这是用来安装这些“库”的命令。

```bash
pip install <库名>
```

例如像上面这样输入，就会从互联网下载并安装库。

---

## 虚拟环境

前面说过，库既是 Python 的强项，也很容易成为出错的原因。
装得越多越方便，但依赖关系也会随之变复杂，出错的可能性也会变高。

于是就轮到 **“虚拟环境”** 登场了。

如果什么都不做就直接装库，会影响到电脑上所有的 Python 程序；而按软件分到各自的“专用房间”里管理，就能避免依赖关系变得一团乱。
经常出现的 `venv`，就是创建这种虚拟环境的功能之一。

---

## 便携版

便携版的 ComfyUI 有点特别。
打开 `ComfyUI_windows_portable` 文件夹看看，会发现里面有一个 `python_embeded` 文件夹。

* **手动安装(venv):** 在 PC 上安装 Python，并在其中创建虚拟环境（房间）。
* **便携版:** 把 Python 本身内置在文件夹里。

可以说是“连房子一起搬过来”的结构。
所以即使电脑上没有安装 Python 也能运行；放进 U 盘、在别的电脑上启动，也能直接运行。


### 🚨 注意点

虽说“哪里都能跑”，但也是有限度的。

- 1.  **OS 之墙:** Windows 用的便携版无法在 Linux 或 Mac 上运行。
- 2.  **硬件之墙:** 针对 CUDA (NVIDIA) 设置的 ComfyUI，无法在没有 NVIDIA GPU 的 PC 上运行。
- 3.  **环境依赖之墙:** `xformers`、`FlashAttention` 等特定的库，高度依赖驱动、硬件配置和路径，带到其他电脑上往往跑不起来。

把它理解为“只要基本的硬件配置和 OS 相同就能运行”这个程度就好。
