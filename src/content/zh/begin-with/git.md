---
layout: page.njk
lang: zh
section: begin-with
slug: git
navId: git
title: "Git"
created: 2026-02-06
updated: 2026-03-02
summary: "关于 Git 的基础知识"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/4bb24e5d24ae91a7e0f1f5143c2e5ee5.png"
---

## 什么是 Git？

一言以蔽之，它就像是**游戏的存档功能**。
它提供了能让你舒适地进行开发的功能，避免“一旦失败就要从头再来”的惨剧。

- **Commit (提交)**
  - 类似于动作游戏中的“存档点”。
  - 只要在喜欢的时机进行存档（Commit），即使之后的作业把程序搞坏了，也能将时间回溯到那个确保能运行的时刻重新开始。

- **Branch（分支）**
  - 类似于游戏的“分支路线”或“平行世界”。
  - 可以在不影响主文件的情况下，在复制出来的世界（Branch）中安全地尝试新功能。
  - 与游戏不同的是，它可以将 Branch 中试验成功的变更点（差异），在之后合并（Merge）回主世界。

---

## 什么是 GitHub？

![](https://i.gyazo.com/aa0bd187bca975346df5582992735910.png){gyazo=image}

它是一个存放用 Git 保存的数据的 **“巨大的仓库（云存储）”**。

世界各地的开发者都会将自己编写的程序（如 ComfyUI 的自定义节点等）上传到这里并公开。
一般所说的“安装自定义节点”，指的就是“从 GitHub 这个仓库里，把文件复制到自己的 PC 上”。

此外，GitHub 也有类似 SNS 的一面。
当程序出现问题时进行报告（Issue），或者请求新功能，它也是开发者与用户进行交流的场所。

---

## 至少要记住的命令

- **git clone (克隆)**
  - 基本上理解为“将 GitHub 上的程序，完整地下载到自己 PC 上的功能”就可以了。
  - 但是，与单纯下载 Zip 文件不同，重要的是它会在**保持与仓库的关联**的状态下，将副本带到你的手边。正因为有这个“关联”，接下来的 `pull` 才成为可能。

- **git pull (拉取)**
  - 在 `git clone` 之后，由于开发者会持续改进软件或添加功能，你自己环境里的程序会逐渐变旧。
  - 执行 `git pull` 后，它会对比 GitHub 上的最新状态和自己 PC 的内容，**只下载并更新有变更的部分**。
  - 将其视为实质上的“主要更新”命令即可。

---

## ComfyUI Manager 的真面目
经常使用的 **ComfyUI Manager**，其实就是在后台自动为你代劳了 `git clone` 和 `git pull` 的工具。

- **Install:** 后台运行着 `git clone`。
  - （同时执行 `pip install` 等，为你准备必要的库）
- **Update:** 后台运行着 `git pull`。
