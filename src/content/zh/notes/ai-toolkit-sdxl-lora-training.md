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
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/b0d3bb95931f32192df7619f612a202e.png"
---

## 用 AI Toolkit 训练 SDXL（Illustrious）LoRA

这里使用 [AI Toolkit](https://github.com/ostris/ai-toolkit) 来训练 SDXL 系模型用的 LoRA。

本文使用 [WAI-illustrious-SDXL v16.0](https://civitai.com/models/827184/wai-illustrious-sdxl)，但只要是 SDXL 系模型，基本流程大致相同。

这次做的是 **角色 LoRA**，不过服装 LoRA、画风 LoRA 的基本思路也差不多。

---

## 准备数据集

LoRA 训练里，数据集质量比什么都重要。这里要稍微认真一点处理。

### 1. 收集图像

收集能清楚看出训练对象的图像。

- 比起数量，质量更重要。尽量使用高分辨率图像。
  - 这次用 15 张图训练，但数量更少也可以训练。

模型会从多张图像里学习 **共同的概念**。

如果可以，最好不要全是同一种构图。姿势、角度、背景有一些变化会更好。

### 2. 简单整理图像

如果对象太小，或者其他东西太显眼，又或者混入了别的角色，可以简单裁剪一下。

不过不需要把对象严格抠出来。

稍微保留一些背景或不同服装，反而有助于模型理解“什么是角色本体，什么只是当前场景”。

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

caption 主要有 **自然语言** 和 **标签形式** 两种写法。对于 SDXL，基本上用逗号（`,`）分隔单词的标签形式会更好用。

### 4. caption 的写法

我们用 Myaku-Myaku 的例子来看。

![Myaku-Myaku](https://gyazo.com/0b39351c0a14cdf1e768d4cc64b9ac0c){gyazo=image}

看图可以发现很多元素：

- 电脑
- 椅子
- 很多眼睛
- 蓝色身体
- 图像风格（这次是照片）
- ...

这些不需要全部写进 caption。  
角色 LoRA 中要写的是 **不定义角色本体的词**。

图像中反复出现、但 **没有被文本说明的东西**，会更容易被 LoRA 学进去。

比如直接给上图写 caption，大概会是这样：

```text
mascot, sitting, indoors, office, desk, laptop, office chair, lanyard, id card, multiple eyes, smile, blue body, red appendages, plush, photo
```

为了训练角色 LoRA，把定义 Myaku-Myaku 本体的词删掉：

```text
sitting, indoors, office, desk, laptop, office chair, photo
```

最后，在开头加上用于呼出这个角色的 trigger word。这里用 `myakumyaku-san`。

- trigger word 没有严格规则。
- 不过如果太普通，可能会和其他概念混在一起，所以用专有名词会更安全。

```text
myakumyaku-san, sitting, indoors, office, desk, laptop, office chair, photo
```

### 4.5 用 MLLM 创建 caption

最近的 MLLM 性能很好，所以也可以把 caption 创建基本交给它。

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

- [WIP]

---

## 读取 Dataset

启动 AI Toolkit 后，先读取 Dataset。

![](https://gyazo.com/8e7d24641bb2491bca6ad449bddcaa69){gyazo=image}

1. 打开 `Dataset` 标签
2. 点击右上角的 `New Dataset`
3. 用任意名称创建文件夹
4. 通过 `Add Images` 把图像和文本文件所在的文件夹加入进去

只要图像和对应 caption 正确读取，就可以了。

---

## 创建 Job

在 AI Toolkit 里，会先创建一个叫 Job 的训练设置，然后再启动它。

可以理解成类似 ComfyUI 里的 workflow。

![](https://gyazo.com/b4ef7a58d34d67eb34963f61d1bc50c3){gyazo=image}

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
  - 取一个自己喜欢的名字。
  - 之后还会回来看，所以最好包含模型名、对象、日期之类的信息。

- **Trigger Word**
  - 如果 caption 文件里还没有写 trigger word，可以在这里填写，AI Toolkit 会统一插入。
  - 如果每个 `.txt` 里已经写好了，就保持空白。

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
但并不是越大越好，也更容易把不必要的东西记进去。

角色 LoRA 的话，`16/8` 这样偏小的 Rank 通常已经够用。

### SAVE

LoRA 学得好不好，最后还是只能实际生成图像来确认。

所以训练过程中要定期保存 LoRA，再拿出来测试。

- **Save Every**
  - 决定每隔多少 step 保存一次 LoRA。
  - 设得短一点，之后更容易挑选效果好的 step。

- **Max Step Saves to Keep**
  - 决定保留多少个 LoRA。

比如每 100 step 保存一次，训练到 3000 step，就会在 100 step、200 step、300 step……这样细分保存 LoRA。

如果 `Max Step Saves to Keep` 太小，旧文件会被删除。存储空间足够的话，可以设大一点。

### TRAINING

这里决定训练量和训练推进方式。

- **Batch Size / Gradient Accumulation**
  - Batch Size 是训练时同时看几张图像。
    - 比起一次只看一张图，同时看几张图会更容易找到共同点。
    - LoRA 训练也是类似。角色 LoRA 的话，我常用实质 batch `2` 到 `4`。
  - 提高 Batch Size 会增加 VRAM 使用量。
    - Gradient Accumulation 在这种时候很方便，可以在不大幅增加 VRAM 使用量的情况下，提高实质 Batch Size。
    - `Batch Size × Gradient Accumulation` 就是实质 batch。

- **Steps**
  - 需要多少 step，实际训练前很难确定。
  - 后面可以继续追加，所以一开始设到 3000 左右就可以。

- **Learning Rate**
  - 一般可以从 `0.00005` 到 `0.0001` 左右开始试。
  - 值越大收敛越快，值越小推进越慢。
  - 不过慢并不一定更好，最后还是要看实际输出结果判断。

顺带一提，`0.0001` 有时也写作 `1e-4`。  
意思是 `1 × 10^-4`。

### DATASETS

- **Target Dataset**
  - 选择刚才创建的 Dataset。

- **Resolutions**
  - 决定以哪些分辨率读取图像。内部会自动 resize。
  - 高分辨率图像多的话，更高分辨率可能有利，但训练时间也会变长。
  - 角色 LoRA 的话，只用 `512` 和 `768` 也通常够了。

### SAMPLE

- **Disable Sampling**
  - AI Toolkit 有训练中生成 sample 的功能，但这里不用。
  - 这里生成的图像和 ComfyUI 里生成的图像，即使 seed 相同，通常也会不同。
  - 如果平时主要用 ComfyUI 生成，那么直接把 LoRA 读进 ComfyUI 测试会更可靠。

> 设置完成后，点击右上角的 `Create Job`。

---

## 开始训练

只是创建 Job，训练还不会开始。

点击 Job 画面右上角的 `▶` 按钮，就会开始训练。

---

## 确认训练结果

LoRA 是否真的学好了，还是要实际生成图像来确认。

下载训练过程中定期输出的 LoRA，在 ComfyUI 里试试看。

### 下载 LoRA

![](https://gyazo.com/d3f7c198f0ffd434876eee7522f5387d){gyazo=image}

Job 画面右侧的 `Checkpoints` 里会显示已保存的 LoRA。  
可以通过下载按钮取得。

### 用什么 prompt 测试？

首先用包含 trigger word 的简单 prompt，确认角色能否出现。

```text
myakumyaku-san, standing, simple background
```

角色能出来的话，第一步算是安心了。但这还不代表 LoRA 已经很好。

好的 LoRA 应该只学习 **原本想让它学习的概念**。

如果连背景一起学进去了，或者只能生成训练图里出现过的姿势，那作为 LoRA 来说灵活性还不够。

所以需要用训练图里没有的 prompt 来测试。

- 不同姿势
- 不同服装
- 不同背景
- 不同构图
- 稍微不同的画风

如果只有接近训练图的条件下才好看，稍微改一下 prompt 就崩，可能是训练还不够，也可能是数据集本身需要调整。

这时可以重新检查数据集，或者调整 learning rate。

### 在 ComfyUI 里批量确认

如果想一次测试多个 prompt，`Create List` 节点很方便。

![](https://gyazo.com/88aed03eb70c3ada096a5e388c3cc245){gyazo=image}

[](/workflows/notes/ai-toolkit-sdxl-lora-training/SDXL_list.json)

- 准备多个 prompt
- 连接到 `Create List`，再连接到 `CLIP Text Encode`
- 固定 LoRA 以外的生成参数，例如 CFG、seed 等
- 一边替换不同 step 的 LoRA，一边比较结果

对于 SDXL LoRA，一般会先让它在 LoRA Strength `0.8` 左右正常出图。

---

## 在哪里停止？

训练越久，并不一定越好。

训练过头会变成过拟合，灵活性会下降。

用不同 prompt 生成几次，找出刚好合适的 step。

因为之后可以用 LoRA Strength 调弱，所以稍微偏强一点通常也没问题。

---

## 不同 step 的生成例

下面是这次 Myaku-Myaku LoRA 的生成例。

这次看起来 2700 step 左右比较好。

![800step](https://gyazo.com/c8739cbbb75ff09453c092c7e2612308){gyazo=image} ![1300step](https://gyazo.com/715f92faeca1d427be017153631582a8){gyazo=image} ![1800step](https://gyazo.com/266b39d5c9e8ec1d383e66af75ba2253){gyazo=image}

![2400step](https://gyazo.com/040467bfb8701ff106ecc1fe01545f75){gyazo=image} ![😎 2700step](https://gyazo.com/b0d3bb95931f32192df7619f612a202e){gyazo=image} ![3000step](https://gyazo.com/a0a4b53f690cc515e08103225f336adb){gyazo=image}

![3300step](https://gyazo.com/a90b8f3b293e75939c7dcfb26334ecd3){gyazo=image} ![3600step](https://gyazo.com/cf10d44f3c466e847754ed6dbe7f7bcc){gyazo=image} ![4000step](https://gyazo.com/708b9f6cc164cd85b65d35c56f0ceeb8){gyazo=image}
