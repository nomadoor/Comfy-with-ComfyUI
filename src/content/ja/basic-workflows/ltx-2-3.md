---
layout: page.njk
lang: ja
section: basic-workflows
slug: ltx-2-3
navId: ltx-2-3
title: "LTX 2.3"
summary: "LTX 2.3: text2video / image2video / audio2video"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f3f8635fb9056670204fe9bdac577b39.mp4"
tags: []
---

## LTX 2.3とは？

`LTX 2.3` は、Lightricks の動画生成モデル `LTX-2` の改良版です。

基本的な考え方やノード構成は [LTX-2](/ja/basic-workflows/ltx-2/) と同じです。  
そのため、このページでは **LTX-2 から何が変わるか** だけ見ていきます。

---

## 推奨設定値

- 解像度
  - 最終出力として 1.5M ピクセル前後
  - ※32の倍数である必要があります
- FPS
  - 24 / 25 / 48 / 50
- フレーム数
  - 65 / 97 / 121 / 161 / 257
  - `8n + 1` である必要があります

---

## モデルのダウンロード

- checkpoints
  - [ltx-2.3-22b-dev-fp8.safetensors](https://huggingface.co/Lightricks/LTX-2.3-fp8/blob/main/ltx-2.3-22b-dev-fp8.safetensors) (29.1 GB)
- latent_upscale_models
  - [ltx-2.3-spatial-upscaler-x2-1.1.safetensors](https://huggingface.co/Lightricks/LTX-2.3/blob/main/ltx-2.3-spatial-upscaler-x2-1.1.safetensors) (996 MB)
- loras
  - [ltx-2.3-22b-distilled-lora-384.safetensors](https://huggingface.co/Lightricks/LTX-2.3/blob/main/ltx-2.3-22b-distilled-lora-384.safetensors) (7.61 GB)
- text_encoders
  - [gemma_3_12B_it_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it_fp8_scaled.safetensors) (13.2 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── ltx-2.3-22b-dev-fp8.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2.3-spatial-upscaler-x2-1.1.safetensors
    ├── 📂loras/
    │   └── ltx-2.3-22b-distilled-lora-384.safetensors
    └── 📂text_encoders/
        └── gemma_3_12B_it_fp8_scaled.safetensors
```

---

## 基本的な処理の流れ

![](https://gyazo.com/7ace8e776133d570e2d42b1a27435189){gyazo=image}

アーキテクチャは [LTX-2](/ja/basic-workflows/ltx-2/) と同じなので、workflow もそのまま流用できます。  
ただし、そのままではあまり良い結果が出ません。

そこで、このページでは、コミュニティが見つけた **[3stage workflow](https://www.reddit.com/r/StableDiffusion/comments/1rn3fjv/for_ltx2_use_triple_stage_sampling/)** を紹介します。

もともと LTX-2 は、一度低解像度で生成したものを Hires.fix して 1.5MP にする 2stage での生成をしていました。  
2.3 ではさらに 1 段増やし、非常に小さな解像度で生成したものを 2 倍 Hires.fix、さらにそれをもう 2 倍 Hires.fix します。

公式に推奨されている方法ではありませんが、明確に結果が良いのでこちらを採用しています。

> 全て `distilled-lora` を適用した 8 ステップ生成です。

---

## text2video

![](https://gyazo.com/7477c07351d62edda93ae50270bbbaf5){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_text2video_distilled_3stage.json)


{% mediaRow img="https://gyazo.com/6e9e9474d28ef76af5053fb0be5e6290 {gyazo=image}", width=40, align="left" %}

**動画解像度・長さ・FPSの設定**

生成したい動画と音声のパラメータをここで決めます。

- EmptyLTXVLatentVideo / LTXV Empty Latent Audio に、解像度・フレーム数・FPS を入力します。
- 🚨LTX-2 のときと異なる部分
  - 2倍を二回、つまり最終的には縦横4倍の解像度になるため、それを加味して 0.1MP 程度の値を設定します

{% endmediaRow %}

**出力例**

![](https://gyazo.com/2cd2d6eb51760a4928ba476bf2c0878b){gyazo=loop}

---

## image2video

![](https://gyazo.com/0bb56ddc29aa5c644460f5eb6a2c7443){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_image2video_distilled_3stage.json)

**出力例**

![入力](https://gyazo.com/bf4c40372ce923fb53f2867c33c27bc6){gyazo=image} ![出力](https://gyazo.com/cb1a91ed174f29d4441ae1332590f3a0){gyazo=loop}

---

## audio2video

![](https://gyazo.com/0d62ef375ff30b08ea96c40b5105c94c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_audio2video_distilled_3stage.json)

**出力例**

![](https://gyazo.com/4e0ce0ea62fc7138ffe7ea1892ec21b8){gyazo=player}

---

## audio-image2video

![](https://gyazo.com/443cbbeacab7a63e85641c0b209ab5da){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_audio-image2video_distilled_3stage.json)

**出力例**

![](https://gyazo.com/dc3fb2e0b92432ca2651ca121aea7205){gyazo=image} ![](https://gyazo.com/69ebdac3cc6a3badd9452f0cbb345167){gyazo=player}

---

## IC-LoRA

`LTX-2.3` でも、`LTX-2` と同様に IC-LoRA 系の拡張を使うことができます。

### モデルのダウンロード

- [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) 654 MB

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
```

### IC-LoRA Union (Pose)

![](https://gyazo.com/9432f1cad25a54328ed912bc85af4a2d){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/LTX-2.3_IC-LoRA(Pose)_distilled_2stage.json)

- 🚨IC-LoRA のときは **3 stage ではなく 2 stage** の workflow を使います
- IC-LoRA Union では、制御動画に「生成動画の半分の解像度」を使う、という特殊な手法を使います
  - そのため 3 stage にすると、制御画像の解像度は "半分の半分の半分の半分"、つまり 100px ほどまで落ちます
  - そこまで小さくなると、制御画像としてまともな情報を保てません
  - そのため、IC-LoRA では 2 stage で止めます

**出力例**

![入力](https://gyazo.com/9aea1871cc24b0c98931d55bebb1c19c){gyazo=loop} ![出力](https://gyazo.com/25f44e7a08247ae96a2ebcc3cb901d56){gyazo=loop}
