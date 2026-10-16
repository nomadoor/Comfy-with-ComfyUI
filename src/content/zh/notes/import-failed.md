---
layout: page.njk
lang: zh
section: notes
slug: import-failed
navId: import-failed
title: "(IMPORT FAILED)"
created: 2026-02-06
updated: 2026-03-02
noteTags: ["troubleshoot", "custom-nodes"]
summary: "自定义节点加载失败"
seoTitle: "ComfyUI (IMPORT FAILED) 的原因与解决方法"
seoDescription: "ComfyUI 启动时显示 (IMPORT FAILED)、自定义节点无法使用时的原因与解决方法，包括缺少库、Python / PyTorch 版本不匹配等情况的处理。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## 症状

![](/media/notes/import-failed/legacy_gyazo_3054a82b909490117748ae061e29c35e.png){media=image}

- 启动 ComfyUI 时，终端里出现好几行 `(IMPORT FAILED)`，某些自定义节点用不了，或者在节点列表里找不到。

## 什么时候会出现

- 刚启动 ComfyUI 的时候。
- 明明装好了的自定义节点，却没有出现在节点列表里时。

## 原因

- 缺少必要的库，或者使用的 Python / PyTorch 版本不受支持。
  - 在终端里从 `(IMPORT FAILED)` 往上翻，
    会看到 `ModuleNotFoundError: No module named 'facenet_pytorch'` 之类的信息，说明找不到该自定义节点需要的库。
- 存在与路径或操作系统相关的问题。
  - 例：像 `UnicodeDecodeError('cp932' codec can't decode byte 0x87...)` 这样，文件夹路径中含有日语时会报错。
- 与其他自定义节点发生了冲突。
  - 有些节点使用旧的前端实现，或带有自己特有的依赖，和新版 ComfyUI 不兼容而崩溃。

## 解决方法

- 缺少库时
  - 熟悉 Python 的人自己 `pip install` 也可以；否则请先打开该自定义节点的 GitHub，确认安装方法有没有出错。
  - 现在很多节点只要通过 ComfyUI Manager 安装，就会把需要的库一起装好。没有特别理由的话，请先用 Manager 安装。
  - 如果 README 里写着“请手动运行这个脚本”之类的特殊步骤，而你又不太明白，那干脆就别碰这个节点。

- 怀疑与其他自定义节点冲突时
  - 可以的话，先把报 `(IMPORT FAILED)` 的节点以外的自定义节点暂时从 `custom_nodes` 里移走，确认只留这个节点时 ComfyUI 能否启动。
  - 然后按“问题节点 + 另 1 个节点”的组合一点点放回去，找出和哪个节点一起时会崩溃。
  - 如果没必要费这么大劲也要用它，就把这个节点卸载掉（删除整个文件夹）。
