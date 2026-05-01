---
layout: page.njk
lang: zh
section: basic-workflows
slug: reactor
navId: reactor
title: "ReActor"
created: 2026-02-06
updated: 2026-03-02
summary: "使用 ReActor 的 FaceSwap（变脸）"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/c75a0142055d05c154f7d8cf03b3ca56.png"
tags: ["id-transfer"]
---

## 什么是 ReActor？

**face swap** 作为 deepfake 几年前已存在，但当时有必要集齐几百张同一人物的脸部图像进行学习。

ReActor（正确地说是那个核心 **InsightFace** ），可以只以 1 张脸部照片为参照，替换映在别的图像或视频的脸。

现在虽然以扩散模型为基础的更柔软的 ID 传送手段也登场了，但 ReActor 凭借“比较轻”“好意义上的没有柔软性（严密）并安定”等理由，现在也是被经常使用的方法。

---

## 自定义节点和安装

- [Gourieff/ComfyUI-ReActor](https://github.com/Gourieff/ComfyUI-ReActor?tab=readme-ov-file#installation)

### 安装方法

这个节点导入稍微有点难，只从 ComfyUI Manager 安装是不会动的。

- 1. 从 ComfyUI Manager 安装 ReActor 节点。
- 2. 执行在 `ComfyUI/custom_nodes/ComfyUI-ReActor` 的 `install.bat`。
- 3. Windows 用户只做这些动不了，必须另外安装 InsightFace。
  - 详情：请参照 [InsightFace 的安装方法](/zh/notes/insightface-install/) 。
- 4. 重启 ComfyUI。

---

## FaceSwap（inswapper）

基本的 FaceSwap，只是向 ReActor 节点输入“元图像”和“参照脸图像”。

![](https://gyazo.com/bc67dfff78c431c688d8ec1a4937969e){gyazo=image}

[](/workflows/basic-workflows/reactor/ReActor_Fast_Face_Swap.json)

- `input_image`  
  - 连接想替换脸的元图像。
- `source_image`  
  - 连接想参照的脸图像（1 张脸部照片等）。

此外，简单总结经常使用的参数。

- `face_restore_model`
  - 如果选择 `GFPGANv1.3`，FaceSwap 后会进行由 GFPGAN 带来的脸部修补。
  - `inswapper` 因为将脸的部分调整为 128px 四方进行处理，那样的话容易丢失细节，所以这样的后处理变得重要。
  - 只是，需要注意这点：无论如何都容易变成平板（不立体）的印象。
- `detect_gender_input` / `detect_gender_source`
  - 是否自动判定输入图像・参照图像的性别的设定。
  - 因性别的差异导致结果变得不自然的情况，试着切换 ON/OFF 也许好。
- `input_faces_index`
  - 元图像中有复数人的脸的情况，指定以哪张脸为对象。
  - 是 `0` 为最初找到的脸，`1` 为第 2 人……这样的印象。
  - 像 `0,1` 这样以逗号分隔指定复数的话，也可以同时置换复数人。
- `source_faces_index`
  - 参照侧的 `source_image` 也有复数人的脸的情况，与 `input_faces_index` 同样指定使用哪张脸。

---

## 使用别的 FaceSwap 模型（HyperSwap）

虽然刚才使用的 inswapper 是旧模型，但考虑社会影响，被开发者封印了高分辨率版。  
虽然有几个代替模型，试着使用 FaceFusion Labs 开发的 HyperSwap 吧。

### 模型的下载

- [hyperswap_1a_256.onnx](https://huggingface.co/facefusion/models-3.3.0/blob/main/hyperswap_1a_256.onnx) 
```text
📂ComfyUI/
  └── 📂models/
      └── 📂hyperswap/
          └── hyperswap_1a_256.onnx
```

### 工作流的设定

![](https://gyazo.com/bab77e7c89d65dff9a4ebedb17a46375){gyazo=image}

[](/workflows/basic-workflows/reactor/ReActor_hyperswap.json)

- 将 ReActor 节点的 `swap_model`，变更为 `hyperswap_1a_256`。

---

## 关于 NSFW 过滤器

为了不让存储库被删除，ReActor 加入了针对 NSFW 图像的过滤器。  
因此，使用包含 NSFW 的图像的情况会被拒绝。

虽然不会说得太详细，但可以用简单的手段回避。  
( [Detailer](/zh/basic-workflows/detailer/) 也许……会有用 )
