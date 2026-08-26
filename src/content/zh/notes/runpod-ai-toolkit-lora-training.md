---
layout: page.njk
lang: zh
section: notes
slug: runpod-ai-toolkit-lora-training
navId: runpod-ai-toolkit-lora-training
title: "在 RunPod 上运行 AI Toolkit"
created: 2026-05-03
updated: 2026-08-26
noteTags: ["guide", "training", "runpod", "ai-toolkit", "lora"]
summary: "在 RunPod 上启动 AI Toolkit 并执行 LoRA 训练的流程"
permalink: "/{{ lang }}/notes/{{ slug }}/"
---

## RunPod 是什么？

[RunPod](https://www.runpod.io/) 是一个可以短时间租用云端 GPU 算力的服务。

类似的服务有好几个，但我觉得 RunPod 在价格和易用性之间的平衡最好。

和单纯生成图片相比，模型训练需要更高的处理能力和更多 VRAM，而且 GPU 往往要连续运行几十分钟到几个小时。

如果只是训练一个简单的 LoRA，通常几美元就能完成，所以可以先轻松试试看。

这篇笔记会介绍从在 RunPod 上启动 AI Toolkit，到下载训练好的 LoRA 为止的流程。

> 不同模型的详细训练设置，以及数据集的制作方法，我打算分别写在其他文章里。

---

## 整体流程

1. 创建 RunPod 账号并购买点数
2. 创建 Pod
3. 打开 AI Toolkit 界面
4. 上传 Dataset
5. 创建 Job
6. 执行训练
7. 下载 LoRA 文件
8. 停止 Pod

---

## 1. 创建 RunPod 账号并购买点数

### 创建账号

![](https://gyazo.com/fa937b8adfc9a1e28e406645ada9b52b){gyazo=image}

打开 [RunPod](https://www.runpod.io/)，从 `Sign Up` 创建账号。

### 购买点数

RunPod 是先购买点数，再消耗点数使用 GPU 的形式。

如果只是试一下 LoRA 训练，10 美元左右就足够了。

![](https://gyazo.com/f683db8baf406ed1aa79e5d348f1e406){gyazo=image}

- 点击右上角的 `+` 按钮
- 如果想购买 150 美元或更少的点数，选择 `Other`
- 输入金额，然后进入 `Go to Checkout`

> 不一定要用，不过这是我的邀请链接。从这里注册并购买至少 10 美元的点数，会额外得到一点额度。
>
> [RunPod 邀请链接](https://runpod.io?ref=ke9q7kqp)

---

## 2. 创建 Pod

### Pod 是什么？

RunPod 有几种功能，但这次只要知道 **Pod** 就够了。

Pod 就像一台可以自定义的云端租用 PC。

你选择要使用哪张 GPU、分配多少容量，然后租用这个环境。

这次我们会创建一个可以使用 AI Toolkit 的 Pod，从浏览器打开 AI Toolkit 界面，并训练 LoRA。

### 选择 Template

从侧边栏打开 `Pods`，点击 `Deploy`。

![](https://gyazo.com/c39356c905c1a2bf89d0fcf83451712d){gyazo=loop}

- 在 `Search templates` 中搜索 `AI Toolkit`
- 选择 [AI Toolkit - ostris - ui - official](https://console.runpod.io/hub/template/ai-toolkit-ostris-ui-official?id=0fqzfjy6f3)
  - 这是 AI Toolkit 作者 Ostris 制作的 Template。
  - 搜索结果里会出现许多同名 Template，请注意不要选错。

选择 Template 后，从 `Set overrides` 修改一项设置。

- 打开 `Environment Variables`
- 把 `AI_TOOLKIT_AUTH` 的值改成只有自己知道的密码

> 这里设置的值会在打开 AI Toolkit 时使用。如果保持默认值，任何人都可以用 `password` 打开，所以请改成别的值。

### 选择 GPU

`Compute` 一栏中会列出许多 GPU。

不知道该选哪个时，首先要看的是 **VRAM**。

VRAM 不够时，训练中会出现 `Out of Memory`，无法继续处理。

价格较高的 GPU 通常训练也更快，但价格翻倍，并不代表速度也会翻倍。还是要看预算和剩余时间怎么取舍。

我经常使用 RTX A5000 和 A40。

| GPU | VRAM | 备注 |
| --- | --- | --- |
| **RTX A5000** | 24GB | 优点是价格便宜。不过数量较少，有时可能没有空闲实例。 |
| **A40** | 48GB | 可以相对便宜地使用 48GB VRAM。24GB 不够时，我会使用这张卡。 |

### Deploy Pod

点击 `Deploy Pod` 后，Pod 就会被创建。

> 从这个时间点开始会消耗点数。dataset 等准备工作最好提前完成。

---

## 3. 打开 AI Toolkit 界面

Pod 创建需要一点时间，先等它完成。

![](https://gyazo.com/952faa4188776b9cc626a5c2009422b3){gyazo=image}

Pod 准备好后，会显示 `🟢Ready`，并出现打开 AI Toolkit 的链接。

点击 `HTTP Service`，应该就能打开 AI Toolkit。

![](https://gyazo.com/696fa9e2aa3260c51214fd4fc7c3af1a){gyazo=image}

它会要求输入密码，这里输入刚才设置在 `AI_TOOLKIT_AUTH` 中的值。

接下来大致看一下在 AI Toolkit 中训练模型的流程。

---

## 4. 上传 Dataset

![](https://gyazo.com/d57274c9ba07002e7ee02b1b72a80499){gyazo=image}

把训练用的图片和 caption file 上传到 AI Toolkit。

- 打开 `Dataset` 标签页
- 点击右上角的 `New Dataset`
- 给 dataset 命名
- 拖放图片和 `.txt` 文件

只要图片和对应的 caption file 被正确读取，就可以继续。

---

## 5. 创建 Job

在 AI Toolkit 中，训练流程是先创建一个叫做 Job 的训练设置，然后启动它。

有点像 ComfyUI 里的 workflow。

![](https://gyazo.com/c8029171b590fcb71fc68188a2f5c8be){gyazo=image}

在这里设置 base model、学习率、刚才读取的 dataset 等训练参数。

设置完成后，点击右上角的 `Create Job`。

训练开始前，可以反复修改设置。

---

## 6. 执行训练

Job 创建好之后，开始训练。

![](https://gyazo.com/b06e6a6734de8d0dba21687c56604812){gyazo=image}

- 点击右上角的执行按钮（`▶`）

如果没有报错，Progress bar 也在前进，基本上就说明运行正常。

训练可以中途停止，也可以之后继续。

停止后也可以修改参数再运行一次，但有些参数会破坏训练状态。如果不清楚，最好从 0 重新开始。

---

## 7. 下载 LoRA 文件

根据设置不同，AI Toolkit 会在训练过程中定期输出 LoRA。

训练是否顺利，最终还是只能实际用 ComfyUI 等工具生成图片来确认。老实说，Loss Graph 参考价值不大。

![](https://gyazo.com/89e7eea124ea56af4a34bba8af083057){gyazo=image}

- 输出的 LoRA 会显示在 `Checkpoints` 区域
- 点击下载按钮保存

基本流程到这里就结束了。

> 删除 Pod 后，上传的 dataset 和生成的 LoRA 也会一起删除。需要的文件一定要提前下载。  
> 写有全部设置的 config file 也建议保存下来，之后回看时会很有用。

---

## 8. 停止 Pod

RunPod 在 Pod 运行期间，即使没有实际操作，也会产生费用。

所以不要忘记停止它。

![](https://gyazo.com/f60fe312a59e9fe6624490c8004da78e){gyazo=image}

- 回到 RunPod 页面
- 打开正在运行的 Pod
- 用 `Stop` 停止 Pod
- 确认必要文件都已经下载

只按 `Stop` 的话，GPU 计费会停止，但 Volume disk 的 storage 费用仍然会保留。

如果已经可以关闭 AI Toolkit，就执行 `Terminate` 完全关闭。

![](https://gyazo.com/7142f88c43aa0b4b0281b6c6a1c064ad){gyazo=image}

- 用 `Terminate` 删除 Pod

---

## 具体模型的训练

这篇主要说明了从 RunPod 启动 AI Toolkit 的部分。

如果想看用 AI Toolkit 具体训练模型的流程，请参考下面这篇。

- [用 AI Toolkit 训练 SDXL（Illustrious）LoRA](/zh/notes/ai-toolkit-sdxl-lora-training/)
