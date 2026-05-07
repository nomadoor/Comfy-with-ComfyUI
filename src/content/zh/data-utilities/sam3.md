---
layout: page.njk
lang: zh
section: data-utilities
slug: sam3
navId: sam3
title: "SAM 3 / 3.1"
created: 2026-05-07
updated: 2026-05-07
summary: "使用 SAM 3 / 3.1 生成 AI 蒙版"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## SAM 3 / 3.1 是什么？

[SAM 3](https://github.com/facebookresearch/sam3) 是 Meta Segment Anything Model 系列的新模型。

以前的 SAM 主要只是 **理解物体的形状**。如果想切出指定对象，需要用 BBOX 或坐标来指定位置。

SAM 3 则可以像 VLM 一样用文本指定对象，并且单独完成分割。

[SAM 3.1](https://ai.meta.com/blog/segment-anything-model-3/) 是 SAM 3 的更新版，改进了视频中多个对象的追踪处理。

---

## 模型下载

- [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors) (1.75 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂checkpoints/
        └── sam3.1_multiplex_fp16.safetensors
```

---

## workflow

### 静态图像

![](https://gyazo.com/cd6078ed81d850085144836e404754d5){gyazo=image}

[](/workflows/data-utilities/sam3/SAM3.1.json)

- 向 `SAM3 Detect` 节点输入图像、蒙版，以及想切出的对象信息（文本提示词、BBOX、坐标）。
- 这个规格有点绕。如果有多个对象符合提示词，只写 `car` 的话，只会检测其中最像的一个。
  - 如果想分割到第 N 个对象，需要写成 `car:N`。
  - 如果只是想检测画面中所有符合条件的对象，直接写成 `car:99` 也可以。

### 视频

![](https://gyazo.com/96c353a26df8cf274d9b68a95453ba7b){gyazo=loop}

[](/workflows/data-utilities/sam3/SAM3.1_video.json)

- 使用 `SAM3 Video Track` 节点。
- 将输出传给 `SAM3 Track to Mask` 节点，就可以作为蒙版使用。
- `SAM3 Track Preview` 节点输入图像和 `track_data` 后，会给蒙版部分上色，方便查看。
