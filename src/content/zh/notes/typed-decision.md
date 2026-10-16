---
layout: page.njk
lang: zh
slug: typed-decision
section: notes
navId: typed-decision
title: "ComfyUI-TypedDecision"
created: 2026-09-30
updated: 2026-10-16
noteTags: ["project", "custom-nodes", "concept"]
summary: "针对图像、视频或文本的提问，给出带概率答案的节点"
seoTitle: "ComfyUI-TypedDecision：在 ComfyUI 中使用只做判断的 MLLM"
seoDescription: "用 noul / choice / score 三种类型，对图像、视频和文本的提问给出带概率的答案的 ComfyUI 自定义节点。介绍使用 d3-mini 的基础工作流，以及从提示词决定分辨率、数据集分拣、在视频中查找人物出现片段的实例。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/typed-decision/typed_decision_d3_mini_noul.png"
---

## ComfyUI-TypedDecision

不让多模态 LLM 生成文字、只让它做判断的任务，有时被称为 "Typed Decision"。
Jev 比较有名，不过也有好几个能在本地做到同样事情的模型，所以我把它们做成了 ComfyUI 自定义节点。

因为答案的形式是固定的，也许可以用在条件分支或数据集处理上。最重要的是，它很快嘛。

那就来看看 Typed Decision 能做什么，在 ComfyUI 里又能怎么玩吧。

---

## 安装

