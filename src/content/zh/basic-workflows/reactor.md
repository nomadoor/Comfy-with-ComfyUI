---
layout: page.njk
lang: zh
section: basic-workflows
slug: reactor
navId: reactor
title: "ReActor"
created: 2026-02-06
updated: 2026-03-02
summary: "用 ReActor 进行 FaceSwap（换脸）"
seoTitle: "用 ComfyUI ReActor 换脸（FaceSwap）"
seoDescription: "只需一张人脸照片即可替换图像或视频中人脸的 ReActor 在 ComfyUI 中的用法。介绍安装、inswapper 与 HyperSwap 的区分使用，以及 NSFW 过滤器。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/reactor/legacy_gyazo_c75a0142055d05c154f7d8cf03b3ca56.png"
tags: ["id-transfer"]
---

## 什么是 ReActor？

**face swap** 作为 deepfake 早在好几年前就有了，但当时需要收集几百张同一个人的脸部图像来训练。

ReActor（准确地说是它的核心 **InsightFace**）只需参考 1 张脸部照片，就能替换其他图像或视频中的脸。

现在虽然也出现了基于扩散模型、更灵活的 ID 迁移方法，但 ReActor 因为“比较轻量”“不够灵活，但这恰恰让它很稳定”等理由，至今仍被广泛使用。

---

## 自定义节点和安装

- [Gourieff/ComfyUI-ReActor](https://github.com/Gourieff/ComfyUI-ReActor?tab=readme-ov-file#installation)

### 安装方法

这个节点安装起来稍微有点麻烦，只用 ComfyUI Manager 安装是跑不起来的。

- 1. 从 ComfyUI Manager 安装 ReActor 节点。
- 2. 运行 `ComfyUI/custom_nodes/ComfyUI-ReActor` 中的 `install.bat`。
- 3. Windows 用户只做到这一步还跑不起来，需要另外安装 InsightFace。
  - 详情请参考：[InsightFace 的安装方法](/zh/notes/insightface-install/)。
- 4. 重启 ComfyUI。

---

## FaceSwap（inswapper）

基本的 FaceSwap 只需要向 ReActor 节点输入“原图像”和“参考脸部图像”。

![](/media/basic-workflows/reactor/legacy_gyazo_bc67dfff78c431c688d8ec1a4937969e.png){media=image}

[](/workflows/basic-workflows/reactor/reactor_fast_face_swap.json)

- `input_image`  
  - 连接想要换脸的原图像。
- `source_image`  
  - 连接作为参考的脸部图像（比如 1 张脸部照片）。

下面简单整理一下其他常用参数。

- `face_restore_model`
  - 选择 `GFPGANv1.3` 后，会在 FaceSwap 之后用 GFPGAN 修复脸部。
  - `inswapper` 会把脸部缩放到 128px 见方再处理，直接输出很容易丢失细节，所以这类后处理就很重要。
  - 不过要注意，修复后的脸往往会显得有些扁平。
- `detect_gender_input` / `detect_gender_source`
  - 设置是否自动判断输入图像和参考图像的性别。
  - 如果因为性别不同导致结果不自然，可以切换 ON/OFF 试试看。
- `input_faces_index`
  - 原图像中有多个人的脸时，指定要替换哪一张。
  - 大致是 `0` 表示最先找到的脸，`1` 表示第 2 个人……这样。
  - 像 `0,1` 这样用逗号分隔指定多个，就能同时替换多个人。
- `source_faces_index`
  - 参考侧的 `source_image` 中有多个人的脸时，用和 `input_faces_index` 相同的方式指定使用哪一张。

---

## 使用其他 FaceSwap 模型（HyperSwap）

刚才用的 inswapper 本身是个老模型，而且考虑到社会影响，开发者把它的高分辨率版本封存了。  
替代模型有好几个，这里来试试 FaceFusion Labs 开发的 HyperSwap。

### 下载模型

- [hyperswap_1a_256.onnx](https://huggingface.co/facefusion/models-3.3.0/blob/main/hyperswap_1a_256.onnx) 
```text
📂ComfyUI/
  └── 📂models/
      └── 📂hyperswap/
          └── hyperswap_1a_256.onnx
```

### 工作流设置

![](/media/basic-workflows/reactor/legacy_gyazo_bab77e7c89d65dff9a4ebedb17a46375.png){media=image}

[](/workflows/basic-workflows/reactor/reactor_hyperswap.json)

- 把 ReActor 节点的 `swap_model` 改为 `hyperswap_1a_256`。

---

## 关于 NSFW 过滤器

为了避免仓库被删除，ReActor 内置了针对 NSFW 图像的过滤器。  
所以使用含有 NSFW 内容的图像时会被拒绝。

这里不细说，但用简单的方法就能绕过。  
（[Detailer](/zh/basic-workflows/detailer/) 说不定……能派上用场）
