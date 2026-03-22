---
layout: page.njk
lang: zh
section: faq
slug: import-failed
navId: import-failed
title: "(IMPORT FAILED)"
summary: "自定义节点加载失败"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 症状

![](https://gyazo.com/3054a82b909490117748ae061e29c35e){gyazo=image}

- 启动 ComfyUI 时，终端排列着许多 `(IMPORT FAILED)` 的行，特定的自定义节点无法使用，或者没有出现在节点列表中。

## 发生的时机

- 刚启动 ComfyUI 后。
- 应该已经安装的自定义节点没有出现在节点列表时。

## 原因

- 必要的库没有安装，或者使用了不对应的 Python / PyTorch 版本。
  - 在终端从 `(IMPORT FAILED)` 向上滚动的话，
    写着 `ModuleNotFoundError: No module named 'facenet_pytorch'` 等找不到该自定义节点所需库的信息。
- 存在路径或 OS 依赖的问题。
  - 例：`UnicodeDecodeError('cp932' codec can't decode byte 0x87...)` 像这样，文件夹路径中包含日语（中文）会导致错误的案例。
- 与其他自定义节点发生了冲突。
  - 也有旧的前端实现或抱有独自依赖关系的节点，与新的 ComfyUI 相性不好而崩溃的情况。

## 解决方法

- 没有安装库的情况
  - 习惯 Python 的人可以自己 `pip install`，但如果不是的话，请先打开该自定义节点的 GitHub，确认安装方法是否有误。
  - 现在如果是通过 ComfyUI Manager，很多节点会汇总安装所需的库。如果没有特别的理由，请先从 Manager 安装。
  - 即使是 README 中写着“请手动运行这个脚本”等特殊步骤的节点，如果不太明白的话，原本就请不要出手。

- 怀疑与其他自定义节点冲突的情况
  - 如果可能的话，将除了报 `(IMPORT FAILED)` 的自定义节点以外的节点一度从 `custom_nodes` 中移走，确认只保留该节点的状态下 ComfyUI 是否能启动。
  - 之后，以“有问题的节点 + 其他节点 1 个”这种组合一点点放回去，区分与哪个节点组合时会崩溃。
  - 如果没有必要用到那种程度，请卸载该节点（删除整个文件夹）。
