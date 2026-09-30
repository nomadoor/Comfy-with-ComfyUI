---
layout: page.njk
lang: zh
slug: typed-decision
section: notes
navId: typed-decision
title: "ComfyUI-TypedDecision"
created: 2026-09-30
updated: 2026-09-30
noteTags: ["project", "custom-nodes", "concept"]
summary: "对图像或文本提出一个问题，并带着概率给出答案的节点"
seoTitle: "ComfyUI-TypedDecision：只做判断的 MLLM"
seoDescription: "用 noul / choice / score 三种类型，对图像和文本的提问给出带概率的答案的 ComfyUI 自定义节点。介绍使用 imajev-4b 的基础工作流，以及从提示词决定分辨率、数据集分拣的实例。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/typed-decision/typed_decision_noul.png"
---

## ComfyUI-TypedDecision

以 Jev 为开端，**只做判断的 MLLM** 正在流行起来。它不写文章，你问「这张图里有人吗」，它就回答 `yes` / `no`，并附上有多确定。这类任务被称为 **typed decision**。

Jev 的本地替代项目有好几个，其中 [imajev](https://github.com/mohit67890/imajev) 与 ComfyUI 的核心系统非常契合，所以我先把它做成了自定义节点。

那就来看看 typed decision 能做什么，在 ComfyUI 里又能怎么玩吧。

---

## 安装

[nomadoor/ComfyUI-TypedDecision](https://github.com/nomadoor/ComfyUI-TypedDecision)

- 在 `ComfyUI Manager` 中搜索 `TypedDecision` 安装即可。

---

## 模型的下载

- text_encoders
  - [qwen3.5_4b_int8_convrot.safetensors](https://huggingface.co/nomadoor/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_int8_convrot.safetensors) (5.76 GB)
  - 或者原版的 [qwen3.5_4b_bf16.safetensors](https://huggingface.co/Comfy-Org/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_bf16.safetensors) (9.32 GB)
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

## 三种 mode

提问的形式有三种。选哪一种，输入栏和答案的类型都会随之改变。

> [!NOTE]
> 三种 mode 的输出接口是共用的，但其含义会随 mode 而变。


### noul (Yes or No)

对问题回答 true 或 false。

![](/media/notes/typed-decision/typed_decision_noul.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul.json)

**输入**

- `instructions` 里写要判断的陈述，或者能用 yes / no 回答的问题
- `criteria_true` / `criteria_false` 是可选的。可以补充说明什么情况算 yes、什么情况算 no

**输出**

- `value` 是 true 的概率
  - 无法判断的部分会平分给 true 和 false，所以拿不准时会落在 0.5 附近
- `label` 是 `yes` / `no`
- `pass` 以 `Boolean` 输出 `value >= threshold` 且没有弃权的结果

这里让它判断「图中有很多人」这个陈述是 true 还是 false。

不过多少人才算「很多」是模糊的。所以补上了「5 人以上为 yes」「4 人以下为 no」这样的标准。

### choice

从准备好的选项中选一个。

![](/media/notes/typed-decision/typed_decision_choice.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_choice.json)

**输入**

- `criteria` 里每行写一个选项
  - 只有选项名说不清楚时，可以像 `landscape: scenery with no clear main subject` 这样用 `:` 补充说明

**输出**

- `label` 是被选中的选项
- `index` 是第几行
  - 被选中的是第 3 行时，从 0 开始数，`index` 就是 2

### score

用自己定义的评价轴做 N 级评分。

![](/media/notes/typed-decision/typed_decision_score.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_score.json)

**输入**

- `criteria` 里每行写一个等级，**从低到高**

**输出**

- `value` 是期望值
  - 第 1 行算作 `0`，所以 5 级的范围就是 `0.0` 〜 `4.0`

这里让它用 5 级来评价一张照片是否适合作为训练数据。

`value` 是按各等级的概率加权的平均值，所以会得到 `3.4` 这样介于等级之间的值。也就是「在 good 和 excellent 之间，偏 good」这样的评价。

---

## 图像可以放两张

imajev 最多可以放两张图像。
**第一张是参考，第二张是判断对象。**

> [!WARNING]
> 受 ComfyUI 的机制影响，第三个及之后的接口也会出现。但 imajev 只接受两张，连上去会报错。

![](/media/notes/typed-decision/typed_decision_noul_two_images.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul_two_images.json)

问「第一张和第二张是同一个人吗？」，就能当作同一人判定来用。

---

## 用 state 传递上下文

如果说 `instructions` 是「问题」，那 `state` 就是 **回答这个问题所需的上下文**。看图像也无从得知的信息，用文本传进来。

比如想判断「照片里的商品颜色是否和商品信息一致」时，问题本身并没有说正确的颜色是什么。

把商品信息写进 `state`，它就能拿来对照了。

- `state`：`The listing says: red suede boat shoes.`
- `instructions`：`The shoes in the photo match the color in the listing.`

> [!TIP]
> `state` 也可以写成 JSON。这时可以从 `instructions` 用 `listing.color` 这样的字段名来指代。

---

## 实践

### 从提示词决定分辨率

上面都输入了图像，不过只用文本输入也是可以的。

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

typed decision 最大的好处就是快。

利用这一点，把大量图像分拣开来，是个很不错的用法。

![](/media/notes/typed-decision/typed_decision_noul_dataset_sort.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul_dataset_sort.json)

把文件夹里的图像，按是否符合条件分拣开。

1. 用 `Load Image (from Folder)` 把文件夹作为 List 读入
2. 用 `noul` 判断「有没有人」
3. 把 `pass` 传给 `If/Else Switch`，切换保存路径
   - ComfyUI 的 output 文件夹中的 `typed_decision` 下，应该会生成 `accepted` 和 `rejected` 两个文件夹

试着读入一个装了 2 张人物、3 张其他内容的文件夹。

{% outputs %}
![input](/media/notes/typed-decision/typed_decision_noul_dataset_sort_input.png){media=image} ![output (accepted)](/media/notes/typed-decision/typed_decision_noul_dataset_sort_output_accepted.png){media=image} ![output (rejected)](/media/notes/typed-decision/typed_decision_noul_dataset_sort_output_rejected.png){media=image}
{% endoutputs %}

有人的图像保存到了 `accepted`，没有人的保存到了 `rejected`。

> [!NOTE]
> 用 `abstained` 输出，还可以把「无法判断的部分」单独分出来。可以用来缩小需要人工查看的范围。

---

{% outputs "samples" %}
![noul](/media/notes/typed-decision/typed_decision_noul_input.png){media=image} ![choice](/media/notes/typed-decision/typed_decision_choice_input.png){media=image} ![score](/media/notes/typed-decision/typed_decision_score_input.png){media=image} ![两张输入 第一张](/media/notes/typed-decision/typed_decision_noul_two_images_input1.png){media=image} ![两张输入 第二张](/media/notes/typed-decision/typed_decision_noul_two_images_input2.png){media=image}
{% endoutputs %}