[nomadoor/ComfyUI-TypedDecision](https://github.com/nomadoor/ComfyUI-TypedDecision)

- 在 `ComfyUI Manager` 中搜索 `TypedDecision` 安装即可。

---

## 支持的模型

| 模型 | 基础模型 | int8 大小 | 图像 | 视频 |
| --- | --- | --- | --- | --- |
| [d3-flash](https://huggingface.co/vllm-sr/d3-flash) | Qwen3.5-9B | 9.88 GB | 不限张数 | ○ |
| [d3-mini](https://huggingface.co/vllm-sr/d3-mini) | Qwen3.5-4B | 5.52 GB | 不限张数 | ○ |
| [d3-nano](https://huggingface.co/vllm-sr/d3-nano) | Qwen3.5-2B | 3.06 GB | 不限张数 | ○ |
| [d3-lite](https://huggingface.co/vllm-sr/d3-lite) | Qwen3.5-0.8B | 1.21 GB | 不限张数 | ○ |
| [Clef-flash](https://huggingface.co/Cloudflare/clef-flash) | Qwen3.5-9B | 12.2 GB | 不限张数 | ○ |
| [imajev-4b](https://huggingface.co/mohit67890/imajev-4b) | Qwen3.5-4B + LoRA | 5.76 GB + 490 MB | 最多 2 张 | × |

本文全部使用 **d3-mini**。性能好，而且轻量，推荐使用。

---

## 下载模型

### d3 / Clef-flash

请把要用的模型放进 `text_encoders`。

- text_encoders
  - [d3_mini_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_mini_int8_convrot.safetensors) (5.52 GB)
  - [d3_flash_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_flash_int8_convrot.safetensors) (9.88 GB)
  - [d3_nano_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_nano_int8_convrot.safetensors) (3.06 GB)
  - [d3_lite_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_lite_int8_convrot.safetensors) (1.21 GB)
  - [clef_flash_int8_convrot.safetensors](https://huggingface.co/nomadoor/clef/blob/main/text_encoders/clef_flash_int8_convrot.safetensors) (12.2 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂text_encoders/
        └── d3_mini_int8_convrot.safetensors
```

### imajev

imajev 需要把 Qwen3.5-4B 和 imajev-4b 的文件搭配使用。

- text_encoders
  - [qwen3.5_4b_int8_convrot.safetensors](https://huggingface.co/nomadoor/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_int8_convrot.safetensors) (5.76 GB)
- typed_decision
  - [mohit67890/imajev-4b](https://huggingface.co/mohit67890/imajev-4b/tree/main) (以下文件共 490 MB)
    - 把以下文件放进 `imajev-4b` 文件夹。下载整个仓库也可以

```text
📂ComfyUI/
└── 📂models/
    ├── 📂text_encoders/
    │   └── qwen3.5_4b_int8_convrot.safetensors
    └── 📂typed_decision/
        └── 📂imajev-4b/
            ├── adapter_config.json
            ├── adapter_model.safetensors
            ├── calibration-rot4-modality.json
            ├── decision_readout.json
            └── decision_readout.safetensors
```

---

## Load Typed Decision Model

在 `backbone` 中选择模型文件，在 `adapter` 中选择模型的种类。

| 模型 | `backbone` | `adapter` |
| --- | --- | --- |
| d3 | d3 的文件 | `d3` |
| Clef-flash | Clef-flash 的文件 | `clef` |
| imajev | Qwen3.5-4B 的文件 | `imajev-4b` |

选好 `adapter` 后，会出现该模型可用的设置。

- `debias`（d3、imajev）：换几种选项顺序来判断并取平均。能减少顺序带来的偏差，但相应会变慢
  - d3 只在 choice 时，额外按倒序判断一次
  - imajev 在所有 mode 下，最多判断 4 种顺序
- `fps`（d3、Clef-flash）：视频每秒读取多少帧（默认 2）
- `calibration`（imajev）：进行温度校准

---

## 三种 mode

提问的形式有三种。选哪一种，输入栏和答案的类型都会随之改变。问题和选项请用英文书写。

> [!NOTE]
> 三种 mode 的输出接口是共用的，但其含义会随 mode 而变。

### noul (Yes or No)

对问题回答 true 或 false。

![](/media/notes/typed-decision/typed_decision_d3_mini_noul.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul.json)

**输入**

- `instructions` 里写要判断的陈述，或者能用 yes / no 回答的问题
- `criteria_true` / `criteria_false` 是可选的。可以补充说明什么情况算 yes、什么情况算 no

**输出**

- `value` 是 true 的概率
- `label` 是 `yes` / `no`
- `pass` 以 `Boolean` 输出 `value >= threshold` 的结果

这里让它判断“图中有很多人”这个陈述是 true 还是 false。

不过多少人才算“很多”是模糊的。所以补上了“5 人以上为 yes”“4 人以下为 no”这样的标准。

### choice

从准备好的选项中选一个。

![](/media/notes/typed-decision/typed_decision_d3_mini_choice.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_choice.json)

**输入**

- `criteria` 里每行写一个选项
  - 只有选项名说不清楚时，可以像 `landscape: scenery with no clear main subject` 这样用 `:` 补充说明

**输出**

- `value` 是被选中选项的概率
- `label` 是被选中的选项
- `index` 是第几行
  - 被选中的是第 3 行时，从 0 开始数，`index` 就是 2

### score

用自己定义的评价轴做 N 级评分。

![](/media/notes/typed-decision/typed_decision_d3_mini_score.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_score.json)

**输入**

- `criteria` 里每行写一个等级，**从低到高**

**输出**

- `value` 是期望值
  - 第 1 行算作 `0`，所以 5 级的范围就是 `0.0` 到 `4.0`

这里让它用 5 级来评价能否用作训练数据。

`value` 是按各等级的概率加权的平均值，所以会得到 `1.35` 这样介于等级之间的值。也就是“在 poor 和 acceptable 之间，偏 poor”这样的评价。

---

## 可以输入任意张图像

d3 和 Clef-flash 可以输入任意张图像，也能提出比较多张图像的问题。

imajev 最多两张，**第一张是参考，第二张是判断对象**。

![](/media/notes/typed-decision/typed_decision_d3_mini_noul_two_images.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul_two_images.json)

问“第一张和第二张是同一个人吗？”，就能当作同一人判定来用。

---

## 也能判断视频

使用 d3 和 Clef-flash 时，把视频连到 `videos`，它也能回答关于视频的问题。

![](/media/notes/typed-decision/typed_decision_d3_mini_noul_visible.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul_visible.json)

按 Load Typed Decision Model 的 `fps` 读取整个视频，一次性判断所有帧。1 分钟的视频按 2 fps 读取就是 120 帧。

`fps` 为 2 时只会每 0.5 秒看一次，所以一闪而过的东西可能会漏掉。

---

## 用 state 传递上下文

如果说 `instructions` 是“问题”，那 `state` 就是 **回答这个问题所需的上下文**。看图像也无从得知的信息，用文本传进来。

比如想判断“照片里的商品颜色是否和商品信息一致”时，问题本身并没有说正确的颜色是什么。

把商品信息写进 `state`，它就能拿来对照了。

- `state`：`The listing says: red suede boat shoes.`
- `instructions`：`The shoes in the photo match the color in the listing.`

> [!TIP]
> `state` 也可以写成 JSON。这时可以从 `instructions` 用 `listing.color` 这样的字段名来指代。

---

## Typed Decision Moment Search

这是一个在视频中查找条件成立的片段的节点。适合“有狗”“这个人出现了”这类看一帧就能知道的条件。受机制所限，无法判断“向右走”这类动作的方向。

![](/media/notes/typed-decision/typed_decision_moment_search_d3_mini.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_moment_search_d3_mini.json)

这里查找参考图像中的人物出现的片段，并拼接成一段视频。

**输入**

- `instructions` / `criteria_true` / `criteria_false` / `state` 与 Typed Decision 的 noul 相同
- 把参考图像连到 `images`，就能在视频中查找那个人或物
- `window` 是一开始一起判断的帧数（默认 8。按 2 fps 读取，相当于 4 秒）
- `threshold` 是帧判定为通过所需的概率

**输出**

- `intervals` 以 JSON 输出找到的片段的开始和结束时间（秒）等信息
- `videos` 输出按片段切出的视频
  - 什么都没找到时，后面的视频节点不会执行

{% outputs %}
![input](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_input_video.mp4){media=loop} ![参考图像](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_input_image.png){media=image} ![output](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_output.mp4){media=loop}
{% endoutputs %}

### 问题的写法

使用参考图像时，请**针对视频**提问。

- 〇 `The video shows the same person as the image.`
- × `The person in the image is visible.`

后者对参考图像本身也成立，所以所有帧都会通过。

> [!NOTE]
> 片段完全按照模型的判断来切分。半个身子出了画面的人，可能已经被当作“不在画面中”，请根据想要计入的内容来写问题。

---

## 实践

### 从提示词决定分辨率

上面输入的是图像或视频，不过只用文本输入也是可以的。

让它读提示词，判断生成竖版、横版还是正方形比较合适。

![](/media/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2.json)

把三种分辨率准备成 [List](/zh/data-utilities/list/)，用 `choice` 的 `index` 输出来切换。

1. 把提示词输入到 `state`
2. 让 `choice` 从 `portrait` / `landscape` / `square` 中选择
   - `index` 是 `INT`，所以对应关系是 portrait = 0、landscape = 1、square = 2
3. 把 `index` 传给 `Get Item From List`，从宽和高的列表里取值
4. 把取到的值分别放进 `Empty Latent Image` 生成

这条提示词选中了 `square`，生成的图像确实是 1024 × 1024。

{% outputs %}
![](/media/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2_output.png){media=image}
{% endoutputs %}

### 数据集分拣

利用它的速度，把大量图像分拣开来，是个很不错的用法。

![](/media/notes/typed-decision/typed_decision_noul_dataset_sort.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul_dataset_sort.json)

把文件夹里的图像，按是否符合条件分拣开。

1. 用 `Load Image (from Folder)` 把文件夹作为 List 读入
2. 用 `noul` 判断“有没有人”
3. 把 `pass` 传给 `If/Else Switch`，切换保存路径
   - ComfyUI 的 output 文件夹中的 `typed_decision` 下，应该会生成 `accepted` 和 `rejected` 两个文件夹

试着读入一个装了 2 张人物、3 张其他内容的文件夹。

{% outputs %}
![input](/media/notes/typed-decision/typed_decision_noul_dataset_sort_input.png){media=image} ![output (accepted)](/media/notes/typed-decision/typed_decision_noul_dataset_sort_output_accepted.png){media=image} ![output (rejected)](/media/notes/typed-decision/typed_decision_noul_dataset_sort_output_rejected.png){media=image}
{% endoutputs %}

有人的图像保存到了 `accepted`，没有人的保存到了 `rejected`。

---

{% outputs "samples" %}
![noul](/media/notes/typed-decision/typed_decision_noul_input.png){media=image} ![choice](/media/notes/typed-decision/typed_decision_choice_input.png){media=image} ![score](/media/notes/typed-decision/typed_decision_score_input.png){media=image} ![两张输入 第一张](/media/notes/typed-decision/typed_decision_noul_two_images_input1.png){media=image} ![两张输入 第二张](/media/notes/typed-decision/typed_decision_noul_two_images_input2.png){media=image} ![视频](/media/notes/typed-decision/typed_decision_d3_mini_noul_input.mp4){media=loop}
{% endoutputs %}
