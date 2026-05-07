---
layout: page.njk
lang: en
section: data-utilities
slug: sam3
navId: sam3
title: "SAM 3 / 3.1"
created: 2026-05-07
updated: 2026-05-07
summary: "AI mask generation with SAM 3 / 3.1"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is SAM 3 / 3.1?

[SAM 3](https://github.com/facebookresearch/sam3) is a new model in Meta's Segment Anything Model series.

Earlier SAM models could understand **the shape of objects**, but to cut out a specific object, you needed to specify its location with a BBOX or coordinates.

With SAM 3, you can specify the target with text, like a VLM, and complete segmentation with SAM alone.

[SAM 3.1](https://ai.meta.com/blog/segment-anything-model-3/) is an updated version of SAM 3. It improves tracking of multiple objects in video.

---

## Model Download

- [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors) (1.75 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂checkpoints/
        └── sam3.1_multiplex_fp16.safetensors
```

---

## workflow

### Still Image

![](https://gyazo.com/cd6078ed81d850085144836e404754d5){gyazo=image}

[](/workflows/data-utilities/sam3/SAM3.1.json)

- Input the image, mask, and target information (text prompt, BBOX, coordinates) into the `SAM3 Detect` node.
- The behavior is a little tricky. If multiple objects match the prompt, simply writing `car` detects only the most likely one.
  - If you want to segment up to the N-th item, write it like `car:N`.
  - If you simply want to detect all visible matching objects, writing something like `car:99` is also fine.

### Video

![](https://gyazo.com/96c353a26df8cf274d9b68a95453ba7b){gyazo=loop}

[](/workflows/data-utilities/sam3/SAM3.1_video.json)

- Use the `SAM3 Video Track` node.
- Pass the output to the `SAM3 Track to Mask` node to use it as a mask.
- The `SAM3 Track Preview` node takes an image and `track_data`, then colors the masked area so it is easier to see.
