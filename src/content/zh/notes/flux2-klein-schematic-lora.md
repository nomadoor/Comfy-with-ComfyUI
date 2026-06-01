---
layout: page.njk
lang: zh
section: notes
slug: flux2-klein-schematic-lora
navId: flux2-klein-schematic-lora
title: "FLUX.2 [klein] Schematic LoRA"
created: 2026-05-30
updated: 2026-06-01
noteTags: ["project", "flux-2-klein", "lora"]
summary: "让 FLUX.2 [klein] 学习 CV 任务风格的 RGB 输出"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/a0dc0970df98429dcf703e3ed095f6fa.png"
---

## 概述

![](https://gyazo.com/2bd9f7b01d61bea0658ba82a750f227e){gyazo=image}

利用图像生成模型的先验知识来做 CV 任务的研究有不少。代表性的例子包括 [Marigold](https://arxiv.org/abs/2312.02145)、[Lotus-2](https://huggingface.co/papers/2512.01030)、[SDPose](https://tsliang.top/SDPose/) 等。

这些方法虽然利用了预训练图像生成模型，但最终仍然是为各自任务专门设计的。

不过，在指令式图像编辑模型已经变得常见的今天，也出现了另一种思路：从图像进行深度估计或分割这类任务，是否也可以在更宽泛的意义上当作 **图像编辑** 来处理？Google DeepMind 的 [Vision Banana](https://vision-banana.github.io/) 就是这样的研究。

受到这个方向的启发，我想试试看 FLUX.2 [klein] 是否也能做类似的事情。

结果当然谈不上达到 SOTA 性能。不过我希望这个实验能说明，仅靠简单的 LoRA 训练，也可以在本地模型上尝试接近 Vision Banana 方向的行为。

---

## 任务设定

Vision Banana 主要处理 depth / normal / segmentation。

这次没有完全照搬它的任务构成，而是选择了 ComfyUI / 图像生成社区里更熟悉的，也就是类似 ControlNet Preprocessor 的输出。

我个人把这些任务称为 `image2schematic`，这次创建的 LoRA 名称里也都包含 `schematic` 这个词。

| task | output |
|---|---|
| relative depth | near = white / far = black |
| normal map | RGB normal map |
| pose body | OpenPose 风 body skeleton |
| pose full | body + hands + face |
| binary segmentation | visible region mask |
| amodal segmentation | 包含 occluded parts 的 mask |

### amodal segmentation

![](https://gyazo.com/a0cf18a91c6349d3d3002fe98453b723){gyazo=image}

这里面，可能有人没听过 amodal segmentation 这个任务。

- 普通 segmentation 只会 mask 对象 **实际可见的区域**。
- amodal segmentation 会把遮挡物后面看不见的部分也包含进去，推定对象整体形状并生成 mask。

比如鹿的前面被树枝遮住时，普通 segmentation 不会输出树枝后面被挡住的部分。  
而 amodal segmentation 会把被树枝挡住的部分也包括进去，输出鹿整体的 mask。

因为需要推定看不见的部分，所以它与其说是单纯分类，不如说更接近生成。  
反过来说，这也是图像生成模型可能比较能发挥能力的任务，所以这次尝试了一下。

### 按任务分别训练 LoRA

一开始我打算把所有任务训练到一个 LoRA 里，但内部任务混在了一起，单靠 prompt 无法稳定切换。

因此这次采用 1 个任务 1 个 LoRA 的构成。

---

## 数据集

| task | positive | negative | total |
|---|---:|---:|---:|
| depth | 300 | 0 | 300 |
| normal | 300 | 0 | 300 |
| pose body | 300 | 30 | 330 |
| pose full | 300 | 30 | 330 |
| binary segmentation | 300 | 30 | 330 |
| amodal segmentation | 300 | 30 | 330 |

### Depth / Normal

从 Open Images 获取图像，并用 Lotus-2 创建 teacher。

- depth
  - relative depth
  - near = white
  - far = black
- normal
  - RGB normal map

depth 和 normal 使用同一组输入图像。

### Pose

从 Open Images 获取人物图像，并用 DWPose 创建 teacher。

- pose body
- pose full

候选图像经过目视检查，排除了人群图像以及输出明显崩坏的图像。

### Amodal Segmentation

amodal segmentation 是为对象创建 mask 的任务，不只包含可见部分，也包含被遮挡的部分。

手头没有现成数据集，也没有能直接生成它的 teacher，所以这次结合图像生成和图像编辑来制作。

制作流程：

1. 让 GPT-5.5 创建包含明确 subject 和自然 occluder 的 occlusion scene prompt
2. 用 Z-Image-Turbo 生成 source image
3. GPT-5.5 检查 source image
4. 用 FLUX.2 [klein] 9B image edit 去除 occluder
5. 从去除后的图像中，用 SAM 3.1 对 target object 做 segmentation
6. 将 source image 和 complete-object mask 配对
7. 目视检查
8. 使用 BiRefNet 以及手动方式修正

mask 只靠 SAM 3.1 并不稳定，所以几乎全部都用 BiRefNet 和手动方式修正过。

这不是主线内容，但如果让 LLM 大量生成图像 prompt，结果会容易偏向：

- 相似的对象
- 相似的 occluder
- 相似的构图

因此我把 Open Images 的随机图像作为 inspiration 给它看，用来增加 scene variation。

### Binary Segmentation

复用 amodal segmentation 用的 source image。

对输入图像中实际可见的 target object 区域，用 SAM 3.1 做 segmentation，并手动修正。

### Negative Samples

pose / segmentation 都会遇到一个问题：当输入图像里不存在目标对象时，模型容易 hallucination。

例如，输入图像里没有猫，却给出 `generate mask of the cat` 这样的指令时，模型可能会随便生成一个猫形状的 mask。

为了解决这个问题，我加入了一部分 all-black target 的 negative pair。

- segmentation
  - 当指定的 target 不存在于图像中时，返回 all-black mask
  - 例：cond 图像里只有长颈鹿，却要求生成 `cat` 的 amodal mask
- pose
  - 输入图像里没有人物时，返回 all-black pose image

不过，以这次的规模来看，没有确认到明确改善。尤其在 pose 上，反而可能让训练变得不稳定。

---

## 训练

使用 [AI Toolkit](https://github.com/ostris/ai-toolkit) 训练。

| item | value |
|---|---|
| base model | `black-forest-labs/FLUX.2-klein-base-9B` |
| architecture | `flux2_klein_9b` |
| LoRA rank | linear 32 / conv 16 |
| optimizer | `adamw8bit` |
| lr | `5e-5` |
| dtype | `bf16` |
| quantization | transformer / text encoder: `qfloat8` |
| batch size | 4 |
| text encoder | frozen |
| caption dropout | 0.05 |
| EMA | enabled |

为了降低计算量，分辨率基本使用 768 bucket。

只有 pose full 因为脸和手的细节更重要，所以加入了 768 / 1024 bucket 来训练。

每 100 step 保存一次 checkpoint。  
然后在 ComfyUI 中实际运行，选择看起来比较好的 step。所有 LoRA 大约都在 2000～2500 step 左右收敛。

---

## workflow

下面是用于在 ComfyUI 中使用这些 LoRA 的 workflow。

需要注意，基于 FLUX.2 [klein] Base 训练的 LoRA，在 FLUX.2 [klein] Distilled 模型上运行效果不好。请使用 Base 模型，或者使用 Distilled 与 Base 的差分 LoRA（[Klein 4B/9B Base to Turbo Lora](https://civitai.com/models/2324315/klein-4b9b-base-to-turbo-lora?modelVersionId=2617121)）。

### 模型下载

基础模型是 [FLUX.2 [klein]](/zh/basic-workflows/flux-2-klein/)。

- LoRA
  - [flux2-klein-schematic-relative-depth-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-relative-depth-lora.safetensors)
  - [flux2-klein-schematic-surface-normal-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-surface-normal-lora.safetensors)
  - [flux2-klein-schematic-body-pose-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-body-pose-lora.safetensors)
  - [flux2-klein-schematic-full-pose-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-full-pose-lora.safetensors)
  - [flux2-klein-schematic-binary-segmentation-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-binary-segmentation-lora.safetensors)
  - [flux2-klein-schematic-amodal-segmentation-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-amodal-segmentation-lora.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── flux2-klein-schematic-relative-depth-lora.safetensors
        ├── flux2-klein-schematic-surface-normal-lora.safetensors
        ├── flux2-klein-schematic-body-pose-lora.safetensors
        ├── flux2-klein-schematic-full-pose-lora.safetensors
        ├── flux2-klein-schematic-binary-segmentation-lora.safetensors
        └── flux2-klein-schematic-amodal-segmentation-lora.safetensors
```

### image edit Base

![](https://gyazo.com/596669219726f35c5106037b4fce9e38){gyazo=image}

[](/workflows/notes/flux2-klein-schematic-lora/Flux.2-klein-base-9b_image-edit.json)

---

## 实践测试

### relative depth

```text
Generate a relative depth map of the input image.
```

| input | Depth Anything V2 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/668960b4d9147ef1260a01957f93ce9a){gyazo=image} | ![](https://gyazo.com/20a4dcedf04be910c3dbf0830a34cd02){gyazo=image} | ![](https://gyazo.com/8d011d8f92dfaea759907a6430493d63){gyazo=image} |
| ![](https://gyazo.com/206992247684d3cc8540037dffe4b088){gyazo=image} | ![](https://gyazo.com/1b39fbf77eb003a1aa38ce800728eb58){gyazo=image} | ![](https://gyazo.com/6e27345a2ecf071e40671ca000fd84f9){gyazo=image} |
| ![](https://gyazo.com/0ec98b233b467a27a1ac497d2ccf02f9){gyazo=image} | ![](https://gyazo.com/7b1501385098f7cc43354a257739a069){gyazo=image} | ![](https://gyazo.com/ef6402a1b2562118d88f6c471e00bbc0){gyazo=image} |

### normal map

```text
Generate a surface normal map of the input image.
```

| input | Lotus-2 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/b3a1684aefa305aacdc41d92ea4c3485){gyazo=image} | ![](https://gyazo.com/a75bc8fdb2794f16d264f8da33dcd7cc){gyazo=image} | ![](https://gyazo.com/a1def11da46b031feabe3f0e6b3f50a2){gyazo=image} |
| ![](https://gyazo.com/225d29e4318a97b1bfc378091cd06b0e){gyazo=image} | ![](https://gyazo.com/8cc65f987cd5dc9f277efbb242bc6a11){gyazo=image} | ![](https://gyazo.com/595aff620129e00f348fe4ebed8425c7){gyazo=image} |
| ![](https://gyazo.com/a3566d450ba6209c256f8c55293a428c){gyazo=image} | ![](https://gyazo.com/c2aa1322ad6e17b2b900762ac63f1ba8){gyazo=image} | ![](https://gyazo.com/9f1ea3ff029395ab2d6121c059a3bc3a){gyazo=image} |

### pose body

```text
Generate a body pose map of all visible people in the input image.
```

| input | DWPose | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/c3e372e31e394aec307a20fbb9b5fb73){gyazo=image} | ![](https://gyazo.com/5aa247ce618c608d195328483bd5f336){gyazo=image} | ![](https://gyazo.com/d503b1b89f9361c12d110e95dba909f0){gyazo=image} |
| ![](https://gyazo.com/9ee77ec890a84129011b3ef339576171){gyazo=image} | ![](https://gyazo.com/a4a31c41ec507aa59eb0430b0eb05fc3){gyazo=image} | ![](https://gyazo.com/b06ce32e1e60019e84844b5c885f0022){gyazo=image} |
| ![](https://gyazo.com/bd3bb102f39717b6bbfdae0cc68e96b5){gyazo=image} | ![](https://gyazo.com/5f949073e42723d6bef17932c8aa6139){gyazo=image} | ![](https://gyazo.com/5fcc24d235f0360e1284f32cf30fa9ff){gyazo=image} |

### pose full

```text
Generate a full pose map of all visible people in the input image.
```

| input | DWPose | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/c3e372e31e394aec307a20fbb9b5fb73){gyazo=image} | ![](https://gyazo.com/cd1c92e205f413cc144b2ec534a398d3){gyazo=image} | ![](https://gyazo.com/aec346f0e8592e8f946f8c2993491955){gyazo=image} |
| ![](https://gyazo.com/9ee77ec890a84129011b3ef339576171){gyazo=image} | ![](https://gyazo.com/90e9d09c619cbea9c8e788e7b4643616){gyazo=image} | ![](https://gyazo.com/ce5459cca85c4ec415e402d6ecf9da8f){gyazo=image} |
| ![](https://gyazo.com/bd3bb102f39717b6bbfdae0cc68e96b5){gyazo=image} | ![](https://gyazo.com/5f949073e42723d6bef17932c8aa6139){gyazo=image} | ![](https://gyazo.com/db7abedc5ea7431d831076ce4f58353c){gyazo=image} |

### binary segmentation

```text
Generate a binary segmentation mask of the stretcher in the input image.
Generate a binary segmentation mask of the tuna sushi in the input image.
Generate a binary segmentation mask of all jars in the input image.
```

| input | SAM 3.1 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/38dd24bd0eec756210f300aa6bc22dbd){gyazo=image} | ![](https://gyazo.com/78f513b8690050f8085995e79a2bf16a){gyazo=image} | ![](https://gyazo.com/8a1faf3881821b454265ab60f7d97af0){gyazo=image} |
| ![](https://gyazo.com/ff1760a3c6943a2e4e666ec61e1b6eab){gyazo=image} | ![](https://gyazo.com/1abbfc37a68d8335a7f66b9bed7561c3){gyazo=image} | ![](https://gyazo.com/f2ecfb80e270561e7685dfa227855c84){gyazo=image} |
| ![](https://gyazo.com/5cc009a2cf9ed0da1a2ba74c12e1ec8c){gyazo=image} | ![](https://gyazo.com/a355a426888bd07b48efdf8ee3b6f7d7){gyazo=image} | ![](https://gyazo.com/61c49e77830d9ea82039b839cb18b38e){gyazo=image} |

### amodal segmentation

```text
Generate an amodal segmentation mask of the woman in the input image.
Generate an amodal segmentation mask of the bench in the input image.
Generate an amodal segmentation mask of the steam locomotive in the input image.
```

| input | SAM 3.1 visible mask | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/6b4da57f9c240ace62c66fe6c49c49f6){gyazo=image} | ![](https://gyazo.com/ab3b4dbd6acadbe89e038d121ba011c7){gyazo=image} | ![](https://gyazo.com/79f8e50117e8bbab8dcdfee43b5d75e3){gyazo=image} |
| ![](https://gyazo.com/3882219095ebaa6a3c148be2cd6c8cbc){gyazo=image} | ![](https://gyazo.com/34b8014d2efe1557b06403772c5c009d){gyazo=image} | ![](https://gyazo.com/fc9840c4f47858a7d52351694494c6c0){gyazo=image} |
| ![](https://gyazo.com/4a50a286d8870c218e6c792138983ff1){gyazo=image} | ![](https://gyazo.com/95c93284e620212e59cbf261b29f21eb){gyazo=image} | ![](https://gyazo.com/4a3159526479a1ac84b9ce1bc99262d7){gyazo=image} |

---

## 局限与问题

### Depth / Normal

teacher 使用的是 Lotus-2，但 Lotus-2 自身带来的噪声也会被 LoRA 一起学进去。

对于这类任务，本来应该也考虑使用 3D 模型生成的合成数据。

顺便一提，在使用 Lotus-2 之前，我也用 DSINE 创建的 target 图像训练过。DSINE 生成的 Normal map 比 Lotus-2 平很多，结果 LoRA 的输出也同样变得很平。

teacher 的质量会直接反映到 LoRA 的输出上，这让我再次感受到数据集质量的重要性。

### pose

首先，pose 是这次任务中最不适合用 RGB 图像表达的任务。

即使能输出 OpenPose 风格图像，把它再转换回 keypoint 也并不容易，实际使用上会比较麻烦。另外，颜色和骨骼数量都有严格规则，所以一点点偏差也会很显眼。

我原本以为这是一个容易训练的任务，但实际比想象中更容易崩。动物图像和非人物图像上的 hallucination 也没有防住。

### segmentation

我原本期待文本编码器 Qwen3 8B 的 prompt 理解力能发挥作用，但控制能力没有达到预期。

它可以听懂“删除某某人物”这样的指令，但在应用 LoRA 后要求“segment 某某人物”时，会失败，或者 segment 到另一个人物。

因此，这可能不只是 prompt 理解力的问题。模型也可能没有从数据集中很好地理解 segmentation 任务本身。

细节抠图精度方面，我本来期待能接近 matting 那种更平滑的边界，但目前还停留在 SAM 3.1 左右的粗糙程度。

### 整体

整体来看，数据集数量不够。

这次 amodal segmentation 的数据集制作非常重，所以为了统一规模，所有任务大致都控制在 300 张左右。  
不过如果要认真切分原因，我觉得每个任务大概需要 2000～3000 张。

还有很多改进点，但预算和时间已经花得太多，所以这次先到这里。  
如果有机会，希望能用更大的数据集再试一次。

---

## 结语

先不谈质量如何，仅靠小规模 LoRA 训练，也确实能让 FLUX.2 [klein] 在一定程度上学会 CV 任务风格的 RGB 输出。

不过真正重要的，并不是“是否完成了 CV 任务”，而是根据 **我们把什么东西当作图像编辑来处理**，图像编辑模型的用途还可以继续扩展。

一提到图像编辑，最先想到的通常是画风转换或对象移除。  
但像这次这种 CV 任务风格输出，或者让模型生成自定义中间表示，也可以在广义上当作图像编辑。

原本只是“画图”的图像生成模型，逐渐变得像通用视觉模型一样，这一点很有趣。

---

## 参考

- [Marigold: Repurposing Diffusion-Based Image Generators for Monocular Depth Estimation](https://arxiv.org/abs/2312.02145)
- [Lotus: Diffusion-based Visual Foundation Model for High-quality Dense Prediction](https://huggingface.co/papers/2409.18124)
- [Lotus-2: Advancing Geometric Dense Prediction with Powerful Image Generative Model](https://huggingface.co/papers/2512.01030)
- [Vision Banana: Image Generators are Generalist Vision Learners](https://arxiv.org/abs/2604.20329)
- [Vision Banana Project Page](https://vision-banana.github.io/)
