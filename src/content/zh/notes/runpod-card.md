---
layout: page.njk
lang: zh
section: notes
slug: runpod-card
navId: runpod-card
title: "在 Runpod 上运行文章的工作流"
created: 2026-10-02
updated: 2026-10-02
noteTags: ["guide", "runpod"]
summary: "从文章的 Runpod 卡片启动 ComfyUI 并使用的流程"
seoTitle: "在 Runpod 的 ComfyUI 上运行本站的工作流"
seoDescription: "从 Comfy with ComfyUI 文章中的 Runpod 卡片，在云端 GPU 上启动已准备好模型和工作流的 ComfyUI。介绍 GPU 的选择、启动所需时间，以及用完之后的处理方法。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## 什么是 Runpod 卡片

部分文章中放有这样的卡片。

![Runpod 卡片](/media/notes/runpod-card/runpod_card.png){media=image}

点击后，就能在云端 GPU 上启动一个 ComfyUI，里面已经备齐了该文章的工作流、模型、custom node（自定义节点）和示例图像。

每次试新模型，都要下载几十 GB 的模型、安装 custom node、再因为 VRAM 不够而崩溃……确实挺麻烦的……。

这张卡片就是把这些全部跳过，准备一个**总之一定能跑起来**的环境。本地 GPU 跑不动的模型想试试的时候，或者在装到本地之前想先看看效果的时候，欢迎用用看。

### Runpod 和 Pod

[Runpod](https://www.runpod.io/) 是一个可以按小时租用云端 GPU 的服务。

在这里租用的每一台机器叫作 **Pod**。可以理解为按使用时间租一台带 GPU 的电脑。只在租用期间计费，归还之后就停止计费。

通常需要自己决定装什么 GPU、预装哪些软件来创建 Pod，但卡片背后已经准备好了该文章专用的设置。大家只需要选 GPU。

---

## 整体流程

1. 创建 Runpod 账号并购买额度
2. 从文章的卡片创建 Pod
3. 等待准备完成
4. 在 ComfyUI 中生成
5. 用完后删除 Pod

---

## 1. 账号与额度

Runpod 没有免费试用。需要先购买额度（credit），使用的费用从中扣除。

- 打开 Runpod，`Sign Up`
- 从右上角的 `+` 购买额度

![从右上角的 + 购买额度](/media/notes/runpod-ai-toolkit-lora-training/legacy_gyazo_f683db8baf406ed1aa79e5d348f1e406.png){media=image}

不需要一开始就充很多。只是生成几张图找找感觉的话，10 美元就足够了。

> [!NOTE]
> 不一定要用，这是我的推荐链接。  
> 通过这里创建账号并购买额度，可以额外获得一些额度。我也会得到一点额度，用于本站的验证 m(_ _)m
>
> [Runpod 推荐链接](https://runpod.io?ref=knnme3w1)

---

## 2. 从卡片创建 Pod

点击文章中的卡片，就会打开 Runpod 创建 Pod 的页面。需要的设置都已经完成，剩下的只是选 GPU。

![选择喜欢的 GPU，然后 Deploy Pod](/media/notes/runpod-card/runpod_card_select_gpu.mp4){media=loop}

- 带 ★ 的 GPU 是能流畅运行该文章工作流的推荐选项
- 有时会没有空闲，选其他 GPU 当然也没问题
- 选好后点击 `Deploy Pod`

每个 GPU 都标有每小时的价格。越贵的 GPU 越快，但价格翻倍并不代表速度也翻倍。和钱包商量一下吧。

> [!WARNING]
> 按下 `Deploy Pod` 的那一刻就开始计费。

---

## 3. 等待准备完成

Pod 的准备需要一点时间。看着进度条等一下吧。

![稍等片刻就会切换到 ComfyUI](/media/notes/runpod-card/runpod_card_deploy_pod.mp4){media=loop}

准备好后，`Connect` 标签页的 `HTTP services` 中会出现 `Port 8188 → ComfyUI`，点击它。

打开后会先显示准备页面。后台正在一口气下载文章用到的模型。准备完成后，会自动切换到 ComfyUI 的界面。

> [!NOTE]
> 从点击 `Deploy Pod` 开始，大约需要 3〜4 分钟。为了加速已经下了不少功夫，但受 Pod 的机制所限，很遗憾还是需要这么长时间。

---

## 4. 在 ComfyUI 中生成

ComfyUI 打开后，文章中介绍的工作流会全部以标签页的形式排好。示例输入图像也已经放好，直接按 `Run` 就能生成。

![文章的工作流已在标签页中打开，直接 Run 即可](/media/notes/runpod-card/runpod_card_comfyui.mp4){media=loop}

即使关掉了标签页，侧边栏的 `Workflows` 里也有同样的工作流，可以从那里再次打开。

当然，也可以在此基础上修改提示词，或者读入自己的图像。

下载的只有该文章用到的模型，但 ComfyUI Manager 也可以使用，所以可以追加其他模型或 custom node，试试别的工作流。

> [!WARNING]
> 生成的图像只保存在 Pod 里。喜欢的图请随时下载下来。

---

## 5. 用完后删除 Pod

用完后，在 Pod 的页面先 `Stop`（停止），再 `Terminate`（删除）。

![先 Stop，再 Terminate](/media/notes/runpod-card/runpod_card_pod_terminate.mp4){media=loop}

`Terminate` 按钮会在 `Stop` 之后出现。只 `Stop` 也会停止计费，但里面的内容会全部清空，之后重新启动也要从头开始。请一直操作到 `Terminate`。

即使忘了删除，在没有任何操作和生成的状态下经过 30 分钟，Pod 也会自动删除。删除前 5 分钟，ComfyUI 界面顶部会显示提示。

> [!WARNING]
> `Terminate` 之后，生成的图像也会随 Pod 一起消失。想保留的图像或视频，请先下载下来。

想再次使用时，从文章的卡片重新创建一个 Pod 就可以了。
