---
layout: page.njk
lang: zh
section: data-utilities
slug: list
navId: list
title: "List"
created: 2026-02-06
updated: 2026-03-02
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

## 必要的自定义节点

仅靠 ComfyUI 的标准节点无法创建 List，因此需要引入自定义节点。

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)
- [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)
- [godmt/ComfyUI-List-Utils](https://github.com/godmt/ComfyUI-List-Utils)

---

## 创建 List

### Make List (Any) 节点

用于手动组装 List 的节点。
将任意类型（图像 / 文本 / 数值等）汇总成 1 个 List。

![](https://gyazo.com/b6433f5c097164a60a762e4cc24f442f){gyazo=image}

[](/workflows/data-utilities/list/Make_List_(Any).json)

- 连接节点后插槽会增加，可以添加任意数量。
- 一旦连接，就会被“固定为该数据类型”。
  - 如果要切换到其他数据类型，请通过 Fix node (recreate) 重置，或放置新的节点。


### Load Image List From Dir (Inspire) 节点

批量读取文件夹内的图像，创建 `IMAGE` 的 List。

![](https://gyazo.com/4003d1d985e5153aab3cfe4f68c7d979){gyazo=image}

[](/workflows/data-utilities/list/Load_Image_List_From_Dir_(Inspire).json)

- `directory`: 输入要读取的文件夹路径
- `load_always`：当文件夹内容发生变化时，是否每次重读
  - 如果在 disabled 状态下使用，ComfyUI 会认为“只要路径与上次相同，内容就是一样的”，即使文件夹内有变更（添加、删除图像等）也不会重读。
  - 如果想要替换图像并重新执行，请将 `load_always` 设置为 `enabled`。

### Split String

将 1 个长 `STRING`，按分隔符分割并转换为 List。

![](https://gyazo.com/ec2466a80a39f2d4a1c79526167b5293){gyazo=image}

[](/workflows/data-utilities/list/Split_String.json)

- `delimiter`：分隔符（因为 `,` 在提示词中经常使用，所以最好避免使用）
- `splitlines`：按换行符分割
- `strip` : 删除前后的空白

---

## 从 List 中取出

### Select Nth Item (Any list) 节点

从 List 中只取出指定位置的用于 1 件。

![](https://gyazo.com/f1d3281970effbc7a2fc8a782f1a21ab){gyazo=image}

[](/workflows/data-utilities/list/Select_Nth_Item_(Any_list).json)

- `index`：想要取出的位置（0, 1, 2…）

---

## 存在多个 List 时的举动

![](https://gyazo.com/c001c197c385e9cdc2bdab3bc74f69c4){gyazo=image}

[](/workflows/data-utilities/list/image2image_2list-3list.json)

例如在 image2image 中考虑以下情况：

- 图像 List：3 张
- 提示词 List：2 个

这时，你可能会觉得“3 × 2 = 6 张”，但实际的动作是采取 **“齐头并进”** 的形式。

- 第 1 张图像 × 第 1 个提示词
- 第 2 张图像 × 第 2 个提示词
- 第 3 张图像 × **第 2 个提示词（将被复用）**

也就是说只会生成 3 张图像。
