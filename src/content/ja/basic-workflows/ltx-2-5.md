---
layout: page.njk
lang: ja
section: basic-workflows
slug: ltx-2-5
navId: ltx-2-5
title: "LTX 2.5"
created: 2026-09-01
updated: 2026-09-03
summary: "LTX 2.5で動画と音声を生成する"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f0a0582dba74a4ef6e731142136b5c59.mp4"
tags: []
---

## LTX 2.5とは？

`LTX 2.5` は、`LTX-2`、`LTX 2.3` と続いてきた Lightricks の動画生成モデルの新しいバージョンです。

基本的な仕組みは [LTX 2.3](/ja/basic-workflows/ltx-2-3/) と同じですが、単純に出力が綺麗になっただけでなく、いくつか大きな改善が施されています。

- **Multi-shot**
  - 1 回の生成の中で複数のショットを作れるように
- **Gemma 4 Text Encoder**
  - Text Encoder が Gemma 3 から Gemma 4 に変更
- **Diffusion Decoder**
  - VAE Decode の代わりに、拡散モデルを使って latent から映像を復元します
  - 考え方としては [PiD](/ja/basic-workflows/pixeldit-pid/#pid) に近いですね

他にもいくつかの改善点がありますが、ComfyUI で使うなら、ひとまずこれだけ分かっていれば OK です。

---

## 推奨設定値

- 解像度
  - 32 の倍数である必要があります
- FPS
  - 決まった値に固定されていません
  - 既定値は 24 FPS です
- フレーム数
  - `8n + 1` である必要があります
- 動画最大長
  - 481 frames
  - 24 FPS なら約 20 秒です

---

## モデルのダウンロード

- diffusion_models
  - [ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/diffusion_models/ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors) (21.5 GB)
- latent_upscale_models
  - [ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors) (1 GB)
- text_encoders
  - [gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/text_encoders/gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors) (15.4 GB)
- vae
  - [ltx-2.5-video-vae-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/vae/ltx-2.5-video-vae-bf16.safetensors) (1.47 GB)
  - [ltx-2.5-audio-vae-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/vae/ltx-2.5-audio-vae-bf16.safetensors) (365 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors
    ├── 📂text_encoders/
    │   └── gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors
    └── 📂vae/
        ├── ltx-2.5-video-vae-bf16.safetensors
        └── ltx-2.5-audio-vae-bf16.safetensors
```

---

## text2video

![](https://gyazo.com/891b0474ea9ec2636b188b803f6ef2c3){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video.json)

LTX-2 と同じく、まず目標の半分の解像度で作り、そのあと 2 倍にアップスケールする 2 段階の workflow です。

{% mediaRow img="https://gyazo.com/d353cf476e7c8be513f7bc1e55cef365", width=40, align="left" %}
**解像度設定**

あとから 2 倍にするため、目標解像度の半分の値を `EmptyLTXVLatentVideo` に入力します。

この値も 32 の倍数にする必要があるため、目標の幅・高さは 64 の倍数にしてください。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/82803fd97cf50afbdb616105f14b0405", width=40, align="left" %}
**フレーム数の設定**

この workflow では、作りたい動画の秒数（sec）と FPS を入力すると、適切な `8n + 1` のフレーム数に丸められます。

{% endmediaRow %}

**出力例**

![](https://gyazo.com/e68699b3ebb44d9b20b5d85c73cf9644){gyazo=loop}

### Multi-shot

Seedance 2 などから一般的になってきましたが、1 回の生成で複数のショットを作ることができます。

![](https://gyazo.com/7d681d86ce23e28e4e48aed1fe452c7d){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video_multishot.json)

特別な書き方は必要なく、自然文で「ここにカットが入り……」と書けば認識してくれます。

気楽に書ける反面、Multi-shot として認識してくれないこともあります。うまくいかないときは、気長に何度か試してみてください。

**出力例**

![](https://gyazo.com/7fe2eadbd6abb69f2015df4f8531fe26){gyazo=loop}

### Duration Predictor

動画の長さは基本的に手動で設定しますが、このプロンプトなら何秒がちょうどよいのか……というのは意外と悩ましいものです。

LTX 2.5 には、プロンプトの内容から、それを表現するために必要な動画の長さを自動で推定する機能があります。

**モデルのダウンロード**

- model_patches
  - [ltx-2.5-duration-head-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/model_patches/ltx-2.5-duration-head-bf16.safetensors) (3.84 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── ltx-2.5-duration-head-bf16.safetensors
```

![](https://gyazo.com/ecf49f82e56e0fdec6283401d71ae657){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_text2video_Duration_Predictor.json)

{% mediaRow img="https://gyazo.com/4567c3906de961a9c90bc01cef27db5d", width=40, align="left" %}
**LTXV Duration Predictor**

プロンプトから予測されたフレーム数が出力されるので、通常の text2video workflow の `length` へつなぎます。

あくまで予測なので、思っていたより短くなったり、長くなったりすることもあります。それでも、動画の長さを自動で予測してくれるのは面白い機能ですね。

{% endmediaRow %}

## image2video

![](https://gyazo.com/e978305c53f6c658984db4ad42c71a7f){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_image2video.json)

[LTX 2 の image2video](/ja/basic-workflows/ltx-2/#image2video) と同じです。`LTXVImgToVideoInplace` で 1 フレーム目に入力画像を差し込みます。

> 以前は、いろいろな理由から `LTXV Preprocess` で入力画像をわざと劣化させていましたが、LTX 2.5 では、少なくとも私が使った限りでは必要なさそうなので外しています。

**出力例**

![input](https://gyazo.com/856453de1d4eaea2b8e02a8e6993db08){gyazo=image} ![output](https://gyazo.com/d8bdced1eba00d48d1f5ff65dfb4e336){gyazo=loop}

---

## Generative Interpolation / FLF2V

任意の数の画像を渡し、その間を滑らかに埋めてもらう workflow です。

動画の最初と最後だけを指定すれば、いわゆる **FLF2V** というものになります。

![](https://gyazo.com/a0e7571b01f97b79d73325390e0a4d3c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_generative-interpolation.json)

{% mediaRow img="https://gyazo.com/2e39b3e006fcb35d96b87d649ded0146", width=40, align="left" %}
**LTXV Add Guide**

`frame_idx` に画像を入れる位置を指定します。

- `0`：最初のフレーム
- `-1`：最後のフレーム

ノードを増やし、直列につなげれば、Generative Interpolation になります。

> 画像にはよりますが、フレーム補間ではなく、トランジションのようになってしまうことがあります。<br>
> 中間に差し込む `LTXVAddGuide` の `strength` は、0.3〜0.4 くらいまで小さくしたほうが良いかもしれません。

{% endmediaRow %}

**出力例**

![input1](https://gyazo.com/de4eaa85c26607d8b0f98f774880e2b8){gyazo=image} ![input2](https://gyazo.com/0ef0afcbe6a2d35cf018bb0f77e0a0ff){gyazo=image} ![input3](https://gyazo.com/c2058ec73687479e7abe3fa7f21f9d64){gyazo=image} ![output](https://gyazo.com/e0e2fcb86f4a8513708807bacd79af8c){gyazo=loop}

---

## IC-LoRA

LTX における ControlNet や、動画編集 LoRA のような役割を持つのが IC-LoRA です。

LTX 2.5 は LTX 2.3 用 IC-LoRA の多くと互換性があり、そのまま使えます。

LTX 2.3 用も含めると非常に多くの種類がありますが、ここでは最も基本的な Union Control を使ってみましょう。

### モデルのダウンロード

- [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) (654 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
```

### IC-LoRA Union

一般的な ControlNet と同様、線画や深度マップ、ポーズ動画で生成動画を制御できます。

![](https://gyazo.com/4e194652b6db74b853390f20017bb542){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_IC-LoRA-Pose.json)

IC-LoRA の詳しい解説は [LTX 2/IC-LoRA (Pose)](/ja/basic-workflows/ltx-2/#ic-lora-pose) で行っているので、興味があれば見てみてください。

**出力例**

![input/pose](https://gyazo.com/824ba34d0fa1ef036db386c4f7f7b5f6){gyazo=loop} ![output](https://gyazo.com/4f55983a4205360420e7cc605402301b){gyazo=loop}

---

## アップスケーラーとして使う

LTX 2.5 は、半分の解像度で生成したものを 2 倍にして、もう一度綺麗にする 2 段階構成です。

そこで、2 段目だけを使い、好きな動画を 2 倍にするアップスケーラーとして使っちゃおう、というのは自然な発想ですね。

![](https://gyazo.com/7fa914cfea3fe3b4648960d1c3474258){gyazo=image}

[](/workflows/basic-workflows/ltx-2-5/LTX-2.5_x2_upscaler.json)

任意の動画を VAE Encode し、これまで使ってきた workflow の 2 段目へつないでいるだけです。

ただし、上で使ってきた `ManualSigmas` の値では、いわゆる denoise が強すぎて、元の映像が変わりすぎます。

ここでは `Basic Scheduler` に置き換え、denoise を 0.3 にしています。必要に応じて調整してください。

**出力例**

![input](https://gyazo.com/2090f2ae9f78af154922c00cd43e10f7){gyazo=loop} ![output](https://gyazo.com/bb03d5683d784b144c290400638ba139){gyazo=loop}

競合モデルも多く出てきていますが、自然な映像を作る力は、その中でも際立っています。適材適所で使いこなせるといいですね。
