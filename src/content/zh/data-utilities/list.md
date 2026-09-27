---
layout: page.njk
lang: zh
section: data-utilities
slug: list
navId: list
title: "List"
created: 2025-11-26
updated: 2026-09-27
summary: "关于列表：使用多个数据进行连续处理的思路"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 什么是 List (列表)？

List（列表）是一种将多个数据作为“一个整体”来处理的机制。
相对于 Queue 是“将同一个 工作流 执行多次”，List 则是 **在一次执行中，按顺序处理多个输入** 的感觉。

- **Queue**
  - 将同一个 工作流，从外部多次循环
- **List**
  - 在内部按顺序处理多个输入

将其理解为“是多次按下 Run，还是按一次 Run 注入多个输入”的区别，会比较容易懂。

---

## 创建和取出 List

### Create List 节点

用于手动组装 List 的节点。它可以把图像、文本、数值等任意类型汇总成一个 List。

![](/media/data-utilities/list/create_list.mp4){media=loop}

[](/workflows/data-utilities/list/create_list.json)

- 连接节点后会增加插槽，可以添加任意数量的项目。

### Get Item From List 节点

可以从 List 中取出任意编号的一项。

![](/media/data-utilities/list/get_item_from_list.png){media=image}

[](/workflows/data-utilities/list/get_item_from_list.json)

- `index`：要取出的位置（0、1、2……）

---

## 存在多个 List 时的举动

![](/media/data-utilities/list/legacy_gyazo_c001c197c385e9cdc2bdab3bc74f69c4.png){media=image}

[](/workflows/data-utilities/list/image2image_2list_3list.json)

例如在 image2image 中考虑以下情况：

- 图像 List：3 张
- 提示词 List：2 个

这时，你可能会觉得“3 × 2 = 6 张”，但实际的动作是采取 **“齐头并进”** 的形式。

- 第 1 张图像 × 第 1 个提示词
- 第 2 张图像 × 第 2 个提示词
- 第 3 张图像 × **第 2 个提示词（将被复用）**

也就是说只会生成 3 张图像。
