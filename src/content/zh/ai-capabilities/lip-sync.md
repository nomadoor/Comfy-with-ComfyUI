---
layout: page.njk
lang: zh
section: ai-capabilities
slug: lip-sync
navId: lip-sync
title: Lip Sync
summary: 配合音频移动嘴巴或表情的技术
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 什么是 Lip Sync（对口型）？

Lip Sync 是配合音频的内容或节奏，追加嘴巴或表情动作的技术。

它用于给原本的视频叠加单独录制的音频，或让一张静止画“像在说话一样”移动。

---

## 配合现有视频的对口型

![](https://gyazo.com/17b81df017311b5fee98119e7e808492){gyazo=player} ![](https://gyazo.com/a6286699b56195148b64533d441561c0){gyazo=player}
> ← 基础视频 | → Lip Sync (LatentSync)

最初广为人知的是像 Wav2Lip 那样“只修改嘴角”类型的模型。

输入已经拍摄好的视频和单独录制的音频，就会输出脸或身体的动作保持原样，只有嘴巴配合新音频移动的视频。

---

## 让一张静止画说话

> ![](https://gyazo.com/a74335c1403caa5475429688f420212d){gyazo=player}
> EMO

像 [EMO](https://humanaigc.github.io/emote-portrait-alive/) 这样的模型，可以从一张人脸图像和音频中直接生成说话的视频。
用音频来控制并驱动输入图像，可以说是 image2video 的发展。

准备一张角色插图或人脸照片，并给予台词或歌声，它就会返回对应长度的、带有对口型的视频。眨眼、嘴角动作、轻微的头部晃动等也会一并制作出来。

---

## 通过音频驱动整个视频

稍微大声说话就能明白，说话时不仅仅是嘴巴在动。
肺部膨胀，肩膀抬起，回过神来甚至在用手做手势。

归根结底，像 Wav2Lip 那样只让嘴巴配合音频移动，是无法制作出自然的视频的。

再加上视频生成模型已经达到了实用的性能，不仅仅是单纯的“对口型”，正在朝着 **音频驱动型肖像视频生成** 的方向发展。

> ![](https://gyazo.com/808dcfc73aa5fb1959eb35be3534e5e7){gyazo=player}
> InfineTalk

作为现在的 SoTA，有基于 Wan2.1 的 [FantasyTalking](https://fantasy-amap.github.io/fantasy-talking/) 或 [InfiniteTalk](https://meigen-ai.github.io/InfiniteTalk/) 等。
