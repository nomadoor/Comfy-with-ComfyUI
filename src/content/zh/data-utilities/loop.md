---
layout: page.njk
lang: zh
section: data-utilities
slug: loop
navId: loop
title: "循环处理"
created: 2026-09-18
updated: 2026-09-22
summary: "用 Start Loop 和 End Loop 重复执行工作流的一部分"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

ComfyUI 的工作流虽然看起来复杂，但基本上是一条直线。放入素材，加工后输出。仅此而已。

不过，有时也会想把加工好的东西再加工一次。

把同样的工作流一个接一个串起来当然也能做到，但不太优雅。

这种时候就轮到 **循环处理** 登场了。

## 循环处理的基本

### Start Loop和End Loop

循环由 `Start Loop` 和 `End Loop` 成对构成。夹在这两者之间的部分会被重复执行。

![](/media/data-utilities/loop/loop_simple.png){media=image}

[](/workflows/data-utilities/loop/loop_simple.json)

- `num_iterations`：重复的次数。其中一次重复称为 **iteration**
- `iteration_index`：当前是第几次 iteration

在这个工作流中，`iteration_index` 从 0 开始，于是按 `0 * 10` → `1 * 10` … 推进，最后只输出 `3 * 10` 的结果。

### 用accumulate一次性取出循环中的所有结果

![](/media/data-utilities/loop/loop_simple_accumulate.png){media=image}

[](/workflows/data-utilities/loop/loop_simple_accumulate.json)

通常情况下，从 `End Loop` 出来的只有最后一次 iteration 的 `output_value`。

启用 `accumulate` 后，中途的 iteration 也不会被丢弃，全部作为 List 一起输出。

### Simple / For / List

切换 `mode` 可以改变重复的方式。

- `Simple`：按指定的次数重复
- `For`：指定起始值、结束值和 step 来重复。`iteration_index` 会直接输出该值
  - `Simple` 可以说就是起始 0、step 1 的 `For`
- `List`：按 List 的元素个数重复

光看文字不太好理解，我们把 `iteration_index` 直接输出看看。

![](/media/data-utilities/loop/loop_simple_for_list.png){media=image}

[](/workflows/data-utilities/loop/loop_simple_for_list.json)

- `Simple`（4 次）：0, 1, 2, 3
- `For`（起始 2 / 结束 14 / step 3）：2, 5, 8, 11
- `List`（3 个元素）：0, 1, 2

只有 `List` 需要稍加注意。`iteration_index` 表示的只是第几轮，所以无论往 List 里放什么，它都是 0, 1, 2 …

想使用放进去的内容，要从 `list_item` 取出。在这个例子中就是 11, 3, 8。

### 只在第一次或最后一次改变处理

如果只想在循环的最开始或最后改变处理，可以使用 `is_first` / `is_last`。

`is_first` 只在第一次 iteration 输出 `true`，`is_last` 只在最后一次 iteration 输出 `true`。

![](/media/data-utilities/loop/loop_simple_is_last.png){media=image}

[](/workflows/data-utilities/loop/loop_simple_is_last.json)

基本上，可以把它们理解为与 `If/Else Switch` 配合使用的输出。

这个工作流只会把最后一次 iteration 的输出替换为 `12345`。

> `iteration_index` 会输出当前是第几轮，因此配合 `If/Else Switch`，也可以在第一次和最后一次以外的任意时机切换处理。

### 把图像生成重复4次

一直盯着数字也没意思，我们把它和图像生成结合起来。

把 `iteration_index` 直接当作 seed 使用。

![](/media/data-utilities/loop/loop_krea_2.png){media=image}

[](/workflows/data-utilities/loop/loop_krea_2.json)

因为 `Simple = 4`，所以会输出 seed 0 到 seed 3 共 4 张图。

不过，只是这样的话其实没什么必要用循环。用 List 处理或者重复 Queue 也能做到同样的事。

循环真正的强项在于，**可以把上一次的结果送回下一次 iteration**。

---

## 把上一次的结果传给下一次循环

### current_iteration_value 和 next_iteration_value

把循环中生成的数据连到 `next_iteration_value`，这个值就会回到 `Start Loop`。下一次 iteration 可以从 `current_iteration_value` 接收它。

有一点需要注意，最开始的那次 iteration 并没有可以送回来的上一次结果。

这时就要用 `initial_iteration_value`。正如其名，它用于设定最开始使用的值。

![](/media/data-utilities/loop/loop_iteration_value.png){media=image}

[](/workflows/data-utilities/loop/loop_iteration_value.json)

初始值 `5` 乘以 10 后传给 `next_iteration_value`，它在下一次 iteration 中再乘以 10…… 如此反复。

> `next_iteration_value` 只负责把值传给下一次。想把结果带到循环外面时，别忘了同时连接 `output_value`。

### 一次传递多个值

工作流搭得多了，就会想把 2 个 3 个数据一起送到下一次 iteration，这也是可以的。

用 `Create List` 打包发送，接收一侧再用 `Get Item From List` 逐个取出使用。

![](/media/data-utilities/loop/loop_iteration_value_fibonacci.png){media=image}

[](/workflows/data-utilities/loop/loop_iteration_value_fibonacci.json)

我们来生成斐波那契数列，也就是把前两个数相加得到下一个数。

从 `[0, 1]` 开始，计算 `a + b`，然后把 `[b, a + b]` 传给下一次 iteration。

