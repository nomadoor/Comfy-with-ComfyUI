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
seoTitle: "在 ComfyUI 中使用 SAM 3 / 3.1：用文本生成蒙版"
seoDescription: "在 ComfyUI 中使用 Meta 的 SAM 3 / 3.1，通过文本指定对象进行分割。介绍模型下载，以及为静态图像和视频生成蒙版的工作流。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## SAM 3 / 3.1 是什么？

[SAM 3](https://github.com/facebookresearch/sam3) 是 Meta Segment Anything Model 系列的新模型。

以前的 SAM 说到底只能 **看出物体的形状**，想切出指定的对象，还得用 BBOX 或坐标告诉它位置。

SAM 3 则可以像 VLM 一样用文本指定对象，靠它自己就能完成分割。

[SAM 3.1](https://ai.meta.com/blog/segment-anything-model-3/) 是 SAM 3 的更新版，改进了视频中多个对象的追踪处理。

---

## 下载模型

- [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors) (1.75 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂checkpoints/
        └── sam3.1_multiplex_fp16.safetensors
```

---

## 工作流

### 静态图像

![](/media/data-utilities/ai-mask-generation/legacy_gyazo_cd6078ed81d850085144836e404754d5.png){media=image}

[](/workflows/data-utilities/sam3/sam3_1.json)

- 向 `SAM3 Detect` 节点输入图像、蒙版，以及想切出的对象信息（文本提示词、BBOX、坐标）。
- 这里的规则有点绕：如果有多个对象符合提示词，只写 `car` 的话，只会检测出其中最像的那一个。
  - 想分割出前 N 个，需要写成 `car:N`。
  - 如果只是想把画面里出现的对象全部检测出来，直接写 `car:99` 也无妨。

### 视频

![](/media/data-utilities/sam3/legacy_gyazo_96c353a26df8cf274d9b68a95453ba7b.mp4){media=loop}

[](/workflows/data-utilities/sam3/sam3_1_video.json)

- 使用 `SAM3 Video Track` 节点。
- 把输出传给 `SAM3 Track to Mask` 节点，就能当作蒙版使用。
- 给 `SAM3 Track Preview` 节点输入图像和 `track_data`，它会给蒙版部分上色，方便查看。
