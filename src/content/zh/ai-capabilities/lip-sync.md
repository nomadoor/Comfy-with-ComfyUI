---
layout: page.njk
lang: zh
section: ai-capabilities
slug: lip-sync
navId: lip-sync
title: Lip Sync
created: 2026-02-06
updated: 2026-03-02
summary: 配合音频移动嘴巴或表情的技术
seoTitle: "什么是 Lip Sync？让嘴型配合音频的 AI"
seoDescription: "根据音频为视频添加嘴部和表情动作的 Lip Sync 技术。整理只修正嘴部的 Wav2Lip、LatentSync，让单张图说话的方法，以及由音频驱动整段视频的模型。"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---

## 什么是 Lip Sync（对口型）？

Lip Sync 是根据音频的内容和节奏，事后给画面加上嘴部和表情动作的技术。

它常用于给现有视频配上另外录制的音频，或者让一张静态图“像在说话一样”动起来。

---

## 让现有视频的口型对上

![](https://gyazo.com/17b81df017311b5fee98119e7e808492){gyazo=player} ![](/media/ai-capabilities/lip-sync/legacy_gyazo_a6286699b56195148b64533d441561c0.mp4){media=player}
> ← 基础视频 | → Lip Sync (LatentSync)

最早广为人知的，是 Wav2Lip 这类“只修改嘴部”的模型。

输入已经拍好的视频和另外录制的音频，它会输出一段脸和身体动作保持不变、只有嘴巴配合新音频在动的视频。

---

## 让一张图说话

> ![](/media/ai-capabilities/lip-sync/legacy_gyazo_a74335c1403caa5475429688f420212d.mp4){media=player}
> EMO

像 [EMO](https://humanaigc.github.io/emote-portrait-alive/) 这样的模型，可以根据一张人脸图像和音频，直接生成说话的视频。
用音频来控制并驱动输入图像，可以说是 image2video 的延伸。

准备一张角色插画或人脸照片，再给它台词或歌声的音频，就会得到一段长度与音频相应、口型对得上的视频。眨眼、嘴角的动作、轻微的摇头等也会一起生成。

---

## 用音频驱动整段视频

稍微提高嗓门说几句话就会发现，说话时动的可不只是嘴。
肺会鼓起来，肩膀会抬起来，不知不觉连手势都用上了。

也就是说，像 Wav2Lip 那样只让嘴巴配合音频动，是做不出自然的视频的。

再加上视频生成模型已经达到实用水平，技术也从单纯的“对口型”，逐渐走向了 **音频驱动的人像视频生成**。

> ![](/media/ai-capabilities/lip-sync/legacy_gyazo_808dcfc73aa5fb1959eb35be3534e5e7.mp4){media=player}
> InfiniteTalk

目前的 SoTA 有基于 Wan2.1 的 [FantasyTalking](https://fantasy-amap.github.io/fantasy-talking/)、[InfiniteTalk](https://meigen-ai.github.io/InfiniteTalk/) 等。
