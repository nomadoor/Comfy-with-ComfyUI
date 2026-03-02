---
layout: page.njk
lang: zh
section: begin-with
slug: nodes
navId: nodes
title: "节点"
summary: "关于节点"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---


## 添加节点

### 搜索并添加（推荐）

- 在画布上双击 → 在搜索框中输入
- 点击想要的节点，或使用方向键选择并按下 `Enter`

点击搜索栏旁边的图标，可以打开过滤器。可以从数据类型或包含的自定义节点进行筛选。

> 有哪些节点只能靠背。努力学习吧！！

![](https://gyazo.com/b0571db1685d43d84739aeac7559abc8){gyazo=loop}

### 从菜单添加

- 在画布上右键点击 → `Add Node` → 寻找节点并点击

![](https://gyazo.com/ef2cca44a8446a84d9722578e97becbc){gyazo=loop}


### 从可连接的节点添加

- 拖拽引脚并在画布上松开
- 会显示搜索框，但不显示被数据类型过滤器筛选掉的节点

![](https://gyazo.com/89de8c5d0c26473008ed7b65c6d62f71){gyazo=loop}


### 从可连接的节点添加 (旧版)

- 拖拽引脚并**按住 Shift** 在画布上松开
- 从显示的列表中选择（由于显示有上限，如果找不到请通过 `Search` 进行搜索）

![](https://gyazo.com/7fd0db2ee2795630a82eff60f59dc967){gyazo=loop}

---

## 连接节点

- 从引脚拖拽到引脚
- 即便不精确对准引脚，只要拖拽到节点上就会自动吸附。

![](https://gyazo.com/b8d64b7c5ff3ec72eab34d230b18220f){gyazo=loop}

### 更改连接

- **按住 `Shift`** 从引脚拖拽到引脚
- 如果已经有连接的线，可以进行统一切换。

![](https://gyazo.com/bd765ab5d368f0ea62bd9f6752bbd511){gyazo=loop}

---

## 节点的操作

### 选择与移动

- **多选**: `Shift` 或 `Ctrl` + 左键点击
- **框选**: `Ctrl` + 拖拽
- **移动**: 在选中状态下拖拽

![](https://gyazo.com/ec2d834b60c0fdc243fe12298f2a849d){gyazo=loop}

### 删除

- 选中节点并按 `Delete` 键
- 或者点击 `Node Selection Toolbox` 的 `🗑️`

![](https://gyazo.com/38bdfe83ae6bbbff8f063bed7936edfe){gyazo=loop}

### 复制 & 粘贴

- **普通复制**: `Ctrl + C` → `Ctrl + V`
- **维持连接并粘贴**: `Ctrl + C` → `Ctrl + Shift + V`
- **克隆**: 按住 `Alt` 拖拽

![](https://gyazo.com/3898dc47a12c5d95d8f81093bdf5bfb7){gyazo=loop}

### 折叠

- 点击节点左上角的 `⚫`
- 折叠期间，无法进行新的连接或解除。

![](https://gyazo.com/cc2fb21c796ea9a872dd9b25fdf317c0){gyazo=loop}

### 锁定（固定）

将节点固定，使其无法移动。

- 选中节点并按 `P` 键

![](https://gyazo.com/e18df835c4248220e5c8a0c2d021dacd){gyazo=loop}

### 重置参数

- 右键点击节点 → `Fix node(recreate)`

![](https://gyazo.com/b1fec4d60d74acb79b6ef2c56db4e6ab){gyazo=loop}

### Node Info（节点信息）

确认节点的详细信息。

- 点击 `Node Selection Toolbox` 的 `ℹ️`
- 可以知道该节点是在哪个 Python 文件中定义的等信息。便于调试报错。

### 更改节点颜色

更改节点的背景色，按作用进行颜色分类会更容易查看。

- 点击 `Node Selection Toolbox` 的 `🎨 (Color)` 选择颜色

![](https://gyazo.com/57d95f8586bdda17ed96855cbac37af8){gyazo=loop}

### 更改节点标题

更改节点的显示名称（标题）。

- 双击节点 → 输入喜欢的名称并按 `Enter`

![](https://gyazo.com/6d04c3d29e18e2ef5327c438264ff3d0){gyazo=loop}


---

## Reroute 节点

用于整理 工作流 的布线。

- 搜索并添加
- 点击鼠标中键添加点

![](https://gyazo.com/86de60d6b6959f5448dcfaad42178fcb){gyazo=image}


### 点状 Reroute

Reroute 节点是作为单独的节点存在的，而这个不是节点，是设置线条的经过点。

- 在线条上 `Alt + 左键点击`

![](https://gyazo.com/cac43ac8b7fef76a4cdb0ff5d83bd1c7){gyazo=loop}

---

## 屏蔽 (Bypass) 与静音 (Mute)

### 屏蔽 (Bypass)

**无视**该节点并继续处理。

- 选中节点并按 `Ctrl + B`
- 点击 `Node Selection Toolbox` 的 `🔀`

![](https://gyazo.com/4ab6605bdd97ee8cae5b4403057a38e5){gyazo=loop}

### 静音 (Mute)

在该节点**停止**处理。

- 选中节点并按 `Ctrl + M`
- 或者右键点击 → `Mode` → `Never`

> **关于区别**
> - **屏蔽**: 假装“这个节点不存在”，并尝试直接连接前后的节点。
> - **静音**: 叫做“此路不通”。
>
> 实际上，静音很少被使用。通常会将不使用的节点全部屏蔽掉。

![](https://i.gyazo.com/5d96054e7b54a62b3a446a28d70212d6.png){gyazo=image}

---

## 转换为外部输入

将输入栏（Widget）转换为引脚输入，以便从其他节点传递数值。

- **转换**: 将光标移动到没有引脚的参数旁边，会出现连接点。
- **还原**: 断开连接的线，会自动还原为原来的输入栏。

![](https://gyazo.com/80e1bb9211082f4d89a2a85d5abd78c2){gyazo=loop}

### Primitive 节点

可以用作任何类型输入的万能节点。会根据连接目标的类型动态变化。

> **注意:** 
> 由于要配合连接目标的类型，无法与 Reroute 节点组合使用。
>
> 现在推荐使用类型明确的 `int 节点`、`float 节点`、`string 节点` 等。

![](https://i.gyazo.com/e0a056e9c112028930466701e22afd10.gif){gyazo=image}

> **Tip:**
> **双击** 引脚，会自动连接符合该类型的 Primitive 节点。

![](https://gyazo.com/35f00ebec3fab7b0471b5595b4b0a5e5){gyazo=loop}


## 节点的整理

选择多个节点，点击 `Node Selection Toolbox` 的 `⋮`。

- **Align Selected To**: 对齐选中的节点（顶对齐、左对齐等）。
- **Distribute Nodes**: 等间距排列选中的节点。

![](https://gyazo.com/6bb992414f853ea57c7182cde11933f8){gyazo=loop}
