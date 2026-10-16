---
layout: page.njk
lang: zh
section: notes
slug: ai-toolkit-sdxl-lora-training
navId: ai-toolkit-sdxl-lora-training
title: "用 AI Toolkit 训练 SDXL（Illustrious）LoRA"
created: 2026-05-02
updated: 2026-05-02
noteTags: ["project", "lora", "sdxl", "ai-toolkit"]
summary: "使用 AI Toolkit，为 Illustrious 系 SDXL 模型训练角色 LoRA 的基本流程"
seoTitle: "用 AI Toolkit 训练 SDXL（Illustrious）LoRA"
seoDescription: "用 AI Toolkit 为 Illustrious 系 SDXL 模型训练角色 LoRA 的步骤。介绍收集与整理图像、描述的写法与用 MLLM 生成，以及从启动 AI Toolkit 到训练。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_b0d3bb95931f32192df7619f612a202e.png"
---

## 用 AI Toolkit 训练 SDXL（Illustrious）LoRA

这里使用 [AI Toolkit](https://github.com/ostris/ai-toolkit) 来训练 SDXL 系模型用的 LoRA。

本文使用 [WAI-illustrious-SDXL v16.0](https://civitai.com/models/827184/wai-illustrious-sdxl)，但只要是 SDXL 系模型，基本流程大致相同。

这次做的是 **角色 LoRA**，不过服装 LoRA、画风 LoRA 的基本思路也差不多。

---

## 准备数据集

LoRA 训练里，数据集的质量比什么都重要。一步步仔细处理吧。

### 1. 收集图像

收集能清楚看出训练对象的图像。

- 比起数量，质量更重要。尽量收集高分辨率的图像。
  - 这次用 15 张图训练，比这更少也能训练。

模型会从多张图像里学习 **共同的概念**。

如果可以，最好不要全是同一种构图。姿势、角度、背景有一些变化会更好。

### 2. 简单整理图像

如果对象太小，或者其他东西太显眼，又或者混入了别的角色，可以简单裁剪一下。

不过不需要把对象严格抠出来。

稍微混入一些背景或其他服装，反而能让模型理解“什么是角色本体，什么只是场景”。

### 3. 创建 caption

每张图像都准备一个同名文本文件。

```text
images/
├── 0001.png
├── 0001.txt
├── 0002.png
├── 0002.txt
├── ...
├── 0020.png
└── 0020.txt
```

文本文件里写这张图像的说明，也就是 **caption**。

caption 主要有 **自然语言** 和 **标签形式** 两种写法。SDXL 基本上用标签形式来写，也就是用逗号（`,`）分隔一个个单词。

### 4. caption 的写法

我们拿 Myaku-Myaku 做例子，看看 caption 怎么写。

![Myaku-Myaku](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_0b39351c0a14cdf1e768d4cc64b9ac0c.png){media=image}

看看这张图，里面有各种各样的元素：

- 笔记本电脑
- 椅子
- 很多眼睛
- 蓝色身体
- 图像风格（这次是照片）
- ...

caption 里不会把这些全部写进去。  
要写的是其中 **定义角色本体的词以外的部分**。

模型会把图像中共同出现、又 **没有被文本说明的东西**，归到 LoRA 这边来学习。

比如直接给上图写 caption，大概会是这样：

```text
mascot, sitting, indoors, office, desk, laptop, office chair, lanyard, id card, multiple eyes, smile, blue body, red appendages, plush, photo
```

再为角色 LoRA 整理一下，这次就是把和 Myaku-Myaku 本身有关的词删掉，变成这样：

```text
sitting, indoors, office, desk, laptop, office chair, photo
```

最后，在开头加上用来调出这个角色的 trigger word（这次是 `myakumyaku-san`），caption 就完成了。

- trigger word 没有什么特别的规则。
- 不过太常见的词可能会和其他概念混在一起，用专有名词会比较好。

```text
myakumyaku-san, sitting, indoors, office, desk, laptop, office chair, photo
```

### 4.5 用 MLLM 创建 caption

最近的 MLLM 性能非常好，把 caption 整个交给它来写也没问题。

1. 把图像交给它，让它写 SDXL / Illustrious 系 caption
2. 让它删掉定义角色本体的词
3. 在开头加入 trigger word

[这里](https://chatgpt.com/share/69c4c369-b4d4-83ab-95c4-ebf9ca5e6823)是用 ChatGPT 创建 caption 的例子，质量已经足够好了。

---

## 启动 AI Toolkit

如果在 Windows 上尝试，[AI-Toolkit-Easy-Install](https://github.com/Tavris1/AI-Toolkit-Easy-Install) 会比较省事。

1. 从仓库下载安装器
2. 解压
3. 运行 `AI-Toolkit-Easy-Install.bat`
4. 安装后，用 `Start-AI-Toolkit.bat` 启动

如果在 Runpod 上训练，可以参考这里。

- [在 RunPod 上运行 AI Toolkit](/zh/notes/runpod-ai-toolkit-lora-training/)

---

## 读取 Dataset

启动 AI Toolkit 后，先读取 Dataset。

![](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_8e7d24641bb2491bca6ad449bddcaa69.png){media=image}

1. 打开 `Dataset` 标签
2. 点击右上角的 `New Dataset`
3. 用任意名称创建文件夹
4. 通过 `Add Images`，把图像和文本按整个文件夹添加进去

图像和对应的 caption 都正确读取进来就 OK 了。

---

## 创建 Job

在 AI Toolkit 里，训练的流程是先创建一个叫 Job 的训练设置，再启动它。

相当于 ComfyUI 里的工作流。

![](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_b4ef7a58d34d67eb34963f61d1bc50c3.png){media=image}

打开 `+ New Job`，设置各个项目。

先试试下面这些参数。

| 项目 | 值 |
| --- | --- |
| Model architecture | `SDXL` |
| Name or Path | `path\to\wai16.safetensors` |
| Linear Rank | `16` |
| Conv Rank | `8` |
| Save Every | `100` |
| Max Step Saves to Keep | `30` |
| Batch Size | `2` |
| Gradient Accumulation | `2` |
| Steps | `3000` |
| Learning Rate | `0.00007` |
| Resolutions | `512`, `768` |
| Disable Sampling | `on` |

下面简单说明一下这些参数。

### JOB

- **Training Name**
  - 随便取个喜欢的名字。
  - 之后还会翻回来看，名字里带上模型名、对象、日期等信息会比较方便。

- **Trigger Word**
  - 如果做 caption 时没有加 trigger word，在这里填写就会统一插入。
  - 如果一开始就写进了每个 `.txt`，留空即可。

### MODEL

- **Model architecture**
  - 指定要训练的模型架构。
  - 这里选择 `SDXL`。

- **Name or Path**
  - 指定基础模型的路径。
  - 本文假设使用 [WAI-illustrious-SDXL](https://civitai.com/models/827184/wai-illustrious-sdxl)，下载后填写它的 `.safetensors` 绝对路径。
  - 例：`path\to\wai16.safetensors`

### TARGET

这里决定 LoRA 模型的大小。

Rank 越大，LoRA 能容纳的信息越多。  
但并不是越大就一定越好，也更容易把多余的东西记进去。

角色 LoRA 的话，`16/8` 这样偏小的 Rank 通常已经够用。

### SAVE

LoRA 学得好不好，只能实际生成看看。

所以要在训练过程中定期保存 LoRA，把它拿出来用。

- **Save Every**
  - 决定每隔多少 step 保存一次 LoRA。
  - 设得短一点，之后更容易挑选效果好的 step。

- **Max Step Saves to Keep**
  - 决定保留多少个 LoRA。

比如每 100 step 保存一次、训练到 3000 step，就会按 100 step、200 step、300 step……这样一份份保存下来。

`Max Step Saves to Keep` 设得太小，旧的就会被依次删掉，所以存储空间够的话，就设大一点吧。

### TRAINING

这里决定训练量和训练的推进方式。

- **Batch Size / Gradient Accumulation**
  - Batch Size 是训练时同时看几张图像。
    - 比起一次只看一张，同时看几张好像更容易找到共同点，对吧。
    - LoRA 训练也是一样。角色 LoRA 的话，我多半会选实质 batch `2` 到 `4`。
  - 提高 Batch Size 会增加 VRAM 使用量。
    - Gradient Accumulation 在这种时候很方便，可以在不大幅增加 VRAM 使用量的情况下，提高实质 Batch Size。
    - `Batch Size × Gradient Accumulation` 就是实质 batch。

- **Steps**
  - 需要多少 step，不实际训练一下是不知道的。
  - 之后还能再加，所以先设成 3000 左右。

- **Learning Rate**
  - 一般可以从 `0.00005` 到 `0.0001` 左右开始试。
  - 值越大收敛越快，值越小推进越慢。
  - 不过慢也不一定就好，最终还是要看输出结果来判断。

顺带一提，`0.0001` 有时也写作 `1e-4`。  
意思是 `1 × 10^-4`。

### DATASETS

- **Target Dataset**
  - 选择刚才创建的 Dataset。

- **Resolutions**
  - 决定以什么分辨率把图像给模型看。内部会自动缩放。
  - 高分辨率图像多的话，用大分辨率也有好处，但训练时间会相应变长。
  - 角色 LoRA 的话，只用 `512` 和 `768` 就足够了。

### SAMPLE

- **Disable Sampling**
  - AI Toolkit 有训练中生成 sample 的功能，但这里不用。
  - 这里生成的图像和 ComfyUI 里生成的图像，即使 seed 相同，通常也会不同。
  - 如果平时主要用 ComfyUI 生成，最好以实际在 ComfyUI 里加载 LoRA 生成的结果为准。

> [!NOTE]
> 设置完成后，点击右上角的 `Create Job`。

---

## 开始训练

只是创建 Job，训练还不会开始。

点击 Job 画面右上角的 `▶` 按钮，就会开始训练。

---

## 确认训练结果

LoRA 有没有真正学好，只能实际生成来确认……这是我一贯的看法。

把定期输出的 LoRA 下载下来，在 ComfyUI 里生成试试吧。

### 下载 LoRA

![](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_d3f7c198f0ffd434876eee7522f5387d.png){media=image}

Job 画面右侧的 `Checkpoints` 里会显示已保存的 LoRA。  
可以通过下载按钮取得。

### 用什么提示词测试？

先用带 trigger word 的简单提示词，确认角色能不能出来。

```text
myakumyaku-san, standing, simple background
```

角色能出来就可以先松一口气，但光这样还不能说是好的 LoRA。

好的 LoRA，应该 **只学到了原本想让它学的概念**。

如果连背景一起学进去了，或者只能生成训练图里出现过的姿势，那作为 LoRA 来说灵活性还不够。

所以需要像下面这样，编写训练图里没有的提示词来做生成测试。

- 不同姿势
- 不同服装
- 不同背景
- 不同构图
- 稍微不同的画风

如果只有在接近训练图的条件下才出得漂亮，稍微一改就崩，那可能是训练还不够，或者压根没训练好。

这时就重新检查一下数据集或学习率吧。

### 在 ComfyUI 里批量确认

想一次测试多个提示词，用 `Create List` 节点很方便。

![](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_88aed03eb70c3ada096a5e388c3cc245.png){media=image}

[](/workflows/notes/ai-toolkit-sdxl-lora-training/sdxl_list.json)

- 准备多个提示词
- 连到 `Create List`，再把它连到 `CLIP Text Encode` 节点
- 固定 LoRA 以外的生成参数，例如 CFG、seed 等
- 一边替换不同 step 的 LoRA，一边比较结果

一般来说，LoRA 要做到在 LoRA Strength `0.8` 左右就能正常出图。

---

## 在哪里停止？

训练越久，并不一定越好。

训练过头会进入过拟合状态，失去灵活性。

用各种提示词生成看看，找出刚刚好的 step 吧。

想减弱的话可以用 LoRA Strength 调，所以停在“是不是有点过头了？”的程度就可以。

---

## 不同 step 的生成示例

下面是这次 Myaku-Myaku LoRA 的生成示例。

这次看起来 2700 step 左右比较好。

![800step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_c8739cbbb75ff09453c092c7e2612308.png){media=image} ![1300step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_715f92faeca1d427be017153631582a8.png){media=image} ![1800step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_266b39d5c9e8ec1d383e66af75ba2253.png){media=image}

![2400step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_040467bfb8701ff106ecc1fe01545f75.png){media=image} ![😎 2700step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_b0d3bb95931f32192df7619f612a202e.png){media=image} ![3000step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_a0a4b53f690cc515e08103225f336adb.png){media=image}

![3300step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_a90b8f3b293e75939c7dcfb26334ecd3.png){media=image} ![3600step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_cf10d44f3c466e847754ed6dbe7f7bcc.png){media=image} ![4000step](/media/notes/ai-toolkit-sdxl-lora-training/legacy_gyazo_708b9f6cc164cd85b65d35c56f0ceeb8.png){media=image}
