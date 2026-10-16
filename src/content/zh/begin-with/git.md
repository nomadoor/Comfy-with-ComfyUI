---
layout: page.njk
lang: zh
section: begin-with
slug: git
navId: git
title: "Git"
created: 2026-02-06
updated: 2026-03-02
summary: "使用 ComfyUI 时值得了解的 Git 与 GitHub 基础"
seoTitle: "面向 ComfyUI 用户的 Git、GitHub 入门"
seoDescription: "安装 ComfyUI 和自定义节点时会遇到的 Git 与 GitHub 基础。用游戏存档来比喻，讲解提交和分支的概念、至少要记住的命令，以及 ComfyUI Manager 在背后做了什么。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/begin-with/git/legacy_gyazo_4bb24e5d24ae91a7e0f1f5143c2e5ee5.png"
---

## 什么是 Git？

一言以蔽之，它就像是**游戏的存档功能**。
它提供各种功能，让开发顺顺利利地进行，不至于“一失败就得从头再来”。

- **Commit (提交)**
  - 类似于动作游戏中的“存档点”。
  - 只要在任意时机存个档（Commit），即使之后的操作把程序弄坏了，也能把时间倒回到那个确实能运行的地方重新来过。

- **Branch（分支）**
  - 用来创建游戏中的“分支路线”或“平行世界”。
  - 可以在不影响主文件的情况下，在复制出来的世界（Branch）中安全地尝试新功能。
  - 和游戏不同的是，之后可以只把 Branch 中成功的改动（差异）合并（Merge）回主世界。

---

## 什么是 GitHub？

![](/media/begin-with/git/legacy_gyazo_aa0bd187bca975346df5582992735910.png){media=image}

它是用来存放 Git 所保存数据的 **“巨大仓库（云存储）”**。

世界各地的开发者会把自己写的程序（比如 ComfyUI 的自定义节点）上传到这里公开。
一般所说的“安装自定义节点”，指的就是“从 GitHub 这个仓库里，把文件复制到自己的 PC 上”。

此外，GitHub 也有类似 SNS 的一面。
程序有问题时可以在这里报告（Issue），也可以提出新功能的请求，是开发者和用户交流的地方。

---

## 至少要记住的命令

- **git clone (克隆)**
  - 基本上理解为“把 GitHub 上的程序整个下载到自己电脑上的功能”就可以了。
  - 不过，它和单纯下载 Zip 文件不同，关键在于它会 **保持与仓库的关联**，把副本拿到你手上。正因为有这个“关联”，才能用接下来的 `pull`。

- **git pull (拉取)**
  - `git clone` 之后，开发者还会不断改进软件、添加功能，所以你手上的程序会慢慢变旧。
  - 执行 `git pull` 后，它会对比 GitHub 上的最新状态和自己 PC 的内容，**只下载并更新有变更的部分**。
  - 可以把它看作实际上的“更新”命令。

---

## ComfyUI Manager 的真面目
常用的 **ComfyUI Manager**，其实就是在后台自动替你执行 `git clone` 和 `git pull` 的工具。

- **Install:** 后台运行着 `git clone`。
  - （同时执行 `pip install` 等，为你准备必要的库）
- **Update:** 后台运行着 `git pull`。