```text
[0, 1] → [1, 1] → [1, 2] → [2, 3] → [3, 5] → …
```

> 这里打包的是两个 `INT`，不过像 `IMAGE` 和 `BOOLEAN` 这样类型不同也没问题。

### 在循环内执行Preview等节点

Preview 顾名思义只是用来看的，所以会很想像下面这样连接……可惜会报错。

![](/media/data-utilities/loop/loop_krea_2_preview_invalid.png){media=image}

[](/workflows/data-utilities/loop/loop_krea_2_preview_invalid.json)

细节就略过了，总之循环内的节点最终都必须抵达 `End Loop`。`Preview Image` 悬空的话，循环就无法闭合。

话虽如此，也会有只想当场看一眼、并不打算输出的时候。为此准备的就是 `End Loop` 的 `termination`。

![](/media/data-utilities/loop/loop_krea_2_preview_termination.png){media=image}

[](/workflows/data-utilities/loop/loop_krea_2_preview_termination.json)

把它理解成「为了让循环成立而存在的垃圾桶」就没问题了。

---

## 稍微复杂一些的例子

我们来搭几个更实用的工作流。也许能给你一些灵感。

### 用Generate Text实现灵活的循环处理

提到循环处理，容易让人联想到不断重复同样的操作，但其实有办法往里面加入创造性，那就是 MLLM。

把 MLLM 和图像编辑结合起来，让 AI 接连想出编辑指令吧。

![](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5.png){media=image}

[](/workflows/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5.json)

基础是使用 [FLUX.2 \[klein\]](/zh/basic-workflows/flux-2-klein/) 的图像编辑工作流。

不过，具体做什么样的编辑交给 MLLM 来想。这次是看着图像，从服装中挑一处换成别的单品。

再讲究一点，传给 MLLM 的不只是图像，还有它自己过去写过的提示词历史。这样可以避免反复给出相似的指令。

{% mediaRow img="/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_create_list.png", width=40, align="left" %}
**把图像和提示词历史放进List**

把要编辑的图像和提示词历史打包成 List 交给循环。

不过第一次时还没有历史，先放一个 `null` 这样无关紧要的文本。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_image_from_list.png", width=40, align="left" %}
**取出图像**

List 的内容是 `[图像, 历史]`。

把 `Get Item From List` 的 `index` 设为 `0` 就能取出图像，再传给 `Generate Text` 和 FLUX.2 \[klein\]。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_prompt_mllm.png", width=40, align="left" %}
**编写给MLLM的指令**

核心内容是「看着图中的人物，写一条改变其服装某一处的提示词」。

在此基础上，用 `Format Text` 告诉它历史记录和当前是第几轮。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_image_and_prompt.png", width=40, align="left" %}
**追加到历史，再放回List**

把这次 MLLM 写出的提示词追加到已有的历史后面。

再和编辑后的图像一起打包成 List，送往下一次 iteration。

{% endmediaRow %}

**输出示例**

![input](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_input.png){media=image} ![output1](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_output_1.png){media=image} ![output2](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_output_2.png){media=image} ![output3](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_output_3.png){media=image} ![output4](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_output_4.png){media=image}

### 用MiniMax H3和Prompt List实现连续I2V

即使是最新的视频生成模型，一次也只能生成 5〜15 秒左右的视频。

于是就轮到循环处理登场了。哪怕是 5 秒的视频，重复 12 次也有 1 分钟了！

![](/media/data-utilities/loop/loop_minimax_h3_i2va.png){media=image}

[](/workflows/data-utilities/loop/loop_minimax_h3_i2va.json)

用 [MiniMax H3](/zh/basic-workflows/minimax-h3/) 的 I2VA 每次生成 5 秒，重复 N 次。

用 `List` 模式逐条送入提示词，同时把生成视频的最后一帧传给下一次 iteration。

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_image.png", width=40, align="left" %}
**起始图像**

用作第一帧的图像放进 `initial_iteration_value`。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_prompt_list.png", width=40, align="left" %}
**提示词（List）**

5 秒的视频会按 List 的元素个数重复。

像 0〜5 秒、5〜10 秒 … 这样，准备 N 条各自完整的提示词，打包成 List 输入 `Start Loop`。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_last_frame.png", width=40, align="left" %}
**把最后一帧传给下一次**

把输出视频的最后一帧，用作下一次 iteration 的第一张图。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_video.png", width=40, align="left" %}
**输出视频**

之后要把全部片段接起来，所以启用 `accumulate`。

最后一帧会和下一段视频的第一张图重复，因此先丢掉它，再连到 `output_value`。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_video_concatenate.png", width=40, align="left" %}
**Concatenate Video**

4 条提示词生成的视频会作为 List 一起输出。

把它们合成一条的就是 `Concatenate Video`。

只连接了 `video0`，看着有点奇怪，但这样就能接上。

{% endmediaRow %}

**输出示例**

![output](/media/data-utilities/loop/loop_minimax_h3_i2va_output.mp4){media=loop}

老实说，这个工作流拿去实战还是力有不逮。

I2VA 掌握的线索只有第一帧图像。可最后一帧里，关键的人物和背景有时根本没有入镜。看输出就能发现，女性中途变成了另一个人。用 Ref2VA 传入女性的图像会更稳妥。

视频之间的接缝也让人在意。理想的做法是留出几秒作为余量、保持前一段视频原样，只生成剩下的部分，也就是所谓的 Extension，但目前找不到简单的节点，所以这里做了一些妥协。
