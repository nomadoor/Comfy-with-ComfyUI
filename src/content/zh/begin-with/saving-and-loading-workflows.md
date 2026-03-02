---
layout: page.njk
lang: zh
section: begin-with
slug: saving-and-loading-workflows
navId: saving-and-loading-workflows
title: "保存与读取 工作流"
summary: "关于 工作流 的保存与读取"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 打开官方模板

- 点击侧边栏的 `Templates` 图标，选择喜欢的模板

![](https://gyazo.com/a33cb7c6384321e684d9b9fd6eb1817c){gyazo=loop}

---

## 保存 工作流 (浏览器内)

将创建的 工作流 保存在 ComfyUI 内部。

- 1. 点击顶部的 `工作流`，选择 `Save` 或 `Save as`
- 2. 取一个喜欢的名字并 `Confirm`（或按 `Enter` 键）

保存的 工作流 可以通过左侧边栏的文件夹图标 📂（或 `W` 键）进行调用。

![](https://gyazo.com/b9970219294a79c53a651585baa179b4){gyazo=loop}

---

## 导出 工作流 (保存为文件)

将 工作流 导出为 `.json` 文件，用于分享或备份。

### 导出为 JSON 文件

- 1. 点击顶部的 `工作流`，选择 `Export`
- 2. 取一个喜欢的名字并 `Confirm`（或按 `Enter` 键）
- 3. 选择保存位置进行保存

![](https://gyazo.com/e13e29d51a26ea2a29ec87cc872bf522){gyazo=loop}

### 嵌入生成的图像并保存

通过 ComfyUI 标准的图像保存节点（如 `Save Image`）生成的图像，会自动嵌入 工作流 的元数据（设置信息）。只需读取这张图片，即可还原生成时的 工作流。


### 保存为截图

如果安装了 **[ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts)** 等自定义节点，就可以对整个 工作流 进行截图，并在其中嵌入元数据进行保存。

![](https://gyazo.com/a66d20bf36c02fa63c6cd5ab957fe4db){gyazo=loop}


---

## 读取 工作流

### 读取保存的 工作流

打开保存在 ComfyUI 内部的 工作流。

- 1. 点击左侧边栏的文件夹图标 📂（或 `W` 键）
- 2. 从列表中点击想要打开的 工作流

![](https://gyazo.com/7c2149e7af5d6f78a30c9c03ff671356){gyazo=loop}

### 读取外部文件 (JSON / 图像)

读取 PC 中的 `.json` 文件，或带有元数据的图像。

**方法 A: 通过菜单**
- 1. 点击顶部的 `工作流`，选择 `Open`（或 `Ctrl + O`）
- 2. 选择文件并打开

**方法 B: 拖放**
- 将 `.json` 文件或嵌入元数据的图像，拖放到 ComfyUI 的画布上

![](https://gyazo.com/bbd3e9f3833a08a9af16bc3625c4747a){gyazo=loop}


### 从文本读取

如果你复制了 JSON 格式的文本数据，只需在 ComfyUI 上进行粘贴（`Ctrl + V`）即可读取。

![](https://gyazo.com/2df1b87e2f4771e3ea2f718b55357435){gyazo=loop}

### 😎读取本站的 工作流

本站公开的 工作流 提供了复制按钮和下载按钮。
只需点击复制按钮，然后直接在画布上 `Ctrl + V` 即可读取 工作流，请务必利用起来。

[](/workflows/begin-with/saving-and-loading-workflows/Stable_Diffusion_1.5.json)

![](https://gyazo.com/13c0019ad1e471bcf89cdb4b17bc7d9c){gyazo=loop}
